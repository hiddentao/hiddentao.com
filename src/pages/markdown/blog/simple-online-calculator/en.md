---
title: Simple online calculator using HTML and Javascript
date: '2010-11-25'
summary: "Last Friday I was looking for a simple online calculator which I could use via a web browser and which was mobile friendly. The best ones I could find were all done in [Flash](http:&#47;&#47;www.adobe.com&#47;products&#47;flashplayer&#47;) which I though kinda sucked since it was perfectly possible to build one using HTML and Javascript. Not to mention that Flash doesn't work on iPhones&#47;iPads. As I was feeling a little creative I decided to build one myself, which you can now see at [calc8.com](http:&#47;&#47;calc8.com&#47;).\r\n"
tags:
  - Mobile
  - Javascript
  - Calculator
  - HTML5
---
Last Friday I was looking for a simple online calculator which I could use via a web browser and which was mobile friendly. The best ones I could find were all done in [Flash](http://www.adobe.com/products/flashplayer/) which I though kinda sucked since it was perfectly possible to build one using HTML and Javascript. Not to mention that Flash doesn't work on iPhones/iPads. As I was feeling a little creative I decided to build one myself, which you can now see at [calc8.com](http://calc8.com/).

These were my requirements:

1. It must be built using open web standards, ideally HTML 5, CSS 2/3 and Javascript.
2. It should be usable from any modern mobile web browser which supported Javascript.
3. It must be quick to load.

## Evaluating arithmetic expresssions ##

I decided to model the functioning of my calculator on the stock one which came with my HTC Hero Android phone. Unlike most ordinary calculators this handily displays the full set of operations that you've punched in:

[![htc_hero_21_calculator](http://farm5.static.flickr.com/4145/5205983509_07c51b87b0.jpg)](http://www.flickr.com/photos/91055277@N00/5205983509/ "htc_hero_21_calculator by little_ram, on Flickr")

What this meant was my calculator had to be able to parse such an input string (which is using *Infix* notation in mathematical terms), convert it to *Postfix* (also known as [Reverse Polish](http://en.wikipedia.org/wiki/Reverse_Polish_notation)) notation - a format which makes it easier to evaluate algorithmically, notifying the user if there were any errors in the input. So for example, the following input expression in *Infix* notation:

`1-2÷2x6`

would look as follows in *Postfix* notation:

`122÷6x-`

The difference between the two notations is simple. In *Infix* the operator (e.g. ) is written between its two operands. In *Postfix* the operator is written after its two operands. The benefit of *Postfix* is that the operators are in order of precedence according to [BODMAS](http://en.wikipedia.org/wiki/BODMAS) rules and a simple [Stack](http://en.wikipedia.org/wiki/Stack_(data_structure))-based algorithm can be used to evaluate the final answer.

Luckily, converting from *Infix* to *Postfix* is a [solved problem](http://scriptasylum.com/tutorials/infix_postfix/algorithms/infix-postfix/index.htm) utilising the [Shunting Yard Algorithm](http://en.wikipedia.org/wiki/Shunting-yard_algorithm).

## Making the most of the browser window ##

Once I had the arithmetic evaluation working I decided to tackle the layout of the calculator number pad. I wanted the calculator buttons to appear more square than rectangular even if the web page was in widescreen rather than portrait mode. After some playing around with CSS I eventually settled on a Javascript solution which detects when the browser window size gets changed and then redraws the calculator accordingly.

I admit that this isn't as nice as doing it all in CSS, as it's slightly slower than letting the browser do all this work. I'm still investigating a better way of doing this, ~~especially since the calculator buttons currently overflow to the right in Mobile Safari - sorry, iPhone and iPod Touch users (if you have any suggestions as to why this happens please let me know!)~~ **Update: now looks ok on iOS devices running 4.2.**

When you turn the phone into landscape mode there is currently space on either side of the calculator button pad. In future I plan to add other buttons here (e.g. the ones you usually get with scientific calculators) so that you can easily switch between simple and 'advanced' mode by turning your phone.

## Other considerations ##

I went with HTML 5 for the DOCtype. In order to minimize the loading times all the CSS and Javascript is contained within the single HTML file. I've not used any third-party Javascript libraries and have instead stuck to the built-in DOM APIs. The standard jQuery library (at ~26 KB) would have been too heavy for my needs. A quick web search revealed [Unverse](http://unverse.net/Unverse-javascript-library), a ~5 KB library which gives you most of the basics including Lightbox-style pop-ups. If I do add a Javascript library at some point it will most likely be this one.

The full source code is available in the single HTML file on the site and it's licensed under GPL 3\. And apologies for the uninspiring domain name!

## Known issues ##

~~The calculator width issue on iPhones and iPod Touches mentioned above.~~ **Update: Seems to be ok now in iOS 4.2.**

It works fine in the Android 2.1 browser though it's a bit slow. Actually I see this on iPhones too. When I press a calculator button there is a slight delay before the display gets updated. Initially this was because I was using `eval` along with an abstracted button click handling system - turns out `eval` is a bad idea with slow Javascript engines. But even after changing this the button response still isn't snappy enough. I'm not sure whether this is just due to slower Javascript processing than desktops. I've yet to try this on Froyo which has a faster Javascript engine. **Update: I had a look at how Google do click handling and they seem to handle the click on the mousedown event. Copying this idea I was able to reduce the click handling delay though it's still a little slow on Froyo.**.

Another issue I've noticed on Android is that you can't press the buttons in rapid succession because the [browser assumes you're trying to zoom in](http://code.google.com/p/android/issues/detail?id=4113). I'm already using [`meta` tags](https://developer.mozilla.org/en/Mobile/Viewport_meta_tag) to markup the the page as mobile-friendly but it would be nice be able to disable the zoom-in mechanism on mobile browsers.

Enjoy :)

[calc8.com](http://calc8.com/)
