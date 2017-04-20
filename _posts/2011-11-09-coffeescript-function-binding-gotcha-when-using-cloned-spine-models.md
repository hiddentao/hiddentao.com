---
layout: post
published: true
title: CoffeeScript function binding gotcha when using cloned Spine models
excerpt: "I've come across a CoffeeScript \"gotcha\" whilst cloning [Spine models](http:&#47;&#47;spinejs.com&#47;docs&#47;models).
  Let's say we have model as such:\r\n\r\n[code lang=\"js\"]\r\nSpine = require(\"spine\")\r\nclass
  MyModel extends Spine.Model\r\n    id : 1\r\n    output: () =>\r\n        console.log
  @id\r\n[&#47;code]\r\n"
date: '2011-11-09 11:55:47 +0800'
categories:
- Uncategorized
tags:
- Javascript
- Spine
- CoffeeScript
comments:
- id: 4787
  author: Richard Flosi
  author_email: richard.flosi@gmail.com
  author_url: ''
  date: '2012-10-18 17:00:00 +0800'
  date_gmt: '2012-10-18 16:00:00 +0800'
  content: |
    <p>This is actually a documented feature of spine. See the "Dynamic records" section here: http:&#47;&#47;spinejs.com&#47;docs&#47;models<&#47;p>

    <p>I think what you are trying to do is create a new instance of the model.<&#47;p>

    <p>Given you have a Spine Model called MyModel, in CoffeeScript you can do:
        MyModelInstance = MyModel.configure()<&#47;p>

    <p><pre><code>MyModelInstance2 = MyModel.configure()
    <&#47;code><&#47;pre><&#47;p>

    <p>And in Javascript just use setup():
        MyModelInstance = MyModel.setup()
        MyModelInstance2 = MyModel.setup()<&#47;p>
- id: 4788
  author: Ram
  author_email: ram@hiddentao.com
  author_url: ''
  date: '2012-10-19 14:02:00 +0800'
  date_gmt: '2012-10-19 13:02:00 +0800'
  content: "<p>No, I'm specifically trying to clone (i.e. create a memory copy) an
    existing instance of MyModel so that the new instance has the same member data
    as the original instance.<&#47;p>\n"
---
I've come across a CoffeeScript "gotcha" whilst cloning [Spine models](http://spinejs.com/docs/models). Let's say we have model as such:

```coffee
Spine = require("spine")

class MyModel extends Spine.Model
  id : 1
  output: () =>
    console.log @id
```

The `output()` method is always executed within the context of the instance of `MyModel` on which it gets called. Now let's see what happens when we clone it:

```coffee
foo = new MyModel()
foo.id = 2
foo.output() # outputs: 2

bar = m.clone()
bar.id = 3
bar.output() # outputs: 2
```

We expect `bar.output()` to return 3 yet it returns 2\. Why is this? It's because the `output()` method is bound to the instance (`this`) within `MyModel`'s constructor, as can be seen from the generated Javascript:

```js
(function() {
    var MyModel, Spine, cp, m;
    var __bind = function(fn, me) {
            return function() {
                return fn.apply(me, arguments);
            };
        },
        __hasProp = Object.prototype.hasOwnProperty,
        __extends = function(child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key)) child[key] = parent[key];
            }

            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor;
            child.__super__ = parent.prototype;
            return child;
        };
    Spine = require("spine");
    MyModel = (function() {
        __extends(MyModel, Spine.Model);

        function MyModel() {
            this.output = __bind(this.output, this);
            MyModel.__super__.constructor.apply(this, arguments);
        }
        MyModel.prototype.id = 1;
        MyModel.prototype.output = function() {
            return console.log(this.id);
        };
        return MyModel;
    })();
}).call(this);
```

Thus, even when calling `output()` on a cloned object its function context will still point to the original instance it was cloned from. The solution - if you're going to need to clone your model instance - is to not use CoffeeScript's function binding. Using the non-binding syntax we get the results we want:

```coffee
Spine = require("spine")

class MyModel extends Spine.Model
  id : 1
  output: () ->
    console.log @id

foo = new MyModel()
foo.id = 2
foo.output() # outputs: 2

bar = m.clone()
bar.id = 3
bar.output() # outputs: 3
```