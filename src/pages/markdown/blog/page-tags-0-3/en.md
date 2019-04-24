---
title: Page-Tags 0.3
date: '2009-09-08'
summary: ''
tags:
  - Wordpress
  - Page Tagger
---
This is a new version of [Page-Tags](/code/wordpress-page-tags-plugin/) that works with Wordpress 2.8.4.

Under the previous version of Page-Tags (0.2) upgrading to Wordpress 2.8 may have caused your page tags to no longer appear in tag clouds. To rectify this install the latest version of the plugin and then re-save (edit and save without making any changes) all your pages. This will correct the post counts for each tag, which in turn will cause your page tags to show up again in tag clouds.

*Note: Page-Tags 0.3 is not backwards compatible with Wordpress 2.7, so if you're running the older version of Wordpress please stick to using Page-Tags 0.2.*

**Update (Sep8):** The plugin has been [renamed to Page Tagger](/archives/2009/09/08/page-tags-is-now-known-as-page-tagger/). And it requires Wordpress 2.8.4 to function correctly (thanks [Leo](http://www.acumendevelopment.net/)).

**Update (Sep15):** Instead of editing and re-saving all your pages to update the post count you can simply run the following query in your MySQL database (replace `wp_` with the appropriate prefix for your database tables):

`UPDATE wp_term_taxonomy t set count=(SELECT COUNT(*) FROM wp_term_relationships r, wp_posts p WHERE p.ID = r.object_id AND (p.post_type = 'post' OR p.post_type='page') AND r.term_taxonomy_id = t.term_taxonomy_id)`
