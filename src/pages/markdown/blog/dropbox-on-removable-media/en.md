---
title: Dropbox on removable media
date: '2010-02-07'
summary: "I've been using [Dropbox](http:&#47;&#47;www.dropbox.com&#47;) for a while now. For those who are unfamiliar with it it's an application which makes it easy to share files online with anyone. Essentially, Dropbox creates a \"My Dropbox\" folder on your computer. This folder is automatically kept in sync with your Dropbox account online - thus, anything you put into this folder gets automatically uploaded to your Dropbox online account. If you choose to share your Dropbox folder (or even just a specific file) with somebody else then the changes you make to the folder will show up in their local copy of it (they have to be signed up to Dropbox too) and vice versa. Dropbox simply sits in the background and synchronises the folder - the folder looks and works just like a normal filesystem folder.\r\n"
tags:
  - Dropbox
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
