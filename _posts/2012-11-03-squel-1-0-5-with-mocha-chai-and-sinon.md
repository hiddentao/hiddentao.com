---
layout: post
published: true
title: Squel 1.0.5 with Mocha, Chai and Sinon
date: '2012-11-03 07:37:17 +0800'
categories:
- Uncategorized
tags:
- Javascript
- CoffeeScript
- node.js
- Squel
comments:
- id: 4794
  author: abhamid
  author_email: hamidabdulmalik@gmail.com
  author_url: ''
  date: '2012-12-03 01:00:00 +0800'
  date_gmt: '2012-12-03 01:00:00 +0800'
  content: "<p>Does Squel have security against sql injection. Very good work though.<&#47;p>\n"
- id: 4795
  author: Ramesh Nair
  author_email: ''
  author_url: http://twitter.com/hiddentao
  date: '2012-12-03 01:15:00 +0800'
  date_gmt: '2012-12-03 01:15:00 +0800'
  content: |
    <p>Thanks. No it doesn't protect against that at the moment. I initially left that out as I wanted the developer to have full control (hence the ability to use value place holders) and also didn't want to make assumptions about DBMS syntax with regards to that.<&#47;p>

    <p>But perhaps if you opt not to use place holders then it can auto-escape quotes in the string. What do you think?<&#47;p>
---
Today I released version 1.0.5 of [Squel](https://squeljs.org), the Javascript SQL query string builder. Apart from new features such as [instance cloning](http://hiddentao.github.com/squel/#cloning) and [JOINs in DELETEs](http://hiddentao.github.com/squel/#delete) the main change is the new test suite.

I decided to ditch [Vows](https://github.com/cloudhead/vows) and opt for [Mocha](http://visionmedia.github.com/mocha) as it doesn't force me to write my tests in the Behaviour-Driven Development (BDD) style. Along with this I'm using [Chai](http://chaijs.com), a comprehensive assertion library, and [Sinon](http://sinonjs.org), an equally comprehensive mocking library. The new test code should be much easier to maintain and modify going forward.

Get it using npm:

```bash
$ npm install squel
```

Homepage: [squeljs.org](http://squeljs.org)

Github: [github.com/hiddentao/squel](https://github.com/hiddentao/squel)