---
layout: post
published: true
title: Cloud Primecoin mining on Ubuntu 12.04 with auto restart
excerpt: "Following [some helpful instructions](http:&#47;&#47;www.peercointalk.org&#47;index.php?topic=937.0),
  I got myself a [new cloud server at Digital Ocean](https:&#47;&#47;www.digitalocean.com&#47;?refcode=98d0e3d7eb67)
  to start mining [Primecoins](http:&#47;&#47;primecoin.org) with. I wanted to have
  the miner running automatically and continuously, and being restarted even if the
  server itself got rebooted for whatever reason. Here is how I got things setup.\r\n"
date: '2013-11-24 08:58:31 +0800'
categories:
- Uncategorized
tags:
- Ubuntu
- Cloud
- Bitcoin
- Mining
- Supervisor
comments:
- id: 4881
  author: JT
  author_email: jordangthompson@gmail.com
  author_url: ''
  date: '2013-11-29 03:29:00 +0800'
  date_gmt: '2013-11-29 03:29:00 +0800'
  content: "<p>Thank you for this. How many CPD are you seeing?<&#47;p>\n"
- id: 4882
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2013-11-29 03:36:00 +0800'
  date_gmt: '2013-11-29 03:36:00 +0800'
  content: "<p>Honestly, it sucks. Am only getting on the order of 0.3 coins after
    4 days or so of constant mining. I think that if you want to do this now you'd
    definitely need to do multiple cores on a more powerful machine to make headway.
    I think this sort of single-core setup is only worth it in the early days of a
    coin.<&#47;p>\n"
- id: 4883
  author: Darko Sokolovic
  author_email: darkomfs@gmail.com
  author_url: ''
  date: '2013-12-01 21:27:00 +0800'
  date_gmt: '2013-12-01 21:27:00 +0800'
  content: "<p>Can you tell me how i can setup a private pool that will work with
    xolominer. Or any other miner i can auto restart it and keep it running in the
    background. Thanks<&#47;p>\n"
- id: 4884
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2013-12-01 23:50:00 +0800'
  date_gmt: '2013-12-01 23:50:00 +0800'
  content: |
    <p>Hi mate, instructions for compiling and running xolominer are here: http:&#47;&#47;www.peercointalk.org&#47;index.php?topic=798.0<&#47;p>

    <p>Once you have the <em>primeminer<&#47;em> executable created you can follow my instructions above for getting it to auto-run and auto-restart using the supervisor daemon.<&#47;p>
- id: 4885
  author: Darko Sokolovic
  author_email: darkomfs@gmail.com
  author_url: ''
  date: '2013-12-02 06:25:00 +0800'
  date_gmt: '2013-12-02 06:25:00 +0800'
  content: "<p>Sure. But u said it works with beeeer.org and rpool. How do you&#47;can
    you setup a private pool for solo mining?<&#47;p>\n"
- id: 4886
  author: paul croasdale
  author_email: pcroasd@gmail.com
  author_url: ''
  date: '2013-12-03 20:48:00 +0800'
  date_gmt: '2013-12-03 20:48:00 +0800'
  content: "<p>i'm averaging 0.23XPM&#47;day&#47;core<&#47;p>\n"
- id: 4887
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2013-12-05 09:30:00 +0800'
  date_gmt: '2013-12-05 09:30:00 +0800'
  content: "<p>I haven't tried setting up a private pool myself, sorry about that.
    Bitcointalk forum is your best bet for that.<&#47;p>\n"
- id: 4888
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2013-12-05 09:30:00 +0800'
  date_gmt: '2013-12-05 09:30:00 +0800'
  content: "<p>Nice!<&#47;p>\n"
- id: 4889
  author: Amber
  author_email: michikade@gmail.com
  author_url: ''
  date: '2013-12-09 00:08:00 +0800'
  date_gmt: '2013-12-09 00:08:00 +0800'
  content: "<p>Thanks for this.  I've used it in conjunction with jhPrimeminer for
    Linux to mine with ypool and it works like a dream.<&#47;p>\n"
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