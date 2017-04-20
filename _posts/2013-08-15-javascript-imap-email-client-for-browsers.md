---
layout: post
published: true
title: Javascript IMAP email client for browsers
date: '2013-08-15 14:24:13 +0800'
categories:
- Uncategorized
tags:
- Email
- SSL
- Chrome
- Javascript
- node.js
- BrowserMail
- Sockets
- IMAP
- TLS
comments:
- id: 4897
  author: Steve Foerster
  author_email: steve@hiresteve.com
  author_url: http://newworld.ac/
  date: '2014-02-02 01:23:00 +0800'
  date_gmt: '2014-02-02 01:23:00 +0800'
  content: "<p>I realize this isn't much incentive, but I'm one of those ChromeOS
    users who finds that the lack of an IMAP Chrome app is the only real usability
    drawback.  If you did make a full fledged instance of this, I for one would be
    really grateful.<&#47;p>\n"
- id: 4899
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2014-02-04 07:26:00 +0800'
  date_gmt: '2014-02-04 07:26:00 +0800'
  content: "<p>Hi Steve, thanks for your interest in this. I decided a few months
    ago to work on grander email project - https:&#47;&#47;www.autonomail.com. I eventually
    intend to incorporate the browsermail work into this and allow one to access any
    IMAP server with the added benefit of user-friendly PGP encryption.<&#47;p>\n"
- id: 4900
  author: Steve Foerster
  author_email: steve@hiresteve.com
  author_url: http://newworld.ac/
  date: '2014-02-05 18:28:00 +0800'
  date_gmt: '2014-02-05 18:28:00 +0800'
  content: "<p>Thanks, Ram, I've signed up for the beta.  So, Autonomail will handle
    IMAP accounts, and have a drag-and-drop interface?  That's great, if so.  Also,
    out of curiosity, what's your revenue model?<&#47;p>\n"
- id: 4901
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2014-02-06 00:56:00 +0800'
  date_gmt: '2014-02-06 00:56:00 +0800'
  content: |
    <p>Thanks Steve. Drag-and-drop will be there in the v1.0 release though probably not in the beta. My main priority is the PGP encryption - privacy is what people are clamouring for right now.<&#47;p>

    <p>Just to note that only an autonomail.com mail account will cost money as that's the value-add I'm providing. Accessing an existing IMAP account elsewhere won't cost anything. In terms of cost itself I'm aiming for a single yearly fee (haven't decided on the exact amount yet) and I'll make it possible to pay by bitcoin in order to minimize the information I hold on my customers (another privacy feature, if you will).<&#47;p>
- id: 4902
  author: Steve Foerster
  author_email: steve@hiresteve.com
  author_url: http://newworld.ac/
  date: '2014-02-06 03:18:00 +0800'
  date_gmt: '2014-02-06 03:18:00 +0800'
  content: "<p>Fair enough.  I look forward to checking it out!<&#47;p>\n"
- id: 4903
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2014-02-07 13:24:00 +0800'
  date_gmt: '2014-02-07 13:24:00 +0800'
  content: "<p>On that note, would you be interested in an encrypted email solution
    that preserves your privacy or are you happy with Gmail?<&#47;p>\n"
- id: 4904
  author: Steve Foerster
  author_email: steve@hiresteve.com
  author_url: http://newworld.ac/
  date: '2014-02-07 13:51:00 +0800'
  date_gmt: '2014-02-07 13:51:00 +0800'
  content: |
    <p>I don't use Gmail.  If I did, I wouldn't need a third party web-to-IMAP interface, since I would just... use Gmail.<&#47;p>

    <p>As for an encrypted email solution, I guess I don't care as much about that since the people with whom I correspond are mostly non-technical and don't use encryption, and there's not much point to it unless both parties participate.  If your solution somehow addresses that, then that would be really interesting.<&#47;p>
- id: 4905
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2014-02-07 14:06:00 +0800'
  date_gmt: '2014-02-07 14:06:00 +0800'
  content: "<p>Sorry, yes of course you don't use Gmail! I agree with your point on
    encryption. I hope that by making it as easy to use as possible more people are
    at least willing to try it out. Perhaps in a few years time awareness of it will
    be more mainstream and most people will see it as a valuable feature..I hope.<&#47;p>\n"
- id: 4997
  author: Javascript IMAP email client for browsers | Ra Puke Moana
  author_email: ''
  author_url: http://rapukemoana.wordpress.com/2014/10/31/javascript-imap-email-client-for-browsers/
  date: '2014-10-31 04:34:01 +0800'
  date_gmt: '2014-10-31 04:34:01 +0800'
  content: "<p>[&#8230;] http:&#47;&#47;www.hiddentao.com&#47;archives&#47;2013&#47;08&#47;15&#47;javascript-imap-email-client-for-browsers&#47;
    [&#8230;]<&#47;p>\n"
---
I've just released a [proof-of-concept IMAP email client](https://github.com/hiddentao/browsermail) written in Javascript, running in the Chrome browser. It combines an [existing node.js IMAP client](https://github.com/mscdex/node-imap) and browser-side [TLS library](https://github.com/digitalbazaar/forge) with Chrome's [socket API](http://developer.chrome.com/apps/socket.html). The client currently only fetches the latest email in your Inbox (replying not supported in the GUI, though the internal functionality exists).

## How to use it

Grab the [release ZIP](https://github.com/hiddentao/browsermail/raw/master/release/browsermail.zip) from Github and unzip it. Then load it into Chrome as an 'unpackaged extension'. You should see an icon show on your Chrome start page. Click that to launch the extension. Once you've entered connection details and started it up all client-server communication traffic is visible in the logging section at the bottom of the UI.

## Technical info

The tricky part was implementing Node's `TLS`, `Socket` and `Buffer` classes so that the Node IMAP client would work unchanged. With some trial and error I managed to get the node IMAP client talking to the servers using the forge TLS library at first, and then the Chrome Sockets API later on. The tricky part was converting the incoming and outgoing data into the right formats. The IMAP client uses [Node's Buffer](http://nodejs.org/api/buffer.html) but forge TLS uses its own buffer implementation. And Chrome sockets uses [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays/ArrayBuffer). So at the moment my implementation is doing a lot of unnecessary work converting between these formats but my priority was to get things working as soon as possible whilst making minimal modifications to the various third-party components (in the case of the IMAP client I didn't need to make any modifications).

**If you have a Node app which uses Sockets and TLS that you want to port to the browser please feel free to re-use the [Socket](https://github.com/hiddentao/browsermail/blob/master/src/js/node-polyfills/socket.js) and [TLS](https://github.com/hiddentao/browsermail/blob/master/src/js/node-polyfills/tls.js) shims.**

## Future work

My original motivation was to build a fully-fledged email client in the browser that would take privacy seriously by implementing very-user-friendly PGP. Plus it would work well for Chrome OS users, for whom (as far as I'm aware) there currently isn't a server-agnostic IMAP client available. Having put this prototype together I realise now what a big ask it would be to do a full email client!

Having said that, the IMAP client library is already pretty powerful and so the next phase of work would mostly involve extending the UI to expose more of its features, such as replying, searching and attachments. I hope other people who are more keen and have more time than me might want to improve/reuse parts of it.