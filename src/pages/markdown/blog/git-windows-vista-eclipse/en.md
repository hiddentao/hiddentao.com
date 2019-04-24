---
title: Git + Windows Vista + Eclipse
date: '2010-08-12'
summary: "I've recently begun using [Git](http:&#47;&#47;git-scm.com&#47;) for some of my software projects. I've also started storing my repository on [GitHub](http:&#47;&#47;github.com&#47;hiddentao), a great way of sharing open source code with other developers. Git was originally developed for use on *nix systems - Windows support came a little bit later and many of the Git GUI tools have yet to reach an equivalent level of maturity to the SVN tools out there (such as [TortoiseSVN](http:&#47;&#47;tortoisesvn.tigris.org&#47;)). Nevertheless, I needed to Git working on Vista laptop and this post talks about the setup I'm using to get everything working.\r\n"
tags:
  - Git
  - Vista
  - Windows
  - Eclipse
---
I've recently begun using [Git](http://git-scm.com/) for some of my software projects. I've also started storing my repository on [GitHub](http://github.com/hiddentao), a great way of sharing open source code with other developers. Git was originally developed for use on *nix systems - Windows support came a little bit later and many of the Git GUI tools have yet to reach an equivalent level of maturity to the SVN tools out there (such as [TortoiseSVN](http://tortoisesvn.tigris.org/)). Nevertheless, I needed to Git working on Vista laptop and this post talks about the setup I'm using to get everything working.

Before I could really start using Git effectively I had to understand how it was different from the centralised version control systems (e.g. SVN) I had used in the past. A [great article by Charles Duan](http://www.eecs.harvard.edu/~cduan/technical/git/) explains the fundamental concept behind Git - it's about manipulating _commit trees_. And once I started using Git I found myself lacking in understanding when it came to _remotes_ - so I had found another article to explain [how merging from remote branches works](http://consttype.blogspot.com/2008/10/git-how-remotes-work.html) in Git. Now I was ready to setup my tooling.

Initially I grabbed [EGit](http://www.eclipse.org/egit/) for Eclipse Helios. This is a Git client implementation built on top of [JGit](http://www.jgit.org/), and is written in pure Java. I found that it works exceptionally well at cloning repositories and performing 'pulls'. But when it comes to 'push'-ing code back to the remote branch it requires you to configure the push reference and URL in your `.git/config` file (atleast at the time of writing this). With the other tools this isn't necessary but EGit sems to require it for now. Note that this isn't such a bad thing as it encourages you to learn how to write branch specs!

I then tried the tools that came with the Git distribution for Windows. These work great. There's a Git Bash shell which provides a Cygwin-like shell in which you can run all the Git commands. There's also a bare-bones Git GUI which allows you to clone a repository, commit changes and push commits up to the remote branch. Bot of these tools have Explorer integration which is good. The GUI uses the Git command-line tools to perform its operations and it makes it quicker to see the change diffs for your local changes.

The only thinking lacking in Git GUI is a nice Git commit history view though. This is where [Git Extensions](http://sourceforge.net/projects/gitextensions/) comes in. This provides a nice GUI which also has Explorer integration. It also uses the Git command-line tools to perform its operations and it provides you atleast all the commands the standard Git GUI does, plus more. Git Extensions also has decent commit history view which makes it easy to see where and when branches have been merged and forked. My only gripe with it is that the Git Push doesn't always work for remote repository URL which is in the form:

```
ssh://user@domain/project.git
```

The standard Git GUI works great for this URL. However, if you're just pushing to Github (which relies on SSH key authentication) then Git Extensions will work great for you. By the way, for SVN users who are used to using `svn ssh://` there is no equivalent in Git - just use `ssh://` instead.

One final tip: when you clone a remote repository onto your Windows machine, edit `.git/config` and ensure the `filemode` setting is set to `false`. Otherwise when you come to make your first commit you'll find it including a whole bunch of files which you didn't even touch purely because their file permissions have changed (I didn't even realise Git stored file permissions!). In fact, here is the `.git/config` file for my [Drupal Patterns fork](http://github.com/hiddentao/patterns2):

```
[core]
  repositoryformatversion = 0
  filemode = false
  bare = false
  logallrefupdates = true
  symlinks = false
  ignorecase = true
  hideDotFiles = dotGitOnly
[remote "origin"]
  fetch =  refs/heads/*:refs/remotes/origin/*
  url = git@github.com:hiddentao/patterns2.git
```

**Update 1:** I found a [Git cheat sheet](http://cheat.errtheblog.com/s/git).

