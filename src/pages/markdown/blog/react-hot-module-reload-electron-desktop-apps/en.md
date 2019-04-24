---
title: React hot-module-reload in Electron desktop apps
date: '2016-10-12'
summary: ''
tags:
  - React
  - SPA
  - Electron
  - Desktop
  - Livereload
---

In a [previous post](/archives/2016/09/09/react-hot-module-replacement-with-browserify/) 
I outlined how to get React hot-module-reload working in Browserify builds, 
using the Livereactload plugin. In this one I will outline the additional steps 
needed to get this whole thing working within an Electron.js desktop app.

If you wish to access Electron APIs within you UI window you would normally enable 
the `nodeIntegration` flag when creating a `BrowserWindow`, as such:

```js
// main.js
let win = new BrowserWindow({
  webPreferences: {
    nodeIntegration: true,
  }
});
```

This would then enable you use the APIs from the `electron` module within your 
UI's code:

```js
import { ipcRenderer as ipc } from 'electron';

ipcRenderer.on('...');
```

The problem is that the globals inserted by Electron - `require`, `module`, etc - 
[conflict](http://electron.atom.io/docs/faq/#i-can-not-use-jqueryrequirejsmeteorangularjs-in-electron) 
with those created by Browserify and already defined by some JS libraries.

Furthermore, Browserify will load and include the `electron` module into its 
final bundle even though this module will actually be made available to our 
code at runtime by the Electron process.

The solution is to tell Browserify to not automatically include the default 
globals and to also exclude `electron` and other built-in Electron modules from 
bundles. 

*Note: Ensure you are using [livereactload v3.0.1](https://github.com/milankinen/livereactload/releases/tag/3.0.1) or 
above able to use Browserify's module exclusion option.*

For our React bundle to be able to run properly within Electron it 
will require the `process` global to be present. Since we are telling Browserify 
not to automatically insert globals we will need to manually enable this global.

All in all this is what the gulp browserify build task looks:

```js
"use strict";

const _ = require('lodash'),
  browserify = require('browserify'),
  browserifyBuiltIns = require('browserify/lib/builtins'),
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
    commondir: false,
    builtins: _.pick(browserifyBuiltIns, '_process'),
    insertGlobals: false,
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

And that's pretty much all there is to it! 

One thing I've noticed is that my browserify builds take longer now, which 
means hot-module-reload isn't as instant as it should be. I'm still working on 
solving this issue.

