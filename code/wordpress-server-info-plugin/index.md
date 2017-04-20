---
layout: page-code
title: 'Server-Info '
tags:
- Wordpress
- Server-Info
comments: []
---
Server-Info is a Wordpress plugin which displays information about the web server hosting your Wordpress installation on all administration (and optionally, blog) pages. Specifically it displays the hostname and IP address of the server.

The rationale for such a plugin is that if you maintain a mirror copy of your website elsewhere (e.g. on your local computer) for development purposes, then it would be nice to know when you're viewing the live website (i.e. the one that's accessible to everyone on the internet) rather than the other one, just so you don't make any unintended changes to your live website without realising.

This plugin requires PHP 5 and Wordpress 2.7. It has been tested on upto Wordpress 2.9.

License: [GPL 3](http://www.gnu.org/licenses/gpl.txt "GNU General Public License").

## Installation

1. [Download Server-Info](/downloads/wordpress-server-info-plugin-0.1.zip).  
2. Unzip it into your Wordpress `plugins` folder such that the plugin files are at: `wp-content/plugins/server-info/...`  
3. Enable the plugin within your blog's administration options.  
4. All done!

## Usage

If the plugin was successfully enabled then you should a little, floating green box in the top-left-hand corner when viewing your blog administration pages, e.g:

![Server-Info box](http://farm4.static.flickr.com/3615/3401500736_8312c67db6_o.png)

This box is fixed in position - it will stay visible at that point even when you scroll the page.

## Customisation

By default the server information box only gets displayed when viewing your blog administration pages. In the administration options for the plugin you can set it to show on blog pages too, with the ability to restrict this to e.g. when the user is logged in.

You can customise the look and layout of the actual information box by editing `wp-content/plugins/server-info/server-info.css`.
