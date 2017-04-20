---
layout: post
published: true
title: How to check if a JPEG is progressive
excerpt: "I'm trying to optimise my JPEGs so that they're progressive. That way they
  will appear to load quicker for visitors to my website. This practise seems to be
  [gaining steam](http:&#47;&#47;calendar.perfplanet.com&#47;2012&#47;progressive-jpegs-a-new-best-practice&#47;)
  recently. In fact, remember in the late 90's when computers and internet speeds
  were slower? progressive JPEGs were a sure thing then. With today's mobile devices
  still being resource constrained, they again have a chance to shine. In searching
  for how to integrate the creation of progressive JPEGs into the my Grunt imagemin
  task I came across an [interesting technical discussion]((https:&#47;&#47;github.com&#47;yeoman&#47;yeoman&#47;issues&#47;810))
  of the pros and cons, well worth checking out. \r\n\r\nA tricky problem is checking
  whether a JPEG is progressive in the first place. "
date: '2013-06-11 11:45:49 +0800'
categories:
- Uncategorized
tags:
- JPEG
- Tips
comments:
- id: 4877
  author: Hrishikesh Mishra
  author_email: sprt.email@gmail.com
  author_url: http://www.facebook.com/hrishikesh.kumar.mishra
  date: '2013-11-12 09:28:00 +0800'
  date_gmt: '2013-11-12 09:28:00 +0800'
  content: |
    <p>Thanks,<&#47;p>

    <p>I was searching for this.<&#47;p>

    <p>But is there way to convert image to progressive image.<&#47;p>

    <p>Hrishikesh<&#47;p>
- id: 4880
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2013-11-28 02:35:00 +0800'
  date_gmt: '2013-11-28 02:35:00 +0800'
  content: "<p>Hi Hrishikesh, you can use jpegtran. Take a look at http:&#47;&#47;www.yuiblog.com&#47;blog&#47;2008&#47;12&#47;05&#47;imageopt-4&#47;
    and http:&#47;&#47;www.phpied.com&#47;installing-jpegtran-mac-unix-linux&#47;<&#47;p>\n"
- id: 4916
  author: Max Barrett
  author_email: m4xjb@hotmail.com
  author_url: ''
  date: '2014-02-25 11:57:00 +0800'
  date_gmt: '2014-02-25 11:57:00 +0800'
  content: "<p>Do you need any delegates for this to work? I get this error: \nidentify:
    no decode delegate for this image format `file.jpg' @ error&#47;constitute.c&#47;ReadImage&#47;555.<&#47;p>\n"
- id: 4917
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2014-02-25 12:03:00 +0800'
  date_gmt: '2014-02-25 12:03:00 +0800'
  content: "<p>I didn't need to do anything extra apart from the above instructions.<&#47;p>\n"
- id: 4951
  author: Denis Golotyuk
  author_email: golotyuk@gmail.com
  author_url: ''
  date: '2014-06-13 18:53:00 +0800'
  date_gmt: '2014-06-13 17:53:00 +0800'
  content: "<p>Try this online tool as well: http:&#47;&#47;highloadtools.com&#47;progressivejpeg<&#47;p>\n"
- id: 5014
  author: Sergej M&Atilde;&frac14;ller
  author_email: sergej.mueller@gmail.com
  author_url: ''
  date: '2015-01-10 11:26:00 +0800'
  date_gmt: '2015-01-10 11:26:00 +0800'
  content: "<p>Online tool for drag&amp;drop images: http:&#47;&#47;codepen.io&#47;sergejmueller&#47;full&#47;GJKwv<&#47;p>\n"
- id: 5015
  author: Sindre Sorhus
  author_email: sindresorhus@gmail.com
  author_url: ''
  date: '2015-01-10 14:43:00 +0800'
  date_gmt: '2015-01-10 14:43:00 +0800'
  content: "<p>Check out is-progressive: https:&#47;&#47;github.com&#47;sindresorhus&#47;is-progressive#cli<&#47;p>\n"
- id: 5016
  author: kzurell
  author_email: kirk@kirk.zurell.name
  author_url: ''
  date: '2015-01-12 16:51:00 +0800'
  date_gmt: '2015-01-12 16:51:00 +0800'
  content: '<p>On Mac, you have to brew install with "--with-x11". It gave me inexplicable
    delegate errors until I did this. Took a while to figure out, hope this helps.<&#47;p>

'
- id: 5017
  author: PickAName
  author_email: m8r-d6vv9t@mailinator.com
  author_url: ''
  date: '2015-01-13 14:26:00 +0800'
  date_gmt: '2015-01-13 14:26:00 +0800'
  content: '<p>Hi, thanks for the article, just a heads-up: I''m using Chrome 39.0.2171.95
    with Windows 7, and the font of your website looks funky, I don''t know why, see
    screenshot. Also, the link to "interesting technical discussion" isn''t properly
    formatted.<&#47;p>

'
- id: 5118
  author: kostasx
  author_email: minaidisk@gmail.com
  author_url: ''
  date: '2015-12-14 21:55:00 +0800'
  date_gmt: '2015-12-14 21:55:00 +0800'
  content: |
    <p>And here's a line for checking a list of files in a folder:<&#47;p>

    <p><pre><code>for i in .&#47;*.jpg; do echo "Checking ${i}" &amp;&amp; identify -verbose $i | grep Interlace; done<pre><code><&#47;p>
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