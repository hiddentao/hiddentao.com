---
layout: post
published: true
title: Getting geth client mining to work in Travis CI builds
date: '2016-09-07 13:10:01 +0800'
categories:
- Uncategorized
tags:
- Ethereum
- Blockchain
- Builds
- Mining
- Travis
comments: []
---

Yesterday I finally got [geth-private](https://github.com/hiddentao/geth-private) automated [builds](https://travis-ci.org/hiddentao/geth-private/builds) working on Travis CI. There were two main problems in getting the builds working:

* The `geth` sub-processes launched by during tests weren't always existing even though Node.js 
was telling me that they were.

* The tests which relied on mining to happen were always failing.

The second problem was occurring due to the fact that in order to mine, Geth first needs to build a [DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph) for the [Ethash](https://github.com/ethereum/wiki/wiki/Ethash) algorithm to work. This is a one-time thing and takes a number of minutes to do - only after this is done can mining begin.

In my `.travis.yml` I added the following:

```yml
before_script:
  ... # other stuff here
  - mkdir -p ~/.ethash
  - geth makedag 0 ~/.ethash
``` 

This got the mining-related tests passing. But this now raised another problem. Creating the DAG 
was taking upwards of 6 minutes, which meant that every build would take a minimum of this much time even before it got to running the tests. I needed to be able to cache the built DAG between 
builds.

Luckily Travis supports [directory caching](http://docs.travis-ci.com/user/caching/):

```yml
cache:
  directories:
    - ~/.ethash
```

With this set the first build would build the DAG and place it into cache and then subsequent builds would simply re-use the contents from cache - actually, every build runs the `makedag` call but this call doesn't need to do any work if it finds that the DAG is already there.

***

A note on the first problem - `geth` sometimes failing to exit properly. 

This actually took 
longer to solve. I tried using `SIGKILL`, tried using the [terminate](https://www.npmjs.com/package/terminate) module, and tried a whole bunch of other tricks. In the end what fixed it for me was changing how I was launching the `geth` child process in the first place.

Node's [`child_process.exec()`](http://nodejs.org/dist/latest/docs/api/child_process.html#child_process_child_process_exec_command_options_callback) launches a new process from a shell command by first creating a shell to launch it from, whereas [`child_process.spawn()`](http://nodejs.org/dist/latest/docs/api/child_process.html#child_process_child_process_spawn_command_args_options) directly launches the command. On my dev machine it made no difference but on Travis CI it seemed to make a big difference when it came to killing the child process. 

Actually I was using the  [shelljs](https://github.com/shelljs/shelljs) module to launch the process because it provides a simpler API. Switching to `child_process.spawn()` and managing the I/O streams more directly resulted in more robust child process management.

I'll be careful to use `child_process.spawn()` in future when I want to be sure that I can manage my child processes effectively.

