---
layout: post
published: true
title: How to write a custom widget for jQuery Mobile
excerpt: "I needed to write a custom widget for the [jQuery Mobile](http:&#47;&#47;jquerymobile.com&#47;)
  library but couldn't find any step-by-step documentation on how to do it in the
  official docs. A search on Google didn't result in any better luck. In the end it
  turned out to be quite easy to do - I was able to figure it out by looking at the
  source code of jQuery Mobile and that of the excellent [DateBox](http:&#47;&#47;dev.jtsage.com&#47;jQM-DateBox&#47;)
  plugin. In this post I outline the essentials to adding your own custom widget to
  jQuery Mobile.\r\n"
date: '2011-11-07 10:28:06 +0800'
categories:
- Uncategorized
tags:
- Mobile
- jQuery
- Javascript
comments:
- id: 4747
  author: Carlos Olivera
  author_email: ''
  author_url: http://twitter.com/carlos_olivera
  date: '2011-11-09 12:08:00 +0800'
  date_gmt: '2011-11-09 12:08:00 +0800'
  content: |
    <p>Hi, thanks for sharing.<&#47;p>

    <p>I am JQM developer too.<&#47;p>

    <p>This post help me to create my first custom widget!
    https:&#47;&#47;github.com&#47;carlos-olivera&#47;Gauge-jQuery-Mobile<&#47;p>
- id: 4748
  author: Anthony Gill
  author_email: anthonygill08@gmail.com
  author_url: ''
  date: '2011-11-17 23:58:00 +0800'
  date_gmt: '2011-11-17 23:58:00 +0800'
  content: "<p>Fantastic write-up! &nbsp;I've been trying to do this for days now
    with no luck using JQuery and trigger('create'). &nbsp;You rock sir!<&#47;p>\n"
- id: 4775
  author: The Making of a jQuery Mobile Widget &#8211; the &#8220;Tab Bar&#8221; |
    Codiqa
  author_email: ''
  author_url: http://blog.codiqa.com/2012/06/the-making-of-a-jquery-mobile-widget-the-tab-bar/
  date: '2012-06-18 22:05:12 +0800'
  date_gmt: '2012-06-18 22:05:12 +0800'
  content: "<p>[...] Mobile widgets, and I highly suggest reading it. I always forget
    how to use the Widget Factory, and this short blog post&Acirc;&nbsp;about creating
    jQuery Mobile widgets helped get me back on [...]<&#47;p>\n"
- id: 4836
  author: AndyW
  author_email: awysocki@absoftware.com
  author_url: ''
  date: '2013-06-14 01:40:00 +0800'
  date_gmt: '2013-06-14 00:40:00 +0800'
  content: "<p>2 years old and still the best doc out here on the web that clearly
    explains how to build a widget.  THANK YOU, THANK YOU, THANK YOU (can you tell
    I'm on my roof top)<&#47;p>\n"
- id: 4837
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2013-06-14 04:15:00 +0800'
  date_gmt: '2013-06-14 03:15:00 +0800'
  content: "<p>You're welcome :)<&#47;p>\n"
---
I needed to write a custom widget for the [jQuery Mobile](http://jquerymobile.com/) library but couldn't find any step-by-step documentation on how to do it in the official docs. A search on Google didn't result in any better luck. In the end it turned out to be quite easy to do - I was able to figure it out by looking at the source code of jQuery Mobile and that of the excellent [DateBox](http://dev.jtsage.com/jQM-DateBox/) plugin. In this post I outline the essentials to adding your own custom widget to jQuery Mobile.

Ideally place all your widget code into its own file. Here is the basic code structure:

```js
(function($) {
    $.widget("mobile.mywidget", $.mobile.widget, {
        /** Available options for the widget are specified here, along with default values. */
        options: {
            inline: false,
            mode: "default",
            height: 200
        },
        /** Mandatory method - automatically called by jQuery Mobile to initialise the widget. */
        _create: function() {
            var inputElement = this.element;
            var opts = $.extend(this.options, inputElement.data("options"));
            $(document).trigger("mywidgetcreate");
            ...
            inputElement.after("<button>"
                + inputElement.val()
                + "</button>");
            ...
        },
        /** Custom method to handle updates. */
        _update: function() {
            var inputElement = this.element;
            var opts = $.extend(this.options, inputElement.data("options"));
            $(document).trigger("mywidgetupdate");
            ...
            inputElement.siblings("button").text(inputElement.val());
            ...
        },
        /* Externally callable method to force a refresh of the widget. */
        refresh: function() {
            return this._update();
        }
    });
    /* Handler which initialises all widget instances during page creation. */
    $(document).bind("pagecreate", function(e) {
        $(document).trigger("mywidgetbeforecreate");
        return $(":jqmData(role='mywidget')", e.target).mywidget();
    });
})(jQuery);
```

In the HTML we can trigger use of the widget as follows:

```html
<input type="text" val="test" data-role="mywidget" data-height="100" data-inline="true">
```

In the example above our widget is known as a *mywidget*. We first define the widget and then follow it with a handler for the [`pagecreate` event](http://jquerymobile.com/test/docs/api/events.html). This handler ensures that all HTML elements with the attribute **data-role="mywidget"** are processed. _Note that you should use the `jqmData` filter in case you're not using the standard `data-` prefix for widget attributes_.

Any number of options can be provided to your widget with no restrictions on option type. Per-widget-instance options can be specified as HTML attributes or as dictionary keys if initializing a widget directly in Javascript. Default values for options are provided within the widget itself (as you can see above).

The `_create()` method gets automatically called by jQuery Mobile when we call `mywidget()` from the `pagecreate` handler. This method is responsible for setting up the initial widget display. In the example above we simply add a button after the input element with its label set to the value within the text field.

There is also a `refresh()` method available for the widget which can be invoked through Javascript as follows:

```js
$(":jqmData(role='mywidget')").mywidget("refresh");
```

This in turn calls the `_update()` method which in turn refreshes the button label with the current value of the text input field. You can add as many such methods as you like to the widget. For example, most of the standard jQuery Mobile widgets also come with `enable()` and `disable()` methods.

You'll also notice that we trigger widget-specific events within the functions, e.g. `mywidgetcreate`. These aren't strictly necessary but are useful to include, especially if you want the rest of your application to know when these events take place within the widget.