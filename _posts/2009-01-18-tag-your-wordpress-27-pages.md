---
layout: post
published: true
title: Tag your Wordpress 2.7 pages!
excerpt: "A few weeks ago I upgraded to Wordpress 2.7 and was immediately liking the
  new admin interface and all the other features. But I needed a way of tagging my
  pages as well as my blog entries. So I went and grabbed the <a href=\"http:&#47;&#47;wordpress.org&#47;extend&#47;plugins&#47;simple-tags&#47;\">Simple
  Tags plugin<&#47;a> by Amaury Balmer. But for some reason it didn't seem to re-use
  my existing blog post tags, and its tagging interface (when editing a page) didn't
  seem to work as well as the blog post tagging interface that comes with Wordpress.\r\n\r\nSo
  I decided to write my own plugin (both as a learning experience and for fun!) which
  would let me tag pages "
date: '2009-01-18 23:20:42 +0800'
categories:
- Uncategorized
tags:
- Wordpress
- Page Tagger
comments:
- id: 435
  author: claudiuc
  author_email: claudiuc@easymedia.ro
  author_url: http://www.easymedia.ro
  date: '2009-03-21 19:59:31 +0800'
  date_gmt: '2009-03-21 19:59:31 +0800'
  content: |
    <p>Hello,<&#47;p>

    <p>I'm trying to use your plugin but is not working. It display the box on page edit, but no tags are displayed on tag cloud widget.<&#47;p>

    <p>Can you help me?<&#47;p>

    <p>Thanks<&#47;p>
- id: 447
  author: ram
  author_email: ram@hiddentao.net
  author_url: http://hiddentao.net/
  date: '2009-03-22 23:30:18 +0800'
  date_gmt: '2009-03-22 23:30:18 +0800'
  content: "<p>Hi, I haven't tested this with the tag cloud widget. Let me look into
    it for you.<&#47;p>\n"
- id: 593
  author: ram
  author_email: ram@hiddentao.net
  author_url: http://hiddentao.net/
  date: '2009-04-03 16:40:22 +0800'
  date_gmt: '2009-04-03 16:40:22 +0800'
  content: '<p>Fixed the tag cloud issue in a <a href="http:&#47;&#47;www.hiddentao.com&#47;archives&#47;2009&#47;04&#47;03&#47;page-tags-02&#47;"
    rel="nofollow">new release<&#47;a>.<&#47;p>

'
---
A few weeks ago I upgraded to Wordpress 2.7 and was immediately liking the new admin interface and all the other features. But I needed a way of tagging my pages as well as my blog entries. So I went and grabbed the [Simple Tags plugin](http://wordpress.org/extend/plugins/simple-tags/) by Amaury Balmer. But for some reason it didn't seem to re-use my existing blog post tags, and its tagging interface (when editing a page) didn't seem to work as well as the blog post tagging interface that comes with Wordpress.

So I decided to write my own plugin (both as a learning experience and for fun!) which would let me tag pages using the same interface as is used for tagging blog posts. And here it is: [Page-Tags](/code/wordpress-page-tagger-plugin/ "Page-Tags"). It's very simple - it doesn't have any admin options to set - but it gets the job done. Simple install and activate the plugin and then try editing one of your pages. You should see a tagging box like this on the right-hand side:

![Page-Tags tagging box](http://farm4.static.flickr.com/3349/3207162263_4cb925c194_o.png)

This box looks and feels exactly like the one you see when you edit a blog post, and it works the same way too (it has the lookup-as-you-type feature). Additionally, when viewing the archive page for a given tag or tags you should now see the list of tagged pages as well as blog posts.

