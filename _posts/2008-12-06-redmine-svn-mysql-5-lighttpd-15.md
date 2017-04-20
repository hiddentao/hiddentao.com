---
layout: post
published: true
title: Redmine + SVN + MySQL 5 + Lighttpd 1.5 + FastCGI
excerpt: "For about a year now I've been using <a href=\"http:&#47;&#47;trac.edgewall.org&#47;\">Trac<&#47;a>
  as my software project management system. If you haven't heard of Trac then let
  me say that it's one of the few free open source project management systems that
  works really well.\r\n\r\nRecently I've come across a different project management
  system - <a href=\"http:&#47;&#47;www.redmine.org&#47;\">Redmine<&#47;a>. This is
  very similar to Trac in the way it works, except that it's built using Ruby on Rails.
  And notably, it has support for a larger variety of version control systems than
  Trac, and most importantly (for me), it has support for multiple projects (including
  sub-projects of projects) within a single, cohesive web interface.\r\n"
date: '2008-12-06 14:44:01 +0800'
categories:
- Uncategorized
tags:
- Email
- Redmine
- Trac
- Subversion
- Ruby
- Rails
- Apache
- Lighttpd
comments:
- id: 205
  author: Mezza
  author_email: merul.patel@gmail.com
  author_url: ''
  date: '2008-12-19 19:23:12 +0800'
  date_gmt: '2008-12-19 19:23:12 +0800'
  content: "<p>Ram, very useful indeed, and about time the excellent folks at Redmine
    got more exposure.<&#47;p>\n"
- id: 4744
  author: Umar_draz
  author_email: umar_draz@yahoo.com
  author_url: http://www.macheights.com
  date: '2011-11-03 12:15:00 +0800'
  date_gmt: '2011-11-03 12:15:00 +0800'
  content: |
    <p>Hi Great Article,<&#47;p>

    <p>For the rights and permission, I am suing this line in my httpd.conf<&#47;p>

    <p>AuthzSVNAccessFile &#47;home&#47;svn&#47;conf&#47;authz<&#47;p>

    <p>Can i do with redmine?<&#47;p>

    <p>-- Umar<&#47;p>
- id: 4745
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2011-11-04 10:34:00 +0800'
  date_gmt: '2011-11-04 10:34:00 +0800'
  content: "<p>@Umar I haven't tried that myself so I don't know, sorry.<&#47;p>\n"
- id: 4943
  author: Tory
  author_email: toryhoke@gmail.com
  author_url: ''
  date: '2014-05-20 18:16:00 +0800'
  date_gmt: '2014-05-20 17:16:00 +0800'
  content: "<p>OMG you are my flipping hero. I could not sort out my redmine redirects
    for the life of me. Your lighttpd.conf entry for redmine.yourdomain.com is the
    only fully working example I've seen anywhere. Thank you so much for posting this.<&#47;p>\n"
---
For about a year now I've been using [Trac](http://trac.edgewall.org/) as my software project management system. If you haven't heard of Trac then let me say that it's one of the few free open source project management systems that works really well.

Recently I've come across a different project management system - [Redmine](http://www.redmine.org/). This is very similar to Trac in the way it works, except that it's built using Ruby on Rails. And notably, it has support for a larger variety of version control systems than Trac, and most importantly (for me), it has support for multiple projects (including sub-projects of projects) within a single, cohesive web interface.  


So I decided to take the plunge and get Redmine installed and running on my server. In this blog post I'm going to outline the steps I had to take to get things working, in the hope that they'll be of use to others looking to do the same. When I originally setup Trac I had to setup the Subversion repository and web access to it (via Apache) as well as get Trac working as a FastCGI process under Lighttpd 1.5\. So I'm going to assume you're starting off with a setup like mine and are already familiar with setting up Trac in this way - if not you should be able to find out how to set these things up elsewhere on the web.

This is the starting setup:

* Debian Etch  
* Lighttpd 1.5 + FastCGI  
* Mysql 5.0.51  
* Subversion 1.5  
* Apache 2.2 (for Subversion web-based access only)

This guide is split into three sections:

1. Basic Redmine setup
2. Subversion repository authentication and browsing
3. Email notification setup

## 1. Basic Redmine setup ## {#step1}

Install Ruby and other required packages:

```bash 
$ apt-get install ruby rake librmagick-ruby libmysql-ruby rubygems libfcgi-ruby1.8 libopenssl-ruby1.8  
```

Check that the Ruby executable is at **/usr/bin/ruby**:

```bash  
$ which ruby  
/usr/bin/ruby  
```

Install RubyGems (this can take a while to complete):

```bash
$ wget http://rubyforge.org/frs/download.php/45905/rubygems-1.3.1.tgz  
$ tar -xzf rubygems-1.3.1.tgz  
$ cd rubygems-1.3.1/  
rubygems-1.3.1$ ruby setup.rb  
...  
cp gem /tmp/gem  
install -c -m 0755 /tmp/gem /usr/bin/gem1.8  
rm /tmp/gem  
rm -f /root/.gem/source_cache  
rm -f /usr/lib/ruby/gems/1.8/source_cache  
Removing old RubyGems RDoc and ri  
rm -rf /usr/lib/ruby/gems/1.8/doc/rubygems-1.3.1  
Installing rubygems-1.3.1 ri into /usr/lib/ruby/gems/1.8/doc/rubygems-1.3.1/ri  
Installing rubygems-1.3.1 rdoc into /usr/lib/ruby/gems/1.8/doc/rubygems-1.3.1/rdoc  
...  
RubyGems installed the following executables:  
/usr/bin/gem1.8  
If `gem` was installed by a previous RubyGems installation, you may need  
to remove it by hand.  
```

Now install the Rails gem (this can also take a while):

```bash
$ gem install rails --include-dependencies  
INFO: `gem install -y` is now default and will be removed  
INFO: use --ignore-dependencies to install only the gems you list  
Successfully installed rake-0.8.3  
Successfully installed activesupport-2.2.2  
Successfully installed activerecord-2.2.2  
Successfully installed actionpack-2.2.2  
Successfully installed actionmailer-2.2.2  
Successfully installed activeresource-2.2.2  
Successfully installed rails-2.2.2  
7 gems installed  
Installing ri documentation for rake-0.8.3...  
Installing ri documentation for activesupport-2.2.2...  
Installing ri documentation for activerecord-2.2.2...  
Installing ri documentation for actionpack-2.2.2...  
Installing ri documentation for actionmailer-2.2.2...  
Installing ri documentation for activeresource-2.2.2...  
Installing RDoc documentation for rake-0.8.3...  
Installing RDoc documentation for activesupport-2.2.2...  
Installing RDoc documentation for activerecord-2.2.2...  
Installing RDoc documentation for actionpack-2.2.2...  
Installing RDoc documentation for actionmailer-2.2.2...  
Installing RDoc documentation for activeresource-2.2.2...  
```

Test that you've got Rails:

```bash
$ rails -v  
Rails 2.2.2  
```

Get the Redmine 0.7.3 TAR package:

```bash
$ wget http://rubyforge.org/frs/download.php/39477/redmine-0.7.3.tar.gz  
$ tar -xzf redmine-0.7.3.tar.gz  
$ rm -rf redmine-0.7.3.tar.gz  
```

Place it into the folder which will act as the web server's 'document root' (replace _redmine_docroot_ with your own):

```bash
$ mv redmine-0.7.3/ /redmine_docroot  
```

Create a database and username for Redmine (replace _redmine-user_ and _redmine-password_ with your own):

```bash  
mysql> create database redmine;  
Query OK, 1 row affected (0.11 sec)  
mysql> create user 'redmine-user'@'localhost' identified by 'redmine-password';  
Query OK, 0 rows affected (0.03 sec)  
mysql> grant all on redmine.* to 'redmine-user'@'localhost';  
Query OK, 0 rows affected (0.07 sec)  
mysql>  
```

Ensure Redmine's *production* configuration points to the newly created database:

```bash 
$ cd /redmine_docroot  
/redmine_docroot$ cp database.yml.example database.yml  
/redmine_docroot$ database.yml  
/redmine_docroot$ cat database.yml  
...  
production:  
adapter: mysql  
database: redmine  
host: localhost  
username: redmine-user  
password: redmine-password  
encoding: utf8  
...  
```

Create the database tables needed by Redmine:

```bash  
$ cd /redmine_docroot  
/redmine_docroot$ /usr/bin/rake db:migrate RAILS_ENV="production"  
```

Check that the tables got created:

```bash  
mysql> use redmine;  
Reading table information for completion of table and column names  
You can turn off this feature to get a quicker startup with -A  
Database changed  
mysql> show tables;  
+------------------------+  
| Tables_in_redmine |  
+------------------------+  
| attachments |  
| auth_sources |  
| boards |  
| changes |  
| changesets |  
| changesets_issues |  
| comments |  
| custom_fields |  
| custom_fields_projects |  
| custom_fields_trackers |  
| custom_values |  
| documents |  
| enabled_modules |  
| enumerations |  
| issue_categories |  
| issue_relations |  
| issue_statuses |  
| issues |  
| journal_details |  
| journals |  
| members |  
| messages |  
| news |  
| projects |  
| projects_trackers |  
| queries |  
| repositories |  
| roles |  
| schema_info |  
| settings |  
| time_entries |  
| tokens |  
| trackers |  
| user_preferences |  
| users |  
| versions |  
| watchers |  
| wiki_content_versions |  
| wiki_contents |  
| wiki_pages |  
| wiki_redirects |  
| wikis |  
| workflows |  
+------------------------+  
43 rows in set (0.00 sec)  
```

Now load default data into these tables:

```bash  
$ cd /redmine_docroot  
/redmine_docroot$ rake redmine:load_default_data RAILS_ENV="production"  
(in /redmine_docroot)

Select language: bg, cs, da, de, en, es, fi, fr, he, hu, it, ja, ko, lt, nl, no, pl, pt, pt-br, ro, ru, sr, sv, th, uk, zh, zh-tw [en] en  
...  
Default configuration data loaded.  
```

Setup the Redmine FastCGI script:

```bash  
$ cd /redmine_docroot/public  
/redmine_docroot/public$ cp dispatch.fcgi.example dispatch.fcgi  
```

Ensure you've got the correct ownership and permissions set for the Redmine folders and files (assuming your Lighttpd installation runs as user *lighttpd* under the group *lighttpd*):

```bash  
$ chown -Rf lighttpd:lighttpd /redmine_docroot  
$ find /redmine_docroot/ -type f -exec chmod 644 {} \;  
$ find /redmine_docroot/ -type d -exec chmod 755 {} \;  
$ chmod 755 /redmine_docroot/public/dispatch.fcgi  
```

Setup Redmine FastCGI access in Lighttpd. I'm assuming that your Redmine installation will be available at *redmine.yourdomain.com* and that your Lighttpd configuration file is located at */etc/lighttpd/lighttpd.conf*:

```bash  
$ cat /etc/lighttpd/lighttpd.conf  
...  
$HTTP["host"] == "redmine.yourdomain.com"  
{  
server.document-root = "/redmine_docroot/public/"  
server.indexfiles = ( "dispatch.fcgi" )  
server.error-handler-404 = "/dispatch.fcgi"  
url.rewrite-once = (  
"^/(.*\..+(?!html))$" => "$0",  
"^/(.*)\.(.*)" => "$0"  
)  
$HTTP["url"] =~ "\.fcgi$" {  
proxy-core.balancer = "static"  
proxy-core.allow-x-sendfile = "enable"  
proxy-core.protocol = "fastcgi"  
proxy-core.backends = ( "unix:/tmp/redmine-fastcgi.sock" )  
proxy-core.max-pool-size = 1  
}  
}  
...  
```

Finally, make sure that we spawn a FastCGI process for Redmine whenever Lighttpd is started via its startup script (assuming it's at */etc/init.d/lighttpd*):

```bash  
$ cat /etc/init.d/lighttpd  
...  
RAILS_ENV=production  
export RAILS_ENV  
RAILS_GEM_VERSION=2.2.2 # this should match the result of typing 'rails -v'  
export RAILS_GEM_VERSION  
RAILS_ROOT=/redmine_docroot  
export RAILS_ROOT  
...  
case "$1" in  
start)  
...  
/usr/local/bin/spawn-fcgi -s /tmp/redmine-fastcgi.sock -f /redmine_docroot/public/dispatch.fcgi -u lighttpd -g lighttpd -P /var/run/spawn-fcgi-redmine.pid  
...  
```

Now if you restart Lighttpd you should be able to access Redmine at *redmine.yourdomain.com*.

If you create a new project in Redmine, add an *Issue* for it and then access the *Activity* tab you might see the following error:
bash
```  
Internal error  
An error occurred on the page you were trying to access.  
If you continue to experience problems please contact your redMine administrator for assistance.  
```

This will occur if you've got Ruby 1.8.7 installed. The Redmine guys recommend using Ruby 1.8.6\. But you can fix this by adding the following code somewhere near the end of the **/redmine_docroot/config/environment.rb** file:

```bash  
module ActionView  
module Helpers  
module TextHelper  
def truncate(text, length = 30, truncate_string = "...")  
if text.nil? then return end  
l = length - truncate_string.chars.to_a.size  
(text.chars.to_a.size > length ? text.chars.to_a[0...l].join + truncate_string : text).to_s  
end  
end  
end  
end  
```

References:

* [http://www.redmine.org/wiki/redmine/RedmineInstall](http://www.redmine.org/wiki/redmine/RedmineInstall) 
* [http://howto.landure.fr/gnu-linux/debian-4-0-etch-en/install-the-redmine-project-management-application-on-debian-4-0-etch](http://howto.landure.fr/gnu-linux/debian-4-0-etch-en/install-the-redmine-project-management-application-on-debian-4-0-etch)
* [http://forum.lighttpd.net/topic/5539](http://forum.lighttpd.net/topic/5539)

## 2. Subversion repository authentication and browsing ## {#step2}

Redmine lets your browse your project's Subversion repository via its web interface, just like Trac does. In addition to this the Redmine folks have provided a Perl module which you can use to authenticate users who access the repository via an external Subversion client. Essentially, users can use their Redmine username and password to access the Subversion repositories of projects they're members of.

It is really important to have atleast Subversion 1.5 installed (repository browsing from within Redmine won't work with an earlier version). Note that you can use the version 1.5 client tools against repositories created with earlier versions without having to make any changes to the repositories themselves.

First of all get hold of some packages we're going to need for the authentication mechanism to work:

```bash
$ aptitude install libapache2-svn libapache-dbi-perl libapache2-mod-perl2 libdbd-mysql-perl libdigest-sha1-perl  
```

Now ensure that Apache has the necessary modules loaded at runtime, specifically, DAV, Subversion and Perl. For instance, if I list which modules are enabled for my Apache installation I see the following:

```bash  
$ ls /etc/apache2/mods-enabled  
dav.load dav_svn.conf dav_svn.load perl.load  
```

Redmine comes with a Perl module which will handle the authentication of Subversion usernames and passwords. Copy this into Apache's library folder:

```bash  
$ cp /redmine_docroot/extra/svn/Redmine.pm /usr/lib/apache2  
```

Ensure the Subversion configuration is enabled:

```bash  
/etc/apache2$ ls -la sites-available/  
-rw-r--r-- 1 svn svn 1182 2007-08-08 16:33 default  
-rw-r--r-- 1 svn svn 639 2008-11-28 16:09 svn  
/etc/apache2$ ls -la sites-enabled/  
lrwxrwxrwx 1 svn svn 22 2007-08-20 23:03 svn -> ../sites-available/svn  
```

And here is the Virtual Host configuration you will need (assuming **/svn** is the root path to all your Subversion repositories):

```bash  
$ cat /etc/apache2/sites-available/svn  
...  
<Virtualhost *:8080="">  
RequestHeader edit Destination ^https: http: early  
DocumentRoot /apache2_svn  
PerlRequire /usr/lib/apache2/Redmine.pm  
<Location &#47;="">  
DAV svn  
SVNParentPath /svn  
AuthType Basic  
Authname "SVN repository"  
Require valid-user  
PerlAccessHandler Apache::Authn::Redmine::access_handler  
PerlAuthenHandler Apache::Authn::Redmine::authen_handler  
PerlSetVar dsn DBI:mysql:database=redmine;host=localhost  
PerlSetVar db_user redmine-user  
PerlSetVar db_pass redmine-password  
Allow from all  
</Location>  
</VirtualHost>  
```

Note that **/apache2_svn** is the document-root for the Subversion website. It does not need to contain any files; instead the Apache Subversion module may use this folder for storing temporary data. It is essential that this folder be owned by the same user/group used to run Apache. Thus, if Apache runs under user *svn* and group *svn* then you would need to do:

```bash 
$ chown -Rf svn:svn /apache2_svn  
```

And of course the root path to your Subversion repositories (see **/svn** above) also needs to be owned by the Apache user/group.

Tell Lighttpd to forward requests made to **svn.yourdomain.com** to Apache:

```bash  
$ cat /etc/lighttpd/lighttpd.conf  
...  
$HTTP["host"] == "svn.yourdomain.com" {  
server.document-root = "/apache2_svn"  
proxy-core.protocol = "http"  
proxy-core.backends = ( "127.0.0.1:8080" )  
}  
...  
```

Update **/redmine_docroot/lib/redmine/scm/adapters/subversion_adapter.rb** so that it uses **/apache2_svn** for storing any Subversion-related configuration information (I'm assuming the path to the Subversion binary is **/usr/bin/svn**):

```bash  
$ cat /redmine_docroot/lib/redmine/scm/adapters/subversion_adapter.rb  
...  
# SVN executable name  
SVN_BIN = "/usr/bin/svn --config-dir /apache2_svn"  
...  
```

Now if you restart both Lighttpd and Apache you should be able to access your Subversion repositories by pointing your web browser to **svn.yourdomain.com/project** where *project* is the project identifier for one of your Redmine projects. You should also be able to browse the repository for each project from within Redmine itself.

References:

* [http://forum.lighttpd.net/topic/5539](http://forum.lighttpd.net/topic/5539)
* [http://www.redmine.org/wiki/redmine/Repositories_access_control_with_apache_mod_dav_svn_and_mod_perl](http://www.redmine.org/wiki/redmine/Repositories_access_control_with_apache_mod_dav_svn_and_mod_perl)
* [http://www.redmine.org/boards/2/topics/show/723](http://www.redmine.org/boards/2/topics/show/723)
* [http://www.redmine.org/boards/2/topics/show/1325](http://www.redmine.org/boards/2/topics/show/1325)

## 3. Email notification setup ## {#step3}

You can ask Redmine to notify you by email whenever somebody creates or updates an issue, or makes other edits to a Redmine project. Setting this up is quite simple assuming you've already got access to an SMTP server.

Firstly, edit **/redmine_docroot/config/environment.rb** and enter the settings for your SMTP server (in this example I'm using Gmail's SMTP server):

```bash
$ cat /redmine_docroot/config/environment.rb  
...  
# See Rails::Configuration for more options

# SMTP server configuration  
config.action_mailer.smtp_settings = {  
:address => "smtp.gmail.com",  
:tls => true,  
:port => 587,  
:domain => "gmail.com",  
:authentication => :login,  
:user_name => "username@gmail.com",  
:password => "password",  
}

config.action_mailer.perform_deliveries = true

# Tell ActionMailer not to deliver emails to the real world.  
# The :test delivery method accumulates sent emails in the  
# ActionMailer::Base.deliveries array.  
#config.action_mailer.delivery_method = :test  
config.action_mailer.delivery_method = :smtp  
...  
```

The *tls* setting shown above instructs the mailer that the Gmail SMTP server uses the STARTTLS method of establishing a connection. But to actually use this method of connecting we need to install the optional TLS plugin:

```bash
/redmine_docroot$ ruby script/plugin install http://svn.douglasfshearer.com/rails/plugins/action_mailer_optional_tls  
+ ./README  
+ ./Rakefile  
+ ./init.rb  
+ ./lib/action_mailer_tls.rb  
+ ./lib/smtp_tls.rb  
+ ./test/tls_test.rb  
```

As of 5th Dec 2008 there is a bug in this plugin. When you try sending a test email via the Redmine administration interface you will see the error: *An error occurred while sending mail (wrong number of arguments (3 for 2))*. To fix this edit **/redmine_docroot/vendor/plugins/action_mailer_optional_tls/lib/smtp_tls.rb** and change the following block of code from...


```bash
...  
def do_tls_start(helodomain, user, secret, authtype)  
raise IOError, 'SMTP session already started' if @started  
check_auth_args user, secret, authtype if user or secret  
...  
```

...to...

```bash
...  
def do_tls_start(helodomain, user, secret, authtype)  
raise IOError, 'SMTP session already started' if @started  
check_auth_args user, secret if user or secret  
...  
```

After restarting Lighttpd (and thus, Redmine) you should now be able to send a test email via the administration interface (goto *Administration -> Settings -> Email notifications*). Furthermore, when you add or edit an issue in a project all the members of that project will recieve an email notifying them of the changes made.

References:

* [http://www.redmine.org/issues/show/1598](http://www.redmine.org/issues/show/1598)
* [http://github.com/collectiveidea/action_mailer_optional_tls/tree/master](http://github.com/collectiveidea/action_mailer_optional_tls/tree/master)
* [http://www.redmine.org/boards/2/topics/show/662](http://www.redmine.org/boards/2/topics/show/662)
