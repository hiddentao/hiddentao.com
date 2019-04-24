---
title: Setup CouchDB and Futon behind a secure Nginx proxy
date: '2018-05-09'
summary: ''
tags:
  - CouchDB
  - DigitalOcean
  - Nginx
  - Proxy
  - SSL
---

I recently had to setup a self-hosted [CouchDB](http://couchdb.apache.org/) solution on [DigitalOcean](https://m.do.co/c/98d0e3d7eb67) with access secured via HTTPS (using Nginx). This post details the steps I took.

## Install CouchDB and Futon

_Note: These instructions are based on the [DigitalOcean instructions](https://www.digitalocean.com/community/tutorials/how-to-install-couchdb-and-futon-on-ubuntu-14-04)._

I ran the following commands on a fresh Ubuntu 16.04 installation as `root` user.

Install basic tools:

```
$ apt-update
$ apt install software-properties-common -y
```

Install CouchDB and Futon (this comes bundled with CouchDB):

```
$ add-apt-repository ppa:couchdb/stable -y
$ apt update
$ apt install couchdb -y
```

You can do a version check:

```
$ couchdb -V
couchdb - Apache CouchDB 1.6.1
```

Check that CouchDB is running:

```
$ curl localhost:5984
```

You should see something like:

```
{"couchdb":"Welcome","uuid":"9ba954a6b320e4c9950e8bc819ac17ef","version":"1.6.1","vendor":{"version":"16.04","name":"Ubuntu"}}
```

To secure the install let's update the ownership and permissions of various folders:

```
$ service couchdb stop
$ chown -R couchdb:couchdb /var/lib/couchdb /usr/share/couchdb /etc/couchdb /usr/bin/couchdb
$ chmod -R 0770 /var/lib/couchdb /usr/share/couchdb /etc/couchdb /usr/bin/couchdb
$ service couchdb start
```

At this point you can visit `http://<server ip address>:5984` in your browser and
you should see something like:

```
{
    "couchdb": "Welcome",
    "uuid": "9ba954a6b320e4c9950e8bc819ac17ef",
    "version": "1.6.1",
    "vendor": {
        "version": "16.04",
        "name": "Ubuntu"
    }
}
```

To access [Futon](http://docs.couchdb.org/en/1.6.1/intro/futon.html) goto `https://<server ip address>:5984/_utils`. **Ensure you set an
admin user and password through the Futon interface to prevent future anonymous
users from wrecking your db!**


## Setup SSL certificates

Follow the [LetsEncrypt.com instructions for Ubuntu + Nginx](https://certbot.eff.org/lets-encrypt/ubuntuxenial-nginx) to install Certbox:

```
$ apt update
$ apt install software-properties-common
$ add-apt-repository ppa:certbot/certbot
$ apt update
$ apt install python-certbot-nginx
```

Run the Certbot:

```
$ certbot --nginx certonly
```

Assuming your server domain name is `couchdb.mydomain.com` you should see something like:

```
- Congratulations! Your certificate and chain have been saved at:
  /etc/letsencrypt/live/couchdb.mydomain.com/fullchain.pem
  Your key file has been saved at:
  /etc/letsencrypt/live/couchdb.mydomain.com/privkey.pem
```

## Setup Nginx

```
$ add-apt-repository ppa:nginx/stable -y
$ apt update
$ apt install nginx -y
```

Edit the default site config (`/etc/nginx/sites-enabled/default`) to ensure that
all incoming requests are proxied to CouchDB (via default port 5984):

```
server {
  listen 443;
  server_name couchdb.mydomain.com;

  ssl_certificate /etc/letsencrypt/live/couchdb.mydomain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/couchdb.mydomain.com/privkey.pem;

  ssl on;
  ssl_session_cache builtin:1000 shared:SSL:10m;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
  ssl_ciphers HIGH:!aNULL:!eNULL:!EXPORT:!CAMELLIA:!DES:!MD5:!PSK:!RC4;
  ssl_prefer_server_ciphers on;

  location / {
           proxy_pass http://localhost:5984;
           proxy_redirect off;
           proxy_set_header Host $host;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
               proxy_set_header X-Forwarded-Ssl on;
   }

   location ~ ^/(.*)_changes {
           proxy_pass http://localhost:5984;
           proxy_redirect off;
           proxy_buffering off;
           proxy_set_header Host $host;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
   }
}
```

_Note: the above config is based on [official docs](https://cwiki.apache.org/confluence/display/COUCHDB/Nginx+as+a+proxy#Nginxasaproxy-nginxasSSLproxy)._

Now restart Nginx:

```
$ service nginx restart
```

## Software firewall

To ensure our server is protected we'll setup the softare firewall:

```
$ apt install arno-iptables-firewall
```

In the dialog that pops up, set `eth0` as the external interface and `22 443` as the TCP ports to expose. Leave all other fields blank (unless you know what you are doing).

## Check in browser

Visit both https://couchdb.mydomain.com and https://couchdb.mydomain.com/_utils
in your browser and check that they work.


## Database access control

CouchDB has built-in authentication via users and roles. However, you probably
want to control access to the endpoint from Nginx itself - well, this is what I
needed.

The easy way to do this is using [ngx_http_auth_basic_module](http://nginx.org/en/docs/http/ngx_http_auth_basic_module.html).

Let's create a file containing our username - _"couchdb"_ -  and a password:

```
$ apt install apache2-utils -y
$ htpasswd -c /etc/nginx/.htpasswd couchdb
```

Now edit `/etc/ngnix/sites-enabled/default` and update the `location` sections:

```
server {
  ...
  location {
    auth_basic           "Restricted";
    auth_basic_user_file /etc/nginx/.htpasswd;
    proxy_set_header Authorization  "";
    ...
  }
  location {
    auth_basic           "Restricted";
    auth_basic_user_file /etc/nginx/.htpasswd;
    proxy_set_header Authorization  "";
    ...
  }
  ...
}
```

_Note: We need to nullify the Authorization header as shown above otherwise our
auth info will get passed onto couchdb, which will then throw an error!_.

Restart nginx:

```
$ service nginx restart
```

Revisit the CouchDB endpoint in your browser and check that it now prompts you
for the username and password.
