---
title: Creating an archives page like mine
date: '2009-09-22'
summary: "A plugin user recently wrote in asking me how to create an [archives page like mine](&#47;archives&#47;). So I thought I'd give everyone the lowdown on how to do this in this post.\r\n"
tags:
  - Wordpress
---
A plugin user recently wrote in asking me how to create an [archives page like mine](/archives/). So I thought I'd give everyone the lowdown on how to do this in this post.

First of all, there is no search box on my site just now because 1) I didn't think I had enough content to warrant this, and 2) I tag all the content I create quite extensively. So my archives view doesn't handle search results. Nor does it handle querying for specific dates, categories or authors. But I do handle querying for tags. Secondly, all the relevant template files from my theme for making this work can be found at the [bottom](#files).

## Initial archives view

From the [Wordpress theme developer documentation](http://codex.wordpress.org/Theme_Development#Theme_Template_Files) we know that we should provide an **archive.php** template file in our theme folder to handle the viewing of blog archives. I've implemented this for my theme. It gets shown when you click the *Archives* navigational button at the top of the page. In order for Wordpress to know that it needs to show this page when you visit */archives* I have the following placed in my template's **page.php**:

```php
if ('archives' == SITE_SECTION)
{
  require_once('archive.php');
  exit;
}
```

*(The ``SITE_SECTION`` constant tells me which top-level site-section the user is currently in. This is linked to how I generate the navigational links at the top - the code for this is in my theme's functions.php*).

I then create a publicly-viewable static page called 'Archives' and leave it empty, ensuring that its URL path is set to */archives*. Now whenever someone visits this URL they get shown the contents of the **archive.php** template.

Inside **archive.php** I use the ``wp_tag_cloud()`` method to display a cloud of the most popular tags. I then have the following section of code to display all the posts, grouped by month:

```php
// get all posts in descending date order
query_posts('posts_per_page=10000&orderby=date&order=DESC&post_type=post');

$list_of_posts = array();

// split entries into blog posts and static pages
while (have_posts())
{
  the_post();
  global $post;
  $list_of_posts[] = $post;
}

// show them
require_once('archive_show_posts_by_month.inc.php');
```

The **archive_show_posts_by_month.inc.php** script does exactly what it says on the tin. It takes the ``$list_of_posts`` array and outputs the posts, grouped by month. Now you might wonder why I'm calling ``query_posts`` and performing a database fetch. It's because by default Wordpress has only fetched the contents of the static page located at */archives* since that's what it thinks is being displayed to the user. So in this code I fetch all the blog posts from the database (if you have more than 10,000 blog posts then by all means use a larger number in the query).

So that's the display of the [initial archives page](/archives/) done. Now for the tag-specific archives ([example](/archives/tag/code/))...

## Archives for a given tag

At the top of **archive.php** I have the following code:

```php
global $wp_query;
$qry_tag_name = $wp_query->query_vars['tag'];
if ('' != $qry_tag_name)
{
  require_once('archive_results.php');
  exit;
}
```

When you try to view the archives for a specific tag Wordpress will automatically invoke the **archive.php** template. This code then checks to see if you're viewing a specific tag rather than viewing the initial archives page. If so, it invokes the **archive_results.php** template. Inside this template we have the following code:

```php
// get proper tag name
$tag_name = single_tag_title("", false);

$list_of_posts = array();
$list_of_pages = array();

// split entries into blog posts and static pages
while (have_posts()) :

  the_post();
  global $post;
  if ('post' === $post->post_type)
  {
    $list_of_posts[] = $post;
  }
  else if ('page' === $post->post_type)
  {
   $list_of_pages[] = $post;
  }

endwhile;

?>

<?php if have_posts(): ?>

  <div class="results_pages">
    All pages tagged **'<?php echo $tag_name ?>'**:

    <div class="indented">
      <?php require_once('archive_show_pages.inc.php'); ?>
    </div>

  </div>

  <div class="results_posts">

    All blog posts tagged **''**, from newest to oldest:

    <div class="indented">
      <?php require_once('archive_show_posts_by_month.inc.php'); ?>
    </div>

  </div>

<?php else: ?>

  No posts tagged **'<?php echo $tag_name ?>'** were found.

<?php endif; ?>

```

This code splits the list of entries (already loaded by Wordpress since you're viewing tag-specific archives) into static pages and blog posts. It then calls **archive_show_pages.inc.php** and **archive_show_posts_by_month.inc.php** to display each set of entries one after another.

## Files

Template files from my theme: [ZIP file](/downloads/hiddentao_archives.zip).

