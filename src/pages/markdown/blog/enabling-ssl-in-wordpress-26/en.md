---
title: Enabling SSL in Wordpress 2.6
date: '2008-07-28'
summary: "Yesterday I upgraded this site to [Wordpress 2.6](http:&#47;&#47;wordpress.org&#47;development&#47;2008&#47;07&#47;wordpress-26-tyner&#47;). All in all, everything went smoothly. But then I noticed that the *Admin-SSL* plug-in was no longer working, which meant that I couldn't force my admin sessions (i.e. ``wp-admin&#47;`` stuff) to be accessible only over SSL. An excerpt from the [plug-in's homepage](http:&#47;&#47;www.kerrins.co.uk&#47;blog&#47;admin-ssl&#47; \"Admin-SSL homepage\") confirms this:\r\n\r\n> \"Admin SSL 1.1 will not work with WordPress 2.6 due to the changes they have made, attempting to include their own SSL features.  I have tried them, and they only work with Private SSL, you cannot secure individual URLs, and the feature that allows you only to secure the login page does not work (for me, anyway).  So I'll have to update Admin SSL to work with the new WordPress - perhaps I should ask them to include my code in 2.7!\"\r\n\r\n"
tags:
  - Wordpress
  - Admin-SSL
  - SSL
---
Yesterday I upgraded this site to [Wordpress 2.6](http://wordpress.org/development/2008/07/wordpress-26-tyner/). All in all, everything went smoothly. But then I noticed that the *Admin-SSL* plug-in was no longer working, which meant that I couldn't force my admin sessions (i.e. ``wp-admin/`` stuff) to be accessible only over SSL. An excerpt from the [plug-in's homepage](http://www.kerrins.co.uk/blog/admin-ssl/ "Admin-SSL homepage") confirms this:

> "Admin SSL 1.1 will not work with WordPress 2.6 due to the changes they have made, attempting to include their own SSL features. I have tried them, and they only work with Private SSL, you cannot secure individual URLs, and the feature that allows you only to secure the login page does not work (for me, anyway). So I'll have to update Admin SSL to work with the new WordPress - perhaps I should ask them to include my code in 2.7!"

I don't need the fine-grained control that *Admin-SSL* provides. I just need something that ensures that whenever I'm logging into the admin section or viewing admin pages it's done over an SSL connection. After searching the web for answers I found a [post by Ryan Boren](http://boren.nu/archives/2008/07/14/ssl-and-cookies-in-wordpress-26/) on how to get the new built-in SSL support working.

If you want to force all admin sessions to be over SSL, add the following to your ``wp-config.php``:

```php
define('FORCE_SSL_ADMIN', true);
```

If you only want to force the logging-in process to be over SSL but not the rest of the admin pages then instead add this to your ``wp-config.php``:

```php
define('FORCE_SSL_LOGIN', true);
```

And in order to ensure that session cookies are truly secure you should make sure the following ``define``s in ``wp-config.php`` are set to sufficiently random and unique values:

```php
define('AUTH_KEY', ‘put your unique phrase here’);  
define('SECURE_AUTH_KEY', ‘put your unique phrase here’);  
define('LOGGED_IN_KEY', ‘put your unique phrase here’);
```

You can use [http://api.wordpress.org/secret-key/1.1/](http://api.wordpress.org/secret-key/1.1/) to obtain three unique, randomly-generated keys which you can just copy-and-paste into your ``wp-config.php``.

This all seems surprisingly simple, but it does work. If you want more technical details then I seriously recommend reading [Ryan's post](http://boren.nu/archives/2008/07/14/ssl-and-cookies-in-wordpress-26/) as a starter.
