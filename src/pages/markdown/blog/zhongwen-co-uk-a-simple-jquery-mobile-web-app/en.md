---
title: Zhongwen.co.uk - a simple jQuery Mobile web app
date: '2012-03-14'
summary: "I started attending Mandarin language classes recently at the [Meridian Chinese School](http:&#47;&#47;www.meridiandao.co.uk&#47;) in London. Studying involves a 2 hour lesson once a week and a few hours spent at home revising what I've learnt. And one of the best ways to study is to practise writing the characters (fun too!) and translating sentences. So I decided to build a web app which would allow me to practise whilst on the go. My aim was to enable character recognition using HTML 5 canvas and get it working on mobiles.\r\n"
tags:
  - Mobile
  - jQuery
  - CoffeeScript
  - Mandarin
  - OCR
---
I started attending Mandarin language classes recently at the [Meridian Chinese School](http://www.meridiandao.co.uk/) in London. Studying involves a 2 hour lesson once a week and a few hours spent at home revising what I've learnt. And one of the best ways to study is to practise writing the characters (fun too!) and translating sentences. So I decided to build a web app which would allow me to practise whilst on the go. My aim was to enable character recognition using HTML 5 canvas and get it working on mobiles.

**You can see the result at: [zhongwen.co.uk](http://zhongwen.co.uk).** The source is code on [github](http://github.com/hiddentao/zhongwen). It's built using [Spine](http://github.com/hiddentao/spine), [jQuery Mobile](http://jquerymobile.com/), [Coffeescript](http://coffeescript.org) and [Weber](http://github.com/hiddentao/weber).

Here are some notes on the technical aspects:

## Stroke input recognition

For the character recognition I was able to find an existing Javascript demo of [stroke input](http://www.lab4games.net/zz85/blog/2010/02/17/js-中文笔画输入法-javascript-chinese-stroke-input/). I grabbed this code, cleaned it up and optimized and got it working in a canvas on my mobile, only to find that the character recognition algorithm was particularly weak. It calculates the angle and length of every stroke you make in proportion to the overall character size and then matches this information to a database of character strokes. The problem is that if there is even a slight different in stroke order the matching will fail to find the right character. It uses the [Shortstraw](http://www.lab4games.net/zz85/blog/2010/01/21/geeknotes-shortstrawjs-fast-and-simple-corner-detection/) algorithm for finding corners - this algorithm doesn't tend to do too well for curved lines.

After much testing I decided to disable canvas stroke input for now and instead provide Pinyin input as well as the ability to input characters directly (in case you have a Chinese keyboard input method available for your device, which I do :).

*Note: Thinking about the stroke input recognition, a smarter algorithm would compare the changes in angle and length between consecutive strokes rather than the individual stroke measurements themselves. A harder problem is solving for stroke mismatches. If the user inputs a curved line which gets interpreted as a straight line and yet the actual dictionary character stroke sees it as two closely connected straight lines, how do yo match them up in a consistently, repeatable manner? I might get around to these problems later on. For now you can see the code I've got by looking at the **canvas_stroke_input** branch in the Git repository.*

## Data strings

For now I've hard-coded a whole bunch of sentences and their English translations in the [`data` module](https://github.com/hiddentao/zhongwen/blob/master/js/data.coffee), categorizing them by study unit. In future it would be good to implement true sentence builders, i.e. algorithms which pick a subject, object, action, etc. and construct an appropriate sentence. Such randomization will be a better test for the user.

## The dictionary module

A core part of the system is the [`dict` module](https://github.com/hiddentao/zhongwen/blob/master/js/dict.coffee). This contains a list of characters along with their matching pinyin representations (one character may have multiple pinyin representations) and also contains methods for looking up character by pinyin.

There is also a `Sentence` object. This takes as input a string of characters and then allows you to see whether they match another string of characters to. The matching algorithm is careful enough to avoid punctuation marks (because different users may input them differently) and also returns a list of mismatched characters. To understandl exactly how it works you can look at the [nodeunit test](https://github.com/hiddentao/zhongwen/blob/master/test/dict.coffee) for this module.

## Contributions

I'll happily accept any contributions to making this site better, and in particular any help on the stroke input recognition system. Please feel free to fork the [github repo](https://github.com/hiddentao/zhongwen).
