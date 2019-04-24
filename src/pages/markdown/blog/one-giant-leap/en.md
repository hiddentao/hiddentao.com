---
title: One Giant Leap!
date: '2009-09-10'
summary: "One of my current clients is the [Sandbag Climate Campaign](http:&#47;&#47;sandbag.org.uk&#47; \"Sandbag\"). They're a small organisation primarily focussed on the [European carbon emissions trading scheme](http:&#47;&#47;en.wikipedia.org&#47;wiki&#47;European_Union_Emission_Trading_Scheme) as well as the upcoming global climate conference at Copenhagen ([COP-15](http:&#47;&#47;en.cop15.dk&#47;)). \r\n\r\nOne of their latest projects is a global parkour jam titled [\"One Giant Leap!\"](http:&#47;&#47;sandbag.org.uk&#47;campaigns&#47;copenhagen), designed to raise the public's awareness of the importance of the upcoming conference. The jam is scheduled to take place on Saturday, September 26th, 2009 in over 30 countries simultaneously ([see the map](http:&#47;&#47;maps.google.com&#47;maps&#47;ms?ie=UTF8&hl=en&msa=0&msid=108986355714869234623.000471a40042e76d97dc8&ll=26.74561,2.8125&spn=133.559418,303.75&z=2)). \r\n"
tags:
  - Sandbag
  - Parkour
  - Climate change
---
One of my current clients is the [Sandbag Climate Campaign](http://sandbag.org.uk/ "Sandbag"). They're a small organisation primarily focussed on the [European carbon emissions trading scheme](http://en.wikipedia.org/wiki/European_Union_Emission_Trading_Scheme) as well as the upcoming global climate conference at Copenhagen ([COP-15](http://en.cop15.dk/)).

One of their latest projects is a global parkour jam titled ["One Giant Leap!"](http://sandbag.org.uk/campaigns/copenhagen), designed to raise the public's awareness of the importance of the upcoming conference. The jam is scheduled to take place on Saturday, September 26th, 2009 in over 30 countries simultaneously ([see the map](http://maps.google.com/maps/ms?ie=UTF8&hl=en&msa=0&msid=108986355714869234623.000471a40042e76d97dc8&ll=26.74561,2.8125&spn=133.559418,303.75&z=2)).
<a id="more"></a><a id="more-488"></a>

One of my tasks for this has been to create a pop-up widget which lets web users sign the One Giant Leap petition online. The requirement was for anyone to be able to embed this widget into their website. It had to stand out and couldn't take up too much space on a page. After much fiddling with Javascript and CSS and with help from the other Sandbagger's in terms of aesthetics a widget is finally born!

To embed the widget you simply need to add the following line to your webpage:

```html
<script class="copenhagen_petition" src="http://sandbag.org.uk/embeddable_widgets/copenhagen_petition.js" type="text/javascript"></script>
```

This Javascript file first loads and initialises the [jQuery](http://jquery.com/) library. It then generates the anchor link image you see in front of you. When you click the image a [Thickbox](http://jquery.com/demo/thickbox/) pops up with the full sign-up form. The form is generated using the same PHP code used to generate the [original petition form](http://sandbag.org.uk/campaigns/copenhagen) (albeit with minor style changes). Indeed, when you submit the widget form the server thinks you've just submitted the original petition form.
