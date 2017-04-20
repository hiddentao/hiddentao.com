---
layout: post
published: true
title: Thoughts on dynamically loading parts of a mobile app
excerpt: "One of the great benefits of building your mobile app in Javascript (with
  PhoneGap as the wrapper) is that you can load in bits of code (via the <code>script<&#47;code>
  tag) as and when needed. Of course, you can do this in any language as long as it
  gives you the ability to load external files or data into into program memory. But
  why would you want to do this?\r\n\r\nIf, for instance, you wish to provide in-app
  purchases to the user those purchased items need not be limited to data. For instance,
  if you write an app which lets people edit and manipulate their photos you could
  have an *advanced blur effect* or something like that available as an in-app purchasable
  upgrade. The code for implementing said effect can be delivered as the purchased
  download rather than having to package it into the original distributable app. This
  reduces the download size and installation time for your initial distributable and
  shifts this additional burden to when the user actually needs said feature and purchases
  it. \r\n"
date: '2013-03-13 05:09:17 +0800'
categories:
- Uncategorized
tags:
- Mobile
- Javascript
- Thoughts
- Architecture
comments: []
---
One of the great benefits of building your mobile app in Javascript (with PhoneGap as the wrapper) is that you can load in bits of code (via the `script` tag) as and when needed. Of course, you can do this in any language as long as it gives you the ability to load external files or data into into program memory. But why would you want to do this?

If, for instance, you wish to provide in-app purchases to the user those purchased items need not be limited to data. For instance, if you write an app which lets people edit and manipulate their photos you could have an *advanced blur effect* or something like that available as an in-app purchasable upgrade. The code for implementing said effect can be delivered as the purchased download rather than having to package it into the original distributable app. This reduces the download size and installation time for your initial distributable and shifts this additional burden to when the user actually needs said feature and purchases it.

Beyond adding new code to your application in this way you can also update the existing code in your application. If you write your application in Javascript then when it starts up it can check your server for updates to the basic code which comprises the app. If you architect things correctly your app could then download those updates and do an in-place hot restart of itself. Surely a much faster process overall than sending the user off the app market to update the app to download and install the latest version of your app.

Of course, you would still want to keep the version in the app market up-to-date as this saves new users from having to endure an update when they first start your application. Plus, one could also argue that sending the existing user to the market to get the new version allows you to track those downloads - though here I would argue that it's better to simply track the in-place updates made from within your app while its running and augment your app market statistics with this data.

I'm currently building a 'packaging' system for my app which will allow me to load updates to app data as well as in-app purchases from my server via a versioned packaging system. It's early days at the moment but I am going to see if there's scope to open-source this in a re-usable manner. If it can't easily be made re-usable , then I shall at least strive to provide an architectural overview of how it works.

The key point here is user experience. Whatever mechanisms you decide on using within your app ask yourself if they enhance the user experience or detract from it