---
layout: post
published: true
title: Ember.JS is stupidly easy, and stupidly difficult
excerpt: "*NOTE: This post is a rant*\r\n\r\nI've recently begun working on an [Ember.JS](http:&#47;&#47;emberjs.com&#47;)
  project for a client. A quick look at the homepage and the associated guides makes
  it sound really good. Computed and observable properties - if I change one property
  everything (upto and including UI elements) will automatically be updated. Cool.
  A view hierarchy that manages itself, including giving me the ability to target
  URLs to sub-views. Yes, yes, this sounds really good. Until you start coding.\r\n"
date: '2013-08-27 01:37:46 +0800'
categories:
- Uncategorized
tags:
- Javascript
- Ember
- Rant
comments:
- id: 4873
  author: Hassan Khan
  author_email: me@hassankhan.me
  author_url: http://hassankhan.me/
  date: '2013-09-11 14:20:00 +0800'
  date_gmt: '2013-09-11 13:20:00 +0800'
  content: |
    <p>Erm straight off, I'd like to say you should re-read the Ember guides. The code you're trying to use from the view should be done in the controller.<&#47;p>

    <p>Functional examples will help you infinitely more than documentation, check out the TodoMVC app, Balanced Dashboard and Discourse.<&#47;p>
- id: 4874
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2013-09-11 16:02:00 +0800'
  date_gmt: '2013-09-11 15:02:00 +0800'
  content: '<p>Thanks, I think I learnt some bad practices due to the app I''m working
    on having been coded by somebody new to Ember. However I do still think that due
    to the complexity and convention-over-configuration "magic" contained within Ember
    it''s imperative that documentation (the first port of call for anyone looking
    to learn it) be as thorough as possible.<&#47;p>

'
- id: 4875
  author: zephyrpellerin
  author_email: zephyr.pellerin@gmail.com
  author_url: ''
  date: '2013-09-24 18:09:00 +0800'
  date_gmt: '2013-09-24 17:09:00 +0800'
  content: "<p>The documentation for Ember has advanced considerably since it's inception.
    Many things have changed considerably since a lot of people began working on Ember
    as a serious endeavor circa RC3. Now debugging mechianisms, a closer view into
    the object model (as well as views themselves!) and other such niceties exist
    that have been historically documented by others. It is indeed surprising that
    EvilTrout seems to be the unofficial source of real Ember documentation in light
    of the historically confusing documentation -- as you said, the source is quite
    accessible however and that (given enough time) allows for a more complete understanding
    of the strange decisions made to accommodate routes, etc.<&#47;p>\n"
- id: 4876
  author: Floby
  author_email: florent.jaby@gmail.com
  author_url: ''
  date: '2013-10-18 14:00:00 +0800'
  date_gmt: '2013-10-18 13:00:00 +0800'
  content: |
    <p>If anything, as of today, only error messages need to be more explicit. Documentation's fine by me. It does not however document the MVC pattern which incomprehension thereof is in fact the problem at hand here.
    Many resources exist on the web about the MVC pattern and its goals.<&#47;p>
---
*NOTE: This post is a rant*

I've recently begun working on an [Ember.JS](http://emberjs.com/) project for a client. A quick look at the homepage and the associated guides makes it sound really good. Computed and observable properties - if I change one property everything (upto and including UI elements) will automatically be updated. Cool. A view hierarchy that manages itself, including giving me the ability to target URLs to sub-views. Yes, yes, this sounds really good. Until you start coding.

Let's start with something simple. I want to programmatically trigger one of my routes when someone clicks this button. Ok, I'll just tell my controller to send the user to the route. But wait, how do I get a reference to it? Oh, I have to use:

```js
// within my view code
this.get('controller').send(my_route);
```

Nope. Doesn't work. I get some error stating that the `target` property on the controller isn't set. What does that have to do with me wanting to load a URL? nothing. What does the [Ember guide](http://emberjs.com/guides/) say about this? nothing. Ok, I know, I'll look through their source code (because as well know, a well-designed API requires you to look through the source code to figure things out) and figure out this hack:

```js
// within my view code
App.__container__.lookup('router:main').send(my_route);
```

Ok, now it's giving me an uncaught error: `Uncaught Error: Nothing handled the event 'my route name'`. Hmm, the route is definitely configured to a controller. And by the way, the Ember guys don't really want you to be using `__container__` directly like that. No, supposedly there's some other magic way that they've decided you're meant to do this in their poorly documented, every-changing framework.

Ok, perhaps it's to do with [managing controller dependencies](http://emberjs.com/guides/controllers/dependencies-between-controllers/). I say perhaps because I really don't know how I'm supposed to hook up the router in to my view class. I'm guessing that the root application controller has a reference to the router and that somehow if I can access the route application controller in my sub-controllers I'll be able to do what I want. So let's try out using the `needs` parameter to tell Ember to enable me to access my parent controller from the child. Oh but now I'm getting a cryptic JS error in the console:

```js
Uncaught TypeError: Cannot call method 'has' of null ember.js?body=1:29206
```

The offending lines in ember.js:

```js
if (!container.has(dependency)) {
  satisfied = false;
  Ember.assert(controller + " needs " + dependency + " but it does not exist", false);
}
```

It seems I also have to set a `container` attribute on the controller. But wait, is this something that Ember will set for me automatically or something I have to set manually? if manually then why isn't it mentioned in the docs? can someone please tell me what the relationship between the `container` and `controller` is? This is the sort of frustration I have with Ember whenever I need to do something that deviates ever so slightly from the norm.

And when I say 'poorly documented' I don't meant that there isn't documentation around the web on how you're supposed to use Ember. There is, but not really from the guys who actually make Ember. They're too hotshot to bother with that so we have [StackOverflow](http://stackoverflow.com/questions/14204674/how-to-architect-an-ember-js-application) and [Evil Trout](http://eviltrout.com/2013/02/10/why-discourse-uses-emberjs.html) and others filling the gap. Seriously, for a framework that does tonnes of heavy-lifting and is strict about how things ought to be done, surely having more thorough documentation with edge cases covered is a must? Yes, I'm aware that their [blog](http://emberjs.com/blog) keeps us up-to-date on what's changing. Here's the thing. If you've been using Ember for over a year or so then you're able to read the blog and instantly know where things are currently at. But if you're knew to Ember, well then screw you.

They do have some tests though. Sounds good until you go through the source code and see lines like:

```js
/**
This class is used internally by Ember and Ember Data.
Please do not use it at this time. We plan to clean it up
and add many tests soon.

@class OrderedSet
@namespace Ember
@constructor
@private
*/
```

At least the source code is well documented. They had the good sense to do that.

Between reading the source, googling, and debug logging I'm figuring out how things hook up. But I'm sure I (and many others) have wasted countless hours figuring things out with Ember - hours which could have been saved by having better and more thorough documentation.
