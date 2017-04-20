---
layout: post
published: true
title: Dropbox on removable media
excerpt: "I've been using [Dropbox](http:&#47;&#47;www.dropbox.com&#47;) for a while
  now. For those who are unfamiliar with it it's an application which makes it easy
  to share files online with anyone. Essentially, Dropbox creates a \"My Dropbox\"
  folder on your computer. This folder is automatically kept in sync with your Dropbox
  account online - thus, anything you put into this folder gets automatically uploaded
  to your Dropbox online account. If you choose to share your Dropbox folder (or even
  just a specific file) with somebody else then the changes you make to the folder
  will show up in their local copy of it (they have to be signed up to Dropbox too)
  and vice versa. Dropbox simply sits in the background and synchronises the folder
  - the folder looks and works just like a normal filesystem folder.\r\n"
date: '2010-02-07 14:11:09 +0800'
categories:
- Uncategorized
tags:
- Dropbox
comments:
- id: 4926
  author: robots and bees
  author_email: spam@spam.org
  author_url: ''
  date: '2014-04-08 04:18:00 +0800'
  date_gmt: '2014-04-08 03:18:00 +0800'
  content: "<p>Wunderbar, I just bought a y410p and wanted to use the ultrabay for
    swapping out the 2nd gpu for a 1tb drive when I want to play fancy games, but
    have experienced firsthand Dropbox's giant scythe of wonton destruction when your
    drive dies &#47; disappears.  This is exactly what I wanted to figure out, thanks!<&#47;p>\n"
- id: 5024
  author: Surce Beats
  author_email: subcero@gmail.com
  author_url: http://www.surcebeats.com/
  date: '2015-02-04 14:30:00 +0800'
  date_gmt: '2015-02-04 14:30:00 +0800'
  content: "<p>But this is nearly useless, because if you want to get DropBox installed
    in a removable drive means that you don't want to have the original copy of the
    DropBox data. I mean I have almost 50 GB used on DropBox, why I should have the
    same data in my hard disk and also in a removable drive? No sense.<&#47;p>\n"
- id: 5031
  author: Cosmin Tataru
  author_email: office@cosmintataru.ro
  author_url: http://www.windowsfaralimite.ro/
  date: '2015-04-14 13:07:00 +0800'
  date_gmt: '2015-04-14 12:07:00 +0800'
  content: "<p>On a Surface Pro 3 for example, you don't want to kill the internal
    disk using Dropbox, so you may want to move Dropbox folder to the attached SD
    Card<&#47;p>\n"
- id: 5036
  author: matt marx
  author_email: mattmarx@gmail.com
  author_url: ''
  date: '2015-05-06 00:36:00 +0800'
  date_gmt: '2015-05-05 23:36:00 +0800'
  content: "<p>Did you get it to work? Trying on a surface 3<&#47;p>\n"
- id: 5037
  author: Cosmin Tataru
  author_email: office@cosmintataru.ro
  author_url: http://www.windowsfaralimite.ro/
  date: '2015-05-06 09:22:00 +0800'
  date_gmt: '2015-05-06 08:22:00 +0800'
  content: "<p>Yes, by mapping the Dropbox path on the SDCard into an empty folder
    on C:<&#47;p>\n"
- id: 5038
  author: Cosmin Tataru
  author_email: office@cosmintataru.ro
  author_url: http://www.windowsfaralimite.ro/
  date: '2015-05-06 09:22:00 +0800'
  date_gmt: '2015-05-06 08:22:00 +0800'
  content: "<p>But it's slow<&#47;p>\n"
- id: 5039
  author: matt marx
  author_email: mattmarx@gmail.com
  author_url: ''
  date: '2015-05-06 13:59:00 +0800'
  date_gmt: '2015-05-06 12:59:00 +0800'
  content: "<p>thanks! just got it working last night. haven't played with it enough
    to know whether it's slow; just happy it works!<&#47;p>\n"
- id: 5040
  author: Cosmin Tataru
  author_email: office@cosmintataru.ro
  author_url: http://www.windowsfaralimite.ro/
  date: '2015-05-06 14:01:00 +0800'
  date_gmt: '2015-05-06 13:01:00 +0800'
  content: "<p>Enjoy :)<&#47;p>\n"
- id: 5071
  author: erkansaner
  author_email: erkansaner2@gmail.com
  author_url: ''
  date: '2015-08-28 12:27:00 +0800'
  date_gmt: '2015-08-28 11:27:00 +0800'
  content: "<p>so the smybolic link is not at the root c: ? there is a C:dropbox folder
    and the Dropbox lnk file in it?<&#47;p>\n"
- id: 5072
  author: erkansaner
  author_email: erkansaner2@gmail.com
  author_url: ''
  date: '2015-08-28 12:44:00 +0800'
  date_gmt: '2015-08-28 11:44:00 +0800'
  content: "<p>I followed your advice and put all my data in the removable D:Dropbox
    location into D:DropboxMdropbox, now I have to create a link to it from C:UserspcrootDropbox\nso
    I create the link in C:Userspcroot right ? \nmy question is, which one is the
    correct command?\na-) mklink &#47;D \"C:UserspcrootDropbox\" \"D:Dropbox\"\nb-)
    mklink &#47;D \"C:UserspcrootDropbox\" \"D:DropboxMdropbox\"\nI guess it's a.
    But now the thing is that all my folders are already in the cloud are not in Mdropbox?
    they are directly in the root this will cause a duplication right?<&#47;p>\n"
- id: 5073
  author: Flying Dyno
  author_email: flyingdyno@gmail.com
  author_url: ''
  date: '2015-08-29 01:29:00 +0800'
  date_gmt: '2015-08-29 00:29:00 +0800'
  content: '<p>Not quite. It would be:  mklink &#47;D "C:Dropbox" "G:Dropbox"<&#47;p>

'
- id: 5074
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2015-08-29 01:30:00 +0800'
  date_gmt: '2015-08-29 00:30:00 +0800'
  content: '<p>Not quite. It would be:  mklink &#47;D "C:Dropbox" "G:Dropbox"<&#47;p>

'
- id: 5075
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2015-08-29 01:32:00 +0800'
  date_gmt: '2015-08-29 00:32:00 +0800'
  content: '<p>What do you mean when you say "directly in the root"?  Basically "C:UserspcrootDropboxMdropbox"
    should be the Dropbox folder as seen by the Dropbox application, so "C:UserspcrootDropbox"
    should symbolically link to "D:Dropbox"<&#47;p>

'
- id: 5076
  author: Chris
  author_email: cboyer@devolutions.net
  author_url: ''
  date: '2015-09-04 19:13:00 +0800'
  date_gmt: '2015-09-04 18:13:00 +0800'
  content: "<p>Hi Ram,\nI try to understand your messages with erkansaner, but I am
    lost...\nI would like to free disk space on our Surface too.\nBy default, Dropbox
    folder location is  C:UserssbourqueDropbox. \nUsing Junction, what should I do
    exactly?\nI tried :\njunction \"d:Dropbox Junction\" \"c:UserssbourqueDropbox\"\nWhat
    do you want to tell by \"don&acirc;&euro;&trade;t symbolic link directly to the
    Dropbox folder itself\".\nI don't want to make a mistake and lose all my documents.
    For your, what should be my command to creat a secure link?\nThanks in advance.<&#47;p>\n"
- id: 5078
  author: Igor Caike Girardi da Veiga
  author_email: igor_ka@hotmail.com
  author_url: ''
  date: '2015-09-20 22:59:00 +0800'
  date_gmt: '2015-09-20 21:59:00 +0800'
  content: "<p>Sadly the same solution seems not work for Onedrive. Anyone has a tip?<&#47;p>\n"
- id: 5079
  author: Igor Caike Girardi da Veiga
  author_email: igor_ka@hotmail.com
  author_url: ''
  date: '2015-09-20 23:00:00 +0800'
  date_gmt: '2015-09-20 22:00:00 +0800'
  content: |
    <p>Hi HIDDENTAO, great text! :)<&#47;p>

    <p>Sadly the same solution seems not work for Onedrive. Anyone has a tip?<&#47;p>
- id: 5080
  author: Igor Caike Girardi da Veiga
  author_email: igor_ka@hotmail.com
  author_url: ''
  date: '2015-09-29 17:36:00 +0800'
  date_gmt: '2015-09-29 16:36:00 +0800'
  content: |
    <p>I used this tip:
    http:&#47;&#47;superuser.com&#47;questions&#47;692151&#47;on-windows-8-or-10-particularly-on-tablets-with-a-permanently-inserted-sd-card<&#47;p>

    <p>And works pretty well for onedrive and dropbox. I think it's even better than made the symbolic link.
    Anyway, I hope can help people. See ya.<&#47;p>
- id: 5081
  author: Igor Caike Girardi da Veiga
  author_email: igor_ka@hotmail.com
  author_url: ''
  date: '2015-09-29 17:37:00 +0800'
  date_gmt: '2015-09-29 16:37:00 +0800'
  content: |
    <p>PS. The link talks about make the filesystem an empty folder inside a hard-disk.
    (Just in case of the link gone offline)<&#47;p>
- id: 5082
  author: Michael Finger
  author_email: michael.alexander.finger@gmail.com
  author_url: ''
  date: '2015-10-01 18:15:00 +0800'
  date_gmt: '2015-10-01 17:15:00 +0800'
  content: "<p>Thanks for this helpful information. I use Dropbox across all my devices,
    but some have insufficient internal space. This is exactly what I needed.<&#47;p>\n"
- id: 5258
  author: Richard
  author_email: TheOnlyRick@gmail.com
  author_url: ''
  date: '2016-02-22 00:05:00 +0800'
  date_gmt: '2016-02-22 00:05:00 +0800'
  content: "<p>Hi Ram, thanks for your guide.<&#47;p>\n\n<p>I tried to move my DBox
    to my D drive with the command: \nmklink &#47;D \"C:usersricharddropbox\" \"d:DBox\"<&#47;p>\n\n<p>I
    got a confirmation that the symbolic link was created.  But:  My Dropbox is still
    downloading to my C drive, so I've got something wrong...<&#47;p>\n\n<p>Did I
    use the right command?  Am I missing something?  (I know I need to move it to
    a subfolder, to avoid it being accidentally deleted.)<&#47;p>\n\n<p>Thanks,  Richard<&#47;p>\n"
- id: 5259
  author: Richard
  author_email: TheOnlyRick@gmail.com
  author_url: ''
  date: '2016-02-22 14:42:00 +0800'
  date_gmt: '2016-02-22 14:42:00 +0800'
  content: "<p>If anyone is looking for more background info on symlinks, here's a
    useful guide... http:&#47;&#47;www.howtogeek.com&#47;howto&#47;16226&#47;complete-guide-to-symbolic-links-symlinks-on-windows-or-linux&#47;<&#47;p>\n"
- id: 5260
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2016-02-22 14:59:00 +0800'
  date_gmt: '2016-02-22 14:59:00 +0800'
  content: "<p>That command looks right to me, though I haven't used Windows for a
    while now so I can't be certain :)<&#47;p>\n"
- id: 5261
  author: Richard
  author_email: TheOnlyRick@gmail.com
  author_url: ''
  date: '2016-02-22 23:25:00 +0800'
  date_gmt: '2016-02-22 23:25:00 +0800'
  content: |
    <p>Hmmm... more research needed!  Thanks for letting me know.  :-)<&#47;p>

    <p>R.<&#47;p>
---
I've been using [Dropbox](http://www.dropbox.com/) for a while now. For those who are unfamiliar with it it's an application which makes it easy to share files online with anyone. Essentially, Dropbox creates a "My Dropbox" folder on your computer. This folder is automatically kept in sync with your Dropbox account online - thus, anything you put into this folder gets automatically uploaded to your Dropbox online account. If you choose to share your Dropbox folder (or even just a specific file) with somebody else then the changes you make to the folder will show up in their local copy of it (they have to be signed up to Dropbox too) and vice versa. Dropbox simply sits in the background and synchronises the folder - the folder looks and works just like a normal filesystem folder.

By default the Dropbox application starts automatically upon boot-up and and it expects the dropbox folder to be available to it all times while it's running. The rationale behind this (I'm guessing) is that most users will want Dropbox to work seamlessly in the background without having to worry about having to manually start it or initiate the synchronisation. This is all great until you want to place your Dropbox local folder onto removable media such as your USB flash drive, so that you can have access to your stuff on-the-go. The Dropbox application won't let you create your Dropbox folder on removable media. So what to do?

I did some investigation and came across [Dropbox Portable](http://wiki.dropbox.com/DropboxAddons/DropboxPortable), essentially an attempt at tricking the Dropbox installer in such a way that you can install the application as well as your Dropbox folder to a flash drive. This method didn't work for me so I then looked for and came across an alternative. Here's what you do:

1. Install Dropbox as normal and then exit the application.
2. Move the Dropbox folder to your flash drive.
3. Create a [symbolic link](http://en.wikipedia.org/wiki/Symbolic_link) from the old location of the folder pointing to the new location of the folder on the flash drive.
4. Restart the application and it should be none the wiser.

You can use symbolic linking on just about any operating system including the latest versions of Windows. For Windows XP you'll need to use the [Junction](http://technet.microsoft.com/en-us/sysinternals/bb896768.aspx) tool to create such a link. On Vista (and I'm guessing for Windows 7) you can use the built-in `mklink` command-line tool.

**Note:** don't symbolic link directly to the Dropbox folder itself. If you did this and then accidentally removed your flash drive whilst Dropbox was still running then it *might* assume that you've just emptied your Dropbox folder and would then proceed to delete your files stored online (remember, it tries to keep everything in sync). To avoid this problem create the symbolic link to the parent folder instead. So on my setup (Vista) my flash drive (G:) has the Dropbox folder at `G:\Dropbox\My Dropbox`. The symbolic link ist at `C:\Dropbox` and points to `G:\Dropbox`.