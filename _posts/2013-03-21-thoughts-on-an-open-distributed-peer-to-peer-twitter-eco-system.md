---
layout: post
published: true
title: 'Thoughts on: an open, distributed peer-to-peer Twitter eco-system'
excerpt: "As Twitter becomes ever more important and people begin to wonder whether
  it can even be used to [balance out biased&#47;incomplete mainstream news outlets](http:&#47;&#47;mediamatters.org&#47;blog&#47;2013&#47;03&#47;18&#47;could-twitter-have-stopped-the-medias-rush-to-w&#47;193074)
  it becomes clear that leaving it in control of one entity (the [Twitter](http:&#47;&#47;www.twitter.com&#47;)
  company) is unwise. Don't get me wrong, I love Twitter and I love what the folks
  behind are doing with it. I am also a fan of how their efforts to [stand up for
  users' rights](http:&#47;&#47;www.nbcbayarea.com&#47;news&#47;local&#47;Twitter-Goes-to-Court-to-Protect-User-Data-150665965.html).
  But perhaps it's now time to build a more resilient, decentralised alternative to
  a) make such privacy violations more difficult, and b) reduce the likelihood and
  impact of a server failure or hack impacting the entire twitter-verse.\r\n"
date: '2013-03-21 04:07:17 +0800'
categories:
- Uncategorized
tags:
- Thoughts
- Architecture
- Twitter
- P2P
comments:
- id: 5064
  author: https:&#47;&#47;www.techdirt.com:443&#47;articles&#47;20150717&#47;11191531671&#47;protocols-instead-platforms-rethinking-reddit-twitter-moderation-free-speech.shtml
    | The Today Online
  author_email: ''
  author_url: http://thetodayonline.com/httpswww-techdirt-com443articles2015071711191531671protocols-instead-platforms-rethinking-reddit-twitter-moderation-free-speech-shtml-2-2015-07-18/
  date: '2015-07-18 15:00:06 +0800'
  date_gmt: '2015-07-18 14:00:06 +0800'
  content: "<p>[&#8230;] trying to do so again outside of the company. And plenty
    of people have discussed building a distributed Twitter for [&#8230;]<&#47;p>\n"
---
As Twitter becomes ever more important and people begin to wonder whether it can even be used to [balance out biased/incomplete mainstream news outlets](http://mediamatters.org/blog/2013/03/18/could-twitter-have-stopped-the-medias-rush-to-w/193074) it becomes clear that leaving it in control of one entity (the [Twitter](http://www.twitter.com/) company) is unwise. Don't get me wrong, I love Twitter and I love what the folks behind are doing with it. I am also a fan of how their efforts to [stand up for users' rights](http://www.nbcbayarea.com/news/local/Twitter-Goes-to-Court-to-Protect-User-Data-150665965.html). But perhaps it's now time to build a more resilient, decentralised alternative to a) make such privacy violations more difficult, and b) reduce the likelihood and impact of a server failure or hack impacting the entire twitter-verse.

[identi.ca](http://www.identi.ca/) is a start in the right direction of building an open source community-drive twitter echo-system. But it's shortcoming is that for the most part people are still tied to a single service provider. Yes, they can setup their own back-end but what's the point in doing that if you simply lose access to the community of users who still remain on the main back-end. Dave Winer has already written about building a [decentralised, distributed system](http://orangejuiceliberationfront.com/building-a-distributed-twitter/) [based on RSS feeds](http://scripting.com/stories/2012/07/25/anOpenTwitterlikeEcosystem.html) which has no central controlling authority. This is the correct approach (both technically and philosophically) and warrants further development.

Looking back at the evolution of peer-to-peer music sharing networks, network architecture went from Napster (central server) to Gnutella (pure peer-to-peer) to Kazaa ([peer-to-peer with auto-elected supernodes](http://computer.howstuffworks.com/kazaa3.htm)). Kazaa was the first file sharing network which was hugely successful because searches were super-fast. This final iteration became the de-facto architectural standard for peer-to-peer globally distributed file sharing networks (for instance Gnutella2 later used a similar architecture to what Kazaa used). The benefits of this architecture:

1. No centralised server facilitating search and discovery meant that no one could easily shut down the network. Yes, joining clients had to be able to get a list of supernodes to connect to initially from a server somewhere. But at least such a list is much easier to replicate and protect from shutdown than a server that's required to facilitate searches.
2. Network nodes organized and "elected" supernodes amongst themselves without the need for a centralized arbiter; a process which got repeated as nodes joined and left the network, thereby always maintaining an efficient structure.
3. Supernode clients would inform the supernode of their library content (metadata only) thereby allowing for fast searches across the network (since you only have to query supernodes).

So, though RSS could be used as the basis for a decentralised Twitter I doubt searches would be as quick as they are in Twitter. Plus, RSS wasn't really designed for micro-blogging and thus isn't designed for real-time updates like Twitter is. A supernode-based peer-to-peer network, on the other hand, is designed for fast search and discovery. Here is how some common Twitter functionality could be implemented:

* When a client tweets this tweet gets broadcast to all supernodes. Each supernode knows which tags or strings its children are listening to and is thus able to push this tweet downwards according to how its content matches up.
* When a client DMs another client this again is just a matter of first discovering the location (i.e. IP address) of the other client by search and then directly messaging them.
* When a client replies to a tweet it's the same process again.
* When a client follows another client it's the same as telling its supernode to give it tweets by that particular client uid.

Disadvantages of this approach:

* Unlike our peer-to-peer network Twitter works for you even when you're not logged in. But we don't have or want a central always-available place to store tweet history so the alternative is for a client - once logged in - to query all the people they're following for their latest updates. Not efficient at all.
* We still aren't fully decentralized since a client still needs a reliable way of finding either a supernode or peer already connected to the network in order for themselves to get connected.
* We have to design and develop new protocols and standards for this architecture, whereas RSS is tried and trusted and already well understood and supported.

I'm sure there are things I've overlooked or forgotten. I'd appreciate other thoughts on this.