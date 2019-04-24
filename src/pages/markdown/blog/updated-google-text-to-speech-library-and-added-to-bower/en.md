---
title: Updated Google text-to-speech library and added to Bower
date: '2013-06-10'
summary: "Just pushed a few updates to the Google text-to-speech API library - [google-tts](https:&#47;&#47;github.com&#47;hiddentao&#47;google-tts) - I first put out a while back. Here are the higlights...\r\n"
tags:
  - Google
  - Javascript
  - Text-to-speech
---
Just pushed a few updates to the Google text-to-speech API library - [google-tts](https://github.com/hiddentao/google-tts) - I first put out a while back. Here are the higlights...

**Large text gets split up**

It turns out that in Google Translate if you ask it to read out more than 100 characters in one go it actually [splits up the text](https://github.com/hiddentao/google-tts/issues/9) into 100 character slices, making consecutive audio requests for each slice. Thanks to [Julien Synx](http://www.julien-syx.fr/) for pointing this out. `Google-tts` now does this too.

**Callback when playback is finished**

Previously when calling `play()` you callback would be triggered once the song had started playing. This now gets triggered once the song has finished playing. I was holding off on implementing this as I wasn't sure if it was possible to detect when HTML5 audio playback had completed in an easy cross-browser compatible away. Now I've decided to just go with the [ended](http://www.w3.org/wiki/HTML/Elements/audio#Media_Events) event as I think we've reached the point where all decent browsers support it.

**Pluggable playback mechanisms**

The current version of Firefox (21) does not support the playback of MP3s using HTML5 audio, though I'm told that soon-to-be released versions might. In any case, in order to provide a solution for Firefox right now I opted to incorporate the excellent [SoundManager2](http://www.schillmania.com/projects/soundmanager2/) library into this project (yes unfortunately, this is a Flash-based solution for Firefox). I've tried to de-couple this library from GoogleTTS as much as possible, especially since not everybody will need or even want to use SoundManager2.

There is now a `GoogleTTS.Player` base class (should be thought of more as an *interface*) from which different playback mechanisms must inherit. It looks like this:

```js
/**
* Represents a playback mechanism.
* @constructor
*/
TTS.Player = function() {
  var self = this;

  /**
  * Get whether this playback mechanism is available for use.
  * @param cb Function Result callback (Boolean available)
  */
  self.available = function(cb) { throw new Error('Not yet implemented'); };

  /**
  * Play given URL.
  * @param url String
  * @param cb Function Called after we finish playing (Error err)
  */
  self.play = function(url, cb) { throw new Error('Not yet implemented'); };

  /**
  * Get name of this player.
  */
  self.toString = function() { throw new Error('Not yet implemented'); };
};
```

Two built-in playback mechanisms are provided within the library - HTML5 audio and SoundManager2\. You can easily define, instantiate and add your own to the library using `addPlayer()` of a `GoogleTTS` instance. The library will use whichever playback mechanism is first found to be 'available', i.e. usable in the current browser context so the order in which you register playback mechanisms matters.

**Testing -> Bower**

We now have some basic unit tests...yay. Continuous build has also been setup - [https://travis-ci.org/hiddentao/google-tts](https://travis-ci.org/hiddentao/google-tts).

I've refrained from adding `google-tts` to NPM as it's not really usable on the back-end. But I've now added it to [Bower](https://github.com/bower/bower), so hopefully more people will become aware of its existence.
