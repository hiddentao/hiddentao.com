---
title: Tag your Wordpress 2.7 pages!
date: '2009-01-18'
summary: "A few weeks ago I upgraded to Wordpress 2.7 and was immediately liking the new admin interface and all the other features. But I needed a way of tagging my pages as well as my blog entries. So I went and grabbed the <a href=\"http:&#47;&#47;wordpress.org&#47;extend&#47;plugins&#47;simple-tags&#47;\">Simple Tags plugin<&#47;a> by Amaury Balmer. But for some reason it didn't seem to re-use my existing blog post tags, and its tagging interface (when editing a page) didn't seem to work as well as the blog post tagging interface that comes with Wordpress.\r\n\r\nSo I decided to write my own plugin (both as a learning experience and for fun!) which would let me tag pages "
tags:
  - Wordpress
  - Page Tagger
---
A few weeks ago I upgraded to Wordpress 2.7 and was immediately liking the new admin interface and all the other features. But I needed a way of tagging my pages as well as my blog entries. So I went and grabbed the [Simple Tags plugin](http://wordpress.org/extend/plugins/simple-tags/) by Amaury Balmer. But for some reason it didn't seem to re-use my existing blog post tags, and its tagging interface (when editing a page) didn't seem to work as well as the blog post tagging interface that comes with Wordpress.

So I decided to write my own plugin (both as a learning experience and for fun!) which would let me tag pages using the same interface as is used for tagging blog posts. And here it is: [Page-Tags](/code/wordpress-page-tagger-plugin/ "Page-Tags"). It's very simple - it doesn't have any admin options to set - but it gets the job done. Simple install and activate the plugin and then try editing one of your pages. You should see a tagging box like this on the right-hand side:

![Page-Tags tagging box](http://farm4.static.flickr.com/3349/3207162263_4cb925c194_o.png)

This box looks and feels exactly like the one you see when you edit a blog post, and it works the same way too (it has the lookup-as-you-type feature). Additionally, when viewing the archive page for a given tag or tags you should now see the list of tagged pages as well as blog posts.

