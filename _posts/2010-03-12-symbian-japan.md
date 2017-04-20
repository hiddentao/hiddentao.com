---
layout: portfolio
status: publish
published: false
title: Symbian Japan
author:
  display_name: ram
  login: ram
  email: ram@hiddentao.com
  url: http://www.hiddentao.com/about/contact
author_login: ram
author_email: ram@hiddentao.com
author_url: http://www.hiddentao.com/about/contact
excerpt: This project involved translating the existing Symbian website ([symbian.org](http://symbian.org/jp))
  into Japanese whilst enabling support for future languages to be easily added.
wordpress_id: 1080
wordpress_url: http://www.hiddentao.com/?post_type=portfolio&#038;p=1080
date: '2010-03-12 12:15:52 +0800'
date_gmt: '2010-03-12 12:15:52 +0800'
categories: []
tags: []
comments: []
---
<p>This project involved translating the existing Symbian website ([symbian.org](http:&#47;&#47;symbian.org&#47;jp)) into Japanese whilst enabling support for future languages to be easily added. Every single translate-able element on the website had to be worked on and it had to work properly on mobile devices too. Content translation was provided by the Symbian team and I was responsible for making the necessary changes to the codebase.</p>
<p>The original English website was built in Drupal with a heavily customised theme. It contained dynamic Flash content (including the use of [sIFR](http:&#47;&#47;en.wikipedia.org&#47;wiki&#47;Scalable_Inman_Flash_Replacement)) and utilised a number of *Views* and *Blocks* as well as various different *Node* types. I was able to utilise [i18n](http:&#47;&#47;drupal.org&#47;project&#47;i18n) and other associated modules to enable translation support. Beyond this I had to hack a few modules and the theme with custom code to ensure translation worked seamlessly with the existing website structure and content. These changes included updating the [Trigger](http:&#47;&#47;drupal.org&#47;handbook&#47;modules&#47;trigger) module to be locale-aware amongst other code changes. I also ensured made it easy to create language and platform-specific CSS and Javascript with a simple selection algorithm.</p>
<p>Key features of project:</p>
<p>*  Use of Views, CCK, i18n and associated modules, and numerous other modules.<br />
*  Extensive front-end and back-end development:<br />
*  Templating, working with PHP, XHTML, CSS and Javascript.<br />
*  Core module improvement (e.g. locale-aware Triggers).<br />
*  Integrating sIFR (Flash) content for page headings and navigation menu.<br />
*  Liaising with client, including requirements analysis and co-ordination of development tasks.</p>
<p>**Note: the Symbian Foundation has since shut down, and thus the website is no longer available**.</p>
