---
layout: post
published: true
title: SMTP server not working for Yahoo UK accounts
excerpt: "I've had a [Yahoo!](http:&#47;&#47;www.yahoo.com&#47;) **.co.uk** email
  address for donkeys years. And I've always been thankful for having POP access to
  this account so that I can work with it from within my [desktop mail client](http:&#47;&#47;www.mozilla.com&#47;thunderbird&#47;).\r\n\r\nAlthough
  I check my email every day I don't have the need to send messages that often. But
  this week I tried to send one and it seemed that the SMTP server didn't like the
  password I was supplying it. After checking and double-checking my login credentials
  and still not getting it to work I fired up my browser and logged in at [http:&#47;&#47;mail.yahoo.com&#47;](http:&#47;&#47;mail.yahoo.com&#47;)
  and checked out the server settings for POP and SMTP access:\r\n\r\n"
date: '2008-07-12 12:53:28 +0800'
categories:
- Uncategorized
tags:
- Yahoo
- UK
- Email
- SMTP
comments: []
---
I've had a [Yahoo!](http://www.yahoo.com/) **.co.uk** email address for donkeys years. And I've always been thankful for having POP access to this account so that I can work with it from within my [desktop mail client](http://www.mozilla.com/thunderbird/).

Although I check my email every day I don't have the need to send messages that often. But this week I tried to send one and it seemed that the SMTP server didn't like the password I was supplying it. After checking and double-checking my login credentials and still not getting it to work I fired up my browser and logged in at [http://mail.yahoo.com/](http://mail.yahoo.com/) and checked out the server settings for POP and SMTP access:

![Yahoo! .co.uk email account POP and SMTP settings](http://farm4.static.flickr.com/3233/2661043976_6a5f4bea01_o.png)  


These were the same as they had been years ago when I'd first setup my mail client to access my account. So I couldn't understand why it wasn't working anymore.

Then after some searching I found the answer in (ironically enough) a [Yahoo! answers posting](http://answers.yahoo.com/question/index?qid=20080415013319AAGn6vV):

> I am now managing to send a few emails using smtp.mail.yahoo.co.uk (SSL port 465). POP3 (through pop.mail.yahoo.com) still seems to be working fine. So it appears the SMTP service is just very poor rather than removed. I guess the non-plus service is just even more minus than before; especially the free SMTP/POP that UK users have but has been denied US users for some time.

And then further down the same post...

> I've just changed from SSL to 'TLS if available', and port 587\. This is on smtp.mail.yahoo.co.uk. Suddenly it is working fairly reliably and fast after days of complete rubbish. I used to find smtp.mail.yahoo.com slightly better than .co.uk, but now it seems to be dead. Maybe Yahoo have tightened up their 'free' rules, and now provide nothing for .com, and no SSL for .co.uk. If so, it would have been helpful to tell us.

I tried out these settings and now everything is working again. It's just disappointing to see that Yahoo! haven't communicated this properly with their customers. And this isn't the first time they've demonstrated [poor customer service](http://www.ahfx.net/weblog.php?article=107).

Anyway, I hope the above information helps anybody who was stuck on the same issue as me.
