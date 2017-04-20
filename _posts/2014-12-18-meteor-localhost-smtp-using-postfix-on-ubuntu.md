---
layout: post
published: true
title: Meteor localhost smtp using Postfix on Ubuntu
excerpt: "For [Youlist](https:&#47;&#47;youlist.io) I had to setup Meteor to use a
  localhost SMTP server to send out all the emails. In this article I'm going to outline
  the Postfix and Meteor steps needed to get this running properly.\r\n\r\nI'm going
  to assume that you have your own domain - let's call it `mydomain.com`. We're going
  to set it up on a Ubuntu 14.04 64-bit server.\r\n"
date: '2014-12-18 13:33:08 +0800'
categories:
- Uncategorized
tags:
- SMTP
- Meteor
- Postfix
comments:
- id: 5085
  author: Sam
  author_email: kingkanadianer@gmail.com
  author_url: ''
  date: '2015-10-03 19:23:00 +0800'
  date_gmt: '2015-10-03 18:23:00 +0800'
  content: "<p>Awesome post! Thank you.<&#47;p>\n"
---
For [Youlist](https://youlist.io) I had to setup Meteor to use a localhost SMTP server to send out all the emails. In this article I'm going to outline the Postfix and Meteor steps needed to get this running properly.

I'm going to assume that you have your own domain - let's call it `mydomain.com`. We're going to set it up on a Ubuntu 14.04 64-bit server.  

## Setup Postfix

Install it:

```bash  
$ sudo apt-get install postfix  
```

Ensure `/etc/mailname` contains:

```  
mydomain.com  
```

Ensure `/etc/postfix/main.cf` contains:

```  
smtpd_banner = $myhostname ESMTP $mail_name (Ubuntu)  
biff = no  
append_dot_mydomain = no  
readme_directory = no

# TLS parameters  
smtpd_tls_cert_file=/etc/ssl/certs/ssl-cert-snakeoil.pem  
smtpd_tls_key_file=/etc/ssl/private/ssl-cert-snakeoil.key  
smtpd_use_tls=yes  
smtpd_tls_session_cache_database = btree:${data_directory}/smtpd_scache  
smtp_tls_session_cache_database = btree:${data_directory}/smtp_scache

smtpd_relay_restrictions = permit_mynetworks permit_sasl_authenticated defer_unauth_destination

myhostname = mydomain.com

virtual_alias_maps = hash:/etc/postfix/virtual  
alias_database = hash:/etc/aliases  
myorigin = /etc/mailname  
mydestination = mydomain.com, mail, localhost.localdomain, localhost  
relayhost =  
mynetworks = 127.0.0.0/8 [::ffff:127.0.0.0]/104 [::1]/128  
mailbox_size_limit = 0  
recipient_delimiter =  
inet_interfaces = all  
```

_(Note the instances of `mydomain.com` in the above file)._

Ensure `/etc/postfix/master.cf` contains:

```  
# ==========================================================================  
# service type private unpriv chroot wakeup maxproc command args  
# (yes) (yes) (yes) (never) (100)  
# ==========================================================================  
smtp inet n - n - - smtpd  
pickup unix n - n 60 1 pickup  
cleanup unix n - n - 0 cleanup  
qmgr unix n - n 300 1 qmgr  
tlsmgr unix - - n 1000? 1 tlsmgr  
rewrite unix - - n - - trivial-rewrite  
bounce unix - - n - 0 bounce  
defer unix - - n - 0 bounce  
trace unix - - n - 0 bounce  
verify unix - - n - 1 verify  
flush unix n - n 1000? 0 flush  
proxymap unix - - n - - proxymap  
proxywrite unix - - n - 1 proxymap  
smtp unix - - n - - smtp  
relay unix - - n - - smtp  
showq unix n - n - - showq  
error unix - - n - - error  
retry unix - - n - - error  
discard unix - - n - - discard  
local unix - n n - - local  
virtual unix - n n - - virtual  
lmtp unix - - n - - lmtp  
anvil unix - - n - 1 anvil  
scache unix - - n - 1 scache

maildrop unix - n n - - pipe  
flags=DRhu user=vmail argv=/usr/bin/maildrop -d ${recipient}

uucp unix - n n - - pipe  
flags=Fqhu user=uucp argv=uux -r -n -z -a$sender - $nexthop!rmail ($recipient)

ifmail unix - n n - - pipe  
flags=F user=ftn argv=/usr/lib/ifmail/ifmail -r $nexthop ($recipient)  
bsmtp unix - n n - - pipe  
flags=Fq. user=bsmtp argv=/usr/lib/bsmtp/bsmtp -t$nexthop -f$sender $recipient  
scalemail-backend unix - n n - 2 pipe  
flags=R user=scalemail argv=/usr/lib/scalemail/bin/scalemail-store ${nexthop} ${user} ${extension}  
mailman unix - n n - - pipe  
flags=FR user=list argv=/usr/lib/mailman/bin/postfix-to-mailman.py  
${nexthop} ${user}  
```

Ensure `/etc/postfix/virtual` contains:

```  
root@mydomain.com root  
```

Now run `postmap` and then restart Postfix:

```bash  
$ sudo postmap /etc/postfix/virtual  
$ sudo /etc/init.d/postfix restart  
```

To test that everything works send an email using [swaks](http://www.jetmore.org/john/code/swaks/):

```bash  
$ sudo apt-get install swaks  
$ swaks --to someone@anotherdomain.com --server 127.0.0.1

=== Trying 127.0.0.1:25...  
=== Connected to 127.0.0.1.  
<- 220 mydomain.com ESMTP Postfix (Ubuntu)  
-> EHLO mydomain  
<- 250-mydomain.com

...

-> To: someone@anotherdomain.com  
-> From: root@mydomain  
-> Subject: test Thu, 18 Dec 2014 08:24:36 -0500  
-> X-Mailer: swaks v20130209.0 jetmore.org/john/code/swaks/  
->  
-> This is a test mailing  
->  
-> .  
<- 250 2.0.0 Ok: queued as ABBBB82E1F  
-> QUIT  
<- 221 2.0.0 Bye  
=== Connection closed with remote host.  
```

## Setup Meteor

To tell Meteor to use Postfix we simply need to set the `MAIL_URL` environment variable to `smtp://localhost:25`. So on the command-line:

```bash  
$ MAIL_URL=smtp://localhost:25 meteor run  
```

For [meteor-up](https://github.com/arunoda/meteor-up) deployment just set it within `mup.json`:

```js  
...  
"env": {  
  ...  
  "MAIL_URL": "smtp://localhost:25"  
},  
...  
```

## Sending an email

When sending an email ensure that the `from` address is always set. Here is how you would send an arbitrary email:

```js  
Email.send({
  from: 'admin@mydomain.com',
  to: 'user@gmail.com',
  subject: 'Welcome to mydomain',
  html: '<p>Welcome to mydomain!</p>We hope you like your stay :)',
});
```

For the built-in Meteor emails (e.g. account verification, reset password) ensure you set the `Accounts.emailTemplates.from` key to be the email address from which all emails should appear to have originated.