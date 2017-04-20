---
layout: post
published: true
title: Page-Tags is now known as "Page Tagger"
date: '2009-09-08 15:20:58 +0800'
categories:
- Uncategorized
tags:
- Wordpress
- Page Tagger
comments:
- id: 4386
  author: Leo Brown
  author_email: leo@acumendevelopment.net
  author_url: http://www.acumendevelopment.net
  date: '2009-09-08 15:37:25 +0800'
  date_gmt: '2009-09-08 15:37:25 +0800'
  content: "<p>This plugin makes much more sense than the other attempts, such as
    Page Tags Plus, because it uses the native Wordpress taxonomy, meaning that tag
    clouds, etc, can be generated in the same way as for posts. Cheers Ramesh!<&#47;p>\n"
- id: 4420
  author: Stijn Debacker
  author_email: stijn@gonzales.be
  author_url: ''
  date: '2009-09-10 14:51:41 +0800'
  date_gmt: '2009-09-10 14:51:41 +0800'
  content: "<p>Hi, i'd love to get this plugin working! i've installed it(wordpress
    4.8.4) and the box is displayed but it seems that the javascript file isn't loaded!
    any idea what could cause this?<&#47;p>\n"
- id: 4422
  author: ram
  author_email: ram@hiddentao.com
  author_url: http://www.hiddentao.com/
  date: '2009-09-10 16:23:56 +0800'
  date_gmt: '2009-09-10 16:23:56 +0800'
  content: |
    <p>Hi Stijn, I see the following script tag get output when editing a page:<&#47;p>

    <p><pre>
    <script type='text&#47;javascript' src='http:&#47;&#47;www.hiddentao.com&#47;wp-content&#47;plugins&#47;page-tagger&#47;page-tags.js?ver=20081210'><&#47;script>
    <&#47;pre><&#47;p>
---
This is a new version of [Page-Tags](/code/wordpress-page-tags-plugin/) that works with Wordpress 2.8.4. Under the previous version of Page-Tags (0.2) upgrading to Wordpress 2.8 may have caused your page tags to no longer appear in tag clouds. To rectify this install the latest version of the plugin and then re-save (edit and save without making any changes) all your pages. This will correct the post counts for each tag, which in turn will cause your page tags to show up again in tag clouds. 

*Note: Page-Tags 0.3 is not backwards compatible with Wordpress 2.7, so if you're running the older version of Wordpress please stick to using Page-Tags 0.2.* 

**Update (Sep8):** The plugin has been [renamed to Page Tagger](/archives/2009/09/08/page-tags-is-now-known-as-page-tagger/). And it requires Wordpress 2.8.4 to function correctly (thanks [Leo](http://www.acumendevelopment.net/)). 

**Update (Sep15):** Instead of editing and re-saving all your pages to update the post count you can simply run the following query in your MySQL database (replace `wp_` with the appropriate prefix for your database tables):

```sql
UPDATE wp_term_taxonomy t set count=(SELECT COUNT(*) 
FROM wp_term_relationships r, wp_posts p 
WHERE p.ID = r.object_id AND (p.post_type = 'post' OR p.post_type='page') AND r.term_taxonomy_id = t.term_taxonomy_id)
```