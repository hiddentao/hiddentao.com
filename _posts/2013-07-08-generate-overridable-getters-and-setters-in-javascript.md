---
layout: post
published: true
title: Generate overridable getters and setters in Javascript
excerpt: 'Javascript has given you the ability to define _properties_ on objects for
  a while now, utilising [Object.defineProperty](https:&#47;&#47;developer.mozilla.org&#47;en-US&#47;docs&#47;Web&#47;JavaScript&#47;Reference&#47;Global_Objects&#47;Object&#47;defineProperty)
  to control how properties are read and written. In this post I will detail how to
  make getters and setters which can be overridden in subclasses. At the end I will
  provide a utility method you can add to your own code which makes it real easy to
  add overridable getters and setters to your classes. '
date: '2013-07-08 04:32:33 +0800'
categories:
- Uncategorized
tags:
- Javascript
- OOP
comments:
- id: 5005
  author: Doc Matthews
  author_email: matthewnolan415@gmail.com
  author_url: ''
  date: '2014-12-01 11:34:00 +0800'
  date_gmt: '2014-12-01 11:34:00 +0800'
  content: "<p>Great article !<&#47;p>\n"
- id: 5027
  author: S&Atilde;&shy;lvia Mur Blanch
  author_email: pchiwan@gmail.com
  author_url: ''
  date: '2015-02-25 11:43:00 +0800'
  date_gmt: '2015-02-25 11:43:00 +0800'
  content: "<p>Great article Ram, thanks a lot!<&#47;p>\n"
- id: 5058
  author: sohrab hejazi
  author_email: sohrab.hejazi@gmail.com
  author_url: ''
  date: '2015-06-12 18:33:00 +0800'
  date_gmt: '2015-06-12 17:33:00 +0800'
  content: |
    <p>Hi.  I'm going through a tutorial that I'm working on and am running an issue that I can't understand.  In your example about, in the getter and setters of the prototype, how come you used underscore in front of the variable names?<&#47;p>

    <p>The tutorial I'm working on is doing the same thing and whenI remove the underscore from the front of the variable, the code doesn't work anymore.<&#47;p>
- id: 5059
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2015-06-13 04:31:00 +0800'
  date_gmt: '2015-06-13 03:31:00 +0800'
  content: "<p>I use underscores to remind myself that it's private and internal and
    should not be directly accessed externally. I need to do this because JS does
    not have a built-in concept of private class members (like you do in Java, e.g.).<&#47;p>\n"
---
Javascript has given you the ability to define _properties_ on objects for a while now, utilising [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) to control how properties are read and written. In this post I will detail how to make getters and setters which can be overridden in subclasses. At the end I will provide a utility method you can add to your own code which makes it real easy to add overridable getters and setters to your classes.<a id="more"></a><a id="more-1589"></a>

## Object properties

First, let's take a quick look at how 'properties' work. Let's say we define a class as follows:

```js
var ClassA = function() {}
Object.defineProperty(ClassA.prototype, 'flag', {
    get: function() {
        return '['
        this._flag ']';
    },
    set: function(val) {
        this._flag = val;
    }
});
```

So we've defined a property `flag` in `ClassA`. Now if we do the following:

```js
var a = new ClassA();
a.flag = 'test';

console.log(a.flag); // [test]
console.log(a._flag); // test
```

Notice that when we call `a.flag` it executes the method assigned as the getter, which in turn returns the set value surrounded by square brackets. Whereas if we directly access `_flag` we get the original value we put in. Technically speaking, there's no restriction to what the getter and setter methods can do. We didn't have to name the internal member variable `_flag` - we could have named it anything. We could have modified an entirely different member variable during the setter. The point is that clients of the API only need to be told about `flag` whereas internally we are free to choose exactly where we store the data.

## Overriding property methods

Now let's say we wish to subclass our `ClassA` and override the getter for the property `flag`. How can we override the getter? Well, we have to rewrite `ClassA` slightly to make this possible:

```js
var ClassA = function() {}
Object.defineProperty(ClassA.prototype, 'flag', {
    get: function() {
        return this.__get_flag();
    },
    set: function(val) {
        this._flag = val;
    }
});

ClassA.prototype.__get_flag = function() {
    return '[' + this._flag + ']';
};
```

By writing the getter as just another method available on `ClassA.prototype` we make it overridable. Now we can write the subclass:

```js
var ClassB = function() {}
ClassB.prototype = Object.create(ClassA.prototype); // inheritance

ClassB.prototype.__get_flag = function() {
  return '(' + this._flag + ')';
};
```

Now let's test it and see if we get what we want:

```js
var a = new ClassA();
a.flag = 'test';

console.log(a.flag); // [test]

var b = new ClassB();
b.flag = 'test';

console.log(b.flag); // (test)
```

Note that by placing the setter method on the prototype we would be able to make that overridable too.

## Utility method to make this all easy

The following utility method makes the task of adding overridable getters and setters real easy:

```js
Function.prototype.generateProperty = function(name, options) {
    // internal member variable name
    var privateName = '__'
    name;

    options = options || {};
    options.get = ('undefined' === typeof options.get ? true : options.get);
    options.set = ('undefined' === typeof options.set ? true : options.set);

    // pre-initialise the internal variable?
    if (options.defaultValue) {
        this.prototype[privateName] = options.defaultValue;
    }

    var definePropOptions = {},
        getterName = '__get_' + name,
        setterName = '__set_' + name;

    // generate the getter
    if (true === options.get) {
        this.prototype[getterName] = function() {
            return this[privateName];
        };
    }
    // use custom getter
    else if (options.get) {
        this.prototype[getterName] = options.get;
    }
    // disable getter
    else {
        this.prototype[getterName] = function() {
            throw new Error('Cannot get: ' + name);
        }
    }

    definePropOptions.get = function() {
        return this[getterName].call(this);
    };

    // generate the setter
    if (true === options.set) {
        this.prototype[setterName] = function(val) {
            this[privateName] = val;
        };
    }
    // use custom setter
    else if (options.set) {
        this.prototype[setterName] = options.set;
    }
    // disable setter
    else {
        this.prototype[setterName] = function() {
            throw new Error('Cannot set: ' + name)
        };
    }

    definePropOptions.set = function(val) {
        this[setterName].call(this, val);
    };

    // do it!
    Object.defineProperty(this.prototype, name, definePropOptions);
};
```

It gives you a large amount of flexibility:

1\. You can choose to generate both a getter and a setter, just a getter on its own, just a setter on its own, or even neither (that would be a strange choice though!).
2\. You can supply a custom getter and setter or have it generate default ones for you.
3\. It sets the internal member variable (which backs the property) to also be on the `prototype`, making it easy to override its value in subclasses. It can even initialise it to a default value if you provide one.
3\. The method itself is attached to the `Function` object, making for ease of use and readable code.

Here is an example of its use:

```js
var ClassA = function() {}

ClassA.generateProperty('name', {
  defaultValue: 'john',
  get: function() {
    return this.__name + ' smith';
  },
  set: false
});

var a = new ClassA();

console.log(a.name); // john smith

a.name = 'terry'; // Error: cannot set: name
console.log(a.name); // john smith

a.__name = 'mark';
console.log(a.name); // mark smith
```

Now we can override the getter in a subclass:

```js
var ClassB = function() {}
ClassB.prototype = Object.create(ClassA.prototype);

ClassB.prototype.__get_name = function() {
  return this.__name + ' oliver';
}

ClassB.prototype.__set_name = function(val) {
  this.__name = val;
}

var b = new ClassB();

console.log(b.name); // john oliver

b.name = 'terry';
console.log(b.name); // terry oliver

b.__name = 'mark';
console.log(b.name); // mark oliver
```

## Final thoughts

It seems a bit inelegant to have to know the method name of the getter and/or setter in order to override it. We could add more utility methods - e.g. `overrideGetter` and `overrideSetter` - to take care of the gory details if we wanted to.

Meanwhile you can also see the above utility method as a Gist: [https://gist.github.com/hiddentao/5946053](https://gist.github.com/hiddentao/5946053).