---
title: 'Heartnotes - offline, encrypted diary using Electron.js + React.js'
date: '2015-08-19'
summary: "I am proud to announce the release of [Heartnotes](http:&#47;&#47;heartnotes.me), an offline, encrypted personal diary app for desktop, built using [Electron](http:&#47;&#47;electron.atom.io) and [React](https:&#47;&#47;facebook.github.io&#47;react). Heartnotes has been a labour of love for a couple of months now, in between various other projects, and it's my first desktop app for any platform.\r\n\r\nWhat does it do exactly? It allows you to keep a personal diary - one you can write to even when offline. All your data is encrypted (AES-256) by a password your provide and stored within a file which you can then backup any you wish (e.g. using Dropbox).\r\n"
tags:
  - Javascript
  - React.js
  - Electron.js
  - Desktop
  - Encryption
---
I am proud to announce the release of [Heartnotes](http://heartnotes.me), an offline, encrypted personal diary app for desktop, built using [Electron](http://electron.atom.io) and [React](https://facebook.github.io/react). Heartnotes has been a labour of love for a couple of months now, in between various other projects, and it's my first desktop app for any platform.

What does it do exactly? It allows you to keep a personal diary - one you can write to even when offline. All your data is encrypted (AES-256) by a password your provide and stored within a file which you can then backup any you wish (e.g. using Dropbox).  

**Technologies used**

Fundamentally it is a React.js web app, using [Flummox](http://acdlite.github.io/flummox) as the Flux implementation (if I was to do it again I'd probably use Redux instead of Flummox). Must of the app uses ES6 (thanks to [Babel](https://babeljs.io/)).

All crypto operations are done inside Web workers to keep the UI responsive. I use [operative](https://github.com/padolsey/operative) to schedule such jobs.

Gulp is used for live-reload development as well as to package the release version of the app.

**Security architecture**

The app works totally offline. Neither your data nor your password leave your computer. An encryption key is derived from your password using [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) as follows:

* Use [Fortuna PRNG](https://en.wikipedia.org/wiki/Fortuna_(PRNG)) with multiple event inputs (mouse, keyboard, accelerometer etc) to generate random `salt` data.  
* Use the generated salt and user's password as inputs to PBKDF2-SHA512 to generate a 512-bit key. _(The number of iterations of PBKDF2 is set such that generation takes 1 second on the user's machine - on a Macbook Air 2012 this easily results in >10000 iterations)_.  
* Use the first 256 bits of the generated key with AES-256-GCM Random Init. Vector to generate the ciphertext.  
* Store the ciphertext, salt and PBKDF2 iteration count in the user's diary file for when we next wish to open the diary.

The crypto algorithms are provided by [SJCL](https://github.com/bitwiseshiftleft/sjcl), a well established JS encryption library.

An attacker who obtains a copy of the file would need to run a brute-force attack using the salt and iteration count contained within in order to obtain your password and decipher your data. Though not impossible, this requires a considerably higher time investment than typical "secure" personal diary software which claims to protect your diary with a password but doesn't actually use encryption and/or uses it properly.

**Editor**

I used [ckEditor](http://ckeditor.com/) to provide editing functionality. I tried a number of other open source editor libraries but ckEditor was the only one which gave me a bug-free experience. However, integration was a pain. I'm already looking ahead to using a better editor, esp. one which will allow me to use [React Native](http://facebook.github.io/react-native/) and build native mobile apps. Right now [AlloyEditor](http://alloyeditor.com/) - which is built on ckEditor - looks promising.

**Links**

* [http://heartnotes.me](http://heartnotes.me) - screenshots and downloads.  
* [https://github.com/hiddentao/heartnotes](https://github.com/hiddentao/heartnotes) - source code.
