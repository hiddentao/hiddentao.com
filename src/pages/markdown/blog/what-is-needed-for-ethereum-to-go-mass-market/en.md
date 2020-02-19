---
title: What is needed for Ethereum to go mass-market
date: '2020-02-19'
---

By the term _mass market_ I mean being adopted and used on a wide scale for
building apps. I mean having [Ethereum](http://ethereum.org/) Dapps that are
used by millions of users. We haven't got this level of usage yet (putting aside for
now that the Eth 1.0 network wouldn't be able to handle such a transaction
load). I'm interested in figuring out the factors that matter and the path
forward towards mass-market usability.

People within the crypto space typically focus on 3 requirements for Ethereum
(or any smart-contract blockchain) to be able to hit the mass-market:

* Price stability
* Scalability
* Usability

### Price stability

Cryptocurrency prices fluctuate and vary wildly, on a frequent basis. For
someone to have confidence in dealing with crypto and in partcular, storing
their funds in crypto, they need to know that the price is generally going to be
stable.

With the advent of [DAI](https://makerdao.com/),
[USDC](https://www.circle.com/en-gb/usdc) and other such _stablecoins_ this
problem has by-and-large been solved. We know how to do stablecoins and we know
how to ensure they maintain a stable value over time.

### Scalability

Scalability mostly refers to how many transactions can be executed per second on
a blockchain. For Ethereum it currently hovers around ~20. The goal of Eth 2.0
is to get this to becomes many 1000's per second. There are numerous competitors
([Solana](https://solana.com/), [NEAR](https://nearprotocol.com/),
[Elrond](http://elrond.com/), etc) also working on this problem. Most of them
(including Ethereum) plan to use sharding as a means of achieving scalability.
And this isn't to mention so-called _Layer 2_ scaling solutions
([zkRollups](https://keen-noyce-c29dfa.netlify.com/#0),
[Plasma](https://www.learnplasma.org/en/learn/mvp.html), [Lightning
networks](https://lightning.network/), etc) which already exist and can equally
be applied to a sharded network to further boost scalabiilty.

Given the great progress that is being made in this area I'm confident that
scalability will be solved.

### Usability

Usability is the final piece of the puzzle that is being tackled.

There are numerous solutions being worked on to make user onboarding easier -
[Torus](https://tor.us/), [Authereum](https://authereum.com/), [Universal
Login](https://unilogin.io/), etc. Most of these solutions focus on minimizing
the need to already own crypto prior to using a Dapp. They also preclude the
need to even have an Ethereum account in the first place. These are great for
onboarding users more, but there are still  fundamental usability issues
with Ethereum (and blockchains in general) that still aren't being addressed
adequately. These issues are what I will focus on for the remainder of this article.

## The fundamental usability issues

I see two fundamental issues regarding usability. Specifically, I'm referring to getting
non-crypto/non-technical users to use an Ethereum Dapp:

* They don't understand crypto/blockchain and it's hard to explain
* It's easy to move from fiat (i.e. $, £, etc) to crypto, but hard to move back the other way

Let's consider each of these in turn.

### They don't understand crypto/blockchain and it's hard to explain

Many of my non-crypto/non-technical friends ask me how they can invest in crypto
since they'd like to get in on the crypto market speculation action. I always
point them to [Coinbase](https://www.coinbase.com/) since I think that's
probably the easiest way to buy in, has a simple enough UI, and is a regulated,
well-established entity. But even then my friends have trouble understanding
what's going on.

They still don't fundamentally understand what it is that they're buying. They
don't understand that the ETH they've bought is owned by a private-public
keypair and that it can be transferred to a _wallet_ that only they control.
They relate their ETH-buying experience to buying shares in the stock market.
And you know what, if they're just in it to make money then actually that's all
they need to know in a way.

But they'll still ask me...

* _"Who creates ETH? Is it the same as Bitcoin?"_
* _"Why does the price change?"_
* _"What is mining?"_
* ...and so on

I try to explain Proof-of-work and mining, Proof-of-stake, public-private
keypairs, etc. But for someone who's knowledge of computers stops at their
mobile apps and websites I'm really just feeding them gobbledy-gook. Moreover,
they remark to me that the whole thing seems a bit complicated compared to
their existing internet stuff (banking, social media, etc) and that that's why they were
hesitant to buy crypto in the first place. I can certainly sympathize!

Now, if I was to say to my friend, _"Hey, you can withdraw your ETH from
Coinbase to your [Ledger Nano](https://www.ledger.com/) and head over to
[Kickback](https://kickback.events/) and RSVP for an event"_ and get them to go
through with that, I know they'll come back to me with even more questions:

* _"Why can't I just transfer from Coinbase?"_
* _"Why is Ledger safer?"_
* _"What is Metamask?"_
* _"What is gas? Is that like a fee?"_
* _"It's saying I need DAI? What is that? How do I get it?"_
* ...and so on

All this just to RSVP to an event - something that they're already able to do on
sites like [Meetup](https://meetup.com) without any pain.

I'm not trying to criticize Kickback (after all, I'm a cofounder) and suggest
that it's their fault. My point is that getting people to use a crypto product
requires getting them to climb steep hill of education, most of which they'll forget very quickly.

Now, some of you might say that you have friends who were able to pick these
things up by themselves and learn quickly. Well those people probably fall into
the "tech adopters" category and this article doesn't really apply to them.

UX onboarding solutions such as Universal Login are great in that they take away
that initial sign up pain. And indeed, Kickback has integrated many of these methods. I
can onboard a user without them even needing to know about crypto. The problem
comes once they're onboarded. I'm giving them tokens. I'm informing them of
their DAI balance. Even if they didn't have to understand crypto when signing up
to my Dapp they certainly must do so afterwards in order to make sense of anything.

And by the way, continual use of a Dapp will require gas payments to be made -
at some point the phenomenon of gas is going have to explained to the user, or some clever way is going to be needed
to hide it.

### It's easy to move from Fiat to Crypto, but hard to move back the other way

Until recently, purchasing crypto using fiat required you to first go through
Know-Your-Client (KYC) approval processes. But thanks to companies like
[Wyre](https://www.sendwyre.com/), this is no longer necessary for small
quantities.

Now we can onboard a non-technical user onto our Dapp by creating them a secure
contract wallet on-the-fly in the background, and if they need to buy ETH we can
let them do so instantly using their credit/debit card.

The return route is the problem...

Let's say we onboard someone onto Kickback directly from fiat using Universal
Login + Wyre. After they've attended the event and are due a payout we need to
give them their payout in fiat. But we can't - at best we can give them back a
stablecoin such as DAI or USDC. At this point they again need to understand
crypto to understand how they can then convert those stablecoins back into cold,
hard fiat cash.

There doesn't exist an API that allows us to convert crypto to fiat and have it
sent to a bank account. I think this is mainly due to legal and regulatory hurdles.

For instance, in the UK you have to calculate and pay Capital Gains Tax when you
sell your crypto. Even crypto debit cards such as [Monolith](https://monolith.xyz/) - which are at
present the easiest way to cash out -  have to account for this in their
product.

## Where the solution lies

Given the present state of the tech I think there are two possible ways of
building something mass-market on Ethereum today:

* Hiding the blockchain from the user
* Building for enterprise

### Hiding the blockchain from the user

**Axiom: a user shouldn't have to understand a blockchain in order to benefit
from the blockchain.**

Expecting someone non-technical to pick up and understand blockchain concepts is a
no-go. Expecting them to care about the philosophical rationale for blockchains
(i.e. decentralization vs centralization) is sadly also a no-go. As much as we
developers want the non-developer world to care about this stuff, for the most
part it will consistently choose convenience over autonomy. Having said that,
that doesn't stop us from using blockchains and associated tech to provide
decentralized, privacy-preserving services to our users.

Given that cashing out is the hard part, it makes sense to focus on Dapps which
don't require that.

For example, take a document signing service. A user would pay a montly
subscription or perhaps a per-signature fee to sign a document, and a record of
this action gets placed on the blockchain. The fee the user pays would cover gas
costs of interacting with the blockchain. The frontend would not expose the
blockchain mechanics in an way, i.e. the user would access the Dapp using an
email and password and their private key would be derived from their
credentials. At the same time, The Dapp could give the user a link to
their on-chain data (e.g. on Etherscan) to allow them to independently verify
the blockchain side of things.

[DFinity's](https://dfinity.org/) approach of calling itself the "Internet
Computer" and pretty much abstracting away all the blockchain details (as far as I can tell) is good thinking, though I don't know for sure if they've done that for the same
reasons as I've outlined.

### Building for enterprise

**Axiom: a user who will make money from integrating with a blockchain will be
more willing to pay to use the blockchain.**

The above axiom doesn't necessarily just apply to enterprise use-cases, but
enterprises are an obvious candidate.

If, for example, a supply-chain logistics
company can improve its business by integrating with Ethereum then it will be
more willing to pay (in terms of money as well as time invested for integration)
to use Ethereum. The company would also be willing to obtain DAI or whatever
other token it needs to. It sees the blockchain as a supplier of sorts and
itself as the customer. And you usually don't mind paying your suppliers because
they are in turn helping you get paid by your customers.

The [Enterprise Ethereum Alliance](https://entethalliance.org/) suddenly makes
so much sense.


## Factors which may yet shake things up

### A global stablecoin

I think the [Libra](https://libra.org/en-US/) project is an example of something
which can solve the cashing-out problem. If their billions of users (most of
whom are non-crypto/non-technical) got into the habit of dealing with Libra
coins and transferring them back and forth, then Libra would become a de-facto
fiat-like stablecoin that people trust, understand and are comfortable using.
Dapps could then cash you out into Libra. Perhaps they could even onboard you
from Libra instead of from fiat.

This shows that we actually need something like Libra. Unfortunately such a
commonly-accepted stablecoin can only exist with the blessing of governments and
regulatory agencies (hence why Libra itself has already hit roadblocks) and so
it's upto the crypto community to engage with national and international
agencies in working towards a central bank condoned digital currency. By all
indications it [looks like China may get there
first](https://smallcaps.com.au/china-plan-introduce-central-bank-digital-currency-benefit-bitcoin/).
And if so I expect Dapps for the Chinese market to immediately jump on board
this opportunity.

### Integrated wallets

If crypto wallets and corresponding fiat <-> crypto
bridges get integrated into the foundational infrastructure of our lives (e.g. our
mobile phones) then there's a chance that over time we become educated and
knowledgeable enough of the tech to utilise it better. Initiatives like the
[Cryptophone](https://www.htcexodus.com/eu/cryptophone/) and
[Opera](https://www.opera.com/crypto) are a step in this direction. I think the
jury is still out on these developments though. Besides, what would the
equivalent desktop solution would be? or would these solutions be mobile-only?
It will be interesting to see how this space evolves.



