---
title: Mocking calls to a class constructor in Javascript
date: '2013-06-10'
summary: "The other day, whilst writing tests with [SinonJS](http:&#47;&#47;sinonjs.org&#47;) I realised that there was no obvious way of mocking calls to class constructors in Javascript. A quick search for _\"mocking Javascript class constructor\"_ [did](http:&#47;&#47;stackoverflow.com&#47;questions&#47;7548974&#47;mock-stub-constructor) [lead](http:&#47;&#47;stackoverflow.com&#47;questions&#47;9347631&#47;spying-on-a-constructor-using-jasmine) [me](http:&#47;&#47;stackoverflow.com&#47;questions&#47;14569499&#47;javascript-mocking-constructor-using-sinon) to some helpful answers. \r\n"
tags:
  - Javascript
  - node.js
  - Mocking
---
The other day, whilst writing tests with [SinonJS](http://sinonjs.org/) I realised that there was no obvious way of mocking calls to class constructors in Javascript. A quick search for _"mocking Javascript class constructor"_ [did](http://stackoverflow.com/questions/7548974/mock-stub-constructor) [lead](http://stackoverflow.com/questions/9347631/spying-on-a-constructor-using-jasmine) [me](http://stackoverflow.com/questions/14569499/javascript-mocking-constructor-using-sinon) to some helpful answers.
<a id="more"></a><a id="more-1551"></a>

Generally speaking, you can only mock a method which exists against an object. So in order to mock the `MyClass` constructor you have to mock the `MyClass` method on its container object:

```js
var sinon = require('sinon');

exports.MyClass = function() {
  this.a = 1;
};

var spy = sinon.spy(exports, 'MyClass');

var inst = new exports.MyClass();

console.log(spy.calledOnce); // true
```

The above example is for Node. In the browser the global object to which top-level functions automatically belong is `window`. Note though what happens if you add a local variable reference into the mix:

```js
var sinon = require('sinon');

var MyClass = exports.MyClass = function() {
  this.a = 1;
};

var spy = sinon.spy(exports, 'MyClass');

var inst = new MyClass();

console.log(spy.calledOnce); // false
```

This discrepancy occurs because Sinon wraps `exports.MyClass` with its own mechanism, which means that the `MyClass` local variable which points directly to the constructor remains unaffected. To prove the point:

```js
var sinon = require('sinon');

exports.MyClass = function() {
  this.a = 1;
};

var spy = sinon.spy(exports, 'MyClass');

var MyClass = exports.MyClass;

var inst = new MyClass();

console.log(spy.calledOnce); // true
```

### Calling from a sub-class

If you are calling a base class constructor from within a subclass you will generally be writing something like this:

```js
var util = require('util'); // core node.js module

var Controller = function() {};

var DefaultController = function() {
  Controller.apply(this, Array.prototype.slice.call(arguments, 0));
};
util.inherits(DefaultController, Controller);
```

In such instances you can mock as previously noted. Alternatively you can mock the call to `apply()`:

```js
var sinon = require('sinon');

var util = require('util'); // core node.js module

var Controller = function() {};

var DefaultController = function() {
  Controller.apply(this, Array.prototype.slice.call(arguments, 0));
};
util.inherits(DefaultController, Controller);

var spy = sinon.spy(Controller, 'apply');

var inst = new DefaultController();

console.log(spy.calledOnce); // true
```
