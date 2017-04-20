---
layout: post
published: true
title: A plugin for embedding Flickr images into Wordpress posts
excerpt: "I'm pleased to announce the immediate availability of <a href=\"http:&#47;&#47;wordpress.org&#47;extend&#47;plugins&#47;wp-flickr-embed&#47;\">Wordpress
  Flickr Embed<&#47;a>, a plugin which makes it <em>really<&#47;em> easy to insert
  Flickr images into your Wordpress posts. \r\n\r\nThe plugin is very user-friendly.
  It adds a button to the editing toolbar which will pop up an interactive interface
  when clicked. The interface lets you search for photos using free text. Click on
  a photo to insert it and customise the title&#47;caption, inserted size, alignment
  and also the size to show in the lightbox. It also provides a mechanism (on its
  settings page) for you to authenticate it with your Flickr account so that you can
  access your private images.\r\n"
date: '2012-11-13 12:28:16 +0800'
categories:
- Uncategorized
tags:
- Wordpress
- Plugin
- Flickr
comments:
- id: 4796
  author: kiljano
  author_email: info@kiljano.com
  author_url: ''
  date: '2012-12-07 12:33:00 +0800'
  date_gmt: '2012-12-07 12:33:00 +0800'
  content: "<p>Hi, i would like for the plugin to be able to see my private photos
    too. Is that posible?<&#47;p>\n"
- id: 4797
  author: Ramesh Nair
  author_email: ''
  author_url: http://twitter.com/hiddentao
  date: '2012-12-09 12:56:00 +0800'
  date_gmt: '2012-12-09 12:56:00 +0800'
  content: "<p>Yes, this should already work. Have you authenticated the plugin with
    your Flickr account?<&#47;p>\n"
- id: 4799
  author: Steve Dimmick
  author_email: dimmick.steve@gmail.com
  author_url: ''
  date: '2012-12-14 14:38:00 +0800'
  date_gmt: '2012-12-14 14:38:00 +0800'
  content: "<p>I can not see my private photos either and I have authenticated the
    plugin with my Flickr account<&#47;p>\n"
- id: 4800
  author: Ramesh Nair
  author_email: ''
  author_url: http://twitter.com/hiddentao
  date: '2012-12-14 15:50:00 +0800'
  date_gmt: '2012-12-14 15:50:00 +0800'
  content: "<p>Ok, I think this is a bug in the plugin. I copied over the authentication
    code from the original plugin (Wordpress Media Flickr) but it seems that Flickr
    have changed how they authenticate apps to access private user data. I will need
    a little time to fix this.<&#47;p>\n"
- id: 4801
  author: Steve Dimmick
  author_email: webmail@wishlistmembercoder.com
  author_url: ''
  date: '2012-12-22 14:51:00 +0800'
  date_gmt: '2012-12-22 14:51:00 +0800'
  content: "<p>Thanks Ramesh - looking forward to getting the new version ;)<&#47;p>\n"
- id: 4802
  author: db
  author_email: dbozorgi@yahoo.com
  author_url: ''
  date: '2012-12-23 06:50:00 +0800'
  date_gmt: '2012-12-23 06:50:00 +0800'
  content: "<p>Same problem. Cannot see private photos.<&#47;p>\n"
- id: 4803
  author: Ross
  author_email: averyall@yahoo.com
  author_url: ''
  date: '2012-12-31 19:19:00 +0800'
  date_gmt: '2012-12-31 19:19:00 +0800'
  content: "<p>Thanks for all the work with this plugin. Exactly what I'm in need
    of. Yes -- it appears private photos cannot be viewed, either through this plugin
    or the original media plugin.<&#47;p>\n"
- id: 4809
  author: dhb
  author_email: dbozorgi@yahoo.com
  author_url: ''
  date: '2013-02-03 09:16:00 +0800'
  date_gmt: '2013-02-03 09:16:00 +0800'
  content: "<p>same problem, cannot see private photos and have authenticated<&#47;p>\n"
- id: 4823
  author: Ram
  author_email: ram@hiddentao.com
  author_url: ''
  date: '2013-05-18 14:35:00 +0800'
  date_gmt: '2013-05-18 13:35:00 +0800'
  content: "<p>Private photos should now show up ok if you go through the Flickr authorization
    within the plugin (v1.1).<&#47;p>\n"
---
I'm pleased to announce the immediate availability of [Wordpress Flickr Embed](http://wordpress.org/extend/plugins/wp-flickr-embed/), a plugin which makes it _really_ easy to insert Flickr images into your Wordpress posts.

The plugin is very user-friendly. It adds a button to the editing toolbar which will pop up an interactive interface when clicked. The interface lets you search for photos using free text. Click on a photo to insert it and customise the title/caption, inserted size, alignment and also the size to show in the lightbox. It also provides a mechanism (on its settings page) for you to authenticate it with your Flickr account so that you can access your private images.

After much searching trying to find something which would do this for me I came across [Wordpress Media Flickr](http://wordpress.org/extend/plugins/wordpress-media-flickr/), an excellent plugin from the initial looks of it. I would have just used this but I couldn't get it to work properly with my blog. As of writing this (Nov 13, 2012) it hasn't been updated in over a year and there are still outstanding support requests. Plus it lacks features I need, like the ability to have the lightbox popup use a larger version of the clicked photo. After fixing some bugs I ended up adding this feature and others and so decided to fork it.

If you have any support requests please enter them on the plugin's [Wordpress Support](http://wordpress.org/support/plugin/wp-flickr-embed) page. Source code is at [https://github.com/hiddentao/wp-flickr-embed](https://github.com/hiddentao/wp-flickr-embed).

Enjoy!