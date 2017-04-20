---
layout: post
published: true
title: Setting up geth Ethereum node to run automatically on Ubuntu
date: '2016-05-04 06:12:21 +0800'
categories:
- Uncategorized
tags:
- Ubuntu
- Supervisor
- Ethereum
- Geth
comments:
- id: 5399
  author: EtherPing &#8211; get notifed when you receive Ethereum payments
  author_email: ''
  author_url: http://www.hiddentao.com/archives/2016/05/14/etherping-get-notifed-when-you-receive-ethereum-payments/
  date: '2016-05-14 08:02:07 +0800'
  date_gmt: '2016-05-14 07:02:07 +0800'
  content: "<p>[&#8230;] to verify that our notification logic works exactly as it&#8217;s
    supposed to. I also learnt how to setup geth as a background service on Ubuntu
    [&#8230;]<&#47;p>\n"
- id: 5402
  author: Shawn Runewell
  author_email: shaunshull@gmail.com
  author_url: ''
  date: '2016-05-23 01:47:00 +0800'
  date_gmt: '2016-05-23 00:47:00 +0800'
  content: "<p>Thank you very much for the article. I was able to get a node up and
    running without a problem. Any chance you can give a quick example of how to use
    arno-iptables-firewall to only allow access from select IPs? Thanks again!<&#47;p>\n"
- id: 5403
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2016-05-23 07:10:00 +0800'
  date_gmt: '2016-05-23 06:10:00 +0800'
  content: "<p>Glad you like it. I haven't tried restricting things in that way myself,
    but perhaps the following will help -> http:&#47;&#47;cosmolinux.no-ip.org&#47;raconetlinux2&#47;arno_iptables_firewall.html<&#47;p>\n"
---
For a recent project I'm working on I needed to get [geth](https://github.com/ethereum/go-ethereum) running as a background service on Ubuntu so that I could connect to it via HTTP-RPC and obtain blockchain information. In this post I will outline the steps I took to make this work on my [Digital Ocean](https://m.do.co/c/98d0e3d7eb67) droplet.

I created a $5 per month droplet (512 MB RAM) and setup 1 GB of swap space on it as follows:

```bash  
$ fallocate -l 1024MB /swapfile  
$ chmod 600 /swapfile  
$ mkswap /swapfile  
$ echo '/swapfile none swap sw 0 0' >> /etc/fstab  
$ /sbin/shutdown -r now  
```

That sets up swap space and reboots the server. Next let's install the [supervisor](http://supervisord.org) daemon, which will be responsible for auto-starting geth at bootup and restarting it if it goes down:

```bash  
$ apt-get install supervisor  
```

Now let's install geth using the [official instructions](https://github.com/ethereum/go-ethereum/wiki/Installation-Instructions-for-Ubuntu):

```bash  
$ apt-get install software-properties-common  
$ add-apt-repository -y ppa:ethereum/ethereum  
$ apt-get update  
$ apt-get install geth  
```

Finally we have to add a configuration file to supervisor to let it know that it should run geth, Create `/etc/supervisor/conf.d/geth.conf` and fill it with:

```
[program:geth]
command=/usr/bin/geth --fast --rpc --rpcaddr 127.0.0.1 --rpcport 8545 --rpccorsdomain * --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3
autostart=true  
autorestart=true  
stderr_logfile=/var/log/supervisor/geth.err.log  
stdout_logfile=/var/log/supervisor/geth.out.log  
```

Note that we use geth's `--fast` option to ensure the initial sync of the blockchain happens as quickly as possible. The downside of this is that you won't have the full data for the entire historical blockchain, just the most recent stuff and for new incoming blocks. The command also enables RPC access to this geth instance, so that our dapps can connect to it. If you do this on a public hosted server I highly recommend setting firewall rules (I use [arno-iptables-firewall](http://manpages.ubuntu.com/manpages/trusty/man8/arno-iptables-firewall.8.html)) to prevent unauthorized access to geth's RPC server.

Now just restart supervisor to startup geth:

```bash  
$ supervisorctl reload  
```

Boom! You can now attach a console to your running geth instance by typing `geth attach`. You can then query it using the [standard commands](https://github.com/ethereum/go-ethereum/wiki/JavaScript-Console).