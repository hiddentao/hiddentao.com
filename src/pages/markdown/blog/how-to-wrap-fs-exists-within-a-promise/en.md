---
title: How to wrap fs.exists() within a Promise
date: '2013-06-10'
summary: "I have started using the [Q](https:&#47;&#47;npmjs.org&#47;package&#47;q) module - an implementation of the [Promises specification](https:&#47;&#47;github.com&#47;promises-aplus&#47;promises-spec). One nifty function it provides is [denodify](https:&#47;&#47;github.com&#47;kriskowal&#47;q&#47;wiki&#47;API-Reference#qdenodeifynodefunc-args). This makes it easy to convert a Node.js function (which takes a normal callback) into one which returns a Promise. All good until you decide you want to use [fs.exists()](http:&#47;&#47;nodejs.org&#47;api&#47;fs.html#fs_fs_exists_path_callback). \r\n"
tags:
  - Javascript
  - node.js
  - Promise
---
I have started using the [Q](https://npmjs.org/package/q) module - an implementation of the [Promises specification](https://github.com/promises-aplus/promises-spec). One nifty function it provides is [denodify](https://github.com/kriskowal/q/wiki/API-Reference#qdenodeifynodefunc-args). This makes it easy to convert a Node.js function (which takes a normal callback) into one which returns a Promise. All good until you decide you want to use [fs.exists()](http://nodejs.org/api/fs.html#fs_fs_exists_path_callback).
<a id="more"></a><a id="more-1561"></a>

The issue is that `fs.exists()` takes a callback which is not expected to have an `err` parameter in its signature. Instead the callback will get passed a boolean value indicating whether the checked path exists or not. Here is the typical usage:

```js
var fs = require('fs');

fs.exists('/tmp', function(exists) {
  if (exists) {
    // do something
  } else {
    // do something else
  }
});
```

So how can we rewrite this using a Promise?

We can use `Q.defer()` to create a new Promise and then we can use `defer.resolve()` as the callback:

```js
var fs = require('fs');

var Q = require('q');

var defer = Q.defer();

fs.exists('/tmp', defer.resolve);

defer.promise.then(function(exists) {
  if (exists) {
    // do something
  } else {
    // do something else
  }
});
```

We can `return` the result of `defer.promise.then(...)` back to a caller. This result itself will be a Promise the caller can subsequently use.
