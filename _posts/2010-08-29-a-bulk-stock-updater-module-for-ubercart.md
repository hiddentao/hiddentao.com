---
layout: post
published: true
title: A bulk stock updater module for Ubercart
excerpt: "On a recent Drupal project I was asked to build an interface whereby administrators
  could easily bulk-edit the stock levels for all their [Ubercart](http:&#47;&#47;www.ubercart.org&#47;)
  products. I had a look on the web for something which already did this. I found
  [Multiple stock edit](http:&#47;&#47;www.ubercart.org&#47;contrib&#47;5411) - which
  only really worked with Ubercart 1.x and Drupal 5 (not to mention that it used the
  standard Drupal form submission mechanism, thus making it difficult to quickly bulk-edit
  large numbers of items). [Stock and Price updater](http:&#47;&#47;www.ubercart.org&#47;contrib&#47;12428)
  only worked by importing CSV files. And [Views Bulk Operations](http:&#47;&#47;drupal.org&#47;project&#47;views_bulk_operations)
  would only let you set the stock level to the same value across a range of products.
  \r\n"
date: '2010-08-29 18:44:31 +0800'
categories:
- Uncategorized
tags:
- Drupal
- Ubercart
comments:
- id: 4673
  author: Will
  author_email: will@dashwood.me.uk
  author_url: ''
  date: '2010-08-30 20:36:31 +0800'
  date_gmt: '2010-08-31 01:36:31 +0800'
  content: Hi Ram! I stumbled across Ubercart Bulk Stock Updater last night, well
    done on your first published module! I was wondering if you&#39;d consider adding
    the ability to edit the product sell price as well as stock? That&#39;s a feature
    my client is requesting and one which would be very valuable for a lot of users.
    I&#39;ve had a look at the module but before I go hacking it I thought I&#39;d
    ask :)
- id: 4674
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2010-08-30 21:13:01 +0800'
  date_gmt: '2010-08-31 02:13:01 +0800'
  content: Hey Will, thanks for using it. Yeah, I&#39;ve thought about adding price-editing
    before. Let me have a look at it and get back to you.
- id: 4675
  author: Will
  author_email: will@dashwood.me.uk
  author_url: ''
  date: '2010-08-31 11:10:40 +0800'
  date_gmt: '2010-08-31 16:10:40 +0800'
  content: Excellent news, would be great if you can. Let me know either way :)
- id: 4676
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2010-09-03 10:56:12 +0800'
  date_gmt: '2010-09-03 15:56:12 +0800'
  content: Hey Will, I&#39;ve committed updates to the module which allow for editing
    the selling price as well as the stock threshold. These should be available via
    the development snapshot release (<a href="http:&#47;&#47;drupal.org&#47;node&#47;896762"
    rel="nofollow">http:&#47;&#47;drupal.org&#47;node&#47;896762<&#47;a>) within a
    day. Let me know if it works for you.
- id: 4677
  author: Will
  author_email: will@dashwood.me.uk
  author_url: ''
  date: '2010-09-06 13:18:16 +0800'
  date_gmt: '2010-09-06 18:18:16 +0800'
  content: That was quick! I&#39;ve downloaded the module but with any version I&#39;ve
    tried I go to admin&#47;store&#47;stock and it doesn&#39;t list any products at
    all. Could it be conflicting with another module? Anything I can do to debug?
- id: 4678
  author: Will
  author_email: will@dashwood.me.uk
  author_url: ''
  date: '2010-09-06 16:47:07 +0800'
  date_gmt: '2010-09-06 21:47:07 +0800'
  content: Sorted, I just hadn&#39;t enabled stock on any product. This could be a
    bit of an issue as my customer doesn&#39;t use stock control but I&#39;ll have
    a look at working around that. Would be good to make the module flexible enough
    to be a stock updater or price updater or both.
- id: 4679
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2010-09-07 20:38:43 +0800'
  date_gmt: '2010-09-08 01:38:43 +0800'
  content: That&#39;s a fair point. I&#39;ll look into it.
- id: 4680
  author: Mullumc
  author_email: mullumc@gmail.com
  author_url: ''
  date: '2010-09-20 05:33:51 +0800'
  date_gmt: '2010-09-20 10:33:51 +0800'
  content: Hi Ram<br><br>Thanks for the module.  The issue I have is that I am importing
    thousands of products.  I then need to bulk set them to active so that I can update
    the stock levels.  Do you know how to do this or can you add it to your module.  Thanks.
- id: 4681
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2010-09-28 16:33:45 +0800'
  date_gmt: '2010-09-28 21:33:45 +0800'
  content: Hey Mullumc, if you wish to perform the same action in bulk mode on all
    the products there are probably other modules out there which already do this.
    I&#39;m not sure but the Views Bulk Operations module (<a href="http:&#47;&#47;drupal.org&#47;project&#47;views_bulk_operations"
    rel="nofollow">http:&#47;&#47;drupal.org&#47;project&#47;views_bulk_operations<&#47;a>)
    may be of use.
- id: 4682
  author: Inventory Control
  author_email: potchiemail@gmail.com
  author_url: http://www.pbsapos.com.au/inventorycontrol.aspx
  date: '2010-10-15 14:35:05 +0800'
  date_gmt: '2010-10-15 19:35:05 +0800'
  content: i suggest to get some more test the system, this is very critical as for
    my opinion.
- id: 4683
  author: Jon
  author_email: jon@prairiedesignsllc.com
  author_url: ''
  date: '2010-10-19 20:32:43 +0800'
  date_gmt: '2010-10-20 01:32:43 +0800'
  content: Thank-you so much for this module.  It is one of the very few options that
    really works for updating attributes with sub-skus.  It doesn&#39;t seem to handle
    the stocks well for attributes (at least in the first 5min I&#39;ve played with
    it).  Anyone else have problems with stocks on sub-skus
- id: 4685
  author: Sepehr Lajevardi
  author_email: lajevardi@gmail.com
  author_url: http://sepehr.ws/
  date: '2010-10-31 13:52:40 +0800'
  date_gmt: '2010-10-31 18:52:40 +0800'
  content: Thanks for your great contribution.
- id: 4714
  author: Epsell Com
  author_email: epsell.com@gmail.com
  author_url: http://www.epsell.com/
  date: '2011-07-09 15:43:00 +0800'
  date_gmt: '2011-07-09 15:43:00 +0800'
  content: "<p>i downloaded it does it work ok for you though?<&#47;p>\n"
- id: 4715
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2011-07-11 20:31:00 +0800'
  date_gmt: '2011-07-11 20:31:00 +0800'
  content: "<p>Hey I actually haven't used this module in a while so I'm not sure.
    Though I don't see why it wouldn't still work.<&#47;p>\n"
- id: 4746
  author: iapplecenter
  author_email: ''
  author_url: http://twitter.com/iapplecenter
  date: '2011-11-07 14:59:00 +0800'
  date_gmt: '2011-11-07 14:59:00 +0800'
  content: "<p>good<&#47;p>\n"
- id: 4751
  author: Myfr34150
  author_email: myfr34150@gmail.com
  author_url: ''
  date: '2012-01-03 18:31:00 +0800'
  date_gmt: '2012-01-03 18:31:00 +0800'
  content: |
    <p>Hello
    Is this going to be ported to D7?thanks<&#47;p>
- id: 4752
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2012-01-04 22:46:00 +0800'
  date_gmt: '2012-01-04 22:46:00 +0800'
  content: "<p>Hi, I'm no longer actively working on this module and am looking for
    a new maintainer.<&#47;p>\n"
---
On a recent Drupal project I was asked to build an interface whereby administrators could easily bulk-edit the stock levels for all their [Ubercart](http://www.ubercart.org/) products. I had a look on the web for something which already did this. I found [Multiple stock edit](http://www.ubercart.org/contrib/5411) - which only really worked with Ubercart 1.x and Drupal 5 (not to mention that it used the standard Drupal form submission mechanism, thus making it difficult to quickly bulk-edit large numbers of items). [Stock and Price updater](http://www.ubercart.org/contrib/12428) only worked by importing CSV files. And [Views Bulk Operations](http://drupal.org/project/views_bulk_operations) would only let you set the stock level to the same value across a range of products.

So I decided to build [Bulk Stock Updater](http://drupal.org/project/uc_bulk_stock_updater). It not only allows you to bulk-edit the stock levels for your entire product catalogue but uses AJAX for the editing process, thus allowing you to quickly change the values across multiple items without having to wait for page reloads. You can view your product catalogue one page at a time (the number of items per page being configurable via a variable) or you can view all the items on a single page. In the single-page view there is a Javascript-powered filter field which you can use to filter the list down to only show the items you want to edit.

I think there is scope for extending this module to allow bulk-editing of prices and perhaps other product attributes too. The AJAX-powered updating really does speed things up compared to normal form submissions.

Finally, I'm especially pleased as it's my first published module on Drupal.org :)