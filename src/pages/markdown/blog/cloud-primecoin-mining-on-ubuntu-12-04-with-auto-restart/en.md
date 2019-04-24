---
title: Cloud Primecoin mining on Ubuntu 12.04 with auto restart
date: '2013-11-24'
summary: "Following [some helpful instructions](http:&#47;&#47;www.peercointalk.org&#47;index.php?topic=937.0), I got myself a [new cloud server at Digital Ocean](https:&#47;&#47;www.digitalocean.com&#47;?refcode=98d0e3d7eb67) to start mining [Primecoins](http:&#47;&#47;primecoin.org) with. I wanted to have the miner running automatically and continuously, and being restarted even if the server itself got rebooted for whatever reason. Here is how I got things setup.\r\n"
tags:
  - Ubuntu
  - Cloud
  - Bitcoin
  - Mining
  - Supervisor
---
Following [some helpful instructions](http://www.peercointalk.org/index.php?topic=937.0), I got myself a [new cloud server at Digital Ocean](https://www.digitalocean.com/?refcode=98d0e3d7eb67) to start mining [Primecoins](http://primecoin.org) with. I wanted to have the miner running automatically and continuously, and being restarted even if the server itself got rebooted for whatever reason. Here is how I got things setup.  

## Install Primecoin miner

I followed the instructions in the [original forum post]((http://www.peercointalk.org/index.php?topic=937.0)), but had to install Boost v1.48 specifically in order to get compilation working:

```bash  
$ apt-get update  
$ apt-get install -y git make g build-essential libminiupnpc-dev  
$ apt-get install -y libdb -dev libgmp-dev libssl-dev dos2unix  
$ apt-get install -y libboost1.48-all libboost-chrono1.48-dev  
```

Now get the source code and build it:

```bash  
$ git clone https://github.com/thbaumbach/primecoin  
$ cd primecoin/src  
$ make -f makefile.unix  
```

At this point `primeminer` is a runnable executable. Test that it works:

```bash  
$ ./primeminer
********************************************
*** Xolominer - Primecoin Pool Miner v0.8 RC1
*** by xolokram/TB - www.beeeeer.org - glhf
***
*** thx to Sunny King & mikaelh
*** press CTRL+C to exit
********************************************
usage: ./primeminer -poolfee=<fee-in-%> -poolip=<ip> -poolport=<port> -pooluser=<user> -poolpassword=<password>
```

## Supervisor

We want to make sure that the miner is always running, even after the server reboots. We'll use [supervisor](http://supervisord.org/) to enable this. Supervisor is a process which starts and monitors other processes, automatically restarting them if they die. In other words, it supervises them!

```bash  
$ apt-get update  
$ apt-get install supervisor  
$ mkdir -p /var/log/supervisor  
```

Now create `/etc/supervisord/conf.d/primecoin.conf` with the following contents (_replace the instruction text with the correct values as per your mining pool and coin address_):

```  
[program:primecoin]  
command=/root/primecoin/src/primeminer -pooluser=AGietAbUNzveig2XDjmc7hgo4tAVBQYLqA -poolpassword=0 -poolip=rpool.net -poolport=8336 -genproclimit=1  
stdout_logfile=/var/log/supervisor/%(program_name)s.log  
stderr_logfile=/var/log/supervisor/%(program_name)s.log  
autorestart=true  
```

Restart supervisord service and check that primeminer is now running:

```  
$ /etc/init.d/supervisord stop  
$ /etc/init.d/supervisord start  
$ ps aux | grep primeminer  
...  
root 25091 80.4 1.0 124176 10984 ? Sl 03:53 0:07 /root/primecoin/src/primeminer -pooluser=AGietAbUNzveig2XDjmc7hgo4tAVBQYLqA -poolpassword=0 -poolip=rpool.net -poolport=8336 -genproclimit=1  
...  
```

Try killing the miner. Then check that it automatically starts up again:

```  
$ kill <process id="" from="" before="">...wait a few seconds before executing the next command...  
$ ps aux | grep primeminer  
...  
root 25105 80.4 1.0 124176 10984 ? Sl 03:53 0:07 /root/primecoin/src/primeminer -pooluser=AGietAbUNzveig2XDjmc7hgo4tAVBQYLqA -poolpassword=0 -poolip=rpool.net -poolport=8336 -genproclimit=1  
...  
[/code]  
</process></div>

Now your miner will kick off as soon as your server starts, and the supervisor will ensure that it stays up. To see what the miner is upto you can check its log:

```bash  
$ tail -f /var/log/supervisor/primecoin.log  
*** press CTRL C to exit  
********************************************  
AGietAbUNzveig2XDjmc7hgo4tAVBQYLqA  
GeneratePrimeTable() : setting nSieveExtensions = 9, nSievePercentage = 10, nSieveSize = 1000000  
GeneratePrimeTable() : prime table [1, 1000000] generated with 78498 primes  
spawning 1 worker thread(s)  
[WORKER0] Hello, World!  
[WORKER0] GoGoGo!  
connecting to 54.238.199.196:8336  
[MASTER] work received  
```
