---
title: jQuery AJAX progress indicator plugin
date: '2011-07-02'
summary: "Some of my latest projects rely heavily on [jQuery's AJAX method](http:&#47;&#47;api.jquery.com&#47;jQuery.ajax&#47;) to perform AJAX requests against the server-side code. I wanted my projects to be mobile-friendly and this meant that I had to take into account intermittent drops in the internet connection as well as temporary slow downs in speed when making my AJAX calls. I decided to display a \"loading\" progress indicator to the user for every critical AJAX request which I needed to make so that in case there was a delay in receiving a response from the server at least the user would know what was going on (you can see this concept in action on [WuPlay](http:&#47;&#47;wuplay.com&#47;)).\r\n"
tags:
  - AJAX
  - jQuery
  - Javascript
---
Some of my latest projects rely heavily on [jQuery's AJAX method](http://api.jquery.com/jQuery.ajax/) to perform AJAX requests against the server-side code. I wanted my projects to be mobile-friendly and this meant that I had to take into account intermittent drops in the internet connection as well as temporary slow downs in speed when making my AJAX calls. I decided to display a "loading" progress indicator to the user for every critical AJAX request which I needed to make so that in case there was a delay in receiving a response from the server at least the user would know what was going on (you can see this concept in action on [WuPlay](http://wuplay.com/)).

I decided to write a jQuery plugin which extends the `$.ajax` with two additional parameters:

* **progress_indicator**
  * Either a jQuery object, function callback or a HTML string specifying the progress indicator. If not specified then no progress indicator will be shown.
* **progress_indicator_delay**
  * No. of milliseconds to wait from when the AJAX request has been sent before displaying the progress indicator. Default is 1000, i.e. 1 second.

The progress indicator can be one of the three types:

* jQuery object:
  * `show()` will be called on it when the request is in progress and hide() will be called on it once the request completes.
* Callback function:
  * it will be invoked with its argument as false (boolean) when the request is in progress and it will then be invoked with true (boolean) when the request has completed.
* HTML string:
  * it will be added to the body within a DIV when the request is in progress. The DIV will then be removed once the request has completed. The DIV has the 'ajax_progress_indicator' class set on it so you can style it as you wish using CSS.

The plugin is available for download at [http://plugins.jquery.com/project/ajaxprogress](http://plugins.jquery.com/project/ajaxprogress).
