---
title: RequireJS with progress indicator
date: '2011-06-23'
summary: >-
  I've just started using the excellent [RequireJS](http://requirejs.org/)
  library with a new Javascript-heavy project I'm working on. This post
  considers an easy way in which to add a progress indicator to all `require()`
  calls such that the user is always aware of what's going on.
tags:
  - Javascript
  - RequireJS
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
