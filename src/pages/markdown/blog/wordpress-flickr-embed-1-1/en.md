---
title: Wordpress Flickr Embed 1.1 released
date: '2013-05-18'
summary: "I've just pushed out a new release of [Wordpress Flickr Embed](http:&#47;&#47;wordpress.org&#47;support&#47;plugin&#47;wp-flickr-embed), a plugin which makes it really easy to insert Flickr images into your posts. The big new thing is...\r\n"
tags:
  - Wordpress
  - Plugin
  - Flickr
---
I've just pushed out a new release of [Wordpress Flickr Embed](http://wordpress.org/support/plugin/wp-flickr-embed), a plugin which makes it really easy to insert Flickr images into your posts. The big new thing is...

**Private photos!**

I've finally replaced the old Flickr auth mechanism with [OAuth 1.0a](http://www.flickr.com/services/api/auth.oauth.html), the mechanism currently supported by Flickr. This wasn't as easy as I initially thought it would be, partially because it requires redirecting the user to Flickr and then again calling the Flickr API from the back-end once the user has returned, and making all of this work with Wordpress's way of doing things. I've tried to make the process as painless as possible for the user.

Internally I use a combination of custom query variables and the [template_redirect](http://codex.wordpress.org/Plugin_API/Action_Reference/template_redirect) hook to accomplish the whole thing. A big thanks to [David Wilkinson](http://dopiaza.org/) and his excellent [Dopiaza PHP library](https://github.com/dopiaza/DPZFlickr) for handling the messy OAuth signing details.

One of the downsides of OAuth 1.0a is that for security purposes [it's recommended that you not send the OAuth token to the browser](https://dev.twitter.com/discussions/2692). To make the best of this I first call the plugin back-end via AJAX with the desired Flickr API parameters. The back-end signs the whole thing using the OAuth authenticated data and then returns the lot back to the browser. The browser then makes the call to Flickr with the new authenticated params. Overall it might feel slightly slower than the old version of the plugin which didn't have to make this additional AJAX call.

On the plus side, once you've authorized the plugin with Flickr (through the _Settings -> WP Flickr Embed_ admin page) you should be able to search and insert your private photos into your posts.

As usual the source is available on Github at [https://github.com/hiddentao/wp-flickr-embed](https://github.com/hiddentao/wp-flickr-embed). Feel free to raise any issues and suggestions there or better yet, in the [Wordpress support forums](http://wordpress.org/support/plugin/wp-flickr-embed).
