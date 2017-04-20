---
layout: page-code
title: CodeIgniter utilities
categories:
- Uncategorized
tags:
- CodeIgniter
comments: []
---
This page contains some useful plugins, libraries and helpers I've written for the [CodeIgniter](http://codeigniter.com/) MVC framework. All code is licensed under GPL 3.

* [MY_Session](http://www.hiddentao.com/wp-content/uploads/2010/05/MY_Session.zip) - A custom version of the CodeIgniter session library. This incorporates some fixes and improvements contributed by users on the CodeIgniter forum as well as some of my own ideas. Specifically the following:  
* A new configuration value - `sess_persistent_cookie` - is used to set whether cookies should persist across browser instances. This value can overridden on a per-session basis.  
* The session id can be updated at any point (even if the normal update interval hasn't elapsed). This is recommended just after a user has logged in to avoid session-hijacking attacks.  
* Session expiration handling is improved. Setting expiry time to 0 will result in a non-expiring cookie (unless of course `sess_persistent_cookie` is set to FALSE).