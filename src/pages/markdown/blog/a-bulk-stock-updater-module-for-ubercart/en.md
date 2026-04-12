---
title: A bulk stock updater module for Ubercart
date: '2010-08-29'
summary: "On a recent Drupal project I was asked to build an interface whereby administrators could easily bulk-edit the stock levels for all their [Ubercart](https://web.archive.org/web/20250907021100/https://www.ubercart.org/) products. I had a look on the web for something which already did this. I found [Multiple stock edit](no-longer-valid) - which only really worked with Ubercart 1.x and Drupal 5 (not to mention that it used the standard Drupal form submission mechanism, thus making it difficult to quickly bulk-edit large numbers of items). [Stock and Price updater](https://web.archive.org/web/20170924155109/http://www.ubercart.org:80/contrib/12428) only worked by importing CSV files. And [Views Bulk Operations](https://web.archive.org/web/20251205045431/https://www.drupal.org/project/views_bulk_operations) would only let you set the stock level to the same value across a range of products. \r\n"
tags:
  - Drupal
  - Ubercart
---
On a recent Drupal project I was asked to build an interface whereby administrators could easily bulk-edit the stock levels for all their [Ubercart](https://web.archive.org/web/20250907021100/https://www.ubercart.org/) products. I had a look on the web for something which already did this. I found [Multiple stock edit](no-longer-valid) - which only really worked with Ubercart 1.x and Drupal 5 (not to mention that it used the standard Drupal form submission mechanism, thus making it difficult to quickly bulk-edit large numbers of items). [Stock and Price updater](https://web.archive.org/web/20170924155109/http://www.ubercart.org:80/contrib/12428) only worked by importing CSV files. And [Views Bulk Operations](https://web.archive.org/web/20251205045431/https://www.drupal.org/project/views_bulk_operations) would only let you set the stock level to the same value across a range of products.

So I decided to build [Bulk Stock Updater](https://web.archive.org/web/20151229122753/https://www.drupal.org/project/uc_bulk_stock_updater). It not only allows you to bulk-edit the stock levels for your entire product catalogue but uses AJAX for the editing process, thus allowing you to quickly change the values across multiple items without having to wait for page reloads. You can view your product catalogue one page at a time (the number of items per page being configurable via a variable) or you can view all the items on a single page. In the single-page view there is a Javascript-powered filter field which you can use to filter the list down to only show the items you want to edit.

I think there is scope for extending this module to allow bulk-editing of prices and perhaps other product attributes too. The AJAX-powered updating really does speed things up compared to normal form submissions.

Finally, I'm especially pleased as it's my first published module on Drupal.org :)
