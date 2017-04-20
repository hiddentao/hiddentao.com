---
layout: page-code
title: Open Graph meta tags
tags:
- Drupal
- OpenGraph
comments: []
---
**Open Graph meta tags** is a Drupal module which lets you easily add Open Graph protocol meta tags to all of your nodes.

Drupal.org project page: [link](http://www.drupal.org/project/opengraph_meta "Goto the drupal.org project page for this module").

Github: [link](http://github.com/hiddentao/opengraph_meta)

License: [GPL 2](http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt "GNU General Public License").

## Installation

1. [Download the latest version from the Drupal.org project page](http://www.drupal.org/project/opengraph_meta).  
2. Unzip it into your `sites/all/modules` folder such that the module is at `sites/all/modules/opengraph_meta/...`.  
3. Goto *Site building > Modules > List* and enable the *Open Graph meta tags* module.  
4. All done!

## Usage

By default Open Graph meta tags can be assigned to a node of any type. But you can restrict through the settings page (*Content management > Open Graph meta tags*). There are also permissions for the _opengraph_meta_ module which you can assign to the appropriate user roles.

Edit a node (of a type for which Open Graph meta tags are enabled) and you will see a collapsed section labelled *Open Graph meta tags* or something similar. Expand this section and you will see input fields for specifying the content of the meta tags. The thumbnail images shown are of images attached to the node (via image filefields) as well images specified as HTML IMG tags within the node body.