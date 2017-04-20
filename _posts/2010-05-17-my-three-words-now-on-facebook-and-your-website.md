---
layout: post
published: true
title: My Three Words now on Facebook and your website
excerpt: "Remember [My Three Words](&#47;archives&#47;2010&#47;03&#47;31&#47;my-three-words&#47;)?
  Over the last month or so we've been busy adding lots more to it. \r\n\r\nYou can
  now get it on Facebook at [http:&#47;&#47;apps.facebook.com&#47;mythreewords&#47;](http:&#47;&#47;apps.facebook.com&#47;mythreewords&#47;).
  And you can share your favourite stories on Facebook itself and invite your friends
  to play with you.\r\n\r\nBut the coolest new thing is the little widget (see below)
  which can be embedded on your website. "
date: '2010-05-17 14:25:02 +0800'
categories:
- Uncategorized
tags:
- MyThreeWords
- Widget
- Javascript
- Facebook
comments: []
---
Remember [My Three Words](/archives/2010/03/31/my-three-words/)? Over the last month or so we've been busy adding lots more to it.

You can now get it on Facebook at [http://apps.facebook.com/mythreewords/](http://apps.facebook.com/mythreewords/). And you can share your favourite stories on Facebook itself and invite your friends to play with you.

But the coolest new thing is the little widget (see below) which can be embedded on your website. So your visitors will get to see what crazy story is being concocted right now on [My Three Words](http://mythreewords.com/). To embed the widget onto a webpage simply insert the following line of code where you want the widget to show up:

```html
<script type="text/javascript" src="http://mythreewords.com/widget"></script>
```

The widget is contained within a `<div>` element with the class `m3w-widget`. It re-uses the styles from the My Three Words homepage. The above `<script>` loads some Javascript which in turn loads jQuery, output the HTML and loads the widget-specific Javascript which will be responsible for fetching new data from the My Three Words server. [JSONP](http://en.wikipedia.org/wiki/JSON) is used to work around the 'Same Origin' policy.

