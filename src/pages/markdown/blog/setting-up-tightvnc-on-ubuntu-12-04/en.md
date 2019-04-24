---
title: Setting up TightVNC on Ubuntu 12.04
date: '2013-09-17'
summary: "I just got [TightVNC](http:&#47;&#47;www.tightvnc.com&#47;) working properly with Ubuntu 12.04. There are various guides around the web which tell you what to do so what I'm about to give you is nothing new. Nevertheless, some of the guides out there are quite old so I hope that mine provides more up-to-date instructions.\r\n\r\nFirst of all I'm assuming you've installed Ubuntu 12.04 and that you have SSH access into it. In order to make VNC worthwhile you'll need Ubuntu desktop access so go ahead and install it if you haven't already done so:\r\n"
tags:
  - Ubuntu
  - VNC
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
