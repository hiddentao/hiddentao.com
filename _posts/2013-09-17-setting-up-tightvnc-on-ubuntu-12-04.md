---
layout: post
published: true
title: Setting up TightVNC on Ubuntu 12.04
excerpt: "I just got [TightVNC](http:&#47;&#47;www.tightvnc.com&#47;) working properly
  with Ubuntu 12.04. There are various guides around the web which tell you what to
  do so what I'm about to give you is nothing new. Nevertheless, some of the guides
  out there are quite old so I hope that mine provides more up-to-date instructions.\r\n\r\nFirst
  of all I'm assuming you've installed Ubuntu 12.04 and that you have SSH access into
  it. In order to make VNC worthwhile you'll need Ubuntu desktop access so go ahead
  and install it if you haven't already done so:\r\n"
date: '2013-09-17 22:45:57 +0800'
categories:
- Uncategorized
tags:
- Ubuntu
- VNC
comments:
- id: 4896
  author: Noob Bill
  author_email: wrd2032@hotmail.com
  author_url: ''
  date: '2014-01-30 04:24:00 +0800'
  date_gmt: '2014-01-30 04:24:00 +0800'
  content: "<p>Where do you put the init.d file?<&#47;p>\n"
- id: 4898
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2014-02-03 07:22:00 +0800'
  date_gmt: '2014-02-03 07:22:00 +0800'
  content: "<p>Into &#47;etc&#47;init.d<&#47;p>\n"
- id: 4927
  author: Mito
  author_email: bf8bbb7e@opayq.com
  author_url: ''
  date: '2014-04-11 13:53:00 +0800'
  date_gmt: '2014-04-11 12:53:00 +0800'
  content: "<p>I have a problem, done everything as said above but i only see a grey
    screen :&#47;<&#47;p>\n"
- id: 4928
  author: feralman
  author_email: bilhays@me.com
  author_url: ''
  date: '2014-04-15 14:07:00 +0800'
  date_gmt: '2014-04-15 13:07:00 +0800'
  content: "<p>Mito, \nCheck ~&#47;.vnc&#47;xstartup, sounds like you're landing in
    twm. Mine looks like this:<&#47;p>\n\n<p>!&#47;bin&#47;sh<&#47;p>\n\n<p>xrdb $HOME&#47;.Xresources\nxsetroot
    -solid grey<&#47;p>\n\n<p>x-terminal-emulator -geometry 80x24+10+10 -ls -title
    \"$VNCDESKTOP Desktop\" &amp;<&#47;p>\n\n<p>x-window-manager &amp;<&#47;p>\n\n<p>Fix
    to make GNOME work<&#47;p>\n\n<p>export XKL_XMODMAP_DISABLE=1\n&#47;etc&#47;X11&#47;Xsession<&#47;p>\n\n<p>Ram,\nMany
    thanks for this, you just saved me a couple hours of work.<&#47;p>\n"
- id: 4929
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2014-04-15 14:52:00 +0800'
  date_gmt: '2014-04-15 13:52:00 +0800'
  content: "<p>Glad it helped. Mito, I hope feralman's suggestion works for you.<&#47;p>\n"
- id: 4934
  author: Ongun Ar&Auml;&plusmn;sev
  author_email: ongunarisev@gmail.com
  author_url: ''
  date: '2014-05-03 01:20:00 +0800'
  date_gmt: '2014-05-03 00:20:00 +0800'
  content: |
    <p>I have followed the steps up to setting the password and killing the vncserver but I cannot kill the server after I set the password the output is as follows:<&#47;p>

    <p>sudo vncserver -kill :1
    Killing Xtightvnc process ID 29063
    kill: No such process<&#47;p>

    <p>cd .vnc&#47;
    -bash: cd: .vnc&#47;: Permission denied<&#47;p>

    <p>Hence, I cannot edit the files inside .vnc directory. How can I remedy this issue?<&#47;p>

    <p>Thanks<&#47;p>
- id: 4935
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2014-05-04 02:48:00 +0800'
  date_gmt: '2014-05-04 01:48:00 +0800'
  content: |
    <p>To kill it you should do:<&#47;p>

    <p>sudo &#47;etc&#47;init.d&#47;vncserver stop<&#47;p>

    <p>By the way, it looks like your vncserver might not have started up properly in the first place. Make sure there weren't any fatal error messages during startup.<&#47;p>
- id: 4936
  author: Ongun Ar&Auml;&plusmn;sev
  author_email: ongunarisev@gmail.com
  author_url: ''
  date: '2014-05-04 15:44:00 +0800'
  date_gmt: '2014-05-04 14:44:00 +0800'
  content: '<p>There were no errors as far as I was concerned and I wrote the script
    to the file named "vncserver" in the &#47;etc&#47;init.d&#47; directory. Maybe
    I have misunderstood something from your post.<&#47;p>

'
- id: 4940
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2014-05-07 16:47:00 +0800'
  date_gmt: '2014-05-07 15:47:00 +0800'
  content: |
    <p>To stop the server have you tried: &#47;etc&#47;init.d&#47;vncserver stop<&#47;p>

    <p>It's been a while since I set this up, so I can't remember exactly how I stopped the server, but am pretty sure that will have been it.<&#47;p>
- id: 4946
  author: name
  author_email: e@mail.com
  author_url: ''
  date: '2014-06-05 00:19:00 +0800'
  date_gmt: '2014-06-04 23:19:00 +0800'
  content: |
    <p>its mistake - you do not create init.d script!
    You should add vncserver script into init.d folder<&#47;p>
- id: 4986
  author: Tony Law
  author_email: tonylaw7@gmail.com
  author_url: ''
  date: '2014-08-25 16:51:00 +0800'
  date_gmt: '2014-08-25 15:51:00 +0800'
  content: "<p>First of all thanks for the quick and clean guide.<&#47;p>\n\n<p>I
    did all the instructions, but after doing\nsudo &#47;etc&#47;init.d&#47;vncserver
    start<&#47;p>\n\n<p>I get this :<&#47;p>\n\n<p>root@server2:&#47;# sudo &#47;etc&#47;init.d&#47;vncserver
    start\n&#47;etc&#47;init.d&#47;vncserver: 7: .: Can't open &#47;lib&#47;lsb&#47;init-functions<&#47;p>\n\n<p>Any
    clue on what would that be? \nI did create and saved the script file into &#47;etc&#47;init.d<&#47;p>\n"
- id: 4987
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2014-08-27 10:59:00 +0800'
  date_gmt: '2014-08-27 09:59:00 +0800'
  content: "<p>I think the scripts used &#47;etc&#47;init.d&#47;vncserver may have
    changed since I wrote that. Worth looking at other scripts inside &#47;etc&#47;init.d
    to see how they do it.<&#47;p>\n"
- id: 5406
  author: Dave Cobb
  author_email: dave32@gmail.com
  author_url: ''
  date: '2016-05-26 18:19:00 +0800'
  date_gmt: '2016-05-26 17:19:00 +0800'
  content: "<p>Any good way to avoid the requirement for the SSH tunnel and allow
    any connections from my local network on the VNC port?<&#47;p>\n"
---
I just got [TightVNC](http://www.tightvnc.com/) working properly with Ubuntu 12.04\. There are various guides around the web which tell you what to do so what I'm about to give you is nothing new. Nevertheless, some of the guides out there are quite old so I hope that mine provides more up-to-date instructions.

First of all I'm assuming you've installed Ubuntu 12.04 and that you have SSH access into it. In order to make VNC worthwhile you'll need Ubuntu desktop access so go ahead and install it if you haven't already done so:

```bash
$ sudo apt-get install ubuntu-desktop
```

Now install TightVNC:

```bash
$ sudo apt-get install tightvncserver
```

Now let's create the `init.d` script:

```bash
#!/bin/bash
PATH="$PATH:/usr/bin/"
export USER="ram"
DISPLAY="1"
DEPTH="16"
GEOMETRY="1024x768"
OPTIONS="-depth ${DEPTH} -geometry ${GEOMETRY} :${DISPLAY} -localhost"
. /lib/lsb/init-functions

case "$1" in
start)
log_action_begin_msg "Starting vncserver for user '${USER}' on localhost:${DISPLAY}"
su ${USER} -c "/usr/bin/vncserver ${OPTIONS}"
;;

stop)
log_action_begin_msg "Stoping vncserver for user '${USER}' on localhost:${DISPLAY}"
su ${USER} -c "/usr/bin/vncserver -kill :${DISPLAY}"
;;

restart)
$0 stop
$0 start
;;
esac
exit 0
```

Note that by specifying the `- localhost` option to the server we disallow access from anything but localhost. This is more secure but it does mean we will need to use an SSH tunnel to connect to it. Now let's set the right permissions on this script and start it up:

```bash
$ sudo chmod 755 /etc/init.d/vncserver
$ sudo /etc/init.d/vncserver start
```

The first time you start the script it will ask you for a password. This is the password which VNC clients will have to supply when they connect to the server.

Once you've created a password kill the server. Now edit the vnc config file at `/home/<your username="">/.vnc/xstartup`:</your>

```bash
#!/bin/sh

xrdb $HOME/.Xresources
xsetroot -solid grey
export XKL_XMODMAP_DISABLE=1
echo starting gnome
gnome-session --session=ubuntu-2d &
```

So we're telling VNC to create a new GUI session using the the Unity 2D desktop manager when a client connects. Now restart the server. And this time we'll make sure it runs on bootup too:

```bash
$ sudo /etc/init.d/vncserver start
$ sudo update-rc.d vncserver defaults
```

Now, from your local machine SSH into your server with port forwarding enabled:

```bash
$ ssh -L 5901:localhost:5901 username@my-remote-server.com
```

Now launch your VNC client and connect to `localhost:5901`. You should be prompted for the password you created earlier. Once you're in you should see the Unity desktop and be able to interact with it.

All done!V