---
layout: post
published: true
title: Why Promises are more flexible than callbacks
excerpt: "Every now and then I see an article explaining why Promises in Javascript
  are awesome. And almost in all cases they never quite go into enough depth about
  exactly how Promises offer more flexibility than callbacks. In this post I shall
  attempt to provide my explanation as to how and why Promises are more flexible than
  callbacks and why you should consider using them.\r\n\r\nLet's take a simple example
  of reading from a file. Assume we have an asynchronous method `readFile(fileName,
  cb)` which reads the contents of a file and invokes a callback. Here is how we might
  use it:\r\n"
date: '2014-04-21 04:04:59 +0800'
categories:
- Uncategorized
tags:
- Javascript
- Promise
comments: []
---
Every now and then I see an article explaining why Promises in Javascript are awesome. And almost in all cases they never quite go into enough depth about exactly how Promises offer more flexibility than callbacks. In this post I shall attempt to provide my explanation as to how and why Promises are more flexible than callbacks and why you should consider using them.

Let's take a simple example of reading from a file. Assume we have an asynchronous method `readFile(fileName, cb)` which reads the contents of a file and invokes a callback. Here is how we might use it:  

```js  
readFile('test.txt', function(err, contents) {
  if (err) return console.error(err);
 
  console.log(contents);
});
```

Straightforward. Now let's say we wish to read in two files and output their contents together. The vanilla way is to do:

```js  
readFile('test.txt', function(err, contents1) {
  if (err) return console.error(err);
 
  readFile('test2.txt', function(err, contents2) {
    if (err) return console.error(err);
 
    console.log(contents1 + contents2);
  });
});
```

It sucks that the final content handling logic is indented like that. Let's use the [async](https://github.com/caolan/async) module to make the this look nicer and parallelise the operations:

```js  
var async = require('async');
 
async.parallel({
  contents1: function(done) {
    readFile('test.txt', done);
  },
  contents2: function(done) {
    readFile('test2.txt', done);
  }
}, function(err, results) {
  if (err) return console.error(err);
 
  console.log(results.contents1 + results.contents2);
});
```

So far so good. And we only need to handle the errors in one place. But what if we didn't want to handle the results then and there? What if we wanted to write the code for the final callback elsewhere? We could write something like this:

```js  
var async = require('async');
 
// This takes the results from async and waits until 
// we call `then` before actually doing anything with them.
var callbackWrapper = function(err, results) {
  this.then = function(fn) {
    fn.call(fn, err, results);
  }
}
 
 
async.parallel({
  contents1: function(done) {
    readFile('test.txt', done);
  },
  contents2: function(done) {
    readFile('test2.txt', done);
  }
}, callbackWrapper);
 
 
... // do some other stuff here
 
 
// now let's finally handle the results
callbackWrapper.then(function(err, results){
  if (err) return console.error(err);
 
  console.log(results.contents1 + results.contents2);  
});
```

What did we just do? We separated the handling of the results from call to the asynchronous operation. When using normal callbacks, the results get handled as soon as they're available. **With Promises the results don't necessary get handled as soon as they're available - they get handled when we want to handle them.**

We could pass the `callbackWrapper` (our makeshift Promise) function object to another function which could then internally process it. Being able to do this provides us with even more flexibility.

_**Note:** [Bluebird](https://github.com/petkaantonov/bluebird) is an excellent Promise library with great performance. For the remaining examples this is what I will be using._

So what if our `readFile()` method returned a Promise? how could we rewrite our code?

```js  
var Q = require('bluebird');
 
var promise = Q.prop({
  contents1: readFile('test.txt'),
  contents2: readFile('test2.txt')
});
 
// do some other stuff
 
promise
  .then(function(results){
    console.log(results.contents1 + results.contents2);
  })
  .catch(function(err){
    // if either of the `readFile` calls fails this callback will be invoked
    console.log(err);
  });
```

Notice how we are still able to defer the handling of results.

Error handling only needs to happen in one place. What's more, if any of the `then()` callbacks throws an error that too will be caught and handled by the final error callback. **Promises make error handling across multiple asynchronous calls more effortless than when using callbacks.**

Not having to provide callbacks makes the code look cleaner. Callbacks represent the control flow mechanism. They only tell us how the program flows, not really what it does. Thus it's nice to be able to minimise their visibility and allow the other more meaningful function parameters and method calls be more visible.

**Promises can be chained** - The callback to `then()` can itself return another Promise, allow you to easily create a sequence of asynchronous calls. What's more we can create and/or extend the chain after we've already obtained results:

```js  
var Q = require('bluebird');
 
readFile('test.txt')
  .then(function(contents) {
    // Assume we have an asynchronous `wordCount` method which returns a Promise
    return wordCount(contents);
  })
  .then(function(numWords) {
    console.log('Word count: ' + numWords);
  })
  .catch(function(err) {
    console.error(err);
  });
```

Have you noticed the one downside to our code above when compared to callbacks? The `contents` result is not available in the scope of the `numWords` result. For instance, if we wrote the above using callbacks we could make it look like:

```js  
readFile('test.txt', function(err, contents) {
  if (err) return console.error(err);
 
  wordCount(contents1, function(err, numWords) {
    if (err) return console.error(err);
 
    console.log('Word count for "' + content + '" is: ' + numWords);
  });
});
```

To do the same using the Promise flow we can either save `contents` into a variable available in the outer scope or handle the result of `wordCount()` within the same scope as `contents`:

```js  
var Q = require('bluebird');
 
readFile('test.txt')
  .then(function(contents) {
    return wordCount(contents)
      .then(function(numWords){
        console.log('Word count for "' + content + '" is: ' + numWords);  
      });
  })
  .catch(function(err) {
    console.error(err);
  });
```

I hope I've given you a good taster of why Promises are more flexible than callbacks. To sum up:

* Promises allow you to choose when you want to handle the result of an asynchronous call  
* Promises can be chained, and chains can be extended at any time  
* Promises allow you to effortlessly handle errors, even when chaining