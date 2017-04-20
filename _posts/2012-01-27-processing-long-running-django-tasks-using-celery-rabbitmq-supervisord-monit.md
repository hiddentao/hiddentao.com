---
layout: post
published: true
title: Processing long-running Django tasks using Celery + RabbitMQ + Supervisord
  + Monit
excerpt: "For a recent project I'm working on we had a requirement to be able to process
  long-running tasks in Django triggered by user interaction on the front-end. For
  instance, the user would click a button on the web page in order to trigger the
  back-end to, for example, build a CSV file containing a subset of the data in the
  database. In the browser a little popup window would get displayed, showing the
  progress of the task in the back-end. Once the task got completed in the back-end
  the user would be notified in the front-end of its completion and provided a link
  to download the final output (e.g. the built CSV file).\r\n"
date: '2012-01-27 13:11:27 +0800'
categories:
- Uncategorized
tags:
- Python
- Django
- Celery
- RabbitMQ
comments:
- id: 4753
  author: HiddenTao &acirc;&euro;&ordm; Processing long-running Django tasks using
    Celery + &#8230; | Programmer Solution
  author_email: ''
  author_url: http://www.programsolution.info/hiddentao-processing-long-running-django-tasks-using-celery.html
  date: '2012-01-27 13:52:19 +0800'
  date_gmt: '2012-01-27 13:52:19 +0800'
  content: "<p>[...] (Note: I&acirc;&euro;&trade;m assuming that you&acirc;&euro;&trade;re
    running a Debian-based Linux system). First of all I installed RabbitMQ to use
    the message queue [...]<&#47;p>\n"
- id: 4763
  author: Laundro
  author_email: laundro@gmail.com
  author_url: ''
  date: '2012-03-21 16:21:00 +0800'
  date_gmt: '2012-03-21 16:21:00 +0800'
  content: "<p>Fantastic guide, thanks. Finally I'm comfortable with my server monitoring
    set-up.<&#47;p>\n"
- id: 4780
  author: murtaza52
  author_email: murtaza.husain@searce.com
  author_url: ''
  date: '2012-08-28 09:17:00 +0800'
  date_gmt: '2012-08-28 08:17:00 +0800'
  content: "<p>Why not use monit all the way to also launch celery workers? Why user
    supervisord at all? I am newbie and trying to learn from your answers ! Thanks<&#47;p>\n"
- id: 4781
  author: Ramesh Nair
  author_email: ''
  author_url: http://twitter.com/hiddentao
  date: '2012-08-28 10:41:00 +0800'
  date_gmt: '2012-08-28 09:41:00 +0800'
  content: |
    <p>supervisord works by launching the monitored processes as child processes of itself. Thus it's monitoring of them is much more reliable. It also makes it easier for it to check if they've crashed or run out of memory and reliably restart them.<&#47;p>

    <p>Monit, on the other hand, does not launch the monitored processes as child processes of itself. Thus when it uses shell commands to start and stop the processes and standard system APIs to probe their statuses.<&#47;p>

    <p>Thus, with monit you can't really monitor something unless it can run on its own as a daemon. With supervisord you can monitor any process, even ones which can't run as a daemon.<&#47;p>

    <p>It was thus easier to have celery workers handled by supervisord as it meant I didn't have to set them up as daemons. You are right though in that it would be better to use one technique to monitor them all. Since implementing the above I've also realised that the upstart mechanism in Ubuntu provides a built-in Monit-like service. So perhaps all that's needed is a combination of upstart and supervisord and no need for Monit.<&#47;p>
- id: 4782
  author: murtaza52
  author_email: murtaza.husain@searce.com
  author_url: ''
  date: '2012-08-28 11:26:00 +0800'
  date_gmt: '2012-08-28 10:26:00 +0800'
  content: "<p>Thanks  Ramesh. One more question, I am going to be monitoring processes
    such as web server, app server, memcached, db server etc, process which are very
    memory and CPU intensive and run as a daemon themselves. So is supervisord a good
    fit, as it spawns sub processess ?<&#47;p>\n"
- id: 4783
  author: Ramesh Nair
  author_email: ''
  author_url: http://twitter.com/hiddentao
  date: '2012-08-28 11:45:00 +0800'
  date_gmt: '2012-08-28 10:45:00 +0800'
  content: "<p>For those which already have init.d scripts I would go with Monit as
    that way you're re-using stuff they already provide. Generally speaking top-level
    servers (e.g. Apache, MySQL) I do with Monit. App-specific stuff (e.g. Celery)
    I do with supervisord.<&#47;p>\n"
- id: 4804
  author: Jan Pobo&Aring;&trade;il
  author_email: ''
  author_url: http://twitter.com/janpoboril
  date: '2013-01-09 23:00:00 +0800'
  date_gmt: '2013-01-09 23:00:00 +0800'
  content: "<p>At the begining of the article is info about showing progress in the
    UI, but later is any word about it. Do you have any resources how to store and
    access task progress (percents, ...) in the RabbitMQ?<&#47;p>\n"
- id: 4805
  author: Ramesh Nair
  author_email: ''
  author_url: http://twitter.com/hiddentao
  date: '2013-01-10 02:34:00 +0800'
  date_gmt: '2013-01-10 02:34:00 +0800'
  content: "<p>Yeah, I did this using a combination of Redis and Websockets. Take
    a look at https:&#47;&#47;github.com&#47;maccman&#47;juggernaut. This is a node.js
    websockets server which makes it easy for a back-end process (for instance, the
    Celery task) to send real-time status updates to client browsers using a publish-subscribe
    model.<&#47;p>\n"
- id: 4861
  author: Setting up celery for django using django-celery, rabbitmq, supervisor and
    monit | Lost Trail
  author_email: ''
  author_url: http://hshah19.wordpress.com/2013/08/23/setting-up-celery-for-django-using-django-celery-rabbitmq-supervisor-and-monit/
  date: '2013-08-23 13:14:00 +0800'
  date_gmt: '2013-08-23 12:14:00 +0800'
  content: "<p>[...] post is mostly borrowed from here&Acirc;&nbsp;with slight [...]<&#47;p>\n"
- id: 4932
  author: harijay
  author_email: harijay@gmail.com
  author_url: ''
  date: '2014-04-28 07:31:00 +0800'
  date_gmt: '2014-04-28 06:31:00 +0800'
  content: "<p>thanks for this post..I have a related question and wonder why celery
    users don't just use Rabbitmq on a different machine to then consume tasks from
    ..most of the examples I have seen use celery tasks on the same host serving up
    the rest of django. in my case I have a compute heavy application that runs on
    different hardware . I have rabbitmq running there and am currently using json
    rpc to send data to it from within celery, but I think I am better off just reading
    off the Rabbitmq queue on the compute machine and exporting the results back to
    Rabbitmq<&#47;p>\n"
- id: 4933
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2014-04-28 17:34:00 +0800'
  date_gmt: '2014-04-28 16:34:00 +0800'
  content: "<p>It can certainly run on a separate machine. For our purposes at the
    time we didn't need that extra horsepower do we didn't bother.<&#47;p>\n"
- id: 5033
  author: chandra sekhar
  author_email: chandrasekhar0722@gmail.com
  author_url: ''
  date: '2015-04-27 11:33:00 +0800'
  date_gmt: '2015-04-27 10:33:00 +0800'
  content: "<p>Thanks for the post.It worked for me.<&#47;p>\n"
- id: 5097
  author: 'Confluence: Network Factory 2'
  author_email: ''
  author_url: http://confucius.reno.pc-doctor.com/confluence/display/NF2/Network+Factory+2+Prototype+0.2
  date: '2015-12-08 18:08:22 +0800'
  date_gmt: '2015-12-08 18:08:22 +0800'
  content: |
    <p><strong>Network Factory 2 Prototype 0.2<&#47;strong><&#47;p>

    <p>Goal: Keep simiilar architecture while making a "l<&#47;p>
- id: 5217
  author: 'Confluence: Network Factory 2'
  author_email: ''
  author_url: http://confucius.reno.pc-doctor.com/confluence/display/NF2/Network+Factory+2+Proof+of+Concept+0.2
  date: '2016-01-18 22:37:33 +0800'
  date_gmt: '2016-01-18 22:37:33 +0800'
  content: |
    <p><strong>Network Factory 2 Proof of Concept 0.2<&#47;strong><&#47;p>

    <p>Goal: Keep similar architecture (tm record storag<&#47;p>
- id: 5284
  author: 'Confluence: Network Factory 2'
  author_email: ''
  author_url: http://confucius.reno.pc-doctor.com/confluence/display/NF2/Network+Factory+2+Proof+of+Concept+2
  date: '2016-03-22 15:18:55 +0800'
  date_gmt: '2016-03-22 15:18:55 +0800'
  content: |
    <p><strong>Network Factory 2 Proof of Concept 2<&#47;strong><&#47;p>

    <p>Goal: Keep similar architecture as&Acirc;&nbsp;Network Factory<&#47;p>
---
For a recent project I'm working on we had a requirement to be able to process long-running tasks in Django triggered by user interaction on the front-end. For instance, the user would click a button on the web page in order to trigger the back-end to, for example, build a CSV file containing a subset of the data in the database. In the browser a little popup window would get displayed, showing the progress of the task in the back-end. Once the task got completed in the back-end the user would be notified in the front-end of its completion and provided a link to download the final output (e.g. the built CSV file).

For a requirement like this, you don't really want to be performing such a long-running task as part of the standard Django *request -> response* cycle since 1) the Django server is single-threaded, and 2) even if you're using [WSGI](http://code.google.com/p/modwsgi/wiki/IntegrationWithDjango) to run your Django app behind Apache or a similar server you're not really going to want one of your Apache worker processes being tied up with a single client request for long periods of time as this would adversely impact other incoming client requests. Thus, any such long-running task should be performed in a process which then informs the main Django app once it's done. [Celery](http://celeryproject.org/) is a readily-available such system (a *task-queue* to be precise) which enables this and it is easy to integrate into Django using [django-celery](http://pypi.python.org/pypi/django-celery).

## Setting up Django Celery

Setting up Django Celery has already been [documented](http://django-celery.readthedocs.org/en/latest/getting-started/first-steps-with-django.html) [elsewhere](http://pypi.python.org/pypi/django-celery) so I'll simply list the settings I used to get things working (*Note: I'm assuming that you're running a Debian-based Linux system*). First of all I installed [RabbitMQ]() to use the message queue system:

```bash
$ sudo apt-get install rabbitmq-server
```

Then I added a `vhost` and username and password for my Django app to RabbitMQ:

```bash
$ sudo rabbitmqctl add_user myapp myapp
$ sudo rabbitmqctl add_vhost myapp
$ sudo rabbitmqctl set_permissions -p myapp myapp ".*" ".*" ".*"
```

Then in my `celeryconfig.py` I set the following:

```python
BROKER_HOST = "127.0.0.1"
BROKER_PORT = 5672 # default RabbitMQ listening port
BROKER_USER = "myapp"
BROKER_PASSWORD = "myapp"
BROKER_VHOST = "myapp"
CELERY_BACKEND = "amqp" # telling Celery to report the results back to RabbitMQ
CELERY_RESULT_DBURI = ""
```

To test that my setup was correct I ran:

```bash
$ ./manage.py celeryd -l INFO

[2012-01-27 12:29:01,344: WARNING/MainProcess]
/home/ram/dev/myapp/virtualenv/lib/python2.7/site-packages/djcelery/loaders.py:86: UserWarning: Using settings.DEBUG leads to a memory leak, never use this setting in production environments!
warnings.warn("Using settings.DEBUG leads to a memory leak, never "
[2012-01-27 12:29:01,344: WARNING/MainProcess]

-------------- celery@RamLaptop2 v2.4.6
---- **** -----
--- * *** * -- [Configuration]
-- * - **** --- . broker: amqp://guest@localhost:5672//
- ** ---------- . loader: djcelery.loaders.DjangoLoader
- ** ---------- . logfile: [stderr]@INFO
- ** ---------- . concurrency: 8
- ** ---------- . events: OFF
- *** --- * --- . beat: OFF
-- ******* ----
--- ***** ----- [Queues]
-------------- . celery: exchange:celery (direct) binding:celery

[Tasks]
. REPORT_CREATE

[2012-01-27 12:29:01,399: INFO/PoolWorker-1] child process calling self.run()
[2012-01-27 12:29:01,401: INFO/PoolWorker-2] child process calling self.run()
[2012-01-27 12:29:01,403: INFO/PoolWorker-3] child process calling self.run()
[2012-01-27 12:29:01,405: INFO/PoolWorker-4] child process calling self.run()
[2012-01-27 12:29:01,406: INFO/PoolWorker-5] child process calling self.run()
[2012-01-27 12:29:01,408: INFO/PoolWorker-6] child process calling self.run()
[2012-01-27 12:29:01,409: INFO/PoolWorker-7] child process calling self.run()
[2012-01-27 12:29:01,410: INFO/PoolWorker-8] child process calling self.run()
[2012-01-27 12:29:01,411: WARNING/MainProcess] celery@RamLaptop2 has started.
```

At this point if you're not familiar with writing Celery tasks then check out their tutorial on [how to write Celery tasks](http://docs.celeryproject.org/en/latest/tutorials/clickcounter.html) for use by Celery daemon workers started above.

## Deploying to production using Supervisord

In the production environment we need a reliable way of running the Celery daemon processes. Enter [Supervisord](http://supervisord.org/). Essentially it's a processes which in turn launches other processes you tell it to launch, and then monitors those child processes, restarting them if they die, etc. Here is what I did to set it up:

```bash
$ sudo easy_install supervisor
```

I created `/etc/supervisord` to hold all the configuration info:

```bash
$ sudo mkdir /etc/supervisord
```

I then edited `/etc/supervisord/supervisord.conf`:

```
[unix_http_server]
file=/tmp/supervisor.sock ; (the path to the socket file)

[supervisord]
logfile=/var/log/supervisord/main.log ; (main log file;default $CWD/supervisord.log)
logfile_maxbytes=50MB ; (max main logfile bytes b4 rotation;default 50MB)
logfile_backups=10 ; (num of main logfile rotation backups;default 10)
loglevel=info ; (log level;default info; others: debug,warn,trace)
pidfile=/tmp/supervisord.pid ; (supervisord pidfile;default supervisord.pid)
nodaemon=false ; (start in foreground if true;default false)
minfds=1024 ; (min. avail startup file descriptors;default 1024)
minprocs=200 ; (min. avail process descriptors;default 200)
childlogdir=/var/log/supervisord ; ('AUTO' child log dir, default $TEMP)

[rpcinterface:supervisor]
supervisor.rpcinterface_factory = supervisor.rpcinterface:make_main_rpcinterface

[supervisorctl]
serverurl=unix:///tmp/supervisor.sock ; use a unix:// URL for a unix socket

[include]
files = /etc/supervisord/conf.d/*.conf
```

I created a folder called `conf.d` inside `/etc/supervisord` and created a file called `myapp-celery.conf` inside that:

```
[program:myapp-celery]
command=/home/ram/dev/myapp/virtualenv/bin/python /home/ram/dev/myapp/manage.py celeryd --loglevel=INFO
environment=PYTHONPATH=/home/ram/dev/myapp
directory=/home/ram/dev/myapp
user=www-data
numprocs=1
stdout_logfile=/var/log/celeryd/myapp.log
stderr_logfile=/var/log/celeryd/myapp.log
autostart=true
autorestart=true
startsecs=10
stopwaitsecs = 600
priority=998
```

**Note: I'm running my Django app inside a virtual environment, which is why I specify the path to the Python interpreter in the above file.**

I created the `/var/log/supervisord` and `/var/log/celeryd` log folders and setup the appropriate permissions on them to enable logging.

To run Supervisord I did the following:

```bash
$ supervisord -c /etc/supervisord/supervisord.conf
```

I checked that my Celery workers were active:

```bash
$ ps aux | grep celeryd
...
www-data 26655 0.5 0.3 210000 36248 ? Sl 12:49 0:02 /home/ram/dev/myapp/virtualenv/bin/python /home/ram/dev/myapp/manage.py celeryd --loglevel=INFO
www-data 26656 0.5 0.3 210012 36232 ? Sl 12:49 0:02 /home/ram/dev/myapp/virtualenv/bin/python /home/ram/dev/myapp/manage.py celeryd --loglevel=INFO
www-data 26671 0.0 0.2 103364 33012 ? S 12:49 0:00 /home/ram/dev/myapp/virtualenv/bin/python /home/ram/dev/myapp/manage.py celeryd --loglevel=INFO
...
```

To shut it down I did:

```bash
$ supervisorctl -c /etc/supervisord/supervisord.conf shutdown
```

## Monitoring Supervisord

Supervisord will monitor our Celery workers and ensure they stay alive, but how will we ensure that Supervisord itself stays alive? Enter [Monit](http://mmonit.com/monit/). Monit does essentially the same thing as Supervisord except that it monitors child processes through pid files and other checks (e.g. checking that a web page loads in order to verify that Apache is running) and doesn't directly own them (unlike Supervisord). Monit also installs itself as an `init.d` script which gets launched at server boot time. It comes with a web interface (with optional authentication) which lets you easily start, stop and restart any services it is monitoring along with providing memory and CPU usage statistics.

I installed Monit:

```bash
$ sudo apt-get install monit
```

I edited `/etc/monit/monitrc` and uncommented the lines relating to the web interface:

```
set httpd port 2812 and
# use address localhost # only accept connection from localhost
# allow localhost # allow localhost to connect to the server and
# allow admin:monit # require user 'admin' with password 'monit'
allow @monit # allow users of group 'monit' to connect (rw)
# allow @users readonly # allow users of group 'users' to connect readonly
```

**Note: I configured it above such that it accepts authenticated connections from anywhere, whereby only local Linux users who belongs to the `monit` group can gain access.**.

Then I created `/etc/monit/conf.d/supervisord.monit`:

```
check process supervisord with pidfile /tmp/supervisord.pid
group supervisord
start program = "/usr/local/bin/supervisord -c /etc/supervisord/supervisord.conf"
stop program = "/usr/local/bin/supervisorctl -c /etc/supervisord/supervisord.conf shutdown"
if 5 restarts within 5 cycles then timeout
```

Restart Monit:

```bash
$ sudo /etc/init.d/monit restart
```

All done! I then created a `monit` Linux group and added myself to it. From then on I was able to visit `http://localhost:2812` to see the status of the `supervisord` process and control it.