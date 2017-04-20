---
layout: page-code
title: RandomHello
tags:
- Wordpress
- RandomHello
comments: []
---
RandomHello is a [Wordpress](http://www.wordpress.org/ "Goto Wordpress homepage") plugin which provides you with methods to output 'Hello' in a random language.

This plugin requires PHP 5 and at least Wordpress 2.3. It has been tested on upto Wordpress 2.9.

License: [GPL 3](http://www.gnu.org/licenses/gpl.txt "GNU General Public License").

## Installation

1. [Download RandomHello](/downloads/wordpress-randomhello-plugin-0.1.zip).  
2. Unzip it into your Wordpress `plugins` folder such that the plugin files are at: `wp-content/plugins/random-hello/...`  
3. Enable the plugin within your blog's administration options.  
4. All done!

## Usage

Using RandomHello simply involves calling static methods on the `RandomHello` class. Full API documentation is provided within the installation package. Or if you wish, you can [view it online](/wp-content/plugins/random-hello/docs/ "RandomHello API documentation").

For example, this is how you might include it on a page:

```php
if (class_exists('RandomHello') && method_exists(RandomHello, 'hello')) :  

  $hello = RandomHello::get_hello();  

  echo $hello[1];  

else:  

  echo 'Hello';  

endif;  
```

## Options

This plugin does not have an administration interface.

