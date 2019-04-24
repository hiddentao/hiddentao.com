---
title: Nginx configuration file for ownCloud 5 server with PHP 5.5 FastCGI
date: '2013-09-12'
summary: ''
tags:
  - PHP
  - nginx
  - ownCloud
  - Cloud
---
I recently decided to take control of my data in the cloud and install [ownCloud](http://owncloud.org/) on my own server. For those of you who haven't heard of ownCloud it's an open source alternative to Dropbox which you install and manage yourself, thereby bypassing the privacy, reliability and security issues associated with commercial cloud storage and sync providers.

I run PHP 5.5 FastCGI Nginx 1.2.6 on my Debian server and couldn't get the default Nginx configuration file (as [provided by ownCloud](http://doc.owncloud.org/server/4.5/admin_manual/installation.html#ubuntu-debian)) working. I kept getting popup errors in the web interface stating "Cloud not found" and similar. With some adjustment I finally got everything working with the following:

```bash
# redirect http to https.
server {
  listen 80;
  server_name owncloud.mydomain.com;
  return 301 https://$server_name$request_uri;  # enforce https
}
 
server {
        listen 443 ssl;
        server_name owncloud.mydomain.com;
        access_log /var/log/nginx/owncloud.access_log;
        error_log /var/log/nginx/owncloud.error_log;
 
        ssl                  on;
        ssl_certificate      /etc/ssl/certs/mydomain.com.pem;
        ssl_certificate_key  /etc/ssl/certs/mydomain.com.pem;
        keepalive_timeout    70;    
 
 
        root /var/www/nginx/owncloud;
 
        index index.php;
 
        client_max_body_size 1000M; # set maximum upload size
        fastcgi_buffers 64 4K;
 
    # Configure proper error pages
    error_page 403 = /core/templates/403.php;
    error_page 404 = /core/templates/404.php;
  
    # deny direct access
    location ~ ^/(data|config|\.ht|db_structure\.xml|README) {
      deny all;
    }
 
    # default try order
    location / {
            # this serves static files that exist without running other rewrite tests
            if (-f $request_filename) {
                    expires 30d;
                    break;
            }
 
            try_files $uri $uri/ @webdav;
    }
 
    # owncloud WebDAV
    location @webdav {
            fastcgi_split_path_info ^(.+\.php)(/.*)$;
            fastcgi_pass 127.0.0.1:9000; # or use php-fpm with: "unix:/var/run/php-fpm/php-fpm.sock;"
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            fastcgi_param HTTPS on;
            include fastcgi_params;
    }
 
    location ~ (.+)\.php$ {
        try_files $uri = 404;
        fastcgi_pass 127.0.0.1:9000; # or use php-fpm with: "unix:/var/run/php-fpm/php-fpm.sock;"
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            fastcgi_param HTTPS on;
            include fastcgi_params;
    }
}
```

Hope this helps anybody else trying to get this working.
