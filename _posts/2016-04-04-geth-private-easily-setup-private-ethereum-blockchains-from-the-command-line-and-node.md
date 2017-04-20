---
layout: post
published: true
title: geth-private - easily setup private Ethereum blockchains from the command-line
  and Node
excerpt: "I've recently been getting into [Ethereum](https:&#47;&#47;ethereum.org&#47;)
  development. As part of that I want to be able to setup a local, private blockchain
  whenever needed so that I can easily and quickly test my contracts and dapps prior
  to deploying them to the live network. I found a [great tutorial by Ade Duke](http:&#47;&#47;adeduke.com&#47;2015&#47;08&#47;how-to-create-a-private-ethereum-chain&#47;)
  which helped me get setup with a private blockchain, but the process was a bit cumbersome,
  and furthermore I wondered if I could automate the process and save myself some
  time. As it turned out, I was able to and thus `geth-private` was born!\r\n"
date: '2016-04-04 11:13:13 +0800'
categories:
- Uncategorized
tags:
- Common-Utils
- Ethereum
- Blockchain
comments: []
---
I've recently been getting into [Ethereum](https://ethereum.org/) development. As part of that I want to be able to setup a local, private blockchain whenever needed so that I can easily and quickly test my contracts and dapps prior to deploying them to the live network. I found a [great tutorial by Ade Duke](http://adeduke.com/2015/08/how-to-create-a-private-ethereum-chain/) which helped me get setup with a private blockchain, but the process was a bit cumbersome, and furthermore I wondered if I could automate the process and save myself some time. As it turned out, I was able to and thus `geth-private` was born!  
<a id="more"></a><a id="more-1955"></a>

[geth-private](https://github.com/hiddentao/geth-private) is an NPM module which provides a way to quickly setup and cleanup private blockchains, both via a programmatic API and directly from the command-line.

## Getting started

To get started first ensure you have both [geth](https://github.com/ethereum/go-ethereum) and [Node v4 ](http://nodejs.org) installed. Then install `geth-private` globally:

```bash  
$ npm install -g geth-private  
```

Running a geth private blockchain is now as simple as doing:

```bash  
$ geth-private  
```

If everything works you'll see something like:

```bash  
geth is now running (pid: 2428).

Etherbase: 8864324ac84c3b6c507591dfabeffdc1ad02e09b  
Data folder: /var/folders/4v/br6x6mlx113235v1lz39nwfc0000gn/T/tmp-242211yXIVsOX5tP

To attach: geth attach ipc:///var/folders/4v/br6x6mlx113235v1lz39nwfc0000gn/T/tmp-242211yXIVsOX5tP/  
```

You can use the outputted _geth attach_ command (see above) to attach to this running instance of `geth` and issue commands like you normally would.

To turn on verbose logging (so that you can see what is happening under the hood) use the `-v` option:

```bash  
$ geth-private -v  
```

## How it works

Effectively, what happens is the following:

1\. `geth-private` first creates a folder within the system temporary folder and sets this as the `--datadir` for `geth`.  
2\. It then writes a `genesis.json` file and starts up `geth`, pointing it to this file.  
3\. Once `geth` has started it creates an account (which will also be the etherbase for this chain) with the password `1234`.  
4\. It then shuts down `geth` and updates the `genesis.json` file with the account id and a preset balance of 5 million Ether (yay!)  
5\. It restarts `geth` with the same options. Now everything is ready!

The CLI can be fed some options. The best part is that any options not directly applicable to `geth-private` get passed onto `geth` itself. For example, I can customize the private network id using the `--identity` option which `geth` supports:

```bash  
$ geth-private --identity mynetwork  
```

Note that if you specify the `--datadir` option then it will attempt to create the specified folder if it doesn't exist. If, however, the folder already exists and there is already a `genesis.json` file within it then `geth-private` will use what's already there. Thus, if you wish to preserve your blockchain changes and re-use the same keys and accounts again simply specify a data folder location using `--datadir`, e.g:

```bash  
$ geth-private --datadir /path/to/my/data  
```

To get Mist / Ethereum Wallet to connect to your private network you need to set `datadir` to the one normally used by Mist. To find out what that is for your system you can type in:

```bash  
$ geth --help | grep datadir  
--datadir "/Users/myname/Library/Ethereum" Data directory for the databases and keystore  
```

With this you will be able to create and visually manage your accounts and contracts. Cool, eh? :)

## Node API

The Node.js API works very similarly to the CLI. In a nutshell here is how you can use it:

```js  
var geth = require('geth-private');
 
var inst = geth();
 
inst.start()
  .then(function() {
    // do some work
  });
  .then(function() {
    // stop it
    return inst.stop();
  });
  .catch(function(err) {
    console.error(err);  
  })
```

You can pass options in the construction phase:

```js  
var geth = require('geth-private');
 
var inst = geth({
  gethPath: '/path/to/geth',
  verbose: true,
  gethOptions: {
    /* 
      These options get passed to the geth command-line 
 
      e.g.
 
      mine: true
      rpc: false,
      identity: 'testnetwork123'
    */
  }
});
 
inst.start().then(...);
```

## Further work & links

With `geth-private` now ready it should be easier to both setup and use private blockchains, as well as write automated Node tests which do the same.

Github: [hiddentao/geth-private](https://github.com/hiddentao/geth-private)