---
title: Javascript generator delegation and coroutine performance
date: '2014-02-14'
summary: "I am currently building a web app framework on top of [Koa](https:&#47;&#47;github.com&#47;koajs&#47;koa), the generator-based middleware framework for node.js. If you are not familiar with Generators then I highly recommend reading [Toby Ho's introduction to Generators](http:&#47;&#47;tobyho.com&#47;2013&#47;06&#47;16&#47;what-are-generators&#47;). Towards the end of that article he mentions [co](https:&#47;&#47;github.com&#47;visionmedia&#47;co), one of the available co-routine methods for use with generator functions. In a nutshell **co** handles the iteration of a generator function so that you don't have to:\r\n"
tags:
  - Javascript
  - Performance
  - node.js
---
I am currently building a web app framework on top of [Koa](https://github.com/koajs/koa), the generator-based middleware framework for node.js. If you are not familiar with Generators then I highly recommend reading [Toby Ho's introduction to Generators](http://tobyho.com/2013/06/16/what-are-generators/). Towards the end of that article he mentions [co](https://github.com/visionmedia/co), one of the available co-routine methods for use with generator functions. In a nutshell **co** handles the iteration of a generator function so that you don't have to:  

```js  
var setTimeoutThunk = function(ms) {
  return function(cb) {
    setTimeout(cb, ms);
  };
};
 
var gen = function*() {
  yield setTimeoutThunk(1);
  yield setTimeoutThunk(1);
};
 
co(gen)(function() {
  // generator finished executing
});
```

A few months ago a fantastic new Promise library - [bluebird](https://github.com/petkaantonov/bluebird) - was released which brought the performance of Generators used with Promises (as opposed to thunk as I have show above) to a very [usable level](http://spion.github.io/posts/why-i-am-switching-to-promises.html). I've since decided to switch to using generators and promises and doing away with callbacks completely within my web framework. Now I want to figure out which of the two - `co` and `bluebird` - offer the best performance. Furthermore would using generator delegation impact performance? Generator delegation allows you to yield a generator from within an existing generator, making it easy to compose a hierarchy of generator calls:

```js  
var setTimeoutThunk = function(ms) {
  return function(cb){
    setTimeout(cb, ms);
  };
};
 
var delegated = function*() {
  yield setTimeoutThunk(1);
  yield setTimeoutThunk(1);
};
 
var delegator = function*() {
  yield* delegated();
};
 
co(delegator)(function(){
  // generator finished executing
});
```

My tests can be found at [https://github.com/hiddentao/node-generator-perf-tests](https://github.com/hiddentao/node-generator-perf-tests). In there I've also linked to browser versions of the tests I've created, though at the moment only Firefox Nightly supports generators out of the box without having to enable additional flags.

**NOTE: Thanks to Petka Antonov (author of Bluebird) for pointing out the problems with my original test. I have since updated the code and the results below accordingly. My recommendations and conclusions have changed as a result.**

Here are my results.

**Generator delegation**

```  
// Test device: Macbook Air 2012 (2 GHz Intel Core i7 + 8GB 1600MHz DDR3 RAM + OS X 10.9 (13A603))
 
// Node 0.11.10
 
$ node --harmony perf-generator-delegation.js -c 10000
Concurrency factor: 10000
Without delegation x 95.18 ops/sec ±1.86% (54 runs sampled)
With delegation x 55.14 ops/sec ±1.58% (68 runs sampled)
 
// Firefox Nightly 30.0a1
// http://jsperf.com/generator-delegation/3
 
Without delegation x 20.24 ops/sec ±2.45%
With delegation x 11.47 ops/sec ±3.43%

```

Using delegation roughly halves the performance, in both Node (V8) and Firefox (SpiderMonkey).

**Bluebird vs co**

```  
// Test device: Macbook Air 2012 (2 GHz Intel Core i7 + 8GB 1600MHz DDR3 RAM + OS X 10.9 (13A603)) 
 
// Node 0.11.10
 
$ node --harmony perf-co-vs-bluebird.js -c 10000
Concurrency factor: 10000
Bluebird-Promise.spawn x 16.02 ops/sec ±3.42% (78 runs sampled)
co x 6.86 ops/sec ±3.23% (37 runs sampled)
Bluebird-Promise.coroutine (prepared) x 16.78 ops/sec ±2.22% (80 runs sampled)
co (prepared) x 7.39 ops/sec ±3.50% (40 runs sampled)
 
// Firefox Nightly 30.0a1
// http://jsperf.com/generator-iteration-co-vs-bluebird/2
 
Bluebird: Promise.spawn x 1.05 ±14.35%
co x 0.93 ±7.95%
Bluebird: Promise.coroutine (prepared) x 1.04 ±11.51%
co (prepared) x 0.93 ±12.41%
```

In Node, Bluebird clearly blows co out of the water by being at least twice as fast - this is in line with [previous performance results](http://spion.github.io/posts/why-i-am-switching-to-promises.html). In SpiderMonkey bluebird is still faster though less so. I'm guessing optimisations made in bluebird for V8 might not apply equally for for SpiderMonkey.

And in Bluebird's case using `Promise.spawn` doesn't seem worse than using `Promise.coroutine`, at least as far as speed is concerned.

**Conclusion**

Generator delegation clearly impacts performance and so should ideally not be used in performance critical parts of your code, at least for now. I'm hoping that future VM optimisations will improve this situation. As for which coroutine library to use Bluebird is the clear winner as far as performance is concerned, no doubt about it, although the performance difference between the two in SpiderMonkey is less pronounced. Bluebird does however deal exclusively with Promises, so if you want to use thunks and other constructs then you're better off with co.

I also initially though that upcoming [native Promises for ES6](http://www.html5rocks.com/en/tutorials/es6/promises/) would mean a speedup in Promises performance generally but some [good points](#comment-1257380004) have been made against that argument. In any case, even if native Promises aren't that fast Bluebird does the job well enough.

Links:

* [Github test code repo](https://github.com/hiddentao/node-generator-perf-tests/)  
* Browser tests: [Generator delegation](http://jsperf.com/generator-delegation/3), [Bluebird vs co](http://jsperf.com/generator-iteration-co-vs-bluebird/2)

**Update (Mar 11)**: I looked at the Bluebird source code to see if I could use the performance techniques there-in to speed up co. This then turned into an attempt to refactor co in general. I was able to almost double co's performance when yielding promises and slightly increase it for other cases (e.g. yielding thunks, generators, etc.). See the [details on github](https://github.com/hiddentao/node-generator-perf-tests/tree/master/co-speedup).
