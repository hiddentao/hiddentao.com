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
be reference the latest code [(d1c5e3f52258295252fabc78652a1a55ded28bc6)](https://github.com/makerdao/maker-otc/tree/d1c5e3f52258295252fabc78652a1a55ded28bc6).

The contract hierarchy is as follows:

* [MatchingMarket](https://github.com/makerdao/maker-otc/blob/d1c5e3f52258295252fabc78652a1a55ded28bc6/src/matching_market.sol) - this is the main contract, and inherits from ...
* ...[ExpiringMarket](https://github.com/makerdao/maker-otc/blob/d1c5e3f52258295252fabc78652a1a55ded28bc6/src/expiring_market.sol) - this is a market which runs until a set time in the
future, but can be stopped at any time. This inherits from ...
* ... [SimpleMarket](https://github.com/makerdao/maker-otc/blob/d1c5e3f52258295252fabc78652a1a55ded28bc6/src/simple_market.sol) - this is the base class which provides the ability to
make, take and cancel offers and emits events accordingly.

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
