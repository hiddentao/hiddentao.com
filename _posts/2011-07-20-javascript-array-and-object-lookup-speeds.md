---
layout: post
published: true
title: Javascript array and object lookup speeds
excerpt: "I'm currently working on an an implementation of the [LZW algorithm](http:&#47;&#47;en.wikipedia.org&#47;wiki&#47;Lempel%E2%80%93Ziv%E2%80%93Welch)
  in Javascript and one of the things I need to decide to test out is whether using
  an `Array` is faster than using an `Object` for storage and retrieval of items which
  are indexed numerically. I decided to write a little Javascript test to see which
  was faster and find out how if the choice of browser made a difference to the relative
  results.\r\n"
date: '2011-07-20 11:35:22 +0800'
categories:
- Uncategorized
tags:
- Javascript
- Algorithms
- Performance
comments:
- id: 4906
  author: Alagusundar
  author_email: alaguslsundaram@gmail.com
  author_url: ''
  date: '2014-02-12 09:07:00 +0800'
  date_gmt: '2014-02-12 09:07:00 +0800'
  content: "<p>Great information. I am learn for many information about your article.
    Thanks for sharing this information. http:&#47;&#47;www.dreamdestinations.in&#47;<&#47;p>\n"
---
I'm currently working on an an implementation of the [LZW algorithm](http://en.wikipedia.org/wiki/Lempel–Ziv–Welch) in Javascript and one of the things I need to decide to test out is whether using an `Array` is faster than using an `Object` for storage and retrieval of items which are indexed numerically. I decided to write a little Javascript test to see which was faster and find out how if the choice of browser made a difference to the relative results.

As you may already know Javascript arrays are pretty much the same as objects and with some subtle differences (see [ECMA spec](http://bclary.com/2004/11/07/#a-15.4)). Most notably, the `length` properly of an array really does give you the number of items in the array whereas in an object it simply returns the largest index 1\. So technically speaking it shouldn't make a difference whether you use an array or an object to store your values.

I decided to test out this theory out across a number of browsers. My test would first involve populating an array or object with the first 65536 Unicode characters whereby each array or object index would hold the corresponding Unicode character. My test would then attempt to lookup a random index within the array or object and repeat this many times in order to generate comparable lookup times. I decided to compare the performance of 3 different storage mechanisms initialised as follows:

* `new Object()` - an object.
* `new Array()` - dynamically sized array.
* `new Array(65536)` - statically sized array. Technically it's size can still increase but perhaps different browsers optimise this differently?

I tried my best to write the test in such a way that it would prevent any "hotspot" optimisations from unfairly biasing any particular storage mechanism. Thus you will see in the code (below) that in each iteration of the test it changes the order in which it tests the storage mechanisms. It also passes the result of each lookup to a variable via a function call in order to get around any aggressive inline optimisations the interpreter/JIT may do (very likely if we were to simply assign the result of a lookup to local variable in the loop which didn't get used anywhere else).

My test rig is has the following basic setup:

* Intel(R) Core(TM)2 Duo CPU E7500 @ 2.93GHz
* Just under 4 GB RAM
* Ubuntu 10.10, kernel x86_64, 2.6.35-25-generic

100,000 lookups were performed on each storage mechanism in each iteration, with a total of 100 iterations done. The value shown below (in *milliseconds*) represent the average time taken to execute a single iteration of 100,000 lookups:

| Browser | new Object | new Array() | new Array(65536) |
| --- | --- | --- | --- |
| Chrome 12.0.742.124 | 8 | 8 | 8 |
| Opera 11.10 | 15 | 15 | 15 |
| Firefox 5.0 | 44 | 26 | 26 |

It's no surprise that Chrome is the fastest. What is surprising though is that on Firefox the `Object` lookups take at least 1.5 times longer than `Array` lookups. Also to note is that when I ran the test in Firefox my browser momentarily froze as it was performing the calculations. There also doesn't seem to be any significant performance difference between dynamically-sized and statically-sized arrays. Since all arrays are dynamic, the Javascript engines don't rely on any initial size you specify.

In order to test Safari I decided to fire up VirtualBox running WinXP and test all the other browsers too. Here are the results:

| Browser | new Object | new Array() | new Array(65536) |
| --- | --- | --- | --- |
| Chrome 12.0.742.122 | 6 | 6 | 5 |
| Opera 11.50 | 15 | 15 | 15 |
| Firefox 5.0 | 23 | 12 | 12 |
| Safari 5.0.5 (7533.21.1) | 79* | 22* | 36* |

_* Safari popped up a confirmation dialog during the test asking me if I wanted to keep running what seemed to be an responsive script, and I'm not sure how this may affected the results._

I could rewrite the code to be more asynchronous using `setTimeout` and whatnot but it's telling to see that Safari's Javascript engine was unable to cope with it. Safari and Firefox both seem to struggle with `Object` lookups more so than `Array` lookup. ~~I don't have a Windows Vista/7 rig right now so I can't test out IE 9\. However I hope to have results for that up soon.~~ I ran the tests on my home machine which has the following specs:

* Core 2 Duo E8400 @ 3.00 GHz
* 2 GB RAM
* Windows 7 Pro 64-bit

Here are the results:

| Browser | new Object | new Array() | new Array(65536) |
| --- | --- | --- | --- |
| Chrome 12.0.742.122 | 5 | 5 | 5 |
| Opera 11.50 | 14 | 14 | 14 |
| Firefox 5.0 | 17 | 12 | 12 |
| Safari 5.1 (7534.50) | 46 | 11 | 11 |
| Internet Explorer 9.0.8112.16421 64-bit | 48 | 42 | 42 |

So the much-vaunted IE 9 still doesn't compare to other browsers when it comes to raw performance. Ok, ok, I accept that my test is FAR from conclusive on that matter! but I can only imagine older versions of IE to be much even worse.

So far it seems that Chrome gives the best performance and has the best underlying optimisation for property access. I'm putting this down to V8's use of ["hidden classes"](http://code.google.com/apis/v8/design.html). Opera also seems to have an architecture which allows for similar speeds across the types; it's just slower than Chrome. For sequential numerical indexes Firefox and Safari do better with `Array`s even though they're still slower than Chrome for overall code execution speed. What's most striking is the magnitude of the difference for Safari - clearly `Object`s and `Array`s are handled very differently within the Nitro Javascript engine.

The full HTML page containing the Javascript test code follows:

```html
<title>Javascript array tests</title>
<button>Test</button>
<script type="text/javascript">
$("button").click(function() {
  // our storage mechanisms
  var inputs = {
      "Object": new Object,
      "Dynamic array": new Array(),
      "Static array": new Array(65536)
  };

  // build array to hold timings as well as an array to hold the keys of 'input' so that
  var timeTakenMs = {};
  var inputKeys = [];
  for (var i in inputs) {
      timeTakenMs[i] = 0;
      inputKeys.push(i);
  }

  // fill up the storage arrays with initail data.
  for (var val = 0; val < 65536; val) {
      for (var i in inputs) {
          inputs[i][val] = String.fromCharCode(val);
      }
  }

  // a dummy function call, to help prevent inline code optimisations in the inner test loop below
  var tmp = "";
  var dummy = function(str) {
      tmp = str;
  }

  // how many lookups we will do in each iteration of the tests
  var MAX_LOOKUPS = 100000;
  // the number of iterations of the test to perform in order to get a decent average
  var MAX_ATTEMPTS = 100;

  /*
  The actual test.

  In each iteration of the test we reverse the direction in which we test the storage
  mechanisms. This is to try and prevent any "hotspot" optimisations the Javascript interpreter/JIT
  may try and do from unfairly benefiting the later-tested storage mechanisms.
  */
  var startKey = 0,
      endKey = inputKeys.length - 1,
      incKey = 1;
  for (var attempt = 0; attempt < max_attempts; attempt) = "" { < br = "" >
          for (var k = startKey; k != (endKey incKey); k = incKey) {
              var list = inputs[inputKeys[k]];
              var startTimeMs = new Date().getTime();
              for (var val = 0; val < max_lookups; val) = "" { < br = "" > dummy(list[parseInt(Math.floor(Math.random() * 65536))]);
              }
              timeTakenMs[inputKeys[k]] = new Date().getTime() - startTimeMs;
          }
          // reverse loop direction
      startKey ^= endKey;
      endKey = startKey ^ endKey;
      startKey ^= endKey;
      incKey = -incKey;
  }

  // show the results
  for (var i in timeTakenMs) {
      // work out average
        $("#results").append("<div>"   i   ": avge time taken for "   MAX_LOOKUPS   " lookups: "
                  Math.round(parseFloat(timeTakenMs[i]) / MAX_ATTEMPTS)   " ms</div>");
  }
});
</script>
```