---
title: 'Squel 1.0.5 with Mocha, Chai and Sinon'
date: '2012-11-03'
summary: ''
tags:
  - Javascript
  - CoffeeScript
  - node.js
  - Squel
---
Today I released version 1.0.5 of [Squel](no-longer-valid), the Javascript SQL query string builder. Apart from new features such as [instance cloning](no-longer-valid) and [JOINs in DELETEs](no-longer-valid) the main change is the new test suite.

I decided to ditch [Vows](https://github.com/cloudhead/vows) and opt for [Mocha](https://web.archive.org/web/20130328220556/http://visionmedia.github.com:80/mocha/) as it doesn't force me to write my tests in the Behaviour-Driven Development (BDD) style. Along with this I'm using [Chai](http://chaijs.com), a comprehensive assertion library, and [Sinon](http://sinonjs.org), an equally comprehensive mocking library. The new test code should be much easier to maintain and modify going forward.

Get it using npm:

```bash
$ npm install squel
```

Homepage: [squeljs.org](no-longer-valid)

Github: [github.com/hiddentao/squel](https://github.com/hiddentao/squel)
