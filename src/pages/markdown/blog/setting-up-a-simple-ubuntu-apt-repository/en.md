---
title: Setting up a simple Ubuntu apt repository
date: '2011-06-27'
summary: "For a recent project I needed to deploy a custom build of PHP 5.2 to multiple Lucid servers. It had to be deployed in such a way as to make it easy to update all the servers with newer versions of the build in future. We decided to set up a Ubuntu repository containing the installation packages which we would access through the `apt` utilities. This post outlines the steps needed to get something like this working.\r\n"
tags:
  - Ubuntu
---
For a recent project I needed to deploy a custom build of PHP 5.2 to multiple Lucid servers. It had to be deployed in such a way as to make it easy to update all the servers with newer versions of the build in future. We decided to set up a Ubuntu repository containing the installation packages which we would access through the `apt` utilities. This post outlines the steps needed to get something like this working.

First of all, I'm assuming that you've got a web server (Apache, nginx, etc.) set to serve documents from the `/var/www` folder. Install the necessary pre-requisites:

```bash
$ sudo apt-get install dpkg-dev
```

Now setup the repository folders and files. The repository itself will be at `/var/www/repo` and the package files (.deb) will be at `/var/www/repo/binary`.

```bash
$ cd /var/www
/var/www$ sudo mkdir repo
/var/www$ cd repo
/var/www/repo$ sudo mkdir binary
/var/www/repo$ cp <path_to_deb>/*.deb binary
```</path_to_deb>

Now lets generate an index. This will create a file at `binary/Packages.gz`:

```bash
/var/www/repo$ sudo su
/var/www/repo$ dpkg-scanpackages binary /dev/null | gzip -9c > binary/Packages.gz
/var/www/repo$ exit
```

That's it! You now have an *unsigned* repository which you can use by creating a file in `/etc/apt/sources.list.d` folder on the server on which you wish to install these packages:

```
# /etc/apt/sources.list.d/repo.list

# replace {hostname} with the actual hostname
deb deb http://{hostname}/repo binary/
```

If you now do an `apt-get update` you should gain access to installing the packages you placed in the `binary` folder.

Ideally you'd want to sign your repository so that you can trust it. I haven't been able to get this working with mine just yet but below are links to resources which I've found on it, and which may help you. If you do get signed repositories working well please let me know!

* [http://mediakey.dk/~cc/howto-create-your-own-debian-or-ubuntu-package-repository/](http://mediakey.dk/~cc/howto-create-your-own-debian-or-ubuntu-package-repository/)
* [http://purplefloyd.wordpress.com/2009/02/05/signing-deb-packages/](http://purplefloyd.wordpress.com/2009/02/05/signing-deb-packages/)
* [http://wiki.debian.org/SecureApt](http://wiki.debian.org/SecureApt)
* [http://hyperlogos.org/Simple-recipe-custom-UbuntuDebian-repositories-with-apt-ftparchive](http://hyperlogos.org/Simple-recipe-custom-UbuntuDebian-repositories-with-apt-ftparchive)
