---
layout: post
published: true
title: Ansijet - Ansible playbook automation server
excerpt: "**Project renamed from Ansibot to Ansijet, to avoid confusion with Github's
  Ansibot**\r\n\r\nI have just released [Ansijet](http:&#47;&#47;hiddentao.github.io&#47;ansijet),
  an Ansible playbook automation server. This server exposes a REST API which allows
  you to automatically trigger Ansible playbooks based on other events within your
  system. For my purposes I use it to automatically re-deploy to my servers when a
  successful build completes (I blogged about this [previously](&#47;archives&#47;2014&#47;06&#47;03&#47;shippable-ansible-docker-loggly-for-awesome-deployments&#47;)).\r\n"
date: '2014-06-20 15:39:18 +0800'
categories:
- Uncategorized
tags:
- node.js
- Deployment
- Ansible
comments:
- id: 4960
  author: mpdehaan
  author_email: michael.dehaan@gmail.com
  author_url: ''
  date: '2014-06-20 21:37:00 +0800'
  date_gmt: '2014-06-20 20:37:00 +0800'
  content: "<p>Can you please change the name of this?  We already have an official
    GitHub bot that comments on things as Ansibot and this may get confusing as it
    makes it sound like they are related.<&#47;p>\n"
- id: 4961
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2014-06-21 10:26:00 +0800'
  date_gmt: '2014-06-21 09:26:00 +0800'
  content: "<p>Fair point, I wasn't aware of that. I have now renamed the project.<&#47;p>\n"
- id: 5000
  author: posthum
  author_email: posthum@outlook.com
  author_url: ''
  date: '2014-11-09 22:25:00 +0800'
  date_gmt: '2014-11-09 22:25:00 +0800'
  content: "<p>It does not run as web server on Ubuntu 14.04 when I tried to install
    according to your instruction.<&#47;p>\n"
- id: 5001
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2014-11-10 02:27:00 +0800'
  date_gmt: '2014-11-10 02:27:00 +0800'
  content: "<p>Please post any issues to https:&#47;&#47;github.com&#47;hiddentao&#47;ansijet&#47;issues
    so that they can be worked on.<&#47;p>\n"
---
**Project renamed from Ansibot to Ansijet, to avoid confusion with Github's Ansibot**

I have just released [Ansijet](http://hiddentao.github.io/ansijet), an Ansible playbook automation server. This server exposes a REST API which allows you to automatically trigger Ansible playbooks based on other events within your system. For my purposes I use it to automatically re-deploy to my servers when a successful build completes (I blogged about this [previously](/archives/2014/06/03/shippable-ansible-docker-loggly-for-awesome-deployments/)).  

## How it works

Ansijet is built in Node.js using the [Waigo](http://waigojs.com) web framework. It runs as web service, exposing both a normal web interface and a REST API. When setting it up you have to have your playbooks already available on the local file system - you then point Ansijet to the relevant folder. At runtime it scans your playbooks folder and saves the metadata into storage (MongoDB). You can then setup on or more _triggers_ against a playbook. A trigger exposes a URL which you can then call to run the playbook.

There are at present two types of triggers supported:

* Simple - This trigger type creates triggers which simply run the playbook with no additional checks.

* Shippable - This trigger type creates triggers which expect to be invoked from [shippable.com](https://www.shippable.com) CI builds. You can supply a project id and a Git branch for which the playbook should run. It makes available the build number, branch name and project id as variables to your Ansible playbook. Once [Shippable build artefacts are externally accessible](https://github.com/Shippable/support/issues/205) it will also be able to check for their existence and then pass the artefacts URL as another variable to Ansible.

## Shell processes

Ansijet runs each playbook in a separate shell process, which means it can run multiple playbooks in parallel when needed, though it is still smart enough to ensure that only instance of any given playbook is running at a time. The default parallelism level is 1 (i.e. no parallelism) but this can be changed in the configuration options.

Sometimes a playbook run may freeze - to prevent a run from never completing, Ansijet will auto-kill the shell process if no output has been received for more than 5 minutes (this time window is configurable).

## Log capture

Each invocation of a trigger is treated as a separate _job_. In the logs section you can drill down to view just the logs for a particular job.

All logs from jobs are captured. If the incoming trigger invocation is malformed or incorrect parameters are supplied then this is also logged. In short, you always know why or how a particular job has failed.

## Front-end tech

For Ansijet's front-end I decided to try out two new libraries - [Minfied.js](http://minifiedjs.com/) and [Axis](https://github.com/jenius/axis).

Minified.js is a jQuery-like toolkit but much much smaller in size. I'm quite happy with it as it has all the features I normally use, has good browser support, and doesn't have as big an impact on total download size as jQuery would. Axis is a Stylus toolkit, similar to Bootstrap but not as big. It lacks a grid framework (I was recommended [Jeet](https://github.com/mojotech/jeet) as an alternative by the author) but it's collection of mixins is quite good. And it builds on top of [nib](http://visionmedia.github.io/nib/), which I like.

---

I'm already using Ansijet successfully in production. I hope you find it useful too. And all contributions (pull requests, feature requests, bug reports, etc.) are welcome.

Find Ansijet at:

* Homepage: [http://hiddentao.github.io/ansijet](http://hiddentao.github.io/ansijet)  
* Source: [https://github.com/hiddentao/ansijet](https://github.com/hiddentao/ansijet)