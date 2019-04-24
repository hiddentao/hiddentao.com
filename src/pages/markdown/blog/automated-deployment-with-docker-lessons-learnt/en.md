---
title: Automated deployment with Docker - lessons learnt
date: '2013-12-26'
summary: "**(The information in this article pertains to Docker v0.7. I have also a written a more [recent post on using Docker](http:&#47;&#47;www.hiddentao.com&#47;archives&#47;2014&#47;06&#47;03&#47;shippable-ansible-docker-loggly-for-awesome-deployments&#47;))**\r\n\r\nRecently for my client's project we decided to automate our staging server deployments using [Docker](https:&#47;&#47;www.docker.io&#47;learn_more&#47;), as a pre-cursor to rolling out Docker deployments across our production servers is everything worked out well. For those who haven't heard of Docker before I can briefly summarize what it does.\r\n\r\n## What is Docker?\r\n\r\nNormally when you need to deploy your web application to a server you first need to setup the necessary pre-requisites on the server in order to run your application. This might mean setting up MongoDB, PostgreSQL, Nginx, PHP, Python, Node, basically whatever is needed to get your application running. This is all well and good until you wish to, for example, deploy a second application onto the same server. Perhaps that second application requires a slightly different version of a particular environment, e.g. a different Python environment setup. In most cases there are ways in which you can run multiple versions of a particular environment without them conflicting with each other. But this isn't always easy. When it gets too difficult you might opt to use virtual machines, and maybe using something like [Vagrant](http:&#47;&#47;www.vagrantup.com&#47;) to do so. These are great but they add a lot of resource overhead - you're essentially running two or more copies of an entire OS in their own sandboxes, and this will have an impact on performance, RAM usage and even disk space usage no matter how much you optimise it.\r\n"
tags:
  - Docker
  - Linux
  - Deployment
---
**(The information in this article pertains to Docker v0.7\. I have also a written a more [recent post on using Docker](/archives/2014/06/03/shippable-ansible-docker-loggly-for-awesome-deployments/))**

Recently for my client's project we decided to automate our staging server deployments using [Docker](https://www.docker.io/learn_more/), as a pre-cursor to rolling out Docker deployments across our production servers is everything worked out well. For those who haven't heard of Docker before I can briefly summarize what it does.

## What is Docker?

Normally when you need to deploy your web application to a server you first need to setup the necessary pre-requisites on the server in order to run your application. This might mean setting up MongoDB, PostgreSQL, Nginx, PHP, Python, Node, basically whatever is needed to get your application running. This is all well and good until you wish to, for example, deploy a second application onto the same server. Perhaps that second application requires a slightly different version of a particular environment, e.g. a different Python environment setup. In most cases there are ways in which you can run multiple versions of a particular environment without them conflicting with each other. But this isn't always easy. When it gets too difficult you might opt to use virtual machines, and maybe using something like [Vagrant](http://www.vagrantup.com/) to do so. These are great but they add a lot of resource overhead - you're essentially running two or more copies of an entire OS in their own sandboxes, and this will have an impact on performance, RAM usage and even disk space usage no matter how much you optimise it.  

What Docker does is allow you to isolate your applications and their environment from each other without the overhead of running a virtual machine. It relies on Linux Containers, a feature [originally introduced in 2006](http://lwn.net/Articles/236038/) as a patch to the Linux kernel. Essentially speaking, the OS gives applications the [illusion of running on a separate machine](http://www.ibm.com/developerworks/linux/library/l-lxc-containers/) while at the same time sharing many of the underlying resources. Docker makes the usage of this user-friendly.

## How does Docker work?

In a nutshell...

You supply a base [Docker image](https://index.docker.io/) (e.g. similar in concept to [Vagrant boxes](http://www.vagrantbox.es/)) from which to create a _container_. You then run commands against your created container to set it up the way you want - for each command Docker runs it saves the delta of the modifications made to the container as a new container. Thus, containers depend upon each other, in a chain which extends right back to the image from which the first container was derived. You can execute an interactive bash shell within a container - for all intents and purposes it feels like you're then inside a VM. Containers, when run, can be bound to ports on the host machine, can have host machine folders shared with them, can share folders with other running containers - all in all very similar to what VMs can do.

The really useful bit is this. You can tell Docker to run a container in _daemon mode_. A container, once started in daemon mode, will keep running in the background as long as the initial command executed within the container is still executing. This is what really makes it useful as you can setup your app within a container and then start it up and have it run continuously. Thus you could build containers for each of your web apps and then start them all up in daemon mode, and have them all running continuously on the one machine, all isolated from each other, and all of this without the overhead of running virtual machines. Brilliant, right?

## An example

Although you can build your Docker container bit by bit from the command-line I found it easier to use a [Dockerfile](http://docs.docker.io/en/latest/use/builder/). It contains instructions that Docker will execute in the given order, as if you'd entered each one by hand on the command-line. Here is the one I built for our project:

```  
FROM ubuntu:12.04

# Fix upstart (see https://github.com/dotcloud/docker/issues/1024)  
RUN dpkg-divert --local --rename --add /sbin/initctl  
RUN ln -s /bin/true /sbin/initctl

# Build dependencies  
RUN echo 'deb http://archive.ubuntu.com/ubuntu precise main universe' > /etc/apt/sources.list.d/ubuntu-precise.list  
RUN echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' > /etc/apt/sources.list.d/mongodb.list  
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10  
RUN apt-get -y update  
RUN apt-get install -y -q curl g mongodb-10gen make build-essential zlib1g-dev libssl-dev libreadline6-dev libyaml-dev nginx supervisor git ruby1.9.3  
RUN gem install bundler

# Install NodeJS  
RUN curl -L http://nodejs.org/dist/v0.10.22/node-v0.10.22.tar.gz | tar -xz  
RUN cd /node-v0.10.22 && ./configure  
RUN cd /node-v0.10.22 && make && make install && make clean

# Global NPM installs  
RUN npm install --silent -g grunt-cli bower

# Add SSH keys  
ADD .ssh /user/deploy/.ssh

# Build src  
RUN git clone git@github.com:group/project.git /project  
RUN cd /project && bundle install  
RUN cd /project && npm install --silent  
RUN cd /project && bower --allow-root install  
RUN cd /project && grunt build

# Nginx config  
RUN rm /etc/nginx/sites-enabled/*  
RUN cp -r /project/deploy/nginx/* /etc/nginx/

# Supervisor  
RUN mkdir -p /var/log/supervisor  
RUN cp -r /project/deploy/supervisord/* /etc/supervisor/  
```

The first line informs Docker that we want to build on top of the `ubuntu 12.04` base Docker image. Docker will download this from the [global public image repository](https://index.docker.io/) if it hasn't already done so previously.

The next section takes care of [the upstart issue](https://github.com/dotcloud/docker/issues/1024). Some apt packages - e.g. mongodb - will try and start themselves up as services, the way they normally do on Linux systems. **Upstart and init.d services do not work inside Docker containers** so we need to essentially neuter the binary responsible for this. One thing to keep in mind is that **Docker does not run all the Dockerfile commands in a single container**. As mentioned earlier, after each command it stops the container, calculates the delta of the modifications made over the previous container and then saves this delta as a new container. It then runs this newly saved container in order to execute the next command in the file. So even if you could start a background service in the container it wouldn't make sense since it wouldn't be available when executing the next command in the Dockerfile.

The next few commands install a whole bunch of packages which I need later on for the app to work. One important point to make here is that **IPv4 forwarding must be enabled on the host machine** in order for your Docker container to be able to access the internet. [Work to make this automatic](https://github.com/dotcloud/docker/pull/2696) is ongoing. But for now follow [these instructions](http://www.ducea.com/2006/08/01/how-to-enable-ip-forwarding-in-linux/) to enable it. Finally, Docker doesn't seem to work well with certain firewalls. Specifically for me, I had to remove [arno-iptables-firewall](http://packages.debian.org/sid/arno-iptables-firewall).

Notice that in the Dockerfile above I add SSH keys from the host machine into the container in order to pull from our private Github repo. This looks insecure, right? if anybody breaks into the container system they'll be able to grab those keys. Initially, I wasn't doing this. I was actually calling [`ADD`](http://docs.docker.io/en/latest/use/builder/#add) for the source tree folder in order to avoid having to do a `git clone`. But this method becomes problematic for big source trees because the way Docker adds a folder it is to actually zip it up and send it to the Docker service running on the host machine, which then makes it available to the container being built. This obviously takes more time the larger the folder you want to add. **There is no way of sharing a folder on the host machine with a Docker container when building from a Dockerfile** - instead when you run a container you can (at that moment) choose to make a host machine folder available to it as a volume. So if you do want to use a Dockerfile you can either get Docker to add your folder to the container's filesystem by copying it or you can fetch your folder in some other way (which I do above using a git).

_(I didn't get time to look into using ssh-agent on the host machine as a way of sharing the SSH keys with the container - if someone else can try and get that working I'd love to hear about it)_.

The last thing to notice in the above Dockerfile is that I am using [supervisor](http://supervisord.org/) to continuously run both Nginx and the NodeJS application. As explained earlier, **a Docker container only stays running for as long the initially run command is still executing**. So what I do is run supervisor as a foreground process, and it in turn starts and up monitors the stuff I actually want to run. In fact, once my container is built here is the command I would use to start it up in daemon mode so that it keeps on running:

```bash  
sudo docker run -p 3020:80 -d <myContainerId> /usr/bin/supervisord --nodaemon
```

The above command starts up my container in daemon mode and runs supervisor in non-daemon mode, thus ensuring that the container stays running. Notice that I also bind port 80 on the container to port 3020 on the host machine, essentially making my web app (which is running within the container) accessible on port 3020\.

## Automated deployment

Once I'd figured out how to build and run containers I wanted to integrate them into our continuous deployment workflow. After a successful build on the build server we would want to replace the running container on the staging server with a newly built one containing the latest code changes.

The first thing to keep in mind is Docker's build system. **If and when a Docker build fails Docker does NOT clean up the intermediate containers built up until that point**. Now this isn't so much a problem since Docker also re-uses containers as much as it can - **if you try and build the same Dockerfile again without changing the instructions or their order then Docker will re-use containers previously built for that Dockerfile**. In effect, Docker treats the intermediate containers as a build cache. If, however, you do change an instruction in the Dockerfile or re-order some instructions around then Docker will only re-use the previously built containers up until the point where the Dockerfile has changed. So in your Dockerfile, make sure you **perform all package installations and software compilations before you ADD folders**. Otherwise, your builds will always take ages to complete. But even after being careful in this way, you could end up with a lot of containers from previously failed builds. And they do eat into your disk space, especially if you're installing 100's of Megabytes of packages like I am.

A good strategy is to tag your final built container so that it gets added to Docker's image list. Although Docker containers are images in of themselves, a tagged image which appear in the image list is essentially a fully self-contained container which can then be used to seed new containers - similar to VM base images. Once you've added your container as an image you can then instruct Docker to clean up all the old containers which are no longer running and reclaim some disk space:

```bash  
# create new image from our container and tag it as "project"
sudo docker commit <myContainerId> project
 
# We're being careful here in that we're only cleaning up containers which are no longer running
sudo docker ps -a | grep "Exit" | awk '{print $1}' | while read -r id ; do
  sudo docker rm $id
done
```

But what about the cacheing system mentioned earlier? For the next build of the Dockerfile won't Docker have to rebuild every container from scratch? Nope. **Once you've tagged your container as an image it's as if it acts as a container cache for the Dockerfile that was used to build it**. Which means our next build of the Dockerfile really only needs to start building containers once it reaches the `ADD` command again in the Dockerfile. This is nice.

Sometimes we may have an old, image we want to clean up too. Since we tag our final image with a name we can just look for the one which has no name and get rid of it:

```bash  
# create new image from our container and tag it as "project"
sudo docker commit <myContainerId> project
 
# We only remove images which don't have a name
sudo docker images | grep "^<none>" | head -n 1 | awk 'BEGIN { FS = "[ \t]+" } { print $3 }'  | while read -r id ; do
  sudo docker rmi $id
done
```

## Issues

One thing you might notice in the Dockerfile example given above is that I sometimes combine shell commands into a single line - I started doing this when I hit the [42 layer limit](https://github.com/dotcloud/docker/issues/1171) due to having too many commands. The fix for this will probably be in the next version of Docker.

I did find the Docker build would intermittently fail on a regular basis, at different points in the Dockerfile build process. Sometimes it would just hang whilst executing a Dockerfile command. I wasn't sure whether this was because I was remotely executing the command through SSH from Jenkins or whether it was due to the RAM on the server being too low or something like that. It was really hard to tell. My gut tells me this is due to Docker being pre-v1.0 - or perhaps I'm being too ambitious trying to do a Docker build remotely through SSH from Jenkins. I can't see that being an issue as previous non-Docker deployment mechanisms that also used SSH have worked fine for me.

Sometimes you'll find yourself [unable to remove previously stopped containers](https://github.com/dotcloud/docker/issues/2714). The only way to definitely remove stopped containers without errors is to restart the Docker daemon prior to removal.

Which leads to the next issue. If the Docker service running on the host machine gets restarted whilst containers are running then they come back as 'Ghost' containers, and you [might not be able to stop them]((https://github.com/dotcloud/docker/issues/3231) ) in the normal way. What's interesting is that Docker actually supports [auto-restarting of containers](https://github.com/dotcloud/docker/issues/26) that were previously running, so technically it should be able to handle this scenario well. The safe bet is to stop any running containers prior to restarting the daemon.

Given the above issues here is what I did in my deployment script:

1. Save ID of running Docker container (the old version of the app) into a variable  
2. Build new container  
3. Tag new container as an image and name it  
4. Stop old running container using its IDS  
5. Restart docker service  
6. Run new container in daemon-mode based on newly built image  
7. Delete old stopped containers  
8. Delete old un-tagged images

Here is the full bash script which does the above:

```bash  
#!/usr/bin/env bash
set -e
 
echo '>>> Get old container id'
CID=$(sudo docker ps | grep "project" | awk '{print $1}')
echo $CID
 
echo '>>> Building new image'
# Due to a bug in Docker we need to analyse the log to find out if build passed (see https://github.com/dotcloud/docker/issues/1875)
sudo docker build ./deploy | tee /tmp/docker_build_result.log
RESULT=$(cat /tmp/docker_build_result.log | tail -n 1)
if [[ "$RESULT" != *Successfully* ]];
then
  exit -1
fi
 
echo '>>> Tagging new image'
NEW=$(sudo docker ps -a -q | head -n 1)
sudo docker commit $NEW project
 
 
echo '>>> Stopping old container'
if [ "$CID" != "" ];
then
  sudo docker stop $CID
fi
 
 
echo '>>> Restarting docker'
sudo service docker restart
sleep 5
 
 
echo '>>> Starting new container'
sudo docker run -p 3000:80 -d project /usr/bin/supervisord --nodaemon
 
 
echo '>>> Cleaning up containers'
sudo docker ps -a | grep "Exit" | awk '{print $1}' | while read -r id ; do
  sudo docker rm $id
done
 
 
echo '>>> Cleaning up images'
sudo docker images | grep "^<none>" | head -n 1 | awk 'BEGIN { FS = "[ \t]+" } { print $3 }'  | while read -r id ; do
  sudo docker rmi $id
done
```

As you can see above we have to manually check for Docker build success due to [Docker not returning correct error codes](https://github.com/dotcloud/docker/issues/3334).

Finally, sometimes my built container would fail to start due to an [EOF error](https://github.com/dotcloud/docker/issues/2461) - again, cause unknown but the Docker team are aware of it.

## Going forward

Docker is really great. But unfortunately due to the intermittent build failures and the problems in cleaning up old containers and sometimes starting new ones, it hasn't proven reliable enough for continuous deployment. 3 out of 4 times I ended up having to manually log onto our staging server and start the container manually, and then clean up old containers manually. For now we've reverted to old-school non-Docker deployments. But the Docker team are hard at work fixing the above issues and I'm confident that by the time it hits v1.0 it will be more reliable and will warrant a second look.

**UPDATE (29 Jan 2014): I have since discovered that the reason my containers were randomly dying was due to insufficient RAM. I have since increased the RAM on my server and now my container (so far at least) seems to be staying up.**

**UPDATE (25 Jun 2014): I have since resolved many of the issues I previously had. Lack of RAM fixed by adding a swap space (duh). Also, with Docker 1.0 there is no longer any need to restart docker once you've killed the running container, Docker now cleans up nicely!**
