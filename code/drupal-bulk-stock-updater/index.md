---
layout: page-code
title: Bulk Stock Updater
tags:
- Bulk Stock Updater
- Drupal
- PHP
comments: []
---
Bulk Stock Updater is a [Ubercart](http://www.ubercart.org/) extension module which lets you easily bulk-edit stock levels for all your products. It displays a page similar to the *uc_stock* module's *Stock reports* page.

This module depends on **uc_stock 6.x-2.0+**.

Drupal.org project page: [link](http://www.drupal.org/project/uc_bulk_stock_updater "Goto the drupal.org project page for this module").

Github: [link](http://github.com/hiddentao/uc_bulk_stock_updater)

License: [GPL 2](http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt "GNU General Public License").

## Installation

1. [Download the latest version from the Drupal.org project page](http://www.drupal.org/project/uc_bulk_stock_updater).  
2. Unzip it into your `sites/all/modules` folder such that the module is at `sites/all/modules/uc_bulk_stock_updater/...`.  
3. Goto *Site building > Modules > List* and enable the *Bulk Stock Updater* module.  
4. All done!

## Usage

Once the module is enabled ensure you assign the _bulk update stock_ permission to the appropriate user roles.

Goto *Store administration > Stock > Bulk update* and you will see a paged list of your products ordered by SKU. At the bottom is a link to view all the products on one page if you wish.

You will notice that the stock value for each product is displayed as an input field. Once you change the value in an input field it will be automatically submitted to the server via AJAX (you will see a progress indicator while this happens). If any errors occur the field value will be reset to what it was originally and an error message will be shown.

You can refer to the CSS file in the module's folder to find out which styles need to be overridden in order to customize the look and feel.