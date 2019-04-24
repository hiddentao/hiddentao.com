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
Today I released version 1.0.5 of [Squel](https://squeljs.org), the Javascript SQL query string builder. Apart from new features such as [instance cloning](http://hiddentao.github.com/squel/#cloning) and [JOINs in DELETEs](http://hiddentao.github.com/squel/#delete) the main change is the new test suite.

I decided to ditch [Vows](https://github.com/cloudhead/vows) and opt for [Mocha](http://visionmedia.github.com/mocha) as it doesn't force me to write my tests in the Behaviour-Driven Development (BDD) style. Along with this I'm using [Chai](http://chaijs.com), a comprehensive assertion library, and [Sinon](http://sinonjs.org), an equally comprehensive mocking library. The new test code should be much easier to maintain and modify going forward.

Get it using npm:

```bash
$ npm install squel
```

Homepage: [squeljs.org](http://squeljs.org)

Github: [github.com/hiddentao/squel](https://github.com/hiddentao/squel)
