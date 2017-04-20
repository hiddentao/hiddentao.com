---
layout: post
published: true
title: google-tts - a Javascript API for Google Text-to-Speech engine
date: '2012-04-01 16:28:02 +0800'
categories:
- Uncategorized
tags:
- Javascript
- HTML5
- Speech
- Github
- Audio
comments:
- id: 4771
  author: Hac Knuckle
  author_email: hacknuckle@gmail.com
  author_url: ''
  date: '2012-06-17 14:30:00 +0800'
  date_gmt: '2012-06-17 14:30:00 +0800'
  content: |
    <p>Hey dude, the SoundManager doesn't work for me. It's expecting a MP3 file and this link returns a MP3 but not a MP3 in itself, hence fails.&Acirc;&nbsp;
    GET http:&#47;&#47;translate.google.com&#47;translate_tts?ie=UTF-8&amp;tl=en&amp;q=hello 404 (Not Found) &Acirc;&nbsp;<&#47;p>
- id: 4777
  author: Ramesh Nair
  author_email: ''
  author_url: http://twitter.com/hiddentao
  date: '2012-07-24 20:40:00 +0800'
  date_gmt: '2012-07-24 19:40:00 +0800'
  content: |
    <p>Ah, as it says in the README I've only tested it locally so I'm not sure if SoundManager works.<&#47;p>

    <p>However, I got your link working by using 'utf-8' instead of 'UTF-8' in the query ->&Acirc;&nbsp;http:&#47;&#47;translate.google.com&#47;translate_tts?ie=utf-8&amp;tl=en&amp;q=hello. I've updated the code in github.<&#47;p>
- id: 4778
  author: Tony
  author_email: tonyfrias@radiovila.com
  author_url: ''
  date: '2012-08-10 16:11:00 +0800'
  date_gmt: '2012-08-10 15:11:00 +0800'
  content: "<p>How \ncan I prevent the browser from sending the Referrer HTTP Header
    to Google&Acirc;&acute;s server ? Could you send a answer to my e-mail ? contato@radiovila.com
    ?<&#47;p>\n"
- id: 4779
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2012-08-10 16:17:00 +0800'
  date_gmt: '2012-08-10 15:17:00 +0800'
  content: "<p>I haven't looked into this myself but the following link may contain
    answers: http:&#47;&#47;stackoverflow.com&#47;questions&#47;5033300&#47;stop-link-from-sending-referrer-to-destination
    \nSpecifically, serving your pages over HTTPS might prevent the referrer from
    being sent.<&#47;p>\n\n<p>Let me know if it works.<&#47;p>\n"
- id: 4784
  author: Robb
  author_email: hxh.robb@gmail.com
  author_url: ''
  date: '2012-09-12 03:03:00 +0800'
  date_gmt: '2012-09-12 02:03:00 +0800'
  content: "<p>That's cool,I'm stuck in the \n  crossdomain issue.<&#47;p>\n"
- id: 4806
  author: Jack Wu
  author_email: jackwu@yogoeasy.com
  author_url: ''
  date: '2013-01-20 03:06:00 +0800'
  date_gmt: '2013-01-20 03:06:00 +0800'
  content: "<p>Hi, would you please kindly let me know how I can use this google-tts
    in WordPress posts. Any help would be appreciated.<&#47;p>\n"
- id: 5030
  author: JUNIOR FERREIRA
  author_email: web2ajax@gmail.com
  author_url: ''
  date: '2015-04-09 19:54:00 +0800'
  date_gmt: '2015-04-09 18:54:00 +0800'
  content: "<p>In this project is to make it save the audio in mp3 3 web2ajax@gmail.com<&#47;p>\n"
---
One of the features I want to add to my experimental "learn Chinese" web app - [http://zhongwen.co.uk/](http://zhongwen.co.uk/) - is the ability to have the Chinese characters read out to you so that you can practise the sounds too. To this end I'd been looking for web services which would do the text-to-speech conversion for me and stumbed upon [/code](http://weston.ruter.net/projects/google-tts/) which demonstrates how to use Google's text-to-speech engine from Javascript. This is the engine which reads out the translations on [Google translate](http://translate.google.com/) and using it as simple as calling a URL with some parameters and then playing the MP3 which gets returned.

I decided to spend a few hours packaging up Weston's code as a re-usable library and here it is - [https://github.com/hiddentao/google-tts](https://github.com/hiddentao/google-tts). It's small (< 1KB minified and gzipped), supports 42 languages, and plays back the audio using the HTML5 Audio tag (just as Weston's example does).

Note: Audio playback in the browser will only work when running the script locally as Google's server only
returns audio if you can prevent the browser from sending the Referrer HTTP Header to their server. If you want to add
background playback to your online site perhaps [SoundManager](http://www.schillmania.com/projects/soundmanager2/)
will do the trick (I haven't tested this).