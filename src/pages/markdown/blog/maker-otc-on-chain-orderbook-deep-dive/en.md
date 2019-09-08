---
title: Maker OTC on-chain orderbook deep-dive
date: '2019-09-08'
---

This post is a deep-dive into MakerDAO's Over-the-counter (OTC) Ethereum
smart contract that can be used to facilitate the trading of ERC-20 tokens.
The orderbook is on-chain, which means that all offers and trades
are conducted fully on the blockchain with no need for an external
backend service. This is different to other projects such as [0x](https://github.com/0xProject), which only perform settlement on-chain (i.e. the actual swap of assets) and thus
typically require additional infrastructure to manage the orderbook off-chain.

The contracts can be found at: https://github.com/makerdao/maker-otc. I will
be referencing the code at commit [d1c5e3f52258295252fabc78652a1a55ded28bc6](https://github.com/makerdao/maker-otc/tree/d1c5e3f52258295252fabc78652a1a55ded28bc6) (August 7th, 2019).

The contract hierarchy is as follows:

* [MatchingMarket](https://github.com/makerdao/maker-otc/blob/d1c5e3f52258295252fabc78652a1a55ded28bc6/src/matching_market.sol) - this is the main contract, and inherits from ...
* ...[ExpiringMarket](https://github.com/makerdao/maker-otc/blob/d1c5e3f52258295252fabc78652a1a55ded28bc6/src/expiring_market.sol) - this is a market which runs until a set time in the
future, but can be stopped at any time. This inherits from ...
* ... [SimpleMarket](https://github.com/makerdao/maker-otc/blob/d1c5e3f52258295252fabc78652a1a55ded28bc6/src/simple_market.sol) - this is the base class which provides the ability to make, take and cancel offers.

## Maker-taker liquidity

Before I dive into the contracts, a quick look at the [maker-taker model](https://www.binance.com/en/support/articles/360007720071) that these markets are based on...

* __Maker__ - someone who creates an offer in a market for other participants to take
(it could be an offer to buy or sell).
* __Taker__ - someone who "takes" a previously "made" offer off the market, i.e.
this is when an actual exchange takes place.
* __Liquidity__ - a measure of how easy it is to trade one's assets in a given
market at a fair market price. Liquidity is directly correlated to the
no. of available offers in a market. Markets with high liquidity allow you to
buy/sell large quantities at a fair market price, and vice versa for markets
with low liquidity.

Since makers add offers to a market, makers are seen as increasing a market's
liquidity. Likewise, takers are seen as decreasing a market's liquidity since
they remove offers from a market. This is why many exchanges charge lower
fees to makers than they do to takers.

## SimpleMarket

`SimpleMarket` actually inherits from [EventfulMarket](https://github.com/makerdao/maker-otc/blob/d1c5e3f52258295252fabc78652a1a55ded28bc6/src/simple_market.sol), which defines events which can be emitted by a market. Here are the key ones:

* [`LogMake`](https://github.com/makerdao/maker-otc/blob/d1c5e3f52258295252fabc78652a1a55ded28bc6/src/simple_market.sol#L27) - when an offer gets made.
* [`LogTake`](https://github.com/makerdao/maker-otc/blob/d1c5e3f52258295252fabc78652a1a55ded28bc6/src/simple_market.sol#L49) - when a previously made offer gets taken.
* [`LogKill`](https://github.com/makerdao/maker-otc/blob/d1c5e3f52258295252fabc78652a1a55ded28bc6/src/simple_market.sol#L61) - when a previously made offer gets cancelled.
* [`LogUpdate`](https://github.com/makerdao/maker-otc/blob/d1c5e3f52258295252fabc78652a1a55ded28bc6/src/simple_market.sol#L21) - when an offer is made, cancelled or bought.

### Offer storage

The data for each offer is stored in the following structure:

```solidity
struct OfferInfo {
  uint     pay_amt;   // <-- amount to pay/sell (wei)
  ERC20    pay_gem;   // <-- address of ERC-20 contract
  uint     buy_amt;   // <-- amount to buy (wei)
  ERC20    buy_gem;   // <-- address of ERC-20 contract
  address  owner;     // <-- who created the offer
  uint64   timestamp; // <-- when offer was created
}
```

_Note: although `OfferInfo` uses `uint256` for amounts, the various other
methods in the contract restrict amounts to `uint128` precision, presumably to
reduce the likelihood of overflows when it comes to mathematical calculations._

Offers are also assigned a unique id. The id is a `uint256`, starting at 0 and
counting upwards. The `last_offer_id` class member tracks this number:

```solidity
uint public last_offer_id;
```

Offer ids are mapped to their respective offer details in `offers`:

```solidity
mapping (uint => OfferInfo) public offers;
```

### Re-entrancy attacks

The transfer of ERC-20 tokens from one participant to another requires
calling into ERC-20 token contracts, and there is hence a
[risk of re-entrancy](https://medium.com/coinmonks/protect-your-solidity-smart-contracts-from-reentrancy-attacks-9972c3af7c21).

To protect against such attacks a _mutex_ is used. This is accomplished via a
`synchronized` modifier:

```solidity
bool locked;

modifier synchronized {
  require(!locked);
  locked = true;
  _;
  locked = false;
}
```

The modifier is applied to the `buy`, `cancel`, and `offer` methods since they
all have the capability of transferring tokens from one address to another:

### Make offer

The `offer()` method is used to create a new offer to add to the market:

```solidity
function offer(uint pay_amt, ERC20 pay_gem, uint buy_amt, ERC20 buy_gem)
    public
    can_offer
    synchronized
    returns (uint id) { /* ... */ }
```

It performs some basic validation checks on the function arguments. It generates
a unique id for the offer, constructs an `OfferInfo`, and then saves a new
entry in to the `offers` mapping.

Finally, it transfers `pay_amt` worth of the `pay_gem` token from the caller
to market escrow:

```solidity
require( pay_gem.transferFrom(msg.sender, this, pay_amt) );
```

_Note: the owner will have previously had to call
[authorize()](https://eips.ethereum.org/EIPS/eip-20) on the token
contract in order to enable the market to transfer tokens on their behalf_.

_Note: The `make()` method internally calls `offer()` but converts the
returned unique id into its `bytes32` representation._

### Cancel offer

The `cancel()` method is used to cancel a previously made offer.

```solidity
function cancel(uint id)
    public
    can_cancel(id)
    synchronized
  returns (bool success) { /* ... */ }
```

The `can_cancel` modifier checks that the offer is stil active and ensures that
only the owner of an offer can cancel it:

```
modifier can_cancel(uint id) {
  require(isActive(id));
  require(getOwner(id) == msg.sender);
  _;
}

function getOwner(uint id) public constant returns (address owner) {
  return offers[id].owner;
}

function isActive(uint id) public constant returns (bool active) {
  return offers[id].timestamp > 0;
}
```

Cancelling an offer involves deleting it from the `offers` mapping:

```solidity
delete offers[id];
```

Note that this simply has the effect of zero-ing the `OfferInfo`
struct data thats stored against the offer id. This is why the `isActive()`
method checks to see if `timestamp > 0` in order to determine if an offer is
still active - **an offer is still active as long as it hasn't already been
cancelled.**

Finally, the cancellation process involves transferring the tokens from escrow
back to the owner:

```solidity
require( offer.pay_gem.transfer(offer.owner, offer.pay_amt) );
```

### Take offer

The `buy()` method is used to take a previously made offer.

```solidity
function buy(uint id, uint quantity)
    public
    can_buy(id)
    synchronized
  returns (bool) { /* ... */ }
```

The `can_buy` modifier simply checks that the offer is still active (see above).

The passed-in `quantity` is expected to be less than or equal to the offer
`pay_amt`. Thus, the process first calculates how much of the offer `buy_gem`
the taker wishes to exchange for the `pay_gem`:

```solidity
uint spend = mul(quantity, offer.buy_amt) / offer.pay_amt;

// check for overflow, etc
require(uint128(spend) == spend);
require(uint128(quantity) == quantity);
```

Then it checks to ensure that the taker's request is non-zero and within the
upper bounds of what the maker is offering:

```solidity
if (quantity == 0 || spend == 0 || quantity > offer.pay_amt || spend > offer.buy_amt) {
  return false;
}
```

The transfer is made and the offer gets updated:

```solidity
offers[id].pay_amt = sub(offer.pay_amt, quantity);  // <- calculate what's left to sell
offers[id].buy_amt = sub(offer.buy_amt, spend);     // <- calculate what's left to buy

require( offer.buy_gem.transferFrom(msg.sender, offer.owner, spend) );
require( offer.pay_gem.transfer(msg.sender, quantity) );
```

Finally, if the offer `pay_amt` is zero (i.e. there is nothing left to sell)
then it effectively gets cancelled:

```solidity
if (offers[id].pay_amt == 0) {
  delete offers[id];
}
```

## ExpiringMarket

`ExpiringMarket` extends `SimpleMarket` with the ability to automatically "close"
itself at a set point in future such that no more trades are allowed after that
point in time.

The modifiers declared in `SimpleMarket` get upgraded with this additional check:

```solidity
modifier can_offer {
  require(!isClosed());
  _;
}

modifier can_buy(uint id) {
  require(isActive(id));
  require(!isClosed());
  _;
}

modifier can_cancel(uint id) {
  require(isActive(id));
  require((msg.sender == getOwner(id)) || isClosed());
  _;
}
```

_Note: once a market is closed, anyone can call `cancel()` to cancel an offer,
not just the offer owner_.

The `isClosed()` method checks whether the market's closing time has passed or
whether it has manually been stopped earlier (see below):

```solidity
uint64 public close_time;
bool public stopped;

function isClosed() public constant returns (bool closed) {
  return stopped || getTime() > close_time;
}
```

The _close_time_ gets set during construction, and there is no means of
changing this value once the contract has been deployed (one must choose this
wisely!).

However it can always be stopped earlier than _close_time_ by an admin:

```solidity
function stop() public auth {
  stopped = true;
}
```

_Note: the `auth` modifier ensures that only the market owner (i.e. the contract
  deployer) or an authorized admin can call the `stop()` method. Please refer to
[auth.sol](https://github.com/dapphub/ds-auth/blob/5ab34511f57dd0c8a0859fe6260bc6a6b329c0d4/src/auth.sol) for details._

## MatchingMarket

`MatchingMarket` extends `ExpiringMarket` with bi-directional orderbooks with
automatic order matching as well as convenience methods to make it easier for a
participant to take multiple, consecutive, sorted orders in one go.

As the repository [README](https://github.com/makerdao/maker-otc/blob/d1c5e3f52258295252fabc78652a1a55ded28bc6/README.md) file states, there is legacy
code in this contract which is likely to be removed in future versions. I will
thus focus solely on the code that is recommended for use today. I will also
skip over read-only methods which are purely there for convenience purposes.

### Events

This contract adds a number of events the existing list, the key ones being:

* `LogMatchingEnabled` - whether matching market is enabled or not.
* `LogSortedOffer` - when a new offer gets added to the sorted list.
* `LogUnsortedOffer` - when a new offer gets added to the un-sorted list.

### Matching vs non-matching modes

Matching is turned on by default:

```solidity
bool public matchingEnabled = true;
```

In non-matching mode the market reverts to the `ExpiringMarket` behaviour.
Matching can be toggled on/off at any point:

```solidity
function setMatchingEnabled(bool matchingEnabled_) public auth returns (bool) {
  matchingEnabled = matchingEnabled_;
  LogMatchingEnabled(matchingEnabled);
  return true;
}
```

I'm not entirely sure why this functionality is available, except perhaps it's
to enable users of this contract to decide whether they
wish to use on-chain or off-chain matching mechanisms.

### Dust handling

In this context `dust` refers to such tiny asset quantities that the gas cost of
making/taking an offer is higher than the amount being traded. The market
enables a _minimum sell-amount_ to be set for all tokens:

```solidity
mapping(address => uint) public _dust;       
```

This value is always checked prior to the creation of a new offer. On the
flip-side, if a take succeeds and an offer is left with a `pay_amt` lower
than `_dust[pay_gem]` then the offer gets cancelled:

```solidity
function _buys(uint id, uint amount) internal returns (bool) {
  /* ... */

  // If offer has become dust during buy, we cancel it
  if (isActive(id) && offers[id].pay_amt < _dust[offers[id].pay_gem]) {
    /* ... */
    cancel(id);
  }

  return true;
}
```

### Unsorted list

The market provides both a sorted and unsorted list of offers. The unsorted
list is useful for applications which to provide an OTC trading service where
traders manually pick offers to trade, rather than an exchange which
automatically matches offers.

The unsorted list represented as a uni-directional linked list which maps a
given offer id to the next offer id in the list:

```solidity
uint _head;                            // first unsorted offer id
mapping(uint => uint) public _near;    // next unsorted offer id
```

The `offer()` method is overloaded in this contract. Here is the variant to add
an offer to the unsorted list:

```solidity
function offer(
  uint pay_amt,    // maker (ask) sell how much
  ERC20 pay_gem,   // maker (ask) sell which token
  uint buy_amt,    // maker (ask) buy how much
  ERC20 buy_gem,   // maker (ask) buy which token
)
  public
returns (uint) { /* ... */ }
```

It internally calls through to the following code:

```solidity
// check min. sell amount
require(_dust[pay_gem] <= pay_amt);

// SimpleMarket.offer(...)
id = super.offer(pay_amt, pay_gem, buy_amt, buy_gem);

// add to unsorted list
_near[id] = _head;
_head = id;
```

The `buy()` and `cancel()` base class methods are overridden to ensure that
offers in the unsorted list are differentiated from ones in the sorted list
(see below):

```solidity
function cancel(uint id) public can_cancel(id) returns (bool success) {
  /* ... */

  if (isOfferSorted(id)) {
      require(_unsort(id));   // <-- remove from sorted list
  } else {
      require(_hide(id));     // <-- remove from unsorted list
  }

  /* ... */

  return super.cancel(id);
}
```

### Bi-directional sorted list

For every pair of tokens which can be traded, two sorted lists need to be
maintained. Each list represents the best price obtainable for a given token.

![screenshot](binance-orderbook.png)

In the above image, the bottom of the red list represents the lowest
BNB sell price (aka the highest ETH buy price) and the top of the green list
lower represents the highest BNB buy price (aka the lowest ETH sell price).

In the code a double-linked list is used in the form of a mapping:

```solidity
struct sortInfo {
    uint next;  // points to id of next higher offer
    uint prev;  // points to id of previous lower offer
    /* ... */
}

mapping(uint => sortInfo) public _rank; // double-linked list

mapping(address => mapping(address => uint)) public _best;  // id of the highest offer for a token pair
```

The `_best` mapping maps `pay_gem` to `buy_gem` to offer id. The `_rank`
mapping keeps track of where a given offer sits in the sorted list of offers.

The overloaded `offer()` method is used to add an offer to the sorted list:

```solidity
function offer(
  uint pay_amt,    // maker (ask) sell how much
  ERC20 pay_gem,   // maker (ask) sell which token
  uint buy_amt,    // maker (ask) buy how much
  ERC20 buy_gem,   // maker (ask) buy which token
  uint pos,        // position to insert offer, 0 should be used if unknown
  bool rounding    // match "close enough" orders?
)
  public
  can_offer
returns (uint) { /* ... */ }
```

This first attempts to match the offer to an existing offer in the sorted list
(see below) before adding it to the list itself:

```solidity
id = super.offer(t_pay_amt, t_pay_gem, t_buy_amt, t_buy_gem);
_sort(id, pos);
```

The `pos` parameter should be the id of the offer closest to the new offer in
terms of sort order. If instead it's set to 0 then the sorting algorithm will
start the at the top of the list (represented by the `_best` member variable)
and walk down the list it finds the correct spot to insert the offer.

Otherwise, it will start at `pos` and iterate down until it finds the first
active offer; it will then iterate up or down the sorted list until find the
right spot to insert the offer.

**Thus, an accurate pre-calculated `pos` value should be provided if
possible to save on gas costs.**

The sorting is based on how offer prices compare:

```solidity
function _isPricedLtOrEq(
    uint low,   // lower priced offer's id
    uint high   // higher priced offer's id
)
  internal
  view
  returns (bool)
{
  return mul(offers[low].buy_amt, offers[high].pay_amt)
    >= mul(offers[high].buy_amt, offers[low].pay_amt);
}
```

The calculation is as follows...

* `mS = offer.pay_amt` _(amount maker is selling)_
* `mB = offer.buy_amt` _(amount maker is buying)_
* `tS = t_pay_amt` _(amount taker is selling)_
* `tB = t_buy_amt` _(amount taker is buying)_
* `mS ÷ mB` _(price per unit of what maker is selling)_
* `tB ÷ tS` _(price per unit of what taker is willing to pay)_
* `(tB ÷ tS) ≥ (mS ÷ mB)` _()


### Matching algorithm

Before inserting a new offer into the sorted list, the The `_matcho()` method
attempts to match it to existing offers:

```solidity
function _matcho(
  uint t_pay_amt,    // taker sell how much
  ERC20 t_pay_gem,   // taker sell which token
  uint t_buy_amt,    // taker buy how much
  ERC20 t_buy_gem,   // taker buy which token
  uint pos,          // position id
  bool rounding      // match "close enough" orders?
)
  internal
  returns (uint id)
{
  uint best_maker_id;    // highest maker id
  uint t_buy_amt_old;    // taker buy how much saved
  uint m_buy_amt;        // maker offer wants to buy this much token
  uint m_pay_amt;        // maker offer wants to sell this much token

  // there is at least one offer stored for token pair
  while (_best[t_buy_gem][t_pay_gem] > 0) {
    best_maker_id = _best[t_buy_gem][t_pay_gem];
    m_buy_amt = offers[best_maker_id].buy_amt;
    m_pay_amt = offers[best_maker_id].pay_amt;

    // Ugly hack to work around rounding errors. Based on the idea that
    // the furthest the amounts can stray from their "true" values is 1.
    // Ergo the worst case has t_pay_amt and m_pay_amt at +1 away from
    // their "correct" values and m_buy_amt and t_buy_amt at -1.
    // Since (c - 1) * (d - 1) > (a + 1) * (b + 1) is equivalent to
    // c * d > a * b + a + b + c + d, we write...
    if (mul(m_buy_amt, t_buy_amt) > mul(t_pay_amt, m_pay_amt) +
        (rounding ? m_buy_amt + t_buy_amt + t_pay_amt + m_pay_amt : 0))
    {
      break;
    }
    // ^ The `rounding` parameter is a compromise borne of a couple days
    // of discussion.
    buy(best_maker_id, min(m_pay_amt, t_buy_amt));
    t_buy_amt_old = t_buy_amt;
    t_buy_amt = sub(t_buy_amt, min(m_pay_amt, t_buy_amt));
    t_pay_amt = mul(t_buy_amt, t_pay_amt) / t_buy_amt_old;

    if (t_pay_amt == 0 || t_buy_amt == 0) {
      break;
    }
  }

  if (t_buy_amt > 0 && t_pay_amt > 0 && t_pay_amt >= _dust[t_pay_gem]) {
    /* add new offer to sorted list */
  }
}
```

The calculation is as follows...

* `mS = offer.pay_amt` _(amount maker is selling)_
* `mB = offer.buy_amt` _(amount maker is buying)_
* `tS = t_pay_amt` _(amount taker is selling)_
* `tB = t_buy_amt` _(amount taker is buying)_
* `mS ÷ mB` _(price per unit of what maker is selling)_
* `tB ÷ tS` _(price per unit of what taker is willing to pay)_
* `(tB ÷ tS) ≥ (mS ÷ mB)` _()


The matching loop ensures multiple, consecutive offers in the sorted list can
be matched in one transaction, just how a normal matching market is expected to
work.

The `rounding` parameter should be set to `true` by default to reduce the
chances

### "List-Keepers"

### offer()
