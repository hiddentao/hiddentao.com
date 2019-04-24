---
title: An improved angular.module() - split your modules into multiple files
date: '2013-11-04'
summary: "The <a href=\"http:&#47;&#47;docs.angularjs.org&#47;api&#47;angular.module\">angular.module()<&#47;a> call is unfortunately not very well designed, if you read the docs. If you call it with a single argument (the module name) it expects the module to already exist. The create the module you have to pass in an array as a second argument, telling it which modules need to be loaded before this module gets loaded - Angular will then create this module:\r\n"
tags:
  - Javascript
  - AngularJS
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
