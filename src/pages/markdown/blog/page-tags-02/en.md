---
title: Page-Tags 0.2
date: '2009-04-03'
summary: "A <a href=\"http:&#47;&#47;www.hiddentao.com&#47;archives&#47;2009&#47;01&#47;18&#47;tag-your-wordpress-27-pages&#47;#comment-435\"> recently noticed<&#47;a> issue with the <a href=\"&#47;code&#47;wordpress-page-tags-plugin&#47;\">Page-Tags<&#47;a> plugin was that if you added a new tag when editing a page the tag didn't show up in the tag cloud sidebar widget. Only tags which were also associated with one or more blog posts were showing up in the tag cloud. I was seeing the same problem on my <a href=\"&#47;archives&#47;\">archives<&#47;a> page.\r\n\r\nThis issue has now been fixed in the <a href=\"&#47;code&#47;wordpress-page-tags-plugin&#47;\">latest version<&#47;a>. **To get the tags you've already added showing, install the updated plugin, and then edit and save the corresponding pages without making any changes**.\r\n"
tags:
  - Wordpress
  - Page Tagger
---
A [recently noticed](/archives/2009/01/18/tag-your-wordpress-27-pages/#comment-435) issue with the [Page-Tags](/code/wordpress-page-tags-plugin/) plugin was that if you added a new tag when editing a page the tag didn't show up in the tag cloud sidebar widget. Only tags which were also associated with one or more blog posts were showing up in the tag cloud. I was seeing the same problem on my [archives](/archives/) page.

This issue has now been fixed in the [latest version](/code/wordpress-page-tags-plugin/). **To get the tags you've already added showing, install the updated plugin, and then edit and save the corresponding pages without making any changes**.

For the developers among you, the cause of this bug is situated the callback function used to calculate how many posts are linked to a given tag:

```php
function _update_post_term_count( $terms ) {
  global $wpdb;

  foreach ( (array) $terms as $term ) {
    $count = $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $wpdb->term_relationships, $wpdb->posts WHERE $wpdb->posts.ID = $wpdb->term_relationships.object_id AND post_status = 'publish' AND post_type = 'post' AND term_taxonomy_id = %d", $term ) );
    $wpdb->update( $wpdb->term_taxonomy, compact( 'count' ), array( 'term_taxonomy_id' => $term ) );
  }
}
```

As you can see it only counts blog posts. Page-Tags 0.2 simply replaces this callback function with one which also counts pages.

*Note: The sidebar tag cloud widget will only show the top 45 tags (see the documentation for the wp_tag_cloud function).*
