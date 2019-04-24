---
title: 'Clockmaker, flexible timer management for Javascript'
date: '2014-06-19'
summary: "As part of my tests for [Ansibot]() I need to be able to shutdown and startup the server multiple times in succession. This involves stopping and starting various timers spread throughout the system. I was using `setTimeout` and `setInterval` directly (Javascript's built-in goodies) to create my timers, and this made it hard to control the timers once they were running. After a quick fruitless search around for a nice library that would make this easier I decided to build [Clockmaker](https:&#47;&#47;github.com&#47;hiddentao&#47;clockmaker), my solution to this.\r\n"
tags:
  - Javascript
  - node.js
  - Timers
---
As part of my tests for [Ansibot]() I need to be able to shutdown and startup the server multiple times in succession. This involves stopping and starting various timers spread throughout the system. I was using `setTimeout` and `setInterval` directly (Javascript's built-in goodies) to create my timers, and this made it hard to control the timers once they were running. After a quick fruitless search around for a nice library that would make this easier I decided to build [Clockmaker](https://github.com/hiddentao/clockmaker), my solution to this.  

Clockmaker allows you to start and stop a timer multiple times, change the timer interval in real-time, and control multiple timers in one go. Here are some examples...

A basic timer which ticks once and execute the handler after 2 seconds:

```js  
Timer(function() {  
  console.log('2 seconds done');  
}, 2000).start();  
```

A repeating timer (like `setInterval`) which has its delay adjusted on-the-fly:

```js  
var delayMs = 1000;
 
var timer = new Timer(function() {
  console.log('1 second longer');
  delayMs += 1000;
  timer.setDelay(delayMs);
}, delayMs, {
  repeat: true
});
 
timer.start();
```

A repeating timer that stops after two ticks:

```js  
var count = 0;
 
var timer = new Timer(function() {
  count++;
  if (2 === count) {
    timer.stop();
  }
}, 1000, {
  repeat: true
});
 
timer.start();
```

A timer with an asynchronous handler function, a custom `this` context and also error handling:

```js  
var ctx = { str: 'hello' };
 
var timer = new Timer(function(cb) {
  console.log(this.str);  // 'hello'
  cb(new Error('test'));
}, 1000, {
  async: true,
  this: ctx,
  onError: function(err) {
    console.log(err);  // 'Error: test'
  }
});
 
timer.start();
```

Control multiple timers:

```js  
var timers = new Timers();
 
var timer1 = timers.new(handlerFn, 2000, { repeat: true });
var timer2 = timers.new(aletFn, 1000);
var timer3 = ...
 
timers.start(); // ...start them all at once
 
... // some time later
 
timers.stop(); // ...stop them all at once
```

A full list of features, installation instructions and a more complete list of examples is available at [https://github.com/hiddentao/clockmaker](https://github.com/hiddentao/clockmaker).
