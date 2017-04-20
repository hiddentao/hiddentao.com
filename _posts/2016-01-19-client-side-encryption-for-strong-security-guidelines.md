---
layout: post
published: true
title: Client-side encryption for strong security - guidelines
excerpt: "I recently released [version 2 of Heartnotes](https:&#47;&#47;heartnotes.me)
  - my secure, encrypted diary app. This was a major rewrite which changed it from
  being a purely offline app into one which synchronized with a server back-end. \r\n\r\nThe
  challenge with this was to ensure that a good user experience could be maintained
  given these changes. Heartnotes' security comes from its implementation of _client-side
  encryption_. All data is encrypted on the user's computer before it gets pushed
  to the server. And the user's password never leaves their computer. All together
  this means that only the user can open and read their diary; no one else can, not
  even the server owner.\r\n\r\nIn this post I'm going to outline the general principles
  behind the encryption architecture I've implemented - these principles are applicable
  to any app that does client-side encryption though I'll refer to Heartnotes as an
  example.\r\n\r\nFirst, let's talk about the raw data...\r\n"
date: '2016-01-19 14:12:43 +0800'
categories:
- Uncategorized
tags:
- Encryption
- Heartnotes
- Authentication
comments: []
---
I recently released [version 2 of Heartnotes](https://heartnotes.me) - my secure, encrypted diary app. This was a major rewrite which changed it from being a purely offline app into one which synchronized with a server back-end.

The challenge with this was to ensure that a good user experience could be maintained given these changes. Heartnotes' security comes from its implementation of _client-side encryption_. All data is encrypted on the user's computer before it gets pushed to the server. And the user's password never leaves their computer. All together this means that only the user can open and read their diary; no one else can, not even the server owner.

In this post I'm going to outline the general principles behind the encryption architecture I've implemented - these principles are applicable to any app that does client-side encryption though I'll refer to Heartnotes as an example.

First, let's talk about the raw data...  

## How is the data accessed and manipulated?

How you encrypt your data and sync it with the server depends on how you envision accessing and modifying the data in the first place.

In the case of Heartnotes, a user may write one or more entries into their diary. Each entry has a unique _id_ and the actual entry content - its _body_. In v1 of Heartnotes the way the encryption was performed was as follows:

1. User adds/updates/removes entry.  
2. Create/update entry in memory.  
3. Encrypt all entries together as one blob.  
4. Save encrypted entry blob to file.

This flow was suitable for v1 since we were only communicating with the local file system (i.e. no network delay). Plus it means that the diary can be opened and closed quickly - since we encrypt and decrypt all entries in one go.

In Heartnotes v2 the user's encrypted entry data needed to be synced with the server on-the-fly. The above flow is not really suitable for this since **we don't want to be sending the entire encrypted diary file to the server on every save**.

So the first change to be made is to encrypt each entry individually:

1. User adds/updates/removes entry.  
2. Create/update entry in memory.  
3. Encrypt the new/updated entry _(we only encrypt the changed entry)_.  
4. Save encrypted entries as one blob to file.

This new flow has the added benefit of slightly speeding up the encryption process during each save since we no longer have to re-encrypt the entire diary file. It also minimises redundant work since entries that weren't modified aren't being unnecessarily re-encrypted.

The downside of this change is that now when we open the diary we have to decrypt each entry individually, which means loading can take a bit longer. But we can mitigate this by redesigning the UI to allow for loading and decrypting entries in parallel (i.e. use loading indicators until decryption is done) - it's a minor inconvenience for users in return for the server sync benefits.

## Sync just the changes or the whole thing?

So now that we encrypt each diary entry individually, how do we handle sync with the server? Our server synchronisation serves two purposes:

* Backup the diary to the server.  
* Keep all open instances of the diary in sync _(if I make a change in the app running on my tablet it soon shows up in the app running on my laptop)_.

Cross-instance sync is a standard feature of many apps today, such as Google Docs. But we want to enable this with data that's encrypted client-side, which makes things a little trickier.

So when the user updates an entry here is what we can choose to send to the server:

* Encrypted copy of the _delta_ (i.e. just what's changed).  
* Encrypted copy of the whole entry.

Here is why the latter is preferable...

Sending just a _delta_ means less data needs to be sent to the server, and is thus more bandwidth and time efficient. This is the sort of thing see happening in multiplayer games - where they send just the key strokes made by the user on the source machine rather than the whole game state. On the other person's machine the retrieved keystrokes and are then applied to the local game state to reproduce the same up-to-date game state as on the source machine.

The caveat - and thus the weakness with this method - is that both machines must always be at the same point in terms of game state in order for deltas to be applied properly. In multi-player games it's immediately obvious if this isn't the case (you'll notice weird game errors, lag, etc). Typically for such games, both parties have to be connected to the internet at the same time in order for the game to work anyway, so it's easier to meet this requirement.

With an app like Heartnotes we want to enable offline editing. So for example, I may edit an entry on my laptop now and have it synced to the server. Later on, I may re-edit this entry from its old version on my tablet which doesn't have an internet connection. How do we reconcile the two? Obviously the tablet-edited version is newer than the laptop-edited version so it should previal. But on the server-side we now have the laptop-edited delta stored. This delta would need to be dropped, plus the tablet-edited delta would need to be sent to the server and then synced across the laptop next time I open the laptop:

1. Edit entry A on Laptop entry A edit delta is sent to server.  
2. Later on, entry A is edited on Tablet. Not connected to internet.  
3. Later on, Tablet is connected to internet.  
4. Tablet-edited entry A delta is sent to server.  
5. Later on, Laptop is connected to internet.  
6. Laptop receives Tablet-edited entry A delta and applies it locally, undoing its own previous local delta.

Thus in the above scenario, the Laptop would need to keep storing the old pre-edited version of entry A just in case it will in future receive a Tablet-edit entry A delta. It is immediately obvious how inefficient this is.

Furthermore, what happens when we sign in to the diary on a new device? We want all the entries to be downloaded and displayed and they should all be up-to-date. We don't want to be dealing with deltas yet.

If we weren't using client-side encryption, the server would be to apply each incoming delta to its locally stored copy of the entry. But since we are using client-side encryption it cannot do this, and thus, **we end up having to send the fully encrypted entry to the server on each save in order to keep the architecture clean and efficient.**

## Hmm...what if I wish to change my encryption password?

As mentioned previously, one of the downsides of encrypting each entry in the diary individually is that it takes time to decrypt the diary on initial load. But there's another problem. If I change my encryption key then every single entry will have to be re-encrypted.

In v1 of Heartnotes this wasn't a problem since all entries were encrypted together in a single pass. But in v2, we not only encrypt each entry individually but also sync each encrypted entry to the server and across to other devices. What are the implications of this with respect to updating the encryption key?

Well, let's say I change my encryption password on my Laptop, and let's say my Tablet is currently not connected to the internet and/or Heartnotes isn't running on it. The only way I can ensure that my Tablet diary data is correct when it does eventually connect is to re-encrypt every entry on my Laptop and send all of this data to the server - for the Tablet to pull down later on:

1. Change password on Laptop.  
2. Re-encrypt all entries on Laptop.  
3. Send all encrypted entries to server.  
4. Later on, Tablet logs in and syncs down all encrypted entries.

Ah, but there's a problem with this. Remember that we want to allow for offline editing. So I might go and edit an entry on my Tablet (whilst its offline) after I've already updated my password on my Laptop. If this happens then I would still want to keep my Tablet edits. But now I have a problem: my tablet edit is encrypted using my old password but all my server-side data is now encrypted with my new password. Damn.

**The solution is to NOT link the encryption key to the user's password**.

In v1 Heartnotes we used PBKDF2 (SHA-512) to generate the encryption key as follows:

1. Use Fortuna PRNG with multiple event inputs (mouse, keyboard, accelerometer etc) to generate _salt_.  
2. Use _salt_ and _password_ as inputs to PBKDF2-SHA512 to generate a 512-bit key. (The number of iterations of PBKDF2 is set such that generation takes 1 second on the user's machine- on a Macbook Air 2012 this easily results in >10000 iterations).  
3. Use the first 256 bits of the key as the _encryption key_.  
4. Store _salt_ and PBKDF2 _iteration count_ in user's diary file.

In v2 we now introduce the concept of a **master key** which is separate to the actual encryption key:

1. Use Fortuna PRNG with multiple event inputs (mouse, keyboard, accelerometer etc) to generate _salt_.  
2. Use _salt_ and _password_ as inputs to PBKDF2-SHA512 to generate a 512-bit key. (The number of iterations of PBKDF2 is set such that generation takes 1 second on the user's machine- on a Macbook Air 2012 this easily results in >10000 iterations).  
3. Store _salt_ and PBKDF2 _iteration count_ in user's account online.  
4. Set the first 256 bits of the key as the _master key_.  
5. Set the second 256 bits of the key as the _authentication key_ (i.e. to login to server).  
6. Generate a SHA-256 _hash_ of: user's _password_ random number (generated using a non-CSRNG)  
7. Use Fortuna PRNG with multiple event inputs (mouse, keyboard, accelerometer etc) to generate _salt_.  
8. Use _salt_ and _hash_ as inputs to PBKDF2-SHA512 to generate a 512-bit key. (The number of iterations of PBKDF2 is set such that generation takes 1 second on the user's machine- on a Macbook Air 2012 this easily results in >10000 iterations).  
9. Set the first 256 bits of the key as the _encryption key_.  
10. Encrypt the _encryption key_ using the _master key_ and store this encrypted bundle in the user's account.

The key thing to note is that since we don't store either the _salt_, _hash_ or _iteration count_ used to generate the _encryption key_ it's not really feasible to derive it from the user's password later on.

Thus, when we change the user's password we simply derive a new master key and then use this to re-encrypt the bundle containing the actual encryption key. Thus we would only need to send the new _salt_, _iteration count_ and bundle to the server and sync that across to other devices to ensure everything is updated everywhere. **The actual encrypted entries themselves remain unchanged when the user changes the password.**

##Â Authentication with the server

Note the **authentication key** mentioned in the flow above for the generation of the encryption key in Heartnotes v2. Client-side encryption followed by server sync means nothing if the server gets to see the user's password.

We don't want anyone with access to the server being able to derive the master key from the user's password yet we still want users to be able to login. The authentication key enables this by virtue of the following properties:

* It is derived from the user's password.  
* It's computationally expensive to derive the master key from the authentication key.  
* It's computationally expensive to derive the initial password from the authentication key.

As long as the above two properties hold, the authentication key is safely usable as a means of authenticating the user with the server. On the server-side, for additional security **we should store a hashed version of the authentication key in the database** - to prevent people who get hold of the database from being able to login as a user even if they can't read the user's data.

One way in which authentication security could be strengthened is by using a vetted protocol such as [SRP](https://en.wikipedia.org/wiki/Secure_Remote_Password_protocol). This may be implemented in a future release of Heartnotes.