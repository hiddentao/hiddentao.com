---
layout: post
published: true
title: An improved angular.module() - split your modules into multiple files
excerpt: "The <a href=\"http:&#47;&#47;docs.angularjs.org&#47;api&#47;angular.module\">angular.module()<&#47;a>
  call is unfortunately not very well designed, if you read the docs. If you call
  it with a single argument (the module name) it expects the module to already exist.
  The create the module you have to pass in an array as a second argument, telling
  it which modules need to be loaded before this module gets loaded - Angular will
  then create this module:\r\n"
date: '2013-11-04 10:34:30 +0800'
categories:
- Uncategorized
tags:
- Javascript
- AngularJS
comments:
- id: 4895
  author: Lars Jeppesen
  author_email: lars.jeppesen@gmail.com
  author_url: ''
  date: '2014-01-20 14:27:00 +0800'
  date_gmt: '2014-01-20 14:27:00 +0800'
  content: "<p>This is a nice solution.<&#47;p>\n\n<p>What I've been doing so far
    is, in app.js, creating all my modules as empty modules:<&#47;p>\n\n<p>angular.module('module1',[]);\nangular.module('module2',,[]);
    \n- and so on.<&#47;p>\n\n<p>Then, in the individual files:<&#47;p>\n\n<p>angular.module('module1').controller(
    bla bla bla bla).<&#47;p>\n\n<p>and so on.<&#47;p>\n"
- id: 4930
  author: Jed Richards
  author_email: jedrichards@gmail.com
  author_url: ''
  date: '2014-04-25 11:58:00 +0800'
  date_gmt: '2014-04-25 10:58:00 +0800'
  content: "<p>This is great. I'm really struggling to create a nice scalable file
    structure for my app at the moment that vibes with an intuitive&#47;sane build
    process which is ideally file order agnostic. I really dislike that the angular.module
    function does two very different things depending on arguments. I wonder if the
    Angular team has plans to improve this? There's so much confusion online about
    how to structure Angular projects and I think this bad function design certainly
    doesn't help. Have you considered turning this into a Bower component so we can
    easily pull it into our projects with our other vendor files?<&#47;p>\n"
- id: 4931
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2014-04-25 12:04:00 +0800'
  date_gmt: '2014-04-25 11:04:00 +0800'
  content: "<p>Thanks Jed. There is a lot of discussion still going on around this
    issue, see https:&#47;&#47;github.com&#47;angular&#47;angular.js&#47;issues&#47;1779.
    Plus it seems somebody has already gone ahead and created a Bower component which
    does something similar (note: I haven't tried this one myself): https:&#47;&#47;github.com&#47;bahmutov&#47;stop-angular-overrides<&#47;p>\n"
- id: 4942
  author: matteus
  author_email: mattwad@gmail.com
  author_url: ''
  date: '2014-05-20 15:43:00 +0800'
  date_gmt: '2014-05-20 14:43:00 +0800'
  content: |
    <p>I just use name-spaces, similar to how the yeoman generator called "angular-app." The main 'module' file just links to the 'sub-modules'. This way it's very easy to see the break-down, and every file is a new module:<&#47;p>

    <p>&#47;&#47; security.js:
    angular.module('security', ['security.authentication', 'security.session', 'security.login'])
    ...
    &#47;&#47; security.authentication.js:
    angular.module('security.authentication', [])
    ...<&#47;p>
- id: 4967
  author: Simon Robb
  author_email: sajrobb@gmail.com
  author_url: ''
  date: '2014-07-14 22:20:00 +0800'
  date_gmt: '2014-07-14 21:20:00 +0800'
  content: "<p>I'd usually just put the single-argument version in a try-catch block,
    wherever the module is required, and then if it hasn't yet been created you can
    instantiate the module in the catch. https:&#47;&#47;gist.github.com&#47;simonrobb&#47;ba264b3c0b8dad9971c5<&#47;p>\n"
- id: 5009
  author: wmmyers
  author_email: wmmyers@hotmail.com
  author_url: ''
  date: '2014-12-13 12:48:00 +0800'
  date_gmt: '2014-12-13 12:48:00 +0800'
  content: "<p>Thanks, nice way to catch the 'module not available' error as well
    as adding further dependencies.<&#47;p>\n"
- id: 5010
  author: Using modularized AngularJS in a traditional MVC | Leipedesigner.nl
  author_email: ''
  author_url: http://www.leipedesigner.nl/?p=5
  date: '2014-12-17 19:23:12 +0800'
  date_gmt: '2014-12-17 19:23:12 +0800'
  content: "<p>[&#8230;] research I found this piece of code by Hiddentoa, which revises
    the angular.module function so you can add dependencies later on in your code
    to [&#8230;]<&#47;p>\n"
- id: 5035
  author: lucax88x
  author_email: lucax88x@hotmail.com
  author_url: ''
  date: '2015-05-05 16:14:00 +0800'
  date_gmt: '2015-05-05 15:14:00 +0800'
  content: "<p>Thanks, this is perfect!<&#47;p>\n"
- id: 5066
  author: Federico Marengo
  author_email: fedemarengo@gmail.com
  author_url: ''
  date: '2015-08-26 02:34:00 +0800'
  date_gmt: '2015-08-26 01:34:00 +0800'
  content: "<p>How i use this code? Can you provide an example?<&#47;p>\n"
- id: 5067
  author: Ram
  author_email: ram@hiddentao.com
  author_url: http://hiddentao.com/
  date: '2015-08-27 05:03:00 +0800'
  date_gmt: '2015-08-27 04:03:00 +0800'
  content: |
    <p>var app = angular.module('test', ['dep1', 'dep2']);<&#47;p>

    <p>&#47;&#47; later on (in another file)<&#47;p>

    <p>var app = angular.module('test', ['dep3', 'dep4']);<&#47;p>
- id: 5077
  author: Oliver P&Atilde;&copy;rez Camargo
  author_email: oliver.a.perez.c@gmail.com
  author_url: ''
  date: '2015-09-09 16:15:00 +0800'
  date_gmt: '2015-09-09 15:15:00 +0800'
  content: "<p>Wonderful solution, very useful when using preprocessors.<&#47;p>\n"
---
The [angular.module()](http://docs.angularjs.org/api/angular.module) call is unfortunately not very well designed, if you read the docs. If you call it with a single argument (the module name) it expects the module to already exist. The create the module you have to pass in an array as a second argument, telling it which modules need to be loaded before this module gets loaded - Angular will then create this module:
<a id="more"></a><a id="more-1639"></a>

```js
angular.module('test', []); // creates the module
```

From then on, you must use the single-argument version of the call if you want to add items to the module. If you again make the call for the same module with an array as the second argument Angular will overwrite your originally created module (and all the items you attached to it) with yet another new module instance:

```js
var app = angular.module('test', []); // creates the module

app.factory(...)
app.controller(...)

var app = angular.module('test', []);

// we've now lost our previously created factories, controllers.
// what we should do do: angular.module('test');

```

This makes things tricky when you wish to split components of a module across multiple files, something you will probably want to do just to keep your code clean and well organised if nothing else. Since you can only do the _creation-style_ call once in order to preserve the items you add to the module you then have to be careful about the order in which your files are processed. Not good!

So here's an improved version of `angular.module()` which wraps the original method with code to keep track of whether a module has already been created or not, thus allowing you to not only not have to worry about file order but also be able to add further module dependencies at any time:

```js
/**
 * Workaround to make defining and retrieving angular modules easier and more intuitive.
 */
(function(angular) {
    var origMethod = angular.module;

    var alreadyRegistered = {};

    /**
     * Register/fetch a module.
     *
     * @param name {string} module name.
     * @param reqs {array} list of modules this module depends upon.
     * @param configFn {function} config function to run when module loads (only applied for the first call to create this module).
     * @returns {*} the created/existing module.
     */
    angular.module = function(name, reqs, configFn) {
        reqs = reqs || [];
        var module = null;

        if (alreadyRegistered[name]) {
            module = origMethod(name);
            module.requires.push.apply(module.requires, reqs);
        } else {
            module = origMethod(name, reqs, configFn);
            alreadyRegistered[name] = module;
        }

        return module;
    };

})(angular);
```

Also available as a GIST: [https://gist.github.com/hiddentao/7300694](https://gist.github.com/hiddentao/7300694)