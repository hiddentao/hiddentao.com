---
title: Setting up geth Ethereum node to run automatically on Ubuntu
date: '2016-05-04'
summary: ''
tags:
  - Ubuntu
  - Supervisor
  - Ethereum
  - Geth
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
