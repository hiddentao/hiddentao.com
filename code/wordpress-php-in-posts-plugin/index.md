---
layout: page-code
title: PHP-in-Posts
tags:
- PHP-in-Posts
- Wordpress
comments: []
---
PHP-in-Posts is a [Wordpress](http://www.wordpress.org/ "Goto Wordpress homepage") plugin which allows you to include PHP code within your blog entries - this includes blog posts, comments and pages. The PHP code gets executed and the resulting output (if any) gets included in the post's content. On the plugin options page you can specify the minimum user permission level required in order to use PHP code within a post.

This plugin requires at least Wordpress 2.3. It has been tested on upto Wordpress 3.1.3.

License: [GPL 3](http://www.gnu.org/licenses/gpl.txt "GNU General Public License").

## Installation ## {#installation}

1. [Download PHP-in-Posts]([phpx:SITE_URI]/downloads/wordpress-php-in-posts-plugin-0.3.zip).  
2. Unzip it into your Wordpress `plugins` folder such that the plugin files are at: `wp-content/plugins/php-in-posts/...`  
3. Enable the plugin within your blog's administration options.  
4. All done!

## Syntax ## {#syntax}

To include PHP code within your posts, simply wrap the code within a [phpx] tag. For example, the following entry...

```
This is the year [phpx]echo date('Y');[/phpx].
```

...will produce...

```
This is the year [phpx]echo date('Y');[/phpx].
```

You can even include code which spans multiple lines. For example, the following entry...

```
[phpx]  

echo 'Your IP address is ';  

echo $_SERVER['REMOTE_ADDR'];  

[/phpx]  
```

...will produce...

```
Your IP address is
192.234....  
```

Additionally, if you simply wish to echo the value of a `global` variable or constant there is a short-hand format you can use. For example:

```
The database for this blog resides on [phpx:DB_HOST].
```

Pre-defined global variables - e.g. `$_SERVER[..]` are not currently supported in this short-hand syntax.

## Options ##   {#options}

On the PHP-in-Posts options page in the administration interface you can set the minimum user level required to include PHP code in entries. If a user's level doesn't meet the minimum value then the PHP-in-Posts plug-in will not process their entries.

Since allowing users to execute arbitrary PHP code within their entries is potentially dangerous, the default level is set to the highest value according to the available user roles (usually 'Administrator').
