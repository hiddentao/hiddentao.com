---
title: Shippable + Ansible + Docker + Loggly for awesome deployments
date: '2014-06-03'
summary: "This post is about how to use Ansible and Docker for both setting up a server environment for your app and then deploying your web app to it, and preserving your logs in case of server crash. Since I wrote my post on [\"Automated deployment with Docker containers\"](http:&#47;&#47;www.hiddentao.com&#47;archives&#47;2013&#47;12&#47;26&#47;automated-deployment-with-docker-lessons-learnt&#47;), both Docker and my own understanding have improved. In this post I'm going to detail my latest deployment setup. One that is more robust than what I had previously. So without further ado, let's get stuck in.\r\n"
tags:
  - Build
  - Docker
  - Ansible
  - Shippable
  - Loggly
---
This post is about how to use Ansible and Docker for both setting up a server environment for your app and then deploying your web app to it, and preserving your logs in case of server crash. Since I wrote my post on ["Automated deployment with Docker containers"](/archives/2013/12/26/automated-deployment-with-docker-lessons-learnt/), both Docker and my own understanding have improved. In this post I'm going to detail my latest deployment setup. One that is more robust than what I had previously. So without further ado, let's get stuck in.  
<a id="more"></a><a id="more-1737"></a>

## Shippable

[Shippable](https://shippable.com) is a recently introduced continuous integration service, similar to [Travis](https://travis-ci.com/) but with some differences. All Shippable builds take place within a Docker container, and as such consecutive builds can re-use the same container, only updating what has changed. This provides for proper but resource-efficient build isolation and good build performance. The best part is that the free version of Shippable enables you to build up to 5 private Github repositories alongside as many public repositories as you like. Perfect for my needs.

Once you've signed up for Shippable and linked your Github account you can enable builds for a particular repository by providing a `shippable.yml` file in the root folder of your repository. Here is one of mine:

```  
# Build Environment
build_environment: Ubuntu 12.04
 
# language setting
language: node_js
 
# version numbers, testing against one version of node
node_js:
  - 0.11.10
 
# only build when certain Git branches are updated
branches:
  only:
    - develop
    - master
 
# node environment
env:
  - NODE_ENV=test
 
# npm install runs by default, but we need to specify global installs ourselves
before_install:
 - npm install -g gulp bower
 
# the build scripts
script:
 - bower --allow-root install 
 - gulp build
 - gulp deploy_artifacts
 
# Notification
notifications:
  email:
    recipients:
      - build@foobar.com
    on_success: always
    on_failure: change

```

_Note: You can do the same build configuration for Travis too_

The call to `gulp deploy_artifacts` is a key one. In that I copy the built project assets into a `shippable/` folder in the root of the project folder. Once the build is finished Shippable automatically zips up anything in this folder and makes the result available for download via its API and website. This is great, because it means we can build the project and zip up what we need to deploy the website and then use that for deployment. Previously I was rebuilding the site assets during the live deployment, which obviously meant the whole process took longer than necessary.

## Ansible

I was previously setting up my cloud servers manually and then saving a snapshot image of the server disk so that I could easily create new servers in future. However, deploying my app to the server using a Docker container still required running a bash script. Plus I hadn't really solved the problem of where to safely store my SSL certificates prior to server deployment such that I could still easily access them. Same goes for SSH keys and any other private encryption keys.

I've used [Puppet](http://puppetlabs.com/) before to setup a server and it wasn't an easy task. This time I decided to give [Ansible](http://ansible.com/) a go. Ansible, unlike Puppet, doesn't think in terms of having a provisioning server which broadcasts setup changes to your servers. Instead it basically connects to your server via SSH (other connection mechanisms are also available) and runs remote commands on the command-line. What you would normally do in a shell script but in a smarter and more reliable way.

Ansible has _playbooks_. Each playbook is an independently runnable Ansible script. Playbooks consist of tasks, some of which maybe imported from task libraries - what Ansible calls _roles_. And roles can be shared with the wider Ansible community at [galaxy.ansible.com](https://galaxy.ansible.com/list#/roles). All in all what this means is that Ansible already comes with libraries of tasks which can do things like install and setup Docker, install and setup nginx, etc. And nearly all of these tasks are highly configurable. And did I mention that Ansible can operate on groups of servers at a time? so you can execute a set of tasks against multiple servers in parallel.

There's a lot more to Ansible and I invite you to read their well-written documentation (I had to in order to understand what was possible and how best to makes use of it).

For my purposes I have two playbooks:

* Setup server - This will get run once to setup a newly obtained server with the right software (install Docker, etc.)  
* Deploy web app - This will get run every time I wish to deploy the latest version of the web app to the server

### Setup server

This playbook will set the hostname, install Docker, Postfix and Monit - basic services which are always needed. It also adds the SSL certificate and associated private key to the server. The key needs to be unprotected so that Nginx can be restarted without requiring a decryption password for the key. However I don't want to store the key in my repository unencrypted as this would enable anyone who gets access to it to then misuse it and my certificate.

Luckily Ansible provides a [vault](http://docs.ansible.com/playbooks_vault.html) feature. This is a command-line tool which allows you to AES-256 encrypt any file within your Ansible role folder tree. When you execute an Ansible playbook it will prompt for the password to this 'vault'. Note that it will only prompt you once for a vault password so ensure all your vaults are locked with the same password. In my Ansible setup I only have one vault, the file which stores the SSL certificate and private key.

Here is my `setupServer` playbook:

```  
- name: Set hostname
  hosts: live
  gather_facts: no
  roles:
    - Ansibles.hostname
 
 
- name: Install pycurl
  hosts: live
  gather_facts: no
  tasks:
    - name: Install pycurl
      apt: pkg=python-pycurl update_cache=yes cache_valid_time=600
 
 
- name: Install Docker
  hosts: live
  roles:
    - angstwad.docker_ubuntu
 
 
- name: Install Postfix
  hosts: live
  gather_facts: no
  roles:
    - geerlingguy.postfix
 
 
- name: Install Monit
  hosts: live
  gather_facts: no
  vars:
    monit_notify_email: 'build@foobar.com'
  roles:
    - Ansibles.monit
 
 
- name: Add my SSL credentials
  hosts: live
  gather_facts: no
  roles:
    - MyWebApp.ssl
```

The first 5 tasks are imported from roles available in the Ansible Galaxy. You can see the code for these there, e.g. see [geerlingguy.postfix](https://galaxy.ansible.com/list#/roles/907). The last role is my own custom one for copying over SSL certificates. It contains the following tasks script (`tasks/main.yml`):

```  
- name: Upload certificate
  shell: echo '{{ mywebapp_ssl_crt }}' > /etc/ssl/certs/mywebapp.crt
 
- name: Set certificate permissions
  file:
    path: /etc/ssl/certs/mywebapp.crt
    mode: 0644
 
- name: Upload key
  shell: echo '{{ mywebapp_ssl_key }}' > /etc/ssl/private/mywebapp.key
   
- name: Set key permissions
  file:
    path: /etc/ssl/private/mywebapp.key
    mode: 0600
```

As you can see it outputs the contents of two Ansible variables into files in the appropriate locations. The variables themselves are stored in another file (`defaults/main.yml`) which is vault-encrypted.

### Deploy web app

My second Ansible playbook calls through to another custom role which is responsible for deploying a particular web app:

```  
- name: Deploy website
  hosts: live
  vars_prompt:
    - name: "shippable_build_id"
      prompt: "Enter Shippable build ID"
      private: no
  roles:
    - MyWebApp.deploy
```

The `shippable_build_id` variable allows my Ansible script to download the build artifacts (which I mentioned earlier) from Shippable so that the web app doesn't need to be rebuilt during deployment.

Inside the `MyWebApp.deploy` role I have the following tasks (`tasks/main.yml`):

```  
- name: Copy over templates
  template:
    src: "{{item}}.j2"
    dest: "{{ansible_env.HOME}}/{{item}}"
  with_items:
    - mywebapp.com
    - mywebapp_sv.sh
    - mywebapp_sv_log.sh
    - Dockerfile
    - nginx.conf
    - nginx_sv.sh
    - nginx_sv_log.sh
    - docker_build.sh
    - syslogng_loggly.conf
 
- name: Copy SSL certificate
  shell: "cp /etc/ssl/certs/mywebapp.crt {{ansible_env.HOME}}"
 
- name: Copy SSL key
  shell: "cp /etc/ssl/private/mywebapp.key {{ansible_env.HOME}}"
 
- name: Make docker build script executable
  file: path="{{ansible_env.HOME}}/docker_build.sh" mode=0755
 
- name: Execute docker build
  shell: "{{ansible_env.HOME}}/docker_build.sh"
```

What's happening here is that any necessary scripts and config files for building and running the final web app get copied over to the remote server. The SSL credentials which are already on the server get copied into the folder in which the docker build script gets run. The `Dockerfile` template looks like this:

```  
# Use phusion/baseimage as base image. To make your builds reproducible, make  
# sure you lock down to a specific version, not to `latest`!  
# See https://github.com/phusion/baseimage-docker/blob/master/Changelog.md for  
# a list of version numbers.  
FROM phusion/baseimage:0.9.10

# Set correct environment variables.  
ENV HOME /root  
ENV DEBIAN_FRONTEND noninteractive

# Regenerate SSH host keys. baseimage-docker does not contain any, so you  
# have to do that yourself. You may also comment out this instruction; the  
# init system will auto-generate one during boot.  
RUN /etc/my_init.d/00_regen_ssh_host_keys.sh

# Use baseimage-docker's init system.  
CMD ["/sbin/my_init"]

# Build dependencies  
RUN apt-get -y update  
RUN apt-get install -y -q software-properties-common  
RUN add-apt-repository -y ppa:nginx/stable  
RUN add-apt-repository -y ppa:chris-lea/node.js-devel  
RUN apt-get -y update  
RUN apt-get install -y -q curl git nginx nodejs

# NPM globals  
RUN npm install --silent -g gulp bower

# Create RunSV logging root folder  
RUN mkdir /var/log/service

# Sylsog-ng loggly conf  
ADD syslogng_loggly.conf /etc/syslog-ng/conf.d/loggly.conf

# Add SSL credentials  
ADD mywebapp.crt /etc/ssl/certs/  
ADD mywebapp.key /etc/ssl/private/

# Add SSH credentials  
ADD .ssh/authorized_keys /root/.ssh/

# Get deployable code  
RUN curl -L https://api.shippable.com/projects/{{shippable_project_id}}/builds/{{shippable_build_id}}/artifacts -o /mywebapp.tgz  
RUN tar -xzf /mywebapp.tgz  
RUN ln -s /shippable/deploy/ /mywebapp

# Autostart mywebapp  
RUN echo production > /etc/container_environment/NODE_ENV  
RUN mkdir /etc/service/mywebapp  
ADD autonomail_sv.sh /etc/service/mywebapp/run  
RUN chmod x /etc/service/mywebapp/run  
# mywebapp sv logging  
RUN mkdir /var/log/service/mywebapp  
RUN mkdir /etc/service/mywebapp/log  
ADD autonomail_sv_log.sh /etc/service/mywebapp/log/run  
RUN chmod x /etc/service/mywebapp/log/run

# Nginx config  
RUN rm /etc/nginx/sites-enabled/*  
ADD mywebapp.com /etc/nginx/sites-enabled/  
ADD nginx.conf /etc/nginx/

# Autostart nginx (with logs)  
RUN mkdir /etc/service/nginx  
ADD nginx_sv.sh /etc/service/nginx/run  
RUN chmod x /etc/service/nginx/run  
# nginx sv logging  
RUN mkdir /var/log/service/nginx  
RUN mkdir /etc/service/nginx/log  
ADD nginx_sv_log.sh /etc/service/nginx/log/run  
RUN chmod x /etc/service/nginx/log/run

# Clean up APT when done.  
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*  
```

The above template shows you where all the copied over scripts and configuration files get used within the container. Notice how we use the `{{shippable_build_id}}` variable mentioned earlier to download the Shippable build artefacts.

I have both nginx and mywebapp running under the auspices of [runsv](http://smarden.org/runit/runsv.8.html), a lighter weight alternative to [supervisord](http://supervisord.org/) which allows you to run any app such that it gets automatically restarted if it crashes or shuts down.

The `/etc/service/nginx/run` script:

```bash  
#!/bin/bash  
exec 2>&1  
exec /usr/sbin/nginx  
```

The stdout/stderr redirection comes into play with the `/etc/service/nginx/log/run` script:

```bash  
#!/bin/bash  
/usr/bin/chpst /usr/bin/svlogd -tt /var/log/service/nginx  
```

At runtime runsv runs them both as a single command:

```  
/etc/service/nginx/run /etc/service/nginx/log/run  
```

This ensures all nginx startup output goes into the the `/var/log/service/nginx` log file. Ensure that `daemon off` is set inside the nginx configuration file so that nginx runs as a foreground process. This is required for runsv to be able to control it._

## Docker build

As you can see in the Dockerfile shown earlier, we base our final image on the Phusion base image, available at [https://github.com/phusion/baseimage-docker](https://github.com/phusion/baseimage-docker).

This is an open source Ubuntu image specially crafted for Docker. It has many features above and beyond the base Ubuntu image that one gets. For instance it ensures your Docker container can run background daemons (just like a normal VM). It also includes runsv (seen earlier) And [syslog-ng](http://www.balabit.com/network-security/syslog-ng), for sending log messages to a service such as [Loggly](https://loggly.com).

As you saw in the Ansible task list earlier, I copy over a bash script which is responsible for building the Docker image. It basically runs the Dockerfile to build the image and then replaces the existing running container with a one based on the newly built image. Here it is:

```bash  
#!/usr/bin/env bash
set -e
 
echo '>>> Get old container id'
CID=$(sudo docker ps | grep "mywebapp" | awk '{print $1}')
echo $CID
 
echo '>>> Building new image'
# Due to a bug in Docker we need to analyse the log to find out if build passed (see https://github.com/dotcloud/docker/issues/1875)
sudo docker build -t="mywebapp" . | tee /tmp/docker_build_result.log
RESULT=$(cat /tmp/docker_build_result.log | tail -n 1)
if [[ "$RESULT" != *Successfully* ]];
then
  exit -1
fi
 
 
echo '>>> Stopping old container'
if [ "$CID" != "" ];
then
  sudo docker stop $CID
fi
 
 
echo '>>> Restarting docker'
sudo service docker restart
sleep 5
 
 
echo '>>> Starting new container'
sudo docker run -p 443:443 -p 80:80 -p 5922:22 -d mywebapp
 
 
echo '>>> Cleaning up containers'
sudo docker ps -a | grep "Exit" | awk '{print $1}' | while read -r id ; do
 sudo docker rm $id
done
 
 
echo '>>> Cleaning up images'
# NOTE: we only take the latest image as Docker will perform a cascade of deletions
sudo docker images | grep "^<none>" | head -n 1 | awk 'BEGIN { FS = "[ \t]+" } { print $3 }'  | while read -r id ; do
 sudo docker rmi $id
done
```

One interesting point worth noting is that we forward port 5922 on the host to 22 on the container. This is because the Phusion base image has `sshd` running, so we can SSH directly into our running container if we ever need to. Attaching to a running container in Docker doesn't quite work as well as being able to do this. In fact, this ability to SSH into the container is probably my favourite feature provided by the Phusion image.

## Loggly

I mentioned earlier the possibility of sending logs from a running Docker container to Loggly. One of the benefits of doing this (or indeed sending your logs to another server which you can access) is that even if something happens to your log files you won't lose any of your logs up until that point. Indeed your logs may be the only thing which let you figure out what went wrong and why. It also allows you to passively monitor what's happening on your server without actually having to connect to the server. Loggly isn't the only service for this. There's also [Logstash](http://logstash.net/) - an open source alternative I have yet to try (Loggly's free quota is 200MB of logs per day, which suits my needs amply).

One of the configuration files copied over by my playbook is for [syslog-ng](http://www.balabit.com/network-security/syslog-ng), an open source implementation of the syslog protocol:

```  
source s_syslog {
  file("/var/log/syslog");
};
 
destination d_loggly_syslog {
  tcp("logs.loggly.com" port(37073));
};
 
log {
  source(s_syslog);
  destination(d_loggly_syslog);
};
 
source s_sv {
  file("/var/log/service/nginx/current");
  file("/var/log/service/mywebapp/current");
};
 
destination d_loggly_sv {
  tcp("logs.loggly.com" port(29528));
};
 
log {
  source(s_sv);
  destination(d_loggly_sv);
};
 
source s_nginx_error {
  file("/var/log/nginx/error.log");
};
 
destination d_loggly_nginx {
  tcp("logs.loggly.com" port(42755));
};
 
log {
  source(s_nginx_error);
  destination(d_loggly_nginx);
};
```

As you can see it instructs the syslog-ng agent to monitor certain log files for changes and then send the changes over TCP to loggly.com. The destination Loggly addresses are obtained manually from Loggly after creating the necessary 'inputs'. In Loggly I have three inputs - one for nginx errors, one for runsv errors and one for the general syslog.

## What next?

Right now once a Shippable build completes I receive an email, after which I grab the build number and use it to execute my Ansible playbook to deploy the latest build to my server, in a freshly built Docker container. I want to now automate this process. I am going to build a web interface for executing my Ansible playbooks and have it provide a REST API that gets called from Shippable every time a build completes. My dream is to be able to do a `git push` from my local machine and within minutes (assuming all my tests pass) have the latest version deployed on my live servers. Stay tuned...

**Update (20/6): I have now released [Ansibot](/archives/2014/06/20/ansijet-ansible-playbook-automation-server/), an Ansible playbook automation server which automates the process of re-deploying to the server once a build successfully completes**
