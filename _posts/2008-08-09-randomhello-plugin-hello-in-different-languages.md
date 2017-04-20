---
layout: post
published: true
title: RandomHello plugin - 'Hello' in different languages
excerpt: "I've always thought it was cool that Flickr would say \"Hello\" to you in
  a different language each time you logged in. So a couple of days ago I decided
  to code up a simple Wordpress plugin which would allow me (and hopefully others!)
  to do the same on any page or post. And the result is the [RandomHello](&#47;code&#47;wordpress-randomhello-plugin&#47;
  \"RandomHello plugin page\") plugin. The plugin is currently active on this site
  and you can see it in action on the [homepage](&#47;). \r\n\r\n"
date: '2008-08-09 15:41:52 +0800'
categories:
- Uncategorized
tags:
- Wordpress
- RandomHello
comments:
- id: 4725
  author: George
  author_email: george_zog@hotmail.com
  author_url: ''
  date: '2011-08-31 12:18:00 +0800'
  date_gmt: '2011-08-31 12:18:00 +0800'
  content: |
    <p>This is cool, i was looking for that but I am using blogger.&nbsp; Have you got any idea how can i make this work on a template like "awesome"?<&#47;p>

    <p>thanks<&#47;p>
- id: 4727
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2011-09-01 08:11:00 +0800'
  date_gmt: '2011-09-01 08:11:00 +0800'
  content: "<p>Sorry George, I've never really developed for Blogger so can't say.
    However if you look at the source code for this plugin you'll find that it's really
    really simple. So it should be fairly straightforward for someone to write an
    equivalent for blogger.<&#47;p>\n"
- id: 4728
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2011-09-01 08:11:00 +0800'
  date_gmt: '2011-09-01 08:11:00 +0800'
  content: "<p>Sorry George, I've never really developed for Blogger so can't say.
    However if you look at the source code for this plugin you'll find that it's really
    really simple. So it should be fairly straightforward for someone to write an
    equivalent for blogger.<&#47;p>\n"
- id: 4729
  author: George
  author_email: george_zog@hotmail.com
  author_url: ''
  date: '2011-09-01 20:13:00 +0800'
  date_gmt: '2011-09-01 20:13:00 +0800'
  content: "<p>Ok, I`ll give it a shot. Thank you.<&#47;p>\n"
- id: 4730
  author: George
  author_email: george_zog@hotmail.com
  author_url: ''
  date: '2011-09-01 20:13:00 +0800'
  date_gmt: '2011-09-01 20:13:00 +0800'
  content: "<p>Ok, I`ll give it a shot. Thank you.<&#47;p>\n"
---
I've always thought it was cool that Flickr would say "Hello" to you in a different language each time you logged in. So a couple of days ago I decided to code up a simple Wordpress plugin which would allow me (and hopefully others!) to do the same on any page or post. And the result is the [RandomHello](/code/wordpress-randomhello-plugin/ "RandomHello plugin page") plugin. The plugin is currently active on this site and you can see it in action on the [homepage](/).

I invoke the plugin in a fail-safe manner, i.e. if the plugin isn't active in my Wordpress installation then the homepage will just use the plain English "Hello". The code I used for this is:

```php
if (class_exists('RandomHello') && method_exists(RandomHello, 'hello'))  
{  
    RandomHello::hello();  
}  
else  
{  
    echo 'Hello';  
}  
```

All the 'hello' words in the plugin are grabbed from [http://www.wikihow.com/Say-Hello-in-Different-Languages](http://www.wikihow.com/Say-Hello-in-Different-Languages). The list of languages in the plugin isn't comprehensive. You can add more yourself to the array in the plugin code:

```php
class RandomHello  
{  
  private static $_Hellos = array(  
    "Afrikaans" => "Haai",  
    "Albanian" => "Tungjatjeta",  
    "A'Leamona" => "Tél-nìdõ",  
    "Armenian" => "Barev",  
    "Azerbaijani" => "Salam",  
    ...  
  );
}
```

If you do add some yourself or if you know of any more then let me know and I'll add them in to the main plugin distribution :)
