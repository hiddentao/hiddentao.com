---
title: Getting page tags to show on your Wordpress pages
date: '2010-03-24'
summary: "A number of users of Page Tagger have emailed in asking how to get their page tags showing on their pages. So I thought I'd put up a short blog post on how to do this.\r\n\r\nOnce you've happily tagged your pages using Page Tagger you need to edit your theme's `page.php` template. This is the template which gets used by Wordpress whenever you view a static page (as opposed to a blog post) on your site.\r\n"
tags:
  - Wordpress
  - Page Tagger
---
A number of users of [Page Tagger](no-longer-valid) have emailed in asking how to get their page tags showing on their pages. So I thought I'd put up a short blog post on how to do this.

Once you've happily tagged your pages using Page Tagger you need to edit your theme's `page.php` template. This is the [template which gets used by Wordpress](no-longer-valid) whenever you view a static page (as opposed to a blog post) on your site.
<a id="more"></a><a id="more-771"></a>
Inside this file you should have a section resembling ["The Loop"](http://codex.wordpress.org/The_Loop):

```php
<? php if (have_posts()) : while (have_posts()) : the_post(); ? >
...

```

Inside this section you need to place a call to the `the_tags()` template method. This will output your page tags at that spot with some default formatting. Read the [documentation for the_tags()](http://codex.wordpress.org/Template_Tags/the_tags) for information on changing how it works. You can also use alternative functions such as `get_the_tags()`or `get_the_tag_list()` to achieve a similar effect.

If for some reason your page tags still aren't showing on your page then please get in touch as it maybe a bug in the Page Tagger plugin.

