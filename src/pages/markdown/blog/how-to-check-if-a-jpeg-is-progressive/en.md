---
title: How to check if a JPEG is progressive
date: '2013-06-11'
summary: "I'm trying to optimise my JPEGs so that they're progressive. That way they will appear to load quicker for visitors to my website. This practise seems to be [gaining steam](http:&#47;&#47;calendar.perfplanet.com&#47;2012&#47;progressive-jpegs-a-new-best-practice&#47;) recently. In fact, remember in the late 90's when computers and internet speeds were slower? progressive JPEGs were a sure thing then. With today's mobile devices still being resource constrained, they again have a chance to shine. In searching for how to integrate the creation of progressive JPEGs into the my Grunt imagemin task I came across an [interesting technical discussion]((https:&#47;&#47;github.com&#47;yeoman&#47;yeoman&#47;issues&#47;810)) of the pros and cons, well worth checking out. \r\n\r\nA tricky problem is checking whether a JPEG is progressive in the first place. "
tags:
  - JPEG
  - Tips
---
I'm trying to optimise my JPEGs so that they're progressive. That way they will appear to load quicker for visitors to my website. This practise seems to be [gaining steam](http://calendar.perfplanet.com/2012/progressive-jpegs-a-new-best-practice/) recently. In fact, remember in the late 90's when computers and internet speeds were slower? progressive JPEGs were a sure thing then. With today's mobile devices still being resource constrained, they again have a chance to shine. In searching for how to integrate the creation of progressive JPEGs into the my Grunt imagemin task I came across an [interesting technical discussion]((https://github.com/yeoman/yeoman/issues/810)) of the pros and cons, well worth checking out.

A tricky problem is checking whether a JPEG is progressive in the first place. Luckily [ImageMagick](http://www.imagemagick.org/) really helps with this. If you're doing any sort of programmatic image manipulation ImageMagick should be in your toolbox already (trust me, it's very useful). To install ImageMagick on OS X I'm using [brew](http://mxcl.github.io/homebrew/):

```bash
$ brew install imagemagick
```

To identify whether a JPEG is progressive or not do:

```bash
$ identify -verbose file.jpg | grep Interlace
```

If you get back `Interlace: JPEG` then it's progressive. It you get back `Interlace: None` then it's a baseline (i.e. non-progressive JPEG).
