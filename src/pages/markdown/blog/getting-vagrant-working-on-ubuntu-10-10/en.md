---
title: Getting Vagrant working on Ubuntu 10.10
date: '2011-06-22'
summary: "I've recently started using [Vagrant](http:&#47;&#47;vagrantup.com&#47; \"Vagrant\") to create and deploy virtualized development environments and thought I'd post the steps required to get it working on Ubuntu 10.10 (\"Maverick Meerkat\").\r\n"
tags:
  - Vagrant
  - Ubuntu
  - VirtualBox
---
I've recently started using [Vagrant](http://vagrantup.com/ "Vagrant") to create and deploy virtualized development environments and thought I'd post the steps required to get it working on Ubuntu 10.10 ("Maverick Meerkat").

As explained on Vagrant's homepage it's a tool which uses [Virtualbox](http://www.virtualbox.org/) (a powerful virtualizer) to host the VM images it creates. Vagrant allows you to very quickly configure and run a virtualized environment through a simple configuration file and then package that environment as a "box" which can then be handed to other developers to run. So for instance, you could configure a virtual machine to have Apache, MySQL and a bunch of other stuff setup on it and then package the whole thing and hand it off to another developer to use, allowing them and you to quickly setup a fresh development environment when needed without having to install all the necessary software over and over again.

This post goes over the steps needed to get a basic Vagrant VM running on your machine. The instructions assume you are running Ubuntu 10.10 on a 64-bit procesor but in practice they will probably work for any version of Ubuntu from Lucid onwards, and possible even Debian versions.

## 1. Install Ruby and RubyGems

Vagrant is written in Ruby and is installed as a [RubyGem](http://rubygems.org/). So first of all we need to install these two things. Skip this step if you already have this setup, though note that I am using Ruby 1.8 on my machine.

```bash
$ sudo apt-get install ruby1.8 ruby1.8-dev rubygems1.8
```

Now we will create a symlink (`/usr/bin/ruby`) to the ruby executable:

```bash
$ sudo ln -s /usr/bin/ruby1.8 /usr/bin/ruby
```

Check that ruby is working. You should see something like this:

```bash
$ ruby -v
ruby 1.8.7 (2010-06-23 patchlevel 299) [x86_64-linux]
```

Check that gems is working:

```bash
$ gem -v
1.3.7
```

## 2. Install VirtualBox

Goto [www.virtualbox.org](http://www.virtualbox.org) and download the appropriate VirtualBox package for your platform. As of writing this (June 22, 2011) the latest version is 4.0.8.

If you're using Ubuntu then you will see an entry called *Oracle VM VirtualBox* under _Applications -> System Tools_. Click this to launch VirtualBox and you will then be able to create, configure and boot virtual machines of your choice, even Windows ones if you have a Windows installation disc.

## 3. Install Vagrant

This is easy. Simply install the gem:

```bash
$ sudo gem install vagrant
```

Create a symlink for vagrant into `/usr/local/bin`. You'll need to find out where your vagrant binary is first (on my system it's at `/var/lib/gems/1.8/gems/vagrant-0.7.5/bin/vagrant`):

```bash
$ sudo ln -s /var/lib/gems/1.8/gems/vagrant-0.7.5/bin/vagrant /usr/local/bin/vagrant
```

Check that it works:

```bash
$ vagrant --version
[vagrant] Creating home directory since it doesn't exist: /home/ram/.vagrant
[vagrant] Creating home directory since it doesn't exist: /home/ram/.vagrant/tmp
[vagrant] Creating home directory since it doesn't exist: /home/ram/.vagrant/boxes
[vagrant] Creating home directory since it doesn't exist: /home/ram/.vagrant/logs
Vagrant version 0.7.5
```

## 4. Create and boot your first VM

Create a folder somewhere to hold your Vagrant configuration file. I'm putting mine in `~/src/vagrant`:

```bash
$ mkdir ~/src/vagrant
$ cd ~/src/vagrant
```

Now create a configuration file called `Vagrantfile` within this folder. This tells Vagrant how to build and boot the VM. Put the following into it:

```ruby
Vagrant::Config.run do |config|
# full list of boxes available at https://github.com/mitchellh/vagrant/wiki/Available-Vagrant-Boxes
config.vm.box = "lucid64"
config.vm.box_url = "http://files.vagrantup.com/lucid64.box"
end
```

As you can see we've set the name of the VM to be *lucid64*. This will be its hostname too. For the base [pre-packaged box](vagrantup.com/docs/boxes.html) we've opted for a 64-bit Ubuntu 10.04 ("Lucid Lynx") distribution.

Once you've created this file you're ready to boot the VM. You should see something like the following:

```bash
~/src/vagrant$ vagrant up
[default] Box lucid64 was not found. Fetching box from specified URL...
[default] Downloading with Vagrant::Downloaders::HTTP...
[default] Downloading box: http://files.vagrantup.com/lucid64.box
[default] Extracting box...
[default] Verifying box...
[default] Cleaning up downloaded box...
[default] Importing base box 'lucid64'...
[default] Matching MAC address for NAT networking...
[default] Running any VM customizations...
[default] Clearing any previously set forwarded ports...
[default] Forwarding ports...
[default] -- ssh: 22 => 2222 (adapter 1)
[default] Creating shared folders metadata...
[default] Booting VM...
[default] Waiting for VM to boot. This can take a few minutes.
[default] VM booted and ready for use!
[default] Mounting shared folders...
[default] -- v-root: /vagrant
```

Notice that port 2222 on your host machine now points to port 22 on the VM. To SSH into your VM simply run:

```bash
~/src/vagrant$ vagrant ssh
Linux lucid64 2.6.32-28-server #55-Ubuntu SMP Mon Jan 10 23:57:16 UTC 2011 x86_64 GNU/Linux
Ubuntu 10.04.2 LTS
Welcome to the Ubuntu Server!
* Documentation: http://www.ubuntu.com/server/doc
Last login: Wed Jun 1 05:32:33 2011 from 10.0.2.2
vagrant@lucid64:~$
```

That's it! You're now ready to start installing software into your VM and do whatever you like with it. Once you exit the VM's ssh session you can halt the VM by running:

```bash
~/src/vagrant$ vagrant halt
[default] Attempting graceful shutdown of linux...
```

To resume it simply run:

```bash
~/src/vagrant$ vagrant reload
[default] Running any VM customizations...
[default] Clearing any previously set forwarded ports...
[default] Forwarding ports...
[default] -- ssh: 22 => 2222 (adapter 1)
[default] Creating shared folders metadata...
[default] Booting VM...
[default] Waiting for VM to boot. This can take a few minutes.
[default] VM booted and ready for use!
[default] Mounting shared folders...
[default] -- v-root: /vagrant
```

You can also opt to destroy the VM and clean up all its resources by running:

```bash
~/src/vagrant$ vagrant destroy
[default] Forcing shutdown of VM...
[default] Destroying VM and associated drives...
[default] Destroying unused networking interface...
```

Note that once you destroy your VM you'll have lost any changes you made to it after it first booted. This includes anything you did during the VM SSH session.

## 5. GUI mode

If for some reason you have problems booting your VM or it looks like it's hanging then there may be some configuration problem you need to sort out. To easily find out what the problem is you should turn on GUI mode in the `Vagrantfile`:

```ruby
Vagrant::Config.run do |config|
config.vm.box = "lucid64"
config.vm.box_url = "http://files.vagrantup.com/lucid64.box"
# this will cause VirtualBox to launch a GUI window for the VM
config.vm.boot_mode = :gui
end
```

Now, when you try and boot the VM you'll see a GUI window courtesy of VirtualBox. If any errors do occur they will show up as dialog boxes. For instance, on my machine I got one saying that the hardware virtualization setting hadn't been enabled. Even if the vagrant shell command hangs you should be able to login to your VM through the GUI window which comes up.
