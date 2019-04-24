---
title: Javascript IMAP email client for browsers
date: '2013-08-15'
summary: ''
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
