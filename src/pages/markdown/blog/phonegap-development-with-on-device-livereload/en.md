---
title: PhoneGap development with on-device livereload
date: '2014-08-18'
summary: ''
tags:
  - Mobile
  - Javascript
  - Phonegap
  - Gulp
  - Livereload
---
I am currently working on a [Phonegap](http://phonegap.com/) application using [Ionic](http://ionicframework.com/) framework. One of the great things about building a hybrid application is that because it's really just a web app the _edit-save-refresh_ cycle is quite fast. Initially I was using the Phonegap [developer app](http://app.phonegap.com/) to quickly preview my app on the device and have it auto-reload whenever I made a change in the source code. But when I got to the point of needing to add additional Cordova/Phonegap plugins I was stuck - I would either have to build my app the slow way (full Android compilation, etc.) or modify the Phonegap developer app source code such that it incorporated the additional plugins I needed. In the end I decided to replicate the developer app's livereload functionality into my own app, and in this post I will detail how I did that.

## How livereload works

Once you install the Phonegap developer app on your device and start it up it asks for you the `host:port` address of the computer on which you are running `phonegap serve` from the command line. The command-line output will usually something like:

```bash  
$ phonegap serve  
[phonegap] starting app server...  
[phonegap] listening on 192.168.1.101:3000  
[phonegap]  
[phonegap] ctrl-c to stop the server  
...  
```

If I put the above address into the Phonegap Developer app what it does is simply set `window.location` to this address. If my device is on the same WiFi network as my main machine I will (hopefully) see my web app appear on screen. Now if I change one of the files within the `www` folder that Phonegap is watching I will see my app automatically get reloaded on the device.

## Adding my own livereload mechanism

I ensured that my app successfully compiled using `phonegap build`. The next step was to replicate the functionality of `phonegap serve`. I needed to do two things:

1. Start up a server which would serve the app and tell the browser to reload the page when resources changed, and  
2. Have my app automatically call up the server URL to fetch the web app.

I was using [gulp](https://gulpjs.com) to build my code. So it was simply a matter of picking one of the available livereload plugins to run a server:

```js  
var server = require('gulp-server-livereload');
 
var paths = {
  www: path.join(__dirname, 'phonegap', 'www')
};
 
var devServerHost = require('ip').address();
 
gulp.task( 'dev', function() {
  gulp.src(paths.www)
    .pipe(server({
      livereload: true,
      directoryListing: false,
      open: false,
      host: devServerHost,
      port: 3000
    }));
});
```

When I run the above task (`gulp dev`) it launches a simple static file server pointing to the `www` folder. It additionally launches a [socket.io](http://socket.io) server listening on port 35729 and injects the following code into any HTML files it serves (assume the IP address of my machine is 192.168.1.101):

```html  
<script type="text/javascript" src="http://192.168.1.101:35729/socket.io.js"></script>
<script>
  var ___socket = io.connect('http://192.168.1.101:35729'); 
  ___socket.on('reload', function() { location.reload(); });
</script>
```

The server then watches the `www` folder for changes and whenever one takes place it sends a `reload` message to the socket.io client running in the browser.

The next step was to inject code during the app build process to ensure that the app would auto-connect to my gulp server:

```js  
var replace = require('gulp-replace-task');
 
var paths = {
  html: path.join(__dirname, 'src', 'index.html'),
  www: path.join(__dirname, 'phonegap', 'www')
};
 
var devServerHost = require('ip').address();
 
 
gulp.task('html', function() {
  gulp.src(paths.html)
    .pipe(replace({
      patterns: [
        {
          match: /<head>/,
          replacement: "" +
            "<head>" +
            "<script type=\"text/javascript\">" +
                "var __devSite = 'http://" + devServerHost + ":3000';" +
                "if (window.location.origin !== __devSite) {" +
                  "window.location = __devSite;" +
                "}" +
            "</script>"
        }
      ]
    }))
    .pipe(gulp.dest(paths.www))
});
```

And that's it! Whenever I make a change to the `index.html` file it will automatically get copied to the phonegap `www` folder whilst being injected with the above code to ensure it auto-redirects to my gulp server when starting up. The great thing about this solution is that it is dynamically injected, meaning that I don't need to maintain any necessary boilerplate separately within my app to enable this.

So now I have a livereload mechanism working within my own app that is better than using the Phonegap developer app. It's faster because I don't need to enter the hostname and port of the server and it allows me test my app with additional phonegap plugins.
