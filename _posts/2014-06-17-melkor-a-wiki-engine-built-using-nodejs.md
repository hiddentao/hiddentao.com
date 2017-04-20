---
layout: post
published: true
title: Melkor, a wiki engine built using node.js
date: '2014-06-17 15:28:12 +0800'
categories:
- Uncategorized
tags:
- Javascript
- node.js
comments:
- id: 4953
  author: guillaumech
  author_email: guillaume@noctua-software.com
  author_url: ''
  date: '2014-06-18 04:19:00 +0800'
  date_gmt: '2014-06-18 03:19:00 +0800'
  content: "<p>Looks very good.<&#47;p>\n"
- id: 5129
  author: Zauber Paracelsus
  author_email: zauber@gridmail.org
  author_url: ''
  date: '2015-12-17 17:44:00 +0800'
  date_gmt: '2015-12-17 17:44:00 +0800'
  content: "<p>The demo appears to be no longer available?  I'm seeing a DNS error
    when I try to access it.<&#47;p>\n"
- id: 5131
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2015-12-18 01:33:00 +0800'
  date_gmt: '2015-12-18 01:33:00 +0800'
  content: "<p>Thanks for letting me know, it's working again now.<&#47;p>\n"
---
I've recently released [Melkor](https://github.com/hiddentao/melkor), a wiki engine built in Node.js. Melkor (named after the [Lord of the Rings character](http://lotr.wikia.com/wiki/Melkor)) uses Git as the back-end storage mechanism (including revision history), has a responsive layout (using Bootstrap) and has support for AJAX page navigation built-in (making it fast to use on mobiles).

The wiki content format is Markdown. The back-end is built using [Waigo](http://waigojs.com), a web framework that utilises Javascript ES6 features such as generators.

* Demo: [http://melkor-demo.hiddentao.com](http://melkor-demo.hiddentao.com)  
* Source: [https://github.com/hiddentao/melkor](https://github.com/hiddentao/melkor)