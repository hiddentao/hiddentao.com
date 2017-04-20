---
layout: post
published: true
title: React.js Hot-Module-Replacement with Browserify
date: '2016-09-09 15:16:23 +0800'
categories:
- Uncategorized
tags:
- React
- SPA
- Browserify
- Livereload
comments: []
---

For my latest project I decided to try and get Hot-Module-Replacement (HMR) working with React.js, but using Browserify. 

Most [React HMR setups](https://github.com/facebookincubator/create-react-app) use [Webpack](https://github.com/webpack/webpack) because that's what the community seems to have standardized around but I prefer [Browserify](http://browserify.org/) and how it operates, especially since I find it's integration into gulp scripts more intuitive than that of Webpack's. Your mileage may vary.

In order to get things working with Browserify the key component is the [livereactload](https://github.com/milankinen/livereactload) plugin for Browserify by [@milankinen](https://twitter.com/milankinen). The instructions on the livereactload homepage worked for me. In this post I'll outline additional steps (such as the gulp script) I took to get the whole setup going.

## 1. Babel setup 

Let's get Babel setup to compile our ES6 code (and React JSX) into browser-friendly output, and with the livereactload hot-loading code included.

Install the dependencies:

```shell
$ npm i --save-dev babel-plugin-react-transform babel-preset-es2015 babel-preset-react react-proxy livereactload
```

Now configure `.babelrc`:

```js
{
  "presets": [
    "react",
    "es2015"
  ],
  "env": {
    "development": {
      "plugins": [
        ["react-transform", {
          "transforms": [{
            "transform": "livereactload/babel-transform",
            "imports": ["react"]
          }]
        }]
      ]
    }
  }  
}
```

## 2. Gulp + Browserify + Watchify

*Note: I'm going to run Browserify from within a gulp script. If you're not using gulp then the [instructions on the livereactload homepage](https://github.com/milankinen/livereactload) will show you how to run things straight from the command-line.*

Let's install the dependencies:

```shell
$ npm i --save-dev browserify babelify watchify vinyl-source-stream2 gulp-util gulp
```

Create `gulpfile.js`:

```js
"use strict";

const browserify = require('browserify'),
  source = require('vinyl-source-stream2'),
  watchify = require('watchify'),
  livereactload = require('livereactload'),
  gulp = require('gulp'),
  gutil = require('gulp-util');


gulp.task('js', () => {
  const b = browserify({
    entries: "./src/app.js",
    cache: {},
    packageCache: {},
    plugin: [watchify, livereactload],
  });

  // processing method
  let _build = () => {
    return b.bundle()
      .on('error', (err) => {
        gutil.log(err.stack);
      })
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('build');
  }
  
  // on change
  b.on('update', () => {
    gutil.log('Rerunning browserify...');
    const updateStart = Date.now();
    _build().on('end', () => {
      gutil.log(`...Done ${Date.now() - updateStart} ms`);          
    });
  });

  // kick-off
  return _build();
});
```

Finally, edit `package.json` and add `babelify` as a transform:

```js
{
  ...
  browserify: {
    transform: ['babelify']
  },
  ...
}
```

Now, if you run `gulp` you should see something like the following:

```shell
[15:38:47] Starting 'js'...
[07:38:47.989] LiveReactload :: Reload server up and listening in port 4474...
```

The `build/bundle.js` file should exist and contain all the transpiled JS output. If you now change `src/app.js` or one of the modules it includes you should see something like:

```shell
[15:39:49] Rerunning browserify...
[15:39:50] ...Done (959ms)
```

## 3. Testing in the browser

We want to get things showing in the browser. Let's assume `build/index.html` is our HTML page which includes and runs `build/bundle.js` (built as shown above).

Here is how it might look:

```html
<body>
  <main id="react-root" />
  <script type="text/javascript", src="/bundle.js" />
</body>
```

We can use [gulp-server-livereload](https://github/hiddentao/gulp-server-livereload) plugin to serve up the `build/` folder to the browser. Let's install it:

```shell
$ npm i --save-dev gulp-server-livereload
```

And add it to the gulpfile:

```js
const livereload = require('gulp-server-livereload');

gulp.task('js', ...);

gulp.task('server', ['js'], function() {
  return gulp.src('./build')
  .pipe(livereload({
    host: '0.0.0.0',
    port: 8080
  }));
});
```

The above configuration will run a HTTP server at `http://localhost:8080`. Let's 
run it:

```shell
$ node_modules/.bin/gulp server
[15:38:47] Starting 'js'...
[07:38:47.989] LiveReactload :: Reload server up and listening in port 4474...
[15:38:50] Starting 'server'...
[15:38:50] Finished 'server' after 0.1s
[15:52:19] Webserver started at http://0.0.0.0:8080
```

Now browse to `http://localhost:8080` and you should see the `index.html` page and 
your React app should be loaded and working. If you change one of your `src/` 
files the page should instantly update to reflect the new UI. To verify that 
livereactload is working correctly you should see the following in the browser 
console:

```
LiveReactload :: LiveReactLoad transform detected. Ready to rock!
ReactDOM.js:77 Download the React DevTools for a better development experience: https://fb.me/react-devtools
app.js:389 LiveReactload :: WebSocket client listening for changes...
```

## 4. Hot-load CSS and other assets

Thanks to livereactload we now have hot-loading enabled for our React Javascript code. 
But if we have other assets like CSS files which could also benefit from a 
a hot-loading experience?

Thankfully `gulp-server-livereload` is actually a livereload server. Update the 
gulp configuration as follows:

```js
...
{
  host: '0.0.0.0',
  port: 8080,
  livereload: {
    enable: true,
    /* ignore changes to bundle.js */
    filter: (filePath, cb) => cb(!(/bundle\.js/.test(filePath)))
  },
}
...
```

Now, when we run `gulp server` it will not only serve up files from the `build/` 
folder but also auto-inject HTML files with script code to auto-reload the 
browser page if any of the files within the `build/` folder get modified at 
runtime. If the modified file is a CSS file then it will hot-load the changes 
without reloading the entire page..yay!

Notice in the above configuration that we're telling it to ignore changes made 
to the `bundle.js` file - since livereactload is already taking care of hot-loading that one for us. Check out [gulp-server-livereload homepage](https://github.com/hiddentao/gulp-server-livereload) for more information 
on the available configuration options and what else it can do.

---

And that's it as far as getting hot-module-replacement working with browserify 
is concerned. If you have any questions please do get in touch. You can find me [@hiddentao](https://twitter.com/hiddentao).
