---
title: google-tts - a Javascript API for Google Text-to-Speech engine
date: '2012-04-01'
summary: ''
tags:
  - Javascript
  - HTML5
  - Speech
  - Github
  - Audio
---
One of the features I want to add to my experimental "learn Chinese" web app - [http://zhongwen.co.uk/](http://zhongwen.co.uk/) - is the ability to have the Chinese characters read out to you so that you can practise the sounds too. To this end I'd been looking for web services which would do the text-to-speech conversion for me and stumbed upon [/code](http://weston.ruter.net/projects/google-tts/) which demonstrates how to use Google's text-to-speech engine from Javascript. This is the engine which reads out the translations on [Google translate](http://translate.google.com/) and using it as simple as calling a URL with some parameters and then playing the MP3 which gets returned.

I decided to spend a few hours packaging up Weston's code as a re-usable library and here it is - [https://github.com/hiddentao/google-tts](https://github.com/hiddentao/google-tts). It's small (< 1KB minified and gzipped), supports 42 languages, and plays back the audio using the HTML5 Audio tag (just as Weston's example does).

Note: Audio playback in the browser will only work when running the script locally as Google's server only
returns audio if you can prevent the browser from sending the Referrer HTTP Header to their server. If you want to add
background playback to your online site perhaps [SoundManager](http://www.schillmania.com/projects/soundmanager2/)
will do the trick (I haven't tested this).
