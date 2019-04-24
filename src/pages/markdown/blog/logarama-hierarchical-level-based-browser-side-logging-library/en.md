---
title: 'Logarama - hierarchical, level-based browser-side logging library'
date: '2015-08-20'
summary: "A few days ago I released [logarama](https:&#47;&#47;github.com&#47;hiddentao&#47;logarama), a Javscript logging library for browser-side code. Logarama came out of my approach to logging in various React apps I've been building lately. None of the existing logging libraries out there (and boy, there are many) did quite what I wanted so I built my own.\r\n"
tags:
  - Browsers
  - Javascript
  - Logging
---
A few days ago I released [logarama](https://github.com/hiddentao/logarama), a Javscript logging library for browser-side code. Logarama came out of my approach to logging in various React apps I've been building lately. None of the existing logging libraries out there (and boy, there are many) did quite what I wanted so I built my own.  

Here is how it looks in practice:

```js  
var Logger = require('logarama');

var appLogger = new Logger('app', {  
/* level ordering: error > warn > info > debug > trace */  
  minLevel: 'warn',  
});

appLogger.info('test');  
// does nothing

appLogger.warn('test');  
// console.warn( "app[WARN]: test" )

appLogger.info('test');  
// console.error( "app[ERROR]: test" )

var dataLogger = logger.create('data', {  
  minLevel: 'error',  
});

dataLogger.info(2);  
// does nothing

dataLogger.error('bad');  
// console.error( "app/data[ERROR]: bad" )

appLogger.setMinLevel('trace');

child.info(2, 3, 'test', ['a', 'b', 'c']);  
// console.info( "app/data[INFO]: 2 )  
// console.info( "app/data[INFO]: 3 )  
// console.info( "app/data[INFO]: test )  
// console.info( "app/data[INFO]: a\nb\nc" )

```

_NOTE: the default minimum logging level is `debug`_.

As you can it supports a number of features:

* **Uses `console` methods** - all log methods map to console methods.  
* **Multiple message arguments** - each argument is logged independently.  
* **Logger class** - instantiate multiple loggers and control them independently.  
* **Tag/name prefix** - the tag/name gets prefixed to every message. In essence these are logging categories.  
* **Child loggers** - child loggers inherit config info from parent loggers, and prefix their parent's tag onto their own.  
* **Level propagation** - using `setMinLevel()` you can reset the minimum logging level of a given logger and all its child instances.

The built-in message argument formatter already does a good job of dealing with arrays, objects, `Error` objects as well as scalar values. But you can override this with your own formatter:

```js  
var Logger = require('logarama');

var appLogger = new Logger({  
  format: function(arg) {  
    return '{' arg '}';  
  },  
});

appLogger.info('test');  
// console.log( "[INFO] {test}" )

```

Logarama comes with comprehensive unit tests and a minified UMD-wrapped version so you can use it with or without your module loader of choice.

* Installation: `npm install logarama`  
* Github: [https://github.com/hiddentao/logarama](https://github.com/hiddentao/logarama)
