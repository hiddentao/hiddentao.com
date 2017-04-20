---
layout: post
published: true
title: Idea for a local app based social network
excerpt: "Here's a crazy idea which popped into my head the other day. What if we
  could build a secure social network using a local app manipulating locally stored
  data?\r\n\r\nWhy would we want to do this? After all there are a number of [alternative](https:&#47;&#47;github.com&#47;diaspora&#47;diaspora),
  [open](http:&#47;&#47;elgg.org&#47;) [source][&#47;source](http:&#47;&#47;buddycloud.com&#47;)
  [social](http:&#47;&#47;opensource.appleseedproject.org&#47;) [networks](http:&#47;&#47;movim.eu&#47;)
  currently being built which give you control over your data and allow you to move
  all your data from one host to another, where each host adheres to the specification
  laid out by said social network. The immediate problem with all of these is that
  if you're a non-technical user, setting up and running your own host is a pain.
  It's all good and well trusting somebody else to host your data but for ultimate
  privacy and control you'll want to have your own local copy of it and be able to
  manipulate your profile locally without having to use a third-party website.\r\n"
date: '2011-08-11 11:18:01 +0800'
categories:
- Uncategorized
tags:
- Social Networking
comments: []
---
Here's a crazy idea which popped into my head the other day. What if we could build a secure social network using a local app manipulating locally stored data?

Why would we want to do this? After all there are a number of [alternative](https://github.com/diaspora/diaspora), [open](http://elgg.org/) [source][/source](http://buddycloud.com/) [social](http://opensource.appleseedproject.org/) [networks](http://movim.eu/) currently being built which give you control over your data and allow you to move all your data from one host to another, where each host adheres to the specification laid out by said social network. The immediate problem with all of these is that if you're a non-technical user, setting up and running your own host is a pain. It's all good and well trusting somebody else to host your data but for ultimate privacy and control you'll want to have your own local copy of it and be able to manipulate your profile locally without having to use a third-party website.

So the software to load and deliver your social profile should be installable and usable by you on your own machine. It needs to be light-weight, easily update-able and have a fantastic GUI. We could write it as a native app but then we have to worry about multiple implementations for all the various platforms out there. Looking at the various options out there for building cross-platforms easily the choice is between [Appcelerator Titanium](http://www.appcelerator.com/products/titanium-cross-platform-application-development/), [PhoneGap](http://www.phonegap.com/), [Flex](http://www.adobe.com/products/flex/) or a HTML5 local web app. Titanium is particularly attractive because it produces native apps for Android and iOS platforms, something none of the others do as far as I'm aware. I'll admit that I was initially thinking just about the web app implementation with a Javascript-driven UI (inspired by [TiddlyWiki](http://www.tiddlywiki.com/)) but that probably won't scale up well enough in terms of code structure or volume of data.

The way I envision it, your data would be stored separately to the application, probably as a single file which contains everything in a compressed, encrypted format. When you load the application it would your data in from this file and then continuously read from and write to this file as you about "socializing". But your data won't just be stored locally - it will also be on a server. Let me explain. As with other existing "distributed" social networks, you must opt to host your profile on a host within the network. The key thing here is that the host simply acts as a publicly-accessible repository for your data, i.e. a way for other people to find you on the network. Other people running the social network app on their local machines can fetch your profile data from the host and view it locally - there is no way for them to browse and interact with your profile on the host itself as there's no need for that. The normal privacy and security rules would still apply - so you would be able to set who can read and see what in your profile as well send and receive "friend" requests.

In many ways this is similar to how p2p networks like, in that the central servers (e.g. bittorrent trackers) simply allow you to discover who else is on the network and what they're sharing. The bulk of the exchanges happen directly between users, outside the scope of the trackers. All the hosts connect together in a hierarchical manner so that the network is made up of a number of interconnected hosts, with new hosts joining and leaving at will (ok, this is really beginning to sound like [Gnutella2](http://en.wikipedia.org/wiki/Gnutella2)!). In our case the network hosts needs to do a bit more work than simply search and discovery. If you're not currently online then a incoming friend request will get stored on the host. Next time you come online (by starting your local app) you automatically synchronize data with your host. When you synchronize data with your host any changes you've made locally get sent up and vice versa.

Obviously, for redundancy and availability sake host data would need to get mirrored across the network. But remember that you always have a fully copy of your social profile data locally so even if the whole shebang goes down all you'd need to do is setup or connect to a new host and you're good to go :)

If I post something to somebody else's profile then it gets copied into both mine and their profiles. I haven't yet though through the low-level technical details of how to restrict access to things a person posts to only the people they choose but I reckon some sort of public-key encryption based mechanism is do-able for this. Ideally, when I add someone as a friend, they should only see things I post from that point onwards and nothing from before. If I remove them as a friend they should not be able to see any of my future posts. They should, however always still be able to see the stuff I posted and made visible to them whilst they were my friend.

So that's about as far as I've got with this idea for now. I'll add more as and when it comes into my head. A lot of the above has probably been covered in places like the [Diaspora discussion group](http://groups.google.com/group/diaspora-discuss?pli=1) but I thought it would be good to discuss these ideas from a fresh context.

I'd love to hear any thoughts you may have on this.