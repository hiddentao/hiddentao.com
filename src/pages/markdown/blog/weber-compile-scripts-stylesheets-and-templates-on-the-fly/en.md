---
title: 'Weber - compile scripts, stylesheets and templates on-the-fly'
date: '2012-03-15'
summary: "I'd like to introduce [Weber](https:&#47;&#47;github.com&#47;hiddentao&#47;weber), a slick command-line tool for compiling, concatenating and minifying scripts, stylesheets and templates **on-the-fly**. Weber is a fork of the excellent [Hem](https:&#47;&#47;github.com&#47;maccaw&#47;hem) tool by [Alex Maccaw](http:&#47;&#47;alexmaccaw.com&#47;) which improves on the original by providing more flexibility.\r\n"
tags:
  - Javascript
  - CoffeeScript
  - Utils
---
I'd like to introduce [Weber](https://github.com/hiddentao/weber), a slick command-line tool for compiling, concatenating and minifying scripts, stylesheets and templates **on-the-fly**. Weber is a fork of the excellent [Hem](https://github.com/maccaw/hem) tool by [Alex Maccaw](http://alexmaccaw.com/) which improves on the original by providing more flexibility.

To get started with Weber install it using [npm](http://npmjs.org "Node Package Manager"):

```bash
$ npm install -g weber
```

Then goto the root of your project folder and create a skeleton Weber config file with:

```bash
$ weber init
```

At this point you will have a file called `weber.json` which looks something like this:

```js
{
  "/": "./public_assets",

  "/css/app.css": [
      "./css/reset.css",
      "./css/main.styl"
  ],

  "/css/test.css": {
      "minify": false,
      "input": [
          "./css/test"
      ]
  },

  "/js/app.js": {
      "build": "./app.js",
      "input": {
          "dependency": ["es5-shimify"],
          "lib": ["./lib/jquery.js"],
          "module": ["./coffee"]
      }
  },

  "/js/test.js": {
      "minify": false,
      "input": [
          "./test/testbase.js",
          "./test/test.coffee"
      ]
  }
  }```

The above configuration is put there by Weber just to show you what configuration options are available.

You can now run Weber in *server* mode by typing:

```bash
$ weber server
```

Weber is now running a simple HTTP server accessible at **http://localhost:9294**. This mode allows you to quickly test out and rapidly iterate with your scripts, styles and templates.

The first key-value pair in the config file above is mandatory and tells Weber which folder to use as the document root when running in server mode. In this case Weber will expect an `index.html` file inside the `./public_assets` folder to serve up when the browser navigates to the address above. By the way, Weber can be told to listen on a different port by adding a `port: <portnum>` key in the config file above.</portnum>

The remaining key-value pairs in the config file tell Weber what to do when the browser visits the relative URLs `/css/app.css`, `/css/test.css`, `/js/app.js` and `/js/test.js` respectively. When this happens Weber dynamically builds and outputs these files using the information provided in the config file. Here is what it does for each file:

* `/css/app.css` - concatenates reset.css with main.styl and then minifies the final result.
* `/css/test.css` - concatenates all CSS and Stylus files in `./css/test`.
* `/js/apps.js` - concatenates the node module `es5-shimify` with `./lib/jquery.js` with all the modularized versions of all the code in `./coffee` and then minifies the final result.
* `/js/test.js` - concatenates modularized versions of `./test/testbase.js` and `./test/test.coffee`.

Two points to note:

* Weber automatically compiles coffee, stylus and other files into their JS and CSS equivalents when needed.
* To modularize means to wrap the code such that it thinks of itself and behaves like a CommonJS module, i.e. require, exports, module are available.

The example folder in the Weber source code contains a fully working example app with the above configuration file.

Once you're done testing in server mode you can tell Weber to build the actual static output files configured by doing:

```bash
$ weber build
```

Weber automatically decided where to place the built output file based on the config. For example, if we have:

```js
{
  "/" : "./public_assets",
  "/js/app.js" : [ "./coffee" ]
}
```

Then the output file for `/js/app.js` will be at `./public_assets/js/app.js`. But we can override this path by using the build key as follows:

```js
{
  "/" : "./public_assets",
  "/js/app.js" : {
    "build" : [ "./built_app.js" ]
    "input" : [ "./coffee" ]
  }
}
```

Now Weber will build the output file at `./built_app.js`. Weber can also watch the input files and folders for changes and automatically rebuild the output files when necessary if you start it in *watch* mode:

```bash
$ weber watch
```

Weber works quite well for now but there are some limitations. It doesn't support all the available dialects and languages for input sources (e.g. SASS, LESS, Mustache) so these need adding. It would also be nice to be able to write pluggable input and output formats for Weber so that you could process your own custom format. And finally Weber needs some tests!

You can fork it at: [https://github.com/hiddentao/weber](https://github.com/hiddentao/weber)
