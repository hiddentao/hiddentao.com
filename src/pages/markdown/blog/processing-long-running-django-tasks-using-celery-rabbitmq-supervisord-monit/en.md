---
title: >-
  Processing long-running Django tasks using Celery + RabbitMQ + Supervisord +
  Monit
date: '2012-01-27'
summary: "For a recent project I'm working on we had a requirement to be able to process long-running tasks in Django triggered by user interaction on the front-end. For instance, the user would click a button on the web page in order to trigger the back-end to, for example, build a CSV file containing a subset of the data in the database. In the browser a little popup window would get displayed, showing the progress of the task in the back-end. Once the task got completed in the back-end the user would be notified in the front-end of its completion and provided a link to download the final output (e.g. the built CSV file).\r\n"
tags:
  - Python
  - Django
  - Celery
  - RabbitMQ
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
