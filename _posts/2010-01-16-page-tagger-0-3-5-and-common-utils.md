---
layout: post
published: true
title: Page Tagger 0.3.5 and Common-Utils
date: '2010-01-16 14:46:27 +0800'
categories:
- Uncategorized
tags:
- Wordpress
- Page Tagger
- Java
- Common-Utils
comments:
- id: 4668
  author: Will L
  author_email: will@danger.co.nz
  author_url: http://bluewaterboats.org
  date: '2010-01-29 10:13:23 +0800'
  date_gmt: '2010-01-29 10:13:23 +0800'
  content: '<p>Thanks for working on this. Is there any plans for a "Pages>Page Tags"
    section in the Admin Panel for bulk editing of tags like we have with post tags?<&#47;p>

'
- id: 4669
  author: ram
  author_email: ram@hiddentao.com
  author_url: http://www.hiddentao.com/
  date: '2010-02-07 13:47:41 +0800'
  date_gmt: '2010-02-07 13:47:41 +0800'
  content: "<p>Hi Will, you should be able to bulk-edit your page tags using the post-tags
    bulk editing interface. Atleast that's how I do it.<&#47;p>\n"
---
A new version of [Page Tagger](/code/wordpress-page-tagger-plugin/) is now available. Grab it now from [here](/code/wordpress-page-tagger-plugin/) or the [Wordpress plugin repository](http://wordpress.org/extend/plugins/page-tagger/).

Also, I've put up a few Java classes I wrote a while back as a small library called [Common-Utils](/code/common-utils/ "Common-Utils"). Included within are the following:

* ``ArrayUtils`` - Utility methods to fill an array with a given value or check if it contains a given value.
* ``DynamicArray`` - A resizable "static" array for when you don't quite need the full flexibility of ``ArrayList``.
* ``NonMutableIterator`` - Wraps around a normal ``Iterator`` and disables use of the ``remove`` method.