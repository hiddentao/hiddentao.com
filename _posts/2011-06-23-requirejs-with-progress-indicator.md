---
layout: post
published: true
title: RequireJS with progress indicator
excerpt: I've just started using the excellent [RequireJS](http://requirejs.org/)
  library with a new Javascript-heavy project I'm working on. This post considers
  an easy way in which to add a progress indicator to all `require()` calls such that
  the user is always aware of what's going on.
date: '2011-06-23 09:43:04 +0800'
categories:
- Uncategorized
tags:
- Javascript
- RequireJS
comments:
- id: 4742
  author: Chris Pearce
  author_email: ''
  author_url: http://twitter.com/Chrisui
  date: '2011-10-31 15:08:00 +0800'
  date_gmt: '2011-10-31 15:08:00 +0800'
  content: "<p>This doesn't seem to work when using the order! plugin... :(<&#47;p>\n"
- id: 4743
  author: Ram
  author_email: ram@hiddentao.com
  author_url: ''
  date: '2011-11-01 21:52:00 +0800'
  date_gmt: '2011-11-01 21:52:00 +0800'
  content: "<p>Strange because I was using the order plugin too. I wonder if its because
    all my order! clauses were done in the define() method.<&#47;p>\n"
- id: 4995
  author: guest
  author_email: none3@please.com
  author_url: ''
  date: '2014-10-28 15:40:00 +0800'
  date_gmt: '2014-10-28 15:40:00 +0800'
  content: "<p>Demo?<&#47;p>\n"
- id: 4996
  author: Fix Progress Indicator.js Errors - Windows XP, Vista, 7 &amp; 8
  author_email: ''
  author_url: http://www.fixruntimeerror.net/progress-indicator-js.php
  date: '2014-10-30 15:36:19 +0800'
  date_gmt: '2014-10-30 15:36:19 +0800'
  content: "<p>[&#8230;] RequireJS with progress indicator &#8211; HiddenTao &acirc;&euro;&ldquo;
    RequireJS with progress indicator. June 23, 2011 by ram 2 Comments. I&#8217;ve
    just started using the excellent RequireJS library with a new Javascript-heavy
    project I&#8217;m working on. This post considers an easy way in which to add
    a progress indicator to all require() &#8230; [&#8230;]<&#47;p>\n"
---
I've just started using the excellent [RequireJS](http://requirejs.org/) library with a new Javascript-heavy project I'm working on. This post considers an easy way in which to add a progress indicator to all `require()` calls such that the user is always aware of what's going on.

For anyone not familiar with RequireJS it makes it easy to structure your in-browser Javascript code into separate interdependent modules which can be loaded on the fly. The benefit of this is a cleaner codebase which can then be further minified and optimized (through the RequireJS build tool) for deployment (see [why RequireJS?](http://requirejs.org/docs/why.html)). When you make a `require` call RequireJS adds `script` tags to the document HEAD for every script/module you've requested and then waits until they're loaded before executing the callback function you've specified. This is great except when your internet connection suddenly slows down or whatnot (say, if you're on a mobile device) and your web app is now waiting for some scripts to get downloaded before it can continue.

What I wanted is for a progress indicator to automatically get shown when a `require` call is made and for it to automatically get hidden when the call completes and the requested scripts/modules have been loaded. A naive approach would be to create a proxy function for `require` which does the aforementioned tasks, as follows:

```js
// assume we're using jQuery
var progress = $("#progress");
function require_load(_list, _callback) {
  // show progress indicator
  progress.show();
  // make the call, overriding the callback
  require.call(null, _list, function(){
    // hide progress indicator
    progress.hide();
    // original callback
    _callback.call();
  });
}
```

From here on in we would call our custom `require_load` method rather than `require` itself. The problem is that the RequireJS build tool scans for calls to `require` in our code in order to order to work out which scripts to combine together as part of its optimization step. Our proxy method has now hidden this information from the build tool.

So we need to call our proxy function by the same name, i.e. `require`. But then, how can we refer to the original `require` function without causing recursion? The solution, as nicely explained in [a StackOverflow answer](http://stackoverflow.com/questions/296667/overriding-a-javascript-function-while-referencing-the-original), is to use an anonymous function as follows **(This implementation was found to be incorrect, please see further below)**:

```js
var progress = $("#progress");
// override require() in the window (i.e. global) namespace
window.require = (function(){
  // reference to the original require() function
  var orig_require = window.require;
  return function(_list, _callback) {
    // make the call after the progress indicator gets shown
    progress.show(0, function(){
      orig_require.call(null, _list, function(){
        // do the callback after the progress indicator gets hidden
        progress.hide(0, function(){
          _callback.call();
        });
      });
    });
  }
})();
```

As you can see we define an anonymous function which gets immediately executed and returns another function as its result. This result function now has a reference to the original `require` function in the `orig_require` variable. We can now use the `require` function as we normally do without having to worry about showing and hiding the progress indicator. Furthermore, the RequireJS optimizer will still be able to combine and optimize our scripts according to the `require` calls we make.

**Update on June 28**: I've realised that my above closure doesn't correctly pass through the module objects created in the `require` call back to the callback function. Below is a working implementation which fixes this issue:

```js
var progress = $("#progress");
window.require = (function(){
  var orig_require = window.require;
  return function(_list, _callback) {
    var callback_fn = function(_args){ _callback.apply(null, _args); }
    progress.show(0, function(){
      orig_require.call(null, _list, function(){
        progress.hide(0, callback_fn(arguments));
      });
    });
  };
})();
```
