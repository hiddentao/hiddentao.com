---
layout: portfolio
status: publish
published: false
title: Universal Playback
author:
  display_name: ram
  login: ram
  email: ram@hiddentao.com
  url: http://www.hiddentao.com/about/contact
author_login: ram
author_email: ram@hiddentao.com
author_url: http://www.hiddentao.com/about/contact
wordpress_id: 1100
wordpress_url: http://www.hiddentao.com/?post_type=portfolio&#038;p=1100
date: '2010-10-20 11:31:03 +0800'
date_gmt: '2010-10-20 11:31:03 +0800'
categories: []
tags: []
comments: []
---
<p>This site consists of NBC Universal's back catalogue of shows and their associated products, videos and images. Users can browse shows, episodes and characters and purchase associated books, music and DVDs. Users can also rate shows. </p>
<p>The site makes extensive use Drupal's taxonomy system as well as the [SOLR search server](http:&#47;&#47;lucene.apache.org&#47;solr&#47;) for fast information retrieval. The listing page are AJAX driven with standard request-response fallbacks non-Javascript browsers. In the codebase I was responsible for developing the framework which made it easy to build AJAX-driven listings and show pages with non-Javascript fallback support. This is implemented as a custom Drupal module which internally uses an object-oriented architecture. For SOLR querying we built a custom SOLR API module which builds on the top of Drupal's standard SOLR modules by allowing us more querying flexibility.</p>
<p>Key features of project:</p>
<p>*  AJAX powered navigation with progressive fallback for non-Javascript browsers.<br />
  *  Architecture for producing a listing of a given content type, with the easy ability to<br />
filter by page number, search term and change the display format (e.g. for AJAX).<br />
  *  Created object-oriented MVC-style architecture within Drupal for flexible route handling.<br />
*  Progressive Javascript-driven image loading to decrease initial page load time.<br />
*  Use of numerous modules including but not limited to Views 3, CCK, ApacheSolr, etc.<br />
*  Integration with Apache SOLR for scalable performance.<br />
  * Developed custom direct API layer for SOLR to allow for arbitrary queries.<br />
*  Wrote database export and conversion scripts to migrate data from old schema.<br />
*  Ability to easily declare forms and blocks and override common hooks in an object-oriented way.<br />
*  Extensive front-end theme development including object-oriented Javascript.</p>
<p>[portfolio_gallery]<br />
[portfolio_img title="Dropdowns" src="http:&#47;&#47;farm3.static.flickr.com&#47;2604&#47;5847983861_f16b55c232_t.jpg" href="http:&#47;&#47;farm3.static.flickr.com&#47;2604&#47;5847983861_f16b55c232_b.jpg" lightbox_group="set"]<br />
[portfolio_img title="Listing page" src="http:&#47;&#47;farm3.static.flickr.com&#47;2626&#47;5848543024_cf3d65234f_t.jpg" href="http:&#47;&#47;farm3.static.flickr.com&#47;2626&#47;5848543024_cf3d65234f_b.jpg" lightbox_group="set"]<br />
[portfolio_img title="Show page" src="http:&#47;&#47;farm3.static.flickr.com&#47;2739&#47;5848543154_a64a2e3d5b_t.jpg" href="http:&#47;&#47;farm3.static.flickr.com&#47;2739&#47;5848543154_a64a2e3d5b_b.jpg" lightbox_group="set"]<br />
[&#47;portfolio_gallery]</p>
