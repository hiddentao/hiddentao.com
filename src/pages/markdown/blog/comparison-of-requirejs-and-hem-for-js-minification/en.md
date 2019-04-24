---
title: Comparison of RequireJS and Hem for JS minification
date: '2011-10-24'
summary: "As I've hinted at in <a href=\"http:&#47;&#47;www.hiddentao.com&#47;archives&#47;2011&#47;08&#47;17&#47;notes-on-using-requirejs-with-backbone-andor-spine&#47;\" title=\"Notes on using RequireJS with Backbone and&#47;or Spine\">previous posts<&#47;a> I've been using [RequireJS](http:&#47;&#47;requirejs.org&#47;) for a while now to help \"modularize\" my client-side Javascript code and make it easy to package it into minified and compressed script files at deployment time. And ditto for my CSS files.\r\n\r\nRecently I started using the [Spine](http:&#47;&#47;spinejs.com&#47;) Javascript framework to base my app on a simple MVC architecture. Even more recently I found out that Spine's creator Alex McCaw had written a tool called [Hem](https:&#47;&#47;github.com&#47;maccman&#47;hem) which pretty much does whatever RequireJS except that it's optimised for use with Spine. I gave it a go and having now used both it and RequireJS I am better placed to comment on the differences and relative advantaged of the two tools.\r\n"
tags:
  - Javascript
  - RequireJS
  - Spine
  - Hem
---
As I've hinted at in [previous](/archives/2011/08/17/notes-on-using-requirejs-with-backbone-andor-spine/ "Notes on using RequireJS with Backbone and/or Spine") [posts](/archives/2011/08/17/notes-on-using-requirejs-with-backbone-andor-spine/ "Notes on using RequireJS with Backbone and/or Spine") I've been using [RequireJS](http://requirejs.org/) for a while now to help "modularize" my client-side Javascript code and make it easy to package it into minified and compressed script files at deployment time. And ditto for my CSS files.


Recently I started using the [Spine](http://spinejs.com/) Javascript framework to base my app on a simple MVC architecture. Even more recently I found out that Spine's creator Alex McCaw had written a tool called [Hem](https://github.com/maccman/hem) which pretty much does whatever RequireJS except that it's optimised for use with Spine. I gave it a go and having now used both it and RequireJS I am better placed to comment on the differences and relative advantaged of the two tools.

RequireJS is a standalone Javascript library (~5 KB) with no other dependencies.It introduces new syntax for packaging your Javascript code as different modules. It's module format is based on the [CommonJS](http://www.commonjs.org/) spec though its implementation reserved words and their usage differs slightly from the standard spec. RequireJS's optimization step is yet another script which can be executed from the command-line once you've installed [node](http://nodejs.org/). This step will concatenate and minify your Javascript and (optionally) CSS files.

Hem is a command-line tool. It is an npm module and has a few npm-loaded dependencies, notably [UglifyJS](https://github.com/mishoo/UglifyJS) (the same as is used by RequireJS). Thus, node and [npm](http://npmjs.org/) are pre-requisites for using Hem at all. Hem integrates well with Spine in that it will package up your *views* (`.eco` or `.jeco` templates) along with your Javascript code into a single, minified script file. It also minifies and packages a CSS file you point it to into a single CSS files alongside the single script file which gets output.

Like RequireJS, Hem also allows code to be written in [CoffeeScript](http://jashkenas.github.com/coffee-script/), automatically running the CoffeeScript compiler before packaging things up. It's module format closes adheres to the CommonJS spec.

Hem comes with two distinct options:

* `server` - launch a simple node.js server (port 9294 by default) which concatenates all your Javascript and template files into a single Javascript file on *every page request*.
* `build` - Concatenate all your Javascript and template files into a single, minified Javascript file, ready for deployment to production.

Thus, with Hem your HTML file can expect there to be available a single script file containing all of your app's script code. This is great because it means that switching from development to production mode for your Javascript does not require any changes to the code in your HTML which references the script file. This makes it easy to test both cases, unlike for RequireJS which may require your HTML file to work slightly differently when switching to production mode.

RequireJS is able to produce multiple minified output files as well as being able to concatenate multiple script files into one file based on its static analysis of `define()` and `require()` calls made within the script files. Hem supposedly analyses dependencies dynamically but in truth I think it just assumes that all script files will be needed and thus concatenates them all (including view templates) into one file to avoid errors due to missing code. The downside of putting everything into one file is that the initial download size for your web app might end up being larger (and thus more time consuming) than it would be if you were to load defer loading of some of your scripts.

For me it was initially weird to have to install node and npm even just for a project that only includes client-side scripting. However this comes with the benefit that it's easy to update to the latest versions of Hem and any of the other node-based packages you may be using thanks to npm's versioning system. As far as I'm aware the npm registry is currently the only Javascript package repository widely used by developers. What's more, if you're developing your server-side using node then using npm is an easy way of sharing the same packages among client and server.

After having used npm for a bit now I'm convinced that all future Javascript development (and specifically the inclusion of third-party libraries into your project) will be done using npm (or a future packaging manager) as a way of managing external dependencies. For instance jQuery is already available as an npm module. The one big downside of using npm is that its Windows support isn't quite as good as the other platforms. So if you want to use it with windows you may have some trouble getting it running and working properly.

I've decided that I'm going to be using Hem for all my minification needs from now on since it provides everything RequireJS provides and then some (e.g. template minification). Plus it's source code is written in CoffeeScript (unlike RequireJS), which makes it a pleasure to contribute to.

I've contributed some improvements to Hem, visible on [Hem's pull requests](https://github.com/maccman/hem/pulls) page. You can now ask it to skip CSS minification and have more control over where it should output things.

**Update (Nov 9):** found an [interesting post](http://blog.millermedeiros.com/2011/09/amd-is-better-for-the-web-than-commonjs-modules/) comparing the CommonJS way of defining modules to the AMD (RequireJS) way. I agree with the general sentiment expressed, in that RequireJS makes it easy to test your scripts when developing your app since it can load in dependencies on the fly from the server. Yet Hem works around this by rebuilding the entire optimised script file on every request, and thus doesn't hinder development in any way. Moreover you get to test the final output script file that you'd get in a production build during development, which is something you can't really do as nicely with RequireJS.
