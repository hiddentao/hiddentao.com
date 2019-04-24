---
title: Setting up Hudson on Debian for continuous integration with Git
date: '2010-10-27'
summary: "For the [Tornado](http:&#47;&#47;www.tornadoweb.org&#47;) project I'm currently working on I decided to get continuous integration setup on my Debian Lenny server. In the past I've used [CruiseControl](http:&#47;&#47;cruisecontrol.sourceforge.net&#47;) for doing automated builds but recently I've been getting to know [Hudson](http:&#47;&#47;hudson-ci.org&#47;) and I find it to be a superior alternative ([stackoverflow](http:&#47;&#47;stackoverflow.com&#47;questions&#47;604385&#47;what-is-the-difference-between-hudson-and-cruisecontrol-for-java-projects) has a good discussion on the respective pros and cons). In this post I'm going to outline the steps I took in order to get Hudson up and running on my box. \r\n"
tags:
  - Git
  - Hudson
  - Debian
---
For the [Tornado](http://www.tornadoweb.org/) project I'm currently working on I decided to get continuous integration setup on my Debian Lenny server. In the past I've used [CruiseControl](http://cruisecontrol.sourceforge.net/) for doing automated builds but recently I've been getting to know [Hudson](http://hudson-ci.org/) and I find it to be a superior alternative ([stackoverflow](http://stackoverflow.com/questions/604385/what-is-the-difference-between-hudson-and-cruisecontrol-for-java-projects) has a good discussion on the respective pros and cons). In this post I'm going to outline the steps I took in order to get Hudson up and running on my box.

First of all, I'm assuming you have Git already installed (it's as easy as `apt-get install git`) and setup. On Debian there is a `hudson` package will will install Hudson as a service for you. I decided to opt for installing the `tomcat6` package instead. This installs the general puprose [Tomcat](http://tomcat.apache.org/) web server, making it easy to add other Java web apps in future.

```bash
apt-get install tomcat6
```

At this point, `/etc/tomcat6` contains all the configuration settings for Tomcat. The apps folder is located at `/var/lib/tomcat6/webapps`. By default Tomcat listens on ports 8080 and 8443 (for http and https respectively). For my server I edited `/etc/tomcat6/server.xml` and changed these port numbers since I already had other services listening on those ports.

You can then download the latest `hudson.war` from the Hudson homepage and save it into `/var/lib/tomcat6/webapps`:

```bash
/var/lib/tomcat6/webapps$ wget http://hudson-ci.org/latest/hudson.war
```

If Tomcat is running then it will automatically expand this package as a folder: `/var/lib/tomcat6/webapps/hudson`.

You can now access Hudson by going to `http://<domain.com>:<tomcat_port>/hudson`. It will probably show some error indicating that `HUDSON_HOME` hasn't been set. This environment variable needs to be set to wherever you want Hudson to store all its configuration and data files. I created mine in `/opt`:</tomcat_port></domain.com>

```bash
/opt$ sudo mkdir hudson
/opt$ sudo chown -Rf tomcat6:tomcat6 hudson
```

I then edited `/etc/init.d/tomcat6` and added the following line near the top where the other environment variables are set:

```
HUDSON_HOME=/opt/hudson
```

If you restart Tomcat you should now be able to access Hudson. Initially there is no authentication setup in Hudson - and you should be able to access the administration section (`/hudson/manage`). Everything in here is reasonably self-explanatory. Here is a screenshot of the settings I'm using:

[![User authentication](http://farm5.static.flickr.com/4031/5121093662_f737e76532.jpg)](http://farm5.static.flickr.com/4031/5121093662_f737e76532_b.jpg "User authentication")

*As you can see I've opted for Hudson to handle user authentication internally using its own database (this will get saved in `/opt/hudson` allowing for easy backup).*

Once you've got authentication setup you can install the [Git plugin](http://wiki.hudson-ci.org/display/HUDSON/Git Plugin) through the *Manage Plugins* section of the administration screen. Hudson will automatically restart itself after you've installed a plugin. The Git plugin should automatically pick up the default Git installation you have on your server. Here is a screenshot of my plugins page:

[![User authentication](http://farm5.static.flickr.com/4066/5120490483_96369b1549.jpg)](http://farm5.static.flickr.com/4066/5120490483_96369b1549_b.jpg "User authentication")

You are now ready to create the Hudson 'Job' which will be responsible for the continuous integration process. Just like CruiseControl, Hudson can poll the version control system at regular intervals to see when a build is needed. I set the polling on mine to 15 minutes:

[![User authentication](http://farm5.static.flickr.com/4033/5121093854_5d6c336055.jpg)](http://farm5.static.flickr.com/4033/5121093854_5d6c336055_b.jpg "User authentication")

By default, Hudson will check out a copy of the code from the repository into its own workspace folder (found in `/opt/hudson/jobs/<jobname>/`) when performing a build. In order to force it to use another folder elsewhere (e.g. if your project folder is your testing site you're serving up via Apache) you can simply enable and set the *Custom workspace* setting:</jobname>

[![User authentication](http://farm5.static.flickr.com/4014/5121093768_7252342b1b.jpg)](http://farm5.static.flickr.com/4014/5121093768_7252342b1b_b.jpg "User authentication")

Once you job is setup you can manually trigger a build and if all goes well you should see something like the following in the *Console Output* section of the job:

```
Started by user ram
Checkout:site / /var/www/testsite.com/site - hudson.remoting.LocalChannel@c5a2f7
Using strategy: Default
Last Built Revision: Revision 25db0beb139eae3df00c4d925a27797ecfcdcca2 (origin/master)
Checkout:site / /var/www/testsite.com/site - hudson.remoting.LocalChannel@c5a2f7
GitAPI created
Fetching changes from the remote Git repository
Fetching upstream changes from file:///var/git/repository.git
[site] $ git fetch -t file:///var/git/repository.git  refs/heads/*:refs/remotes/origin/*
[site] $ git ls-tree HEAD
[site] $ git tag -l master
[site] $ git rev-parse origin/master
Commencing build of Revision 25db0beb139eae3df00c4d925a27797ecfcdcca2 (origin/master)
GitAPI created
Checking out Revision 25db0beb139eae3df00c4d925a27797ecfcdcca2 (origin/master)
[site] $ git checkout -f 25db0beb139eae3df00c4d925a27797ecfcdcca2
[site] $ git tag -a -f -m "Hudson Build #14" hudson-CI_to_dev-14
Recording changes in branch origin/master
[site] $ git whatchanged --no-abbrev -M --pretty=raw 25db0beb139eae3df00c4d925a27797ecfcdcca2..25db0beb139eae3df00c4d925a27797ecfcdcca2
Cleaning workspace
[site] $ git clean -fdx
Finished: SUCCESS
```

Enjoy!
