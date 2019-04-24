---
title: RandomHello plugin - 'Hello' in different languages
date: '2008-08-09'
summary: "I've always thought it was cool that Flickr would say \"Hello\" to you in a different language each time you logged in. So a couple of days ago I decided to code up a simple Wordpress plugin which would allow me (and hopefully others!) to do the same on any page or post. And the result is the [RandomHello](&#47;code&#47;wordpress-randomhello-plugin&#47; \"RandomHello plugin page\") plugin. The plugin is currently active on this site and you can see it in action on the [homepage](&#47;). \r\n\r\n"
tags:
  - Wordpress
  - RandomHello
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
