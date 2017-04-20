---
layout: post
published: true
title: Mocking jQuery methods such as fadeIn
excerpt: "In writing UI tests for my new web app I hit a snag today. I have a notification
  system which uses jQuery's [fadeIn()](http:&#47;&#47;docs.jquery.com&#47;Effects&#47;fadeIn)
  and [fadeOut()](http:&#47;&#47;docs.jquery.com&#47;Effects&#47;fadeOut) methods
  to control how notification messages get displayed to the user. And I want to test
  that these methods are being called with right parameters and in the right order.
  So I should just be able to [sinon.spy()](http:&#47;&#47;sinonjs.org&#47;docs&#47;#sinonspy)
  them, right? Not quite.\r\n"
date: '2013-01-29 12:03:09 +0800'
categories:
- Uncategorized
tags:
- jQuery
- Sinon
- Mocking
comments: []
---
In writing UI tests for my new web app I hit a snag today. I have a notification system which uses jQuery's [fadeIn()](http://docs.jquery.com/Effects/fadeIn) and [fadeOut()](http://docs.jquery.com/Effects/fadeOut) methods to control how notification messages get displayed to the user. And I want to test that these methods are being called with right parameters and in the right order. So I should just be able to [sinon.spy()](http://sinonjs.org/docs/#sinonspy) them, right? Not quite.

As detailed in this StackOverflow post, when you use `$()` you create a new instance of the jQuery object. Plus the effect methods noted above aren't accessible as part of a static API exposed by jQuery. So the only way to mock them would be to either:

* Write a proxy method which calls the required method and then mock this proxy, OR
* Override the jQuery method such that calls to it get recorded

I opted for the second approach as it seemed more elegant - being able to use the jQuery methods directly whilst transparently recording the method call history. Here is the code to do this for the `fadeIn()` method:

```js
(function($) {
  var self = this;
  // the array where method call history is stored
  self.jQueryMethodHistory = [];
  // helper method used to insert new data into the history array
  var process = function(methodName, arguments) {
    self.jQueryMethodHistory.push({
      name: methodName,
      args: Array.prototype.slice.call(arguments, 0)  // convert arguments into a real array
    })
  };
  // list of methods we want to track
  var methodsToTrack = [
      'fadeIn'
  ];
  for (var i=0; i<methodsToTrack.length; ++i) {
    (function(methodName) {
      // we override the method
      $.fn[methodName] = (function() {
        var orig = $.fn[methodName];
        return function() {
          // track the call
          process(this, methodName, arguments);
          // transparently send the call through to the original method
          orig.apply(this, arguments);
        }
      }());
    })(methodsToTrack[i]);
  }
})(jQuery);
```

As you can see it's quite simple. We store all method calls into a global array - `jQueryMethodHistory` - which we can clear and manipulate at any time. All calls to `fadeIn()` get sent to the actual method but whilst also being recorded (with method arguments) into the history array. And if we wanted to we could pass in the list of methods to be tracked in this way at runtime - the use of the `methodsToTrack` array hints at this.

*NOTE: fadeIn() internally calls show() once it's done. Likewise, fadeOut() internally calls hide() once done.*