---
title: 'We need a decentralized, censorship-resistant Twitter-like platform'
date: '2016-08-30'
summary: ''
tags:
  - Twitter
  - Ethereum
  - Blockchain
  - Censorship
---

We need a decentralized, censhorship-resistant Twitter-like platform for open dialogue and impartial crowd-sentiment analysis.

**Note: I sent this in as an application to Vinay Gupta's [Hexayurt Capital](http://hexayurt.com/capital).**

Current social networking platforms such as Twitter are centrally controlled and thus extremely vulnerable to censorship. The platforms' value and wealth is derived from the content created by users who are not compensated in any way for either the personal information they offer or the viral content they generate for the platform.

A number of problems are apparent. Because such platforms are so dominant today, network effects ensure that most newcomers still choose to come to these platforms and that existing users prefer to stay rather than shift to a new platform with fewer users (even though it may be superior). Combined with censorship we are left with platforms which we all rely on, have no control over and can censor us at any time.

I propose building a platform which provides the same ease of use as Twitter but which makes censorship extremely difficult if not impossible and can then be relied upon as a basis for sentiment analysis of large populations. 

All users would have a public-private key pair (this could be an Ethereum blockchain account). All content created a by a user would be digitally signed with their public key (though not encrypted, since all content is public), and there would be a running hash of all their content (similar to a Git hash) publicly available to other users, thus allowing anyone to verify that a user's content has been produced by them and has not been tampered with. 

Users would be incentivised to use the platform through a system which rewards them in proportion to the popularity of their content (through e.g. re-tweets and likes). 

The platform itself would utilise the Ethereum blockchain (mainly for the verification of identity and content integrity, and for payment tracking) and most likely a peer-to-peer distributed storage system (IPFS/Swarm) for actual content storage and distribution. If there still needs to be a standard web presence - this can be running an open source stack and made hostable by anybody where-in the different hosted versions can connect with each other, forming a sort of "federation" of peers. However, as much core functionality as possible would be stored in the blockchain and IPFS/Swarm.

Once such a censorship resistant platform is available large-scale sentiment analysis makes sense. This would involve AI algorithms and my hope is that something similar to pol.is would be possible, except with a much richer and rapidly changing dataset (I am not sure if sentiment analysis is at a point yet where such large-scale analysis and aggregation is possible). 

I am still thinking through the revenue model for the platform. Adverts, though possible, would bring in little revenue since they would likely not be very well targetted due to the fact no profile is being built up about the user. An alternative would a regular participation fee paid by users, which then gets added to a "pot" from which payouts occur on a regular basis. Or perhaps the sentiment analysis system can be a commercial service which brings in revenue. Note that the dataset in this platform will be more reliable than that in other platforms due to its lack of censorship, thus making results of data analysis  more valuable.

*Note: Although one could analyse Twitter feeds in the same way, the very real prospect of censorship means that the data is already explicitly skewed according to the biases of the people controlling the platform rather than the being representative of what the site user's think. With this newer platform there would still be biases according to what type of user is most prevalent - however that is a far less serious (and almost unavoidable problem) when it comes to platforms than in the former.*

*Note: I haven't dealt with privacy and/or surveillance yet. The platform I am discussing is more akin to Twitter rather than something like Facebook. As such, there is less personal information being handed over to the platform controllers. However, if the platform is open source and distributed (i.e. it's running mainly on the blockchain and IPFS/Swarm as explained above) then it can go a long way towards collecting as little information as possible about users, thus giving it a privacy advantage over platforms like Twitter).*

