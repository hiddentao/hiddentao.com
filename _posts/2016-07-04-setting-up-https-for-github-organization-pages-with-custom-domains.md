---
layout: post
published: true
title: Setting up HTTPS for Github organization pages with custom domains
excerpt: "_Thanks to Robin Winslow for the [original post](https:&#47;&#47;robinwinslow.uk&#47;2016&#47;02&#47;13&#47;free-https-custom-hosting&#47;)_.\r\n\r\nGithub
  Organization pages are awesome, but they do not support HTTPS, presumably because
  doing so would require Github to serve up your domain-specific SSL certificate for
  incoming requests - which would be a real pain for them to manage.\r\n\r\nRobin
  Winslow has written a great [tutorial](https:&#47;&#47;robinwinslow.uk&#47;2016&#47;02&#47;13&#47;free-https-custom-hosting&#47;)
  which explains how get around this limitation by also setting up Cloudflare account
  and using that to \"layer on\" SSL - all for free. \r\n\r\nMy requirements were
  slightly different to Robin's, in that I needed to set up an apex domain (i.e. `mydomain.com`)
  rather than a subdomain, as Robin does. Here is the process I followed...\r\n"
date: '2016-07-04 09:55:06 +0800'
date_gmt: '2016-07-04 08:55:06 +0800'
categories:
- Uncategorized
tags:
- SSL
- Github
- Cloudflare
- Hosting
comments: []
---

_Thanks to Robin Winslow for the [original post](https://robinwinslow.uk/2016/02/13/free-https-custom-hosting/)_.

Github Organization pages are awesome, but they do not support HTTPS, presumably because doing so would require Github to serve up your domain-specific SSL certificate for incoming requests - which would be a real pain for them to manage.

Robin Winslow has written a great [tutorial](https://robinwinslow.uk/2016/02/13/free-https-custom-hosting/) which explains how get around this limitation by also setting up Cloudflare account and using that to "layer on" SSL - all for free.

My requirements were slightly different to Robin's, in that I needed to set up an apex domain (i.e. `mydomain.com`) rather than a subdomain, as Robin does. Here is the process I followed...  

_Note: Replace `myorg` with your organization name in the instructions below_.

## 1. Setup Github organization repository

Create a new Github organization, e.g. `myorg`. Your organizations repositories will from now on be visible at **https://github.com/myorg**.

Now create a public repository within the organization named `myorg.github.io`. Commit an `index.html` file to this repo. You should now be able to view your site at **https://myorg.github.io**.

Go into the settings for the repository and set the _Custom Domain_ to `myorg.com`.

## 2. Setup Cloudflare

Sign up for a Cloudflare account and setup your DNS **A** records such that `myorg.com` point to Github's IP addresses: `192.30.252.153`, `192.30.252.154`:

[![](https://c2.staticflickr.com/8/7416/27796197220_1bc14135b4.jpg)](https://www.flickr.com/photos/91055277@N00/27796197220/)

If you like you can also setup records for the `www` subdomain pointing to the same IP addresses.

Go into the Crypto tab and ensure **Flexible** is selected as the SSL setting.

[](https://www.flickr.com/photos/91055277@N00/27796197220/)[![](https://c2.staticflickr.com/8/7302/27796197160_d4c0b62c89_z.jpg)](https://www.flickr.com/photos/91055277@N00/27796197160/)

Finally, let's setup page rules to ensure all HTTP traffic is auto-redirected to HTTP.

[](https://www.flickr.com/photos/91055277@N00/27796197160/)[![](https://c2.staticflickr.com/8/7403/27463332504_52bcfb0f37_z.jpg)](https://www.flickr.com/photos/91055277@N00/27463332504/)

Create another rule like the above, except set the URL to `http://*myorg.com`. This will ensure all calls to the base domain (i.e. without a URL path) are also auto-redirected to HTTPS.

## 3. All done!

After a few minutes/hours you should be able to access your website at https://myorg.com. Try HTTP variants.

