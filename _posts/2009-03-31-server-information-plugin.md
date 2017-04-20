---
layout: post
published: true
title: Web server information plugin
excerpt: "I do all the development work for this site on my local machine, using a
  mirror copy of the live database and Wordpress installation. Once I'm happy with
  any changes made I apply them to the live web server (usually via Subversion). I
  use the <a href=\"http:&#47;&#47;en.wikipedia.org&#47;wiki&#47;Hosts_file\">HOSTS
  file<&#47;a> to redirect all browser calls for <strong>hiddentao.com<&#47;strong>
  to the local IP address (127.0.0.1) so that I can properly test URL linking and
  redirection. This way I can experiment as much as I like on my local copy without
  worrying about causing any damage to the live website.\r\n"
date: '2009-03-31 11:08:12 +0800'
categories:
- Uncategorized
tags:
- Wordpress
- Server-Info
comments: []
---
I do all the development work for this site on my local machine, using a mirror copy of the live database and Wordpress installation. Once I'm happy with any changes made I apply them to the live web server (usually via Subversion). I use the [HOSTS file](http://en.wikipedia.org/wiki/Hosts_file) to redirect all browser calls for **hiddentao.com** to the local IP address (127.0.0.1) so that I can properly test URL linking and redirection. This way I can experiment as much as I like on my local copy without worrying about causing any damage to the live website.
<a id="more"></a><a id="more-318"></a>
The problem is, when viewing the local copy of the site it looks exactly the same as the live website, especially since I'm using the same database data. And I've always got lots of browser windows open, as I test and compare changes between the live website and the local copy. Very recently I caught myself making some big changes in the live website administration pages, thinking I was accessing the local copy. I decided that I needed an easily visible way of knowing which server the website I'm accessing is running on.

And behold - the [Server-Info](/code/wordpress-server-info-plugin/ "Server-Info plugin") plugin. Once enabled it will display a floating box at the top-left-hand corner of the webpage, containing the hostname and IP address of the webserver. The box will remain in that position, even when you scroll the page:

![Server-Info box](http://farm4.static.flickr.com/3615/3401500736_8312c67db6_o.png)

_Note: You can change the look and feel and layout of the box by editing the CSS file that comes with the plugin_.

By default the information box only gets shown when viewing an administration page. But in the administration options for the plugin you can set it to show on blog pages too, with the ability to restrict this to e.g. when the user is logged in.

Questions and comments are welcome.