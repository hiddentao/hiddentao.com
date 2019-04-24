---
title: wuPlay - real-time multiplayer web gaming on your mobile
date: '2011-07-15'
summary: "Introducing [wuPlay.com](wuPlay.com), an experiment in real-time multiplayer gaming on a mobile-friendly website. wuPlay is a web-based multiplayer implementation of the excellent [Connect6](http:&#47;&#47;en.wikipedia.org&#47;wiki&#47;Connect6) game that works well on desktops, tablets as well as on most good mobile devices (so far I've tested on Android 2.3 and iOS 4.2 devices).\r\n"
tags:
  - Mobile
  - AJAX
  - jQuery
  - Javascript
  - wuPlay
  - Python
  - Tornado
  - MongoDB
  - Websockets
  - Gaming
---
Introducing [wuPlay.com](wuPlay.com), an experiment in real-time multiplayer gaming on a mobile-friendly website. wuPlay is a web-based multiplayer implementation of the excellent [Connect6](http://en.wikipedia.org/wiki/Connect6) game that works well on desktops, tablets as well as on most good mobile devices (so far I've tested on Android 2.3 and iOS 4.2 devices).

I started working on wuPlay mainly as a way of learning [Tornado](http://www.tornadoweb.org/). Tornado was still quite new then and I was very interested in the idea of a non-blocking event-driven server and what it could do. I was also learning about Websockets and AJAX long-polling and other techniques of simulating a "push" from server to client. At the same time I was also wanting to make a multiplayer game from my droid device and figured that it would be better to build it as a web app so that it straight away ran on all devices. Finally, I wanted to improve my Javascript skills so all the client-side code is written in an object-oriented fashion.

For the rest of this post I'm going to talk about the implementation behind wuPlay and some of the design decisions I took.

## Overall architecture

wuPlay is served via a single Tornado instance sat behind nginx. I put nginx in front so that I could load balance in future if necessary. One of my main aims was to make wuPlay load very quickly and minimize both the size and number of assets which need to be downloaded for it. So all the Javascript and CSS assets are minified using [Juicer](http://cjohansen.no/en/ruby/juicer_a_css_and_javascript_packaging_tool) and compressed at build time, and then served using the [HttpGzipStaticModule](http://wiki.nginx.org/HttpGzipStaticModule) module. So Tornado only serves the HTML.

I wanted it to be as fast as possible on mobile devices, even ones with a 2G connection. Browsing a site normally on a mobile is slow so I opted for a completely Javascript-driven client-side UI. The [jQuery Mobile](http://jquerymobile.com/) project was in development at the time but I found it to be too slow and heavyweight so I rolled my own Javascript UI kit (more on that below).

[Websockets](http://en.wikipedia.org/wiki/WebSockets) wasn't fully supported in browsers when I started building this so I opted for [AJAX long-polling](http://en.wikipedia.org/wiki/Comet_(programming)#Ajax_with_long_polling). This restricted the kind of games I could build but my initial goal was simply Connect6, for which it was more than adequate. There's no need to sign up for the site - you just enter a nickname and immediately join the game lobby where you can both send and receive "challenges" to and from other players in the lobby.

The app is resilient to sudden losses in your internet connection as well as temporary increases in latency. On desktops and on Wifi none of this is an issue but on 2.5/3G on a mobile device these sorts of things happen regularly. In order to be resilient the back-end has to be very quick and responsive. I opted for [MongoDB](http://www.mongodb.org/) as my datastore (for session data too) since most of the database activity involves high-speed writes.

## Back-end database

In wuPlay the majority of the data consists of event notifications such as when a user leaves the lobby, enters the lobby, makes a move in the game, etc. They are stored in the db as a way of allowing other users to be notified of said events. In short wuPlay is based on a [publish-subscribe](http://en.wikipedia.org/wiki/Publish/subscribe) model.

I needed a high speed database and it didn't need to be relational since the data model is so simple. And I didn't mind if data occasionally got lost. So I opted for MongoDB. This also gave me an opportunity to learn what it was about and how to use it. I'd only ever used relation data models before so this was certainly a new way of looking at things. Still, as I built the app I ended up writing a database abstraction layer which mimicked Mongo's API but left it open for me to swap out the actual back-end from MongoDB to something else in future if and when such a time arises.

## How clients receive updates from the server

MongoDB automatically creates unique ids for every row it inserts. These IDs are essentially based on a timestamp and I use these to keep track of which events a client hasn't yet been notified of. Thus, when a client first enters a lobby this is what it (i.e. the Javascript code running in the browser) do:

1. It asks the server for the full state of the lobby (i.e. the full list of users along with their stats) as well as the timestamp of the last lobby event - it stores this as `last_timestamp`.
2. It then opens a persistent connection to the server and asks for events newer than `last_timestamp`. AJAX long-polling is used to query the server, thus ensuring that it only need to do something if the server returns with new data.
3. When new events are found it processes these (by updating the lobby display according to what happened) and sets `last_timestamp` to equal the timestamp of the newest event.
4. It then repeats from step 2 onwards.

If the internet connection drops then the client will go back to step 1 and start from there.

The event notification process described above is also used for when a client is in a game. In fact, it's architected in such a way as to make it re-usable for any type of event we may want to do in future, e.g. instant messaging.

As outlined above, every client maintains a long-polling connection to the server in order to receive event updates. Thankfully, browsers allow for upto [2 simultaneous connections](http://stackoverflow.com/questions/2069562/2-connections-per-server) to a given domain name so the client can still send messages to the server.

## Javascript-driven UI

The client UI is completely Javascript-driven. All the popup dialogs and message boxes are also re-usable Javascript "classes" which get used throughout. Once you load the initial [wuPlay.com](wuPlay.com) site from there on in all subsequent page changes are driven through Javascript. You'll notice this by virtue of the loading graphic which shows for a moment or two whenever you click on a link. If something takes longer than a second or so to load you'll see a "Waiting for server" message in the top right part of the page. All these notifications are coded in a re-usable fashion such that every AJAX request can be made with such progress notification if necessary.

There is a page loader which is responsible for loading a given page from the server. It passes the name of a page to the server and is given back a JSON object similar to the following representing *meta data* about the page:

```json
{"html" : ..., "js" : ..., "css" : ...}
```

The `html` entry is the HTML to show for the page. The `js` entry is a list of scripts to load using the `<script>` tag. The `css` entry is a list of stylesheets to load. When the page loader wishes to display a given page it first calls the server to obtain the above meta data. It then adds the specified stylesheets to the document `head` and then loads each of the Javascript files one at a time until they're all loaded. Once these assets are loaded it replaces the webpage's main content section with the HTML returned above.

A given page may have an associated `PageModule`, usually defined in one of its associated scripts. A `PageModule` is a Javascript object which exposes the following methods:</p> <p>* `preshow` - called just before the page gets shown. The module may choose to show another page instead at this point.

* `show` - called just after the page gets shown so that the module can do any required initialisation.
* `hide` - called just after the page gets hidden so that the module can do any required de-initialisation.

For example, the lobby page as an associated `LobbyModule` which ensures that the lobby display gets reset and re-populated whenever the lobby page gets shown. Likewise, when the user leaves the lobby and switches to a different page this module ensures that any pending AJAX requests (e.g. the long-polling connection to the server) get cleanly aborted.</p> <p>The `preshow` method on the `PageModule` may seem unnecessary but is actually very useful. When a user first visits wuPlay the `HomepageModule` can check in `preshow` to see if they've already visited the site before and have a nickname. If so it can take them straight to the lobby page rather than forcing them to re-submit a nickname. This mechanism is also handy if the user ever decides to refresh the webpage in their browser, thus allowing us to take them swiftly back to the page they were on.

## Device detection

wuPlay uses the excellent [WURFL](http://wurfl.sourceforge.net/) database to detect the user's device type at the server level. So no need to mobile-specific URLs. Users type in the same URL ([http://wuplay.com/](http://wuplay.com/)) on whatever device they're on and the wuPlay back-end works out which stylesheets to use based on their device type. The device type detection takes a little bit of time because the code has to search through the WURFL database which, even when optimised for Python using [pywurfl](http://celljam.net/), takes up megabtyes. So once detected the device type gets saved in the session.

In addition to selecting the right stylesheet the device type is used in the Javascript game logic to determine how the game UI should work. When you hover over a square in the game grid you see a popup near the mouse cursor showing a magnified view of what's underneath it. On the desktop version of the game the user cannot interact with this popup. However, they can on the mobile version - this stops users who have fat fingers from selecting the wrong squares!

## Cheating in the game

The server is responsible for checking if a given move is valid and also for checking if and when somebody has won the game. This ensures that it's impossible to cheat by intercepting and modifying the AJAX calls being made from the client to the server. The downside to this is that game logic is split between server and client. What's more, this setup will only work efficently for turn-based games like Connect6\. For anything real-time this isn't really possible without having beefy servers to handle scale.

I did ponder having the clients themselves verifying validity and correctness of moves. So, one client would make a move and then the other client would verify the move and work out the result of it and inform the server of the result. The server would only accept the move if both clients accepted the move. This approach assumes that the "cheater" doesn't control both clients in the game and that there's no collusion between to the two players if they are indeed separate people. Game stats don't get stored permanently in wuPlay so at the moment this approach is feasible. But once stats matter you wouldn't want to leave a loophole like this in there.

Perhaps another approach would be to have every move vetted by a random selection of clients currently playing the game. This increase the workload of each client as well as the bandwidth utilisation and might not be viable for anything faster than turn-base games.

## Final thoughts and future work items

As my first foray into mobile-friendly multiplayer web games I think wuPlay is ok.

Now that I've had some time to think about it and develop my skills further here are the things I would change and add:

1. Refactor all the Javascript code to make better use of clojures. Perhaps use [CoffeeScript](http://jashkenas.github.com/coffee-script/) to simplify coding? Also use [RequireJS](http://requirejs.org/) rather than Juicer as I think it forces you to think in modular terms better.
2. Swap out Tornado for [node](http://nodejs.org/), thus making it easy to share code (particularly game logic) between front and back-ends.
3. Re-arcitect the back-end so that it's is easy to add more games. Ideally wuPlay should be a platform providing users, lobbies and reward system with an API anyone can write games to.
4. Implement games using Websockets. iOS 4 devices already support this.
5. Implement canvas games. Though note that in mobile browsers you can't currently do any finger dragging detection inside pages, thus ruling out certain games for these platforms.
6. Get more people involved. There's a lot of cool stuff to build here and an opportunity for something special, particularly with the idea of the platform API (see point 3).
7. Add more games!

