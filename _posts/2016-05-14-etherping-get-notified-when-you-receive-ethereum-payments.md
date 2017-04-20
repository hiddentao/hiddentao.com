---
layout: post
status: publish
published: true
title: EtherPing - get notified when you receive Ethereum payments
excerpt: "My friend [Jeff Lau](http:&#47;&#47;jefflau.net) and I this week finished
  work on [EtherPing](https:&#47;&#47;etherping.com), a simple web service which notifies
  you by email when your [Ethereum](https:&#47;&#47;ethereum.org&#47;) address receives
  a payment. EtherPing monitors the global Ethereum network for transactions sent
  to your specified address and emails you according to the notification rules you
  have setup. You can get notified as soon as a transaction appears on the network
  and then again after a certain no. of \"confirmation\" (i.e. blocks in the blockchain)
  have passed since your transaction first appeared. Best part is, you don't need
  to sign-up and it's totally free!\r\n"
date: '2016-05-14 08:02:03 +0800'
date_gmt: '2016-05-14 07:02:03 +0800'
categories:
- Uncategorized
tags:
- node.js
- Ethereum
- Blockchain
comments: []
---
My friend [Jeff Lau](http://jefflau.net) and I this week finished work on [EtherPing](https://etherping.com), a simple web service which notifies you by email when your [Ethereum](https://ethereum.org/) address receives a payment. EtherPing monitors the global Ethereum network for transactions sent to your specified address and emails you according to the notification rules you have setup. You can get notified as soon as a transaction appears on the network and then again after a certain no. of "confirmation" (i.e. blocks in the blockchain) have passed since your transaction first appeared. Best part is, you don't need to sign-up and it's totally free!  
<a id="more"></a><a id="more-1983"></a>

We built Etherping because we believe that the Ethereum network and its associated benefits are going to be most useful only if it can be integrated easily into people's existing digital apps, systems and technology stacks. Even though an [Ethereum wallet](https://github.com/ethereum/mist) will notify you when you receive a transaction, you may not always be looking at your wallet in which case it would be good to be notified in some other fashion. Since pretty much everyone on the web uses email we opted for that as the notification mechanism, though in future we could expand to doing Slack notifications, URL callbacks, etc.

This project was also a chance for both of us to get to grips with the basics of blockchain synchronization and learn how block data can be accessed and processed via the Ethereum client tools. In developing Etherping I built [geth-private](https://github.com/hiddentao/geth-private), a Node.js library which makes it super easy to setup a private local blockchain for testing purposes. This tool enabled us to setup automated tests to verify that our notification logic works exactly as it's supposed to. I also learnt how to [setup geth as a background service](/archives/2016/05/04/setting-up-geth-ethereum-node-to-run-automatically-on-ubuntu/) on Ubuntu machines.

At present Etherping is very simple and it does just "what it says on the tin". If you have any feedback or suggestions for how we can improve it please do let us know at **team [at] flyingdyno [dot] com**.

Try it at [https://etherping.com](https://etherping.com).

_Etherping is built using [Waigo 2.0](https://github.com/waigo/waigo), which I aim to release publicly in the coming months._