---
layout: post
published: true
title: Ubuntu 10.04 Lucid 64-bit + PHP 5.2 FastCGI + APC + nginx
excerpt: "This post outlines the steps needed to get PHP 5.2 running on Ubuntu 10.04
  (\"Lucid Lynx\") 64-bit under nginx and FastCGI with APC enabled. The current Lucid
  apt repositories contain PHP 5.3 so I needed compile 5.2 from source in order to
  get this setup working. I also decided to use the new-ish [FastCGI Process Manager](http:&#47;&#47;php-fpm.org&#47;)
  that comes with PHP in order to manage FastCGI processes. \r\n"
date: '2011-06-24 10:52:26 +0800'
categories:
- Uncategorized
tags:
- PHP
- Ubuntu
- APC
- nginx
- FastCGI
comments:
- id: 4716
  author: Jacob (Boom Shadow)
  author_email: jacob@boomshadow.net
  author_url: http://boomshadow.net
  date: '2011-07-30 07:18:00 +0800'
  date_gmt: '2011-07-30 07:18:00 +0800'
  content: "<p>Nice guide. I found this rather useful. I appreciate the link as well
    :)<&#47;p>\n"
---
This post outlines the steps needed to get PHP 5.2 running on Ubuntu 10.04 ("Lucid Lynx") 64-bit under nginx and FastCGI with APC enabled. The current Lucid apt repositories contain PHP 5.3 so I needed compile 5.2 from source in order to get this setup working. I also decided to use the new-ish [FastCGI Process Manager](http://php-fpm.org/) that comes with PHP in order to manage FastCGI processes.
<a id="more"></a><a id="more-1162"></a>

Initially I tried to setup FastCGI with Apache but in the end I coudn't quite get all the PHP global variables to get set correctly when a request got passed from Apache to the FastCGI processes. I wasn't able to find a definitely solution elsewhere on the web either so I decided save myself some trouble and switch to nginx. However, if you wish to get this working with Apache yourself then check out the ["Resources"](#resources) section below.

## 1. Install PHP

I'll assume you that you have a folder at `~/src`. Now we will fetch the latest PHP 5.2 source (5.2.17 as of writing. We will also merge into it the latest [PHP FPM](http://php-fpm.org/) patch (0.5.14 as of writing).

```bash
$ sudo apt-get update
$ sudo apt-get install patch
$ cd ~/src
~/src$ wget http://uk3.php.net/get/php-5.2.17.tar.gz/from/uk.php.net/mirror
~/src$ wget http://php-fpm.org/downloads/php-5.2.17-fpm-0.5.14.diff.gz
~/src$ mv mirror php-5.2.17.tar.gz
~/src$ tar -zxf php-5.2.17.tar.gz
~/src$ gzip -cd php-5.2.17-fpm-0.5.14.diff.gz | patch -d php-5.2.17 -p1
```

Install all the required dependencies we'll need in order to compile PHP:

```bash
$ sudo apt-get install g libxml2-dev libbz2-dev libssl-dev libmcrypt-dev libmhash-dev libpcre3-dev libcurl4-openssl-dev libpng-dev libmysqlclient-dev libltdl-dev
```

Now build PHP:

```bash
$ cd ~/src/php-5.2.17
~/src/php-5.2.17$ ./configure --enable-fastcgi --enable-fpm --with-mysql --with-zlib --with-gd --with-curl --with-gettext --with-ttf --enable-mbstring --with-openssl --enable-shmop --enable-sockets --with-pear --with-pdo-mysql --with-libdir --with-png-dir --with-pcre-regex --with-mcrypt --with-mhash --with-libdir=lib64 --with-config-file-path=/etc/php5 --with-fpm-conf=/etc/php5/php-fpm.conf --with-fpm-log=/var/log/php5/php-fpm.log --with-fpm-pid=/var/run/php-fpm/php-fpm.pid
~/src/php-5.2.17$ make
```

Note that we've configured it with the following settings:

* PHP and FPM configuraton files will be in `/etc/php5`.
* The FPM log file will be at `/var/log/php5/php-fpm.log`.
* The FPM pid file will be at `/var/run/php-fpm/php-fpm.pid`.
* We're running 64-bit Ubuntu so we've set the lib folder to be `lib64` rather than the default `lib`.

If you're hardcore then you can run the included PHP tests:

```bash
~/src/php-5.2.17$ make test
```

Now install the PHP binaries into your system. We will use [checkinstall](http://www.asic-linux.com.mx/~izto/checkinstall/) to generate a .deb package so that we can easily uninstall it later on.:

```bash
~/src/php-5.2.17$ sudo apt-get install checkinstall
~/src/php-5.2.17$ sudo checkinstall
...
Installing PHP SAPI module: cgi
Installing PHP CGI binary: /usr/local/bin/
Installing FPM config: /etc/php5/php-fpm.conf
(installing as php-fpm.conf.default)
Installing init.d script: /usr/local/sbin/php-fpm
Installing PHP CLI binary: /usr/local/bin/
Installing PHP CLI man page: /usr/local/man/man1/
Installing build environment: /usr/local/lib/php/build/
Installing header files: /usr/local/include/php/
Installing helper programs: /usr/local/bin/
program: phpize
program: php-config
Installing man pages: /usr/local/man/man1/
page: phpize.1
page: php-config.1
Installing PEAR environment: /usr/local/lib/php/
[PEAR] Archive_Tar - already installed: 1.3.7
[PEAR] Console_Getopt - already installed: 1.2.3
[PEAR] Structures_Graph- already installed: 1.0.3
[PEAR] XML_Util - already installed: 1.2.1
[PEAR] PEAR - already installed: 1.9.1
Wrote PEAR system config file at: /usr/local/etc/pear.conf
You may want to add: /usr/local/lib/php to your php.ini include_path
Installing PDO headers: /usr/local/include/php/ext/pdo/
...
```

Check that you can call it from the shell:

```bash
$ php -v
PHP 5.2.17 (cli) (built: May 11 2011 15:24:36)
Copyright (c) 1997-2010 The PHP Group
Zend Engine v2.2.0, Copyright (c) 1998-2010 Zend Technologies
```

Now make all the necessary folders:

```bash
$ sudo mkdir /var/log/php5
$ sudo mkdir /var/run/php-fpm
$ sudo chown -Rf www-data: /var/log/php5
$ sudo chown -Rf www-data: /var/run/php-fpm
$ sudo chmod 777 /var/log/php5
$ sudo chmod 777 /var/run/php-fpm
```

Now setup php.ini:

```bash
$ cd /etc/php5
$ sudo cp ~/src/php-5.2.17/php.ini-dist ./php.ini
$ sudo nano php.ini
...
error_log = /var/log/php5/error.log
include_path = ".:/usr/local/lib/php"
...
```

Remember to create the `/var/log/php5` folder and give the `www-data` user write access to it.

If you wish to run tests with [PHPUnit](https://github.com/sebastianbergmann/phpunit/) then you can install it as follows:

```bash
$ sudo pear upgrade pear
$ sudo pear channel-discover pear.phpunit.de
$ sudo pear channel-discover pear.symfony-project.com
$ sudo pear channel-discover components.ez.no
$ sudo pear install phpunit/PHPUnit
```

## 2\. Install APC ## {#apc}

[Alternative PHP Cache](http://php.net/manual/en/book.apc.php) is a free opcode cache for PHP which caches and optimizes intermediate PHP bytecode to speed up the performance of your website. From PHP's point of view it is simply another plugin which gets enabled, though PHP 6 comes with it built-in.

First, lets grab the APC source code (as of writing APC is at version 3.1.8). We'll again put it into the `~/src` folder:

```bash
$ cd ~/src
~/src$ wget http://pecl.php.net/get/APC-3.1.8.tgz
~/src$ tar -xzf APC-3.1.8.tgz
```

Build and install it:

```bash
~/src/APC-3.1.8$ sudo apt-get install autoconf
~/src/APC-3.1.8$ phpize
~/src/APC-3.1.8$ ./configure --enable-apc --enable-apc-mmap --with-php-config=/usr/local/bin/php-config --with-libdir=/usr/lib64
~/src/APC-3.1.8$ make
~/src/APC-3.1.8$ sudo checkinstall
...
Installing shared extensions: /usr/local/lib/php/extensions/no-debug-non-zts-20060613/
Installing header files: /usr/local/include/php/
...
```

Add a symlink to the PHP extension folder:

```bash
$ cd /usr/local/lib/php/extensions
$ sudo ln -s no-debug-non-zts-20060613/apc.so
```

Now enable it in `php.ini`:

```bash
$ sudo nano /etc/php5/php.ini
...
extension_dir="/usr/local/lib/php/extensions"
...
extension=apc.so
...
```

## 3\. Setup FastCGI ## {#fpm}

We want the FastCGI Process Manager (FPM) to run as a daemon and to start at boot time. We can use the `init.d` script which comes with it to accomplishes these goals:

```bash
$ cd /etc/init.d
/etc/init.d$ sudo wget -O php-fpm http://svn.php.net/repository/php/php-src/branches/PHP_5_3/sapi/fpm/init.d.php-fpm.in
/etc/init.d$ sudo chmod 755 php-fpm
/etc/init.d$ sudo update-rc.d php-fpm defaults
/etc/init.d$ sudo nano php-fpm
...
prefix=/usr/local
exec_prefix=/usr/local/bin
php_fpm_BIN=/usr/local/bin/php-cgi
php_fpm_CONF=/etc/php5/php-fpm.conf
php_fpm_PID=/var/run/php-fpm/php-fpm.pid
...
php_opts="--fpm --fpm-config $php_fpm_CONF"
...
```

As you can see above we need to edit the default script and set the correct paths within.

We now need to configure the FPM configuration file at `/etc/php5/php-fpm.conf`. This configuration file tells the FPM how many worker processes to run and what port to listen on, amongst other things. Here is the configuration file which I use:

```xml
<configuration>

All relative paths in this config are relative to php's install prefix

<section name="global_options">

Pid file
<value name="pid_file">/var/run/php-fpm/php-fpm.pid</value>

Error log file
<value name="error_log">/var/log/php5/php-fpm.log</value>

Log level
<value name="log_level">notice</value>

When this amount of php processes exited with SIGSEGV or SIGBUS ...
<value name="emergency_restart_threshold">10</value>

... in a less than this interval of time, a graceful restart will be initiated.
Useful to work around accidental curruptions in accelerator's shared memory.
<value name="emergency_restart_interval">1m</value>

Time limit on waiting child's reaction on signals from master
<value name="process_control_timeout">5s</value>

Set to 'no' to debug fpm
<value name="daemonize">yes</value>

</section>

<section name="pool">

Name of pool. Used in logs and stats.
<value name="name">default</value>

Address to accept fastcgi requests on.
Valid syntax is 'ip.ad.re.ss:port' or just 'port' or '/path/to/unix/socket'
<value name="listen_address">127.0.0.1:9000</value>

<value name="listen_options"></value>

Set listen(2) backlog
<value name="backlog">-1</value>

Set permissions for unix socket, if one used.
In Linux read/write permissions must be set in order to allow connections from web server.
Many BSD-derrived systems allow connections regardless of permissions.
<value name="owner">www-data</value>
<value name="group">www-data</value>
<value name="mode">0666</value>

Additional php.ini defines, specific to this pool of workers.
<value name="php_defines">
<value name="sendmail_path">/usr/sbin/sendmail -t -i</value>
<value name="display_errors">1</value>
</value>

Unix user of processes
<value name="user">www-data</value>

Unix group of processes
<value name="group">www-data</value>

Process manager settings
<value name="pm"></value>

Sets style of controling worker process count.
Valid values are 'static' and 'apache-like'
<value name="style">static</value>

Sets the limit on the number of simultaneous requests that will be served.
Equivalent to Apache MaxClients directive.
Equivalent to PHP_FCGI_CHILDREN environment in original php.fcgi
Used with any pm_style.
<value name="max_children">5</value>

Settings group for 'apache-like' pm style
<value name="apache_like"></value>

Sets the number of server processes created on startup.
Used only when 'apache-like' pm_style is selected
<value name="StartServers">20</value>

Sets the desired minimum number of idle server processes.
Used only when 'apache-like' pm_style is selected
<value name="MinSpareServers">5</value>

Sets the desired maximum number of idle server processes.
Used only when 'apache-like' pm_style is selected
<value name="MaxSpareServers">35</value>

The timeout (in seconds) for serving a single request after which the worker process will be terminated
Should be used when 'max_execution_time' ini option does not stop script execution for some reason
'0s' means 'off'
<value name="request_terminate_timeout">0s</value>

The timeout (in seconds) for serving of single request after which a php backtrace will be dumped to slow.log file
'0s' means 'off'
<value name="request_slowlog_timeout">0s</value>

The log file for slow requests
<value name="slowlog">logs/slow.log</value>

Set open file desc rlimit
<value name="rlimit_files">1024</value>

Set max core size rlimit
<value name="rlimit_core">0</value>

Chroot to this directory at the start, absolute path
<value name="chroot"></value>

Chdir to this directory at the start, absolute path
<value name="chdir"></value>

Redirect workers' stdout and stderr into main error log.
If not set, they will be redirected to /dev/null, according to FastCGI specs
<value name="catch_workers_output">yes</value>

How much requests each process should execute before respawn.
Useful to work around memory leaks in 3rd party libraries.
For endless request processing please specify 0
Equivalent to PHP_FCGI_MAX_REQUESTS
<value name="max_requests">500</value>

Comma separated list of ipv4 addresses of FastCGI clients that allowed to connect.
Equivalent to FCGI_WEB_SERVER_ADDRS environment in original php.fcgi (5.2.2 )
Makes sense only with AF_INET listening socket.
<value name="allowed_clients">127.0.0.1</value>

Pass environment variables like LD_LIBRARY_PATH
All $VARIABLEs are taken from current environment
<value name="environment">
<value name="HOSTNAME">$HOSTNAME</value>
<value name="PATH">/usr/local/bin:/usr/bin:/bin</value>
<value name="TMP">/tmp</value>
<value name="TMPDIR">/tmp</value>
<value name="TEMP">/tmp</value>
<value name="OSTYPE">$OSTYPE</value>
<value name="MACHTYPE">$MACHTYPE</value>
<value name="MALLOC_CHECK_">2</value>
</value>

</section>

</configuration>
```

Once you've created the configuration file you are read to start the FPM daemon:

```bash
$ sudo service php-fpm restart
```

If you now check the FPM log file you should see something like the this:

```bash
/var/log/php5$ sudo tail php-fpm.log
Jun 24 12:42:21.261000 [NOTICE] fpm_unix_init_main(), line 284: getrlimit(nofile): max:1024, cur:1024
Jun 24 12:42:21.262136 [NOTICE] fpm_event_init_main(), line 88: libevent: using epoll
Jun 24 12:42:21.262269 [NOTICE] fpm_init(), line 52: fpm is running, pid 5719
Jun 24 12:42:21.281651 [NOTICE] fpm_children_make(), line 352: child 5720 (pool default) started
Jun 24 12:42:21.296519 [NOTICE] fpm_children_make(), line 352: child 5721 (pool default) started
Jun 24 12:42:21.299408 [NOTICE] fpm_children_make(), line 352: child 5722 (pool default) started
Jun 24 12:42:21.324208 [NOTICE] fpm_children_make(), line 352: child 5723 (pool default) started
Jun 24 12:42:21.331463 [NOTICE] fpm_children_make(), line 352: child 5724 (pool default) started
Jun 24 12:42:21.331654 [NOTICE] fpm_event_loop(), line 107: libevent: entering main loop
```

## 4\. Install nginx ## {#nginx}

You are now ready to setup nginx so that it passes incoming PHP requests to the FPM daemon. We are going to install nginx from the [nginx Ubuntu PPA](http://wiki.nginx.org/Install#Ubuntu_PPA).

```bash
$ sudo -s
$ nginx=stable
$ add-apt-repository ppa:nginx/$nginx
$ apt-get update
$ apt-get install nginx
```

_Note: the `add-apt-repository` command is available in the `python-software-properties` package._

I'm assuming you don't already have a website to serve through nginx. So let's create a default web folder:

```bash
$ cd /var
/var$ sudo mkdir www
```

Setup a virtual host for your default web folder by editing `/etc/nginx/sites-enabled/default` and replacing its contents with:

```
server {
  listen 80;
  server_name localhost;
  access_log /var/log/nginx/access_log;
  error_log /var/log/nginx/error_log;
  location / {
    root /var/www;
    index index.php index.html;
  }
  location ~ \.php$ {
    fastcgi_pass 127.0.0.1:9000;
    fastcgi_index index.php;
    include /etc/nginx/fastcgi_params;
    fastcgi_param SCRIPT_FILENAME /var/www$fastcgi_script_name;
  }
}
```

We set the document root to be `/var/www` and we ensure all requests for files ending in `.php` get passed to the FastCGI server listening on port 9000 on the same machine. The file `/etc/nginx/fastcgi_params` contains the default FastCGI parameters which get passed to the FastCGI daemon. Override these as you see fit.

To test that everything is working create a file at `/var/www/index.php` with the following contents:

```php
<?php phpinfo(); ?>
```

Now restart nginx:

```bash
$ sudo /etc/init.d/nginx restart
```

If you visit **http://localhost/** you should now see the output of the `phpinfo()` call. The **Server API** should be `CGI/FastCGI` and it should show the APC extension enabled.

## Resources ## {#resources}

Some resources which I found helpful when doing this:

* [http://boomshadow.net/tech/php-handlers/](http://boomshadow.net/tech/php-handlers/) - Check out a beginner's guide to different PHP handlers
* [http://voidweb.com/2010/07/the-perfect-lamp-stack-apache2-fastcgi-php-fpm-apc/](http://voidweb.com/2010/07/the-perfect-lamp-stack-apache2-fastcgi-php-fpm-apc/) - Instructions for Apache APC PHP 5.2 FPM FastCGI
* [http://earthviaradio.wordpress.com/2011/02/04/compiling-php-5-2-for-ubuntu-10-10/](http://earthviaradio.wordpress.com/2011/02/04/compiling-php-5-2-for-ubuntu-10-10/) - General instruction on compiling PHP
* [http://forum.nginx.org/read.php?3,119942,120735](http://forum.nginx.org/read.php?3,119942,120735) - PHP FPM using sockets
* [http://learnix.net/fastasscgi-part2/](http://learnix.net/fastasscgi-part2/) - Another guide on Apache FPM