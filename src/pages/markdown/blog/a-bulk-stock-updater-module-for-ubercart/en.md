---
title: A bulk stock updater module for Ubercart
date: '2010-08-29'
summary: "On a recent Drupal project I was asked to build an interface whereby administrators could easily bulk-edit the stock levels for all their [Ubercart](http:&#47;&#47;www.ubercart.org&#47;) products. I had a look on the web for something which already did this. I found [Multiple stock edit](http:&#47;&#47;www.ubercart.org&#47;contrib&#47;5411) - which only really worked with Ubercart 1.x and Drupal 5 (not to mention that it used the standard Drupal form submission mechanism, thus making it difficult to quickly bulk-edit large numbers of items). [Stock and Price updater](http:&#47;&#47;www.ubercart.org&#47;contrib&#47;12428) only worked by importing CSV files. And [Views Bulk Operations](http:&#47;&#47;drupal.org&#47;project&#47;views_bulk_operations) would only let you set the stock level to the same value across a range of products. \r\n"
tags:
  - Drupal
  - Ubercart
---
On a recent Drupal project I was asked to build an interface whereby administrators could easily bulk-edit the stock levels for all their [Ubercart](http://www.ubercart.org/) products. I had a look on the web for something which already did this. I found [Multiple stock edit](http://www.ubercart.org/contrib/5411) - which only really worked with Ubercart 1.x and Drupal 5 (not to mention that it used the standard Drupal form submission mechanism, thus making it difficult to quickly bulk-edit large numbers of items). [Stock and Price updater](http://www.ubercart.org/contrib/12428) only worked by importing CSV files. And [Views Bulk Operations](http://drupal.org/project/views_bulk_operations) would only let you set the stock level to the same value across a range of products.

So I decided to build [Bulk Stock Updater](http://drupal.org/project/uc_bulk_stock_updater). It not only allows you to bulk-edit the stock levels for your entire product catalogue but uses AJAX for the editing process, thus allowing you to quickly change the values across multiple items without having to wait for page reloads. You can view your product catalogue one page at a time (the number of items per page being configurable via a variable) or you can view all the items on a single page. In the single-page view there is a Javascript-powered filter field which you can use to filter the list down to only show the items you want to edit.

I think there is scope for extending this module to allow bulk-editing of prices and perhaps other product attributes too. The AJAX-powered updating really does speed things up compared to normal form submissions.

Finally, I'm especially pleased as it's my first published module on Drupal.org :)
