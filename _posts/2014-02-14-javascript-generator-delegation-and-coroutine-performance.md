---
layout: post
published: true
title: Javascript generator delegation and coroutine performance
excerpt: "I am currently building a web app framework on top of [Koa](https:&#47;&#47;github.com&#47;koajs&#47;koa),
  the generator-based middleware framework for node.js. If you are not familiar with
  Generators then I highly recommend reading [Toby Ho's introduction to Generators](http:&#47;&#47;tobyho.com&#47;2013&#47;06&#47;16&#47;what-are-generators&#47;).
  Towards the end of that article he mentions [co](https:&#47;&#47;github.com&#47;visionmedia&#47;co),
  one of the available co-routine methods for use with generator functions. In a nutshell
  **co** handles the iteration of a generator function so that you don't have to:\r\n"
date: '2014-02-14 09:29:55 +0800'
categories:
- Uncategorized
tags:
- Javascript
- Performance
- node.js
comments:
- id: 4912
  author: Esailija
  author_email: petka_antonov@hotmail.com
  author_url: ''
  date: '2014-02-23 17:10:00 +0800'
  date_gmt: '2014-02-23 17:10:00 +0800'
  content: |
    <p>Sorry but there are tons of problems with your benchmark. Most important one is that using <code>.spawn<&#47;code> here is completely absurd - it is meant to be called once per application at most (after which it will be up for months I hope). Instead you should use <code>.coroutine<&#47;code> which last time I checked <a href="http:&#47;&#47;spion.github.io&#47;posts&#47;why-i-am-switching-to-promises.html" rel="nofollow">smashed co in a benchmark<&#47;a><&#47;p>

    <p>Also, native promises are much slower than user promises and this actually goes for built-in almost anything.<&#47;p>
- id: 4914
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2014-02-23 17:58:00 +0800'
  date_gmt: '2014-02-23 17:58:00 +0800'
  content: |
    <p>Point noted regarding coroutine(). I've updated the repo code and re-run the tests in node. Am not seeing much difference in the numbers. Perhaps my setTimeout() test isn't really doing enough - is this what you were alluding to?. I decided on that because I wanted to minimize the impact the asynchronous call had on the test times and just see how the coroutines fared.<&#47;p>

    <p>I also found your SO comment (http:&#47;&#47;stackoverflow.com&#47;questions&#47;21652948&#47;javascript-promise-defer-in-chrome&#47;21674674#21674674) regarding native promises. I'm guessing that native promises are just not fast enough 'yet' as I don't see how optimised native Promise code won't end up being faster...or am I missing something?<&#47;p>
- id: 4915
  author: Esailija
  author_email: petka_antonov@hotmail.com
  author_url: ''
  date: '2014-02-23 18:09:00 +0800'
  date_gmt: '2014-02-23 18:09:00 +0800'
  content: |
    <p>You are running with concurrency level of 1 (higher is actually impossible with jsperf&#47;benchmark.js :&#47;), whereas the linked benchmark uses 10000. 1 is not likely to put any pressure and you will just be benchmarking "air".<&#47;p>

    <p>You are missing a couple of things. V8 already compiles all javascript to native code, and not only that, it does this with actual runtime information about types. Secondly, many built-ins have to support insane spec complexity which user implementations can skip. For example es6 promises need to support subclassing and not only that but they need to work in face of malicious&#47;bad subclassing. .sort needs to work with sparse arrays. And so on.<&#47;p>
- id: 4918
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2014-02-26 12:08:00 +0800'
  date_gmt: '2014-02-26 12:08:00 +0800'
  content: "<p>Thanks so much for your feedback. I've now updated the tests with a
    configurable concurrency factor and re run them to obtain new results (see above).
    My conclusions are now totally different though, as you said, bluebird is king
    as for as speed goes. I've also updated the jsperf browser tests accordingly.<&#47;p>\n"
- id: 4937
  author: tjholowaychuk
  author_email: tj@vision-media.ca
  author_url: ''
  date: '2014-05-06 03:14:00 +0800'
  date_gmt: '2014-05-06 02:14:00 +0800'
  content: "<p>It's worth mentioning (for anyone reading) that comparing bluebird
    to co doesn't really make sense, they're not mutually exclusive, you would use
    bluebird (or similar) <em>with<&#47;em> co, it needs some form of future to work,
    be it a function, promise, etc.<&#47;p>\n"
- id: 4938
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2014-05-06 05:30:00 +0800'
  date_gmt: '2014-05-06 04:30:00 +0800'
  content: |
    <p>I actually agree with what you say and do use them both in my work.<&#47;p>

    <p>At the same time, if iterating over generators you have a choice of coroutine libraries, and I wanted ton see what the performance difference was. Moreover, it's feasible to pick just one library to use and architect one's code accordingly.<&#47;p>
- id: 4939
  author: tjholowaychuk
  author_email: tj@vision-media.ca
  author_url: ''
  date: '2014-05-06 16:32:00 +0800'
  date_gmt: '2014-05-06 15:32:00 +0800'
  content: '<p>Sure, the main reason Co is "slow" (it''s really not for any real work
    anyway) is because of the error handling, which lots simply omit, but that really
    defeats the half of the reasoning behind using generators for flow control. It''s
    all relative, people spend a lot of time benchmarking things that don''t matter.<&#47;p>

'
- id: 5025
  author: greim
  author_email: gregreimer@gmail.com
  author_url: ''
  date: '2015-02-09 23:09:00 +0800'
  date_gmt: '2015-02-09 23:09:00 +0800'
  content: "<p>My own tests show that yielding bluebird promises from co is around
    an order of magnitude faster than yielding almost anything else from co. So: A)
    Before worrying about bluebird vs co, worry about choosing your yieldables carefully.
    B) Bluebird and co aren't mutually-exclusive. Bluebird is nice as a speedy drop-in
    replacement for native Promises, whereas co is dead-simple, general-purpose coroutine
    runner.<&#47;p>\n"
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