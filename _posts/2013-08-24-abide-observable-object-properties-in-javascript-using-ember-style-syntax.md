---
layout: post
published: true
title: Abide - observable object properties in Javascript using Ember-style syntax
excerpt: "I have just released [abide](https:&#47;&#47;github.com&#47;hiddentao&#47;abide)
  - a small library I've been working on for the last few days. Inspired by [Ember.JS
  observables](http:&#47;&#47;emberjs.com&#47;api&#47;classes&#47;Ember.Observable.html),
  it provides a mechanism for auto-updating object properties and auto-triggering
  object methods based on updates made to other properties within the object. The
  example in the docs illustrates this well:\r\n"
date: '2013-08-24 07:59:47 +0800'
categories:
- Uncategorized
tags:
- Javascript
- Ember
- ECMA5
- Prototype
comments: []
---
I have just released [abide](https://github.com/hiddentao/abide) - a small library I've been working on for the last few days. Inspired by [Ember.JS observables](http://emberjs.com/api/classes/Ember.Observable.html), it provides a mechanism for auto-updating object properties and auto-triggering object methods based on updates made to other properties within the object. The example in the docs illustrates this well:

```js
var Parent = Abide.extend({
    firstName: 'John',
    lastName: 'Smith',

    fullName: (function() {
        return this.firstName + ' ' + this.lastName;
    }).computed('firstName', 'lastName'),

    showWelcomeMessage: (function() {
        console.log('Welcome ' + this.fullName);
    }).observes('fullName')
});

var m = new Parent();

m.showWelcomeMessage();
// console.log 'John Smith'

m.firstName = 'Mark';
// showWelcomeMessage() automatically gets triggered
// console.log 'Mark Smith'
```

Internally, [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) is used to define getters and setters for all specified properties. The setters internally contain logic for notifying dependent properties if the value has changed.

Furthermore, subclasses can be created, and mixins can also be used:

```js
var EventEmitter = {
    event: null
};

// Parent is defined in our earlier example using Abide.extend(...)
var Child = Parent.extend(EventEmitter, {
    firstName: 'Bob',

    showWelcomeMessage: (function() {
        Parent.prototype.showWelcomeMessage.call(this);
    }).observes('event')
});

var m = new Child();

m.showWelcomeMessage();
// console.log 'Bob Smith'

m.firstName = 'Mark';
// showWelcomeMessage() does not automatically get triggered

m.event = 'test';
// showWelcomeMessage() does get automatically triggered
// console.log 'Mark Smith'
```

It doesn't currently support as wide a feature-set as Ember's observables, e.g. you cannot observe properties within properties or global properties. This was a deliberate decision, in order to make it more lightweight.

More source, tests and API docs available on Github : [https://github.com/hiddentao/abide](https://github.com/hiddentao/abide)
