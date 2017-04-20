---
layout: post
published: true
title: Sending file logs to Loggly in a Docker container
excerpt: "I'm going to outline how I automate the sending of file logs to [Loggly](http:&#47;&#47;loggly.com&#47;)
  inside my Docker containers. This article is a minor follow-on to my previous article
  on [automated deployments](http:&#47;&#47;www.hiddentao.com&#47;archives&#47;2014&#47;06&#47;03&#47;shippable-ansible-docker-loggly-for-awesome-deployments&#47;),
  which gives a good overview of my overall deployment process. In this one I will
  show you how to use the latest Loggly API to send your file logs across.\r\n\r\nI'm
  going to assume that you are building your docker container using a [Dockerfile](https:&#47;&#47;docs.docker.com&#47;reference&#47;builder&#47;).
  If not I recommend doing so, as they provide you ample flexibility and allow you
  to use version control to track changes to your container setup. \r\n"
date: '2015-05-24 11:48:18 +0800'
categories:
- Uncategorized
tags:
- Docker
- Loggly
- Syslog
comments: []
---
I'm going to outline how I automate the sending of file logs to [Loggly](http://loggly.com/) inside my Docker containers. This article is a minor follow-on to my previous article on [automated deployments](/archives/2014/06/03/shippable-ansible-docker-loggly-for-awesome-deployments/), which gives a good overview of my overall deployment process. In this one I will show you how to use the latest Loggly API to send your file logs across.

I'm going to assume that you are building your docker container using a [Dockerfile](https://docs.docker.com/reference/builder/). If not I recommend doing so, as they provide you ample flexibility and allow you to use version control to track changes to your container setup.  

**Syslog-ng config**

We're going to use [syslog-ng](https://www.balabit.com/network-security/syslog-ng) - an open source implementation of the syslog protocol - to actually watch the log files for changes and send them to Loggly. We need to configure syslog-ng and tell it what to do. We want to send the actual `syslog` as well as the log files for our app, which will be running as a server with the container. The below configuration is based on the [Loggly docs for syslog-ng](http://www.loggly.com/docs/syslog-ng-manual-configuration/):

```  
##############################
## file: syslogng_loggly.conf
##############################
 
source s_syslog {
  file("/var/log/syslog");
};
 
template t_syslog { template("<${PRI}>1 ${ISODATE} ${HOST} ${PROGRAM} ${PID} ${MSGID} [<LOGGLY_TOKEN>@41058 tag=\"syslog\"] $MSG\n");
  template_escape(no);
};
 
destination d_loggly_syslog {
  tcp("logs-01.loggly.com" port(514) template(t_syslog));
};
 
log {
  source(s_syslog);
  destination(d_loggly_syslog);
};
 
 
source s_app {
  file("/var/log/myapp/logfile1");
  file("/var/log/myapp/logfile2");
};
 
template t_app { template("<${PRI}>1 ${ISODATE} ${HOST} ${PROGRAM} ${PID} ${MSGID} [<LOGGLY_TOKEN>@41058 tag=\"app\"] $MSG\n");
  template_escape(no);
};
 
destination d_loggly_app {
  tcp("logs-01.loggly.com" port(514) template(t_app));
};
 
log {
  source(s_app);
  destination(d_loggly_app);
};
```

In the above configuration I'm watching both `/var/log/syslog` and two app log files for changes and then sending them to Loggly with the tags `syslog` and `app` respectively.

The tagging allows me to easily filter the logs within the Loggly dashboard. The `<loggly_token>` above should replaced by your own [customer authentication token](https://www.loggly.com/docs/customer-token-authentication-token/) provided by Loggly.</loggly_token>

**DOCKERFILE**

Somewhere within your Dockerfile you need to install `syslog-ng` and then set it to use the above configuration file. This can be done as so:

```  
RUN apt-get update  
RUN apt-get install syslog-ng  
ADD syslogng_loggly.conf /etc/syslog-ng/conf.d/loggly.conf  
```

So you just have to make sure that the `syslogng_loggly.conf` file is in the same folder as your Dockerfile when doing the build.

And that's it! It's really quite simple. I've successfully been using the above setup in production now for months.