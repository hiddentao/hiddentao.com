---
layout: post
published: true
title: Squel 1.0.6 with automatic name quoting
date: '2013-01-10 03:40:36 +0800'
categories:
- Uncategorized
tags:
- Javascript
- CoffeeScript
- node.js
- Squel
comments:
- id: 4811
  author: Sherlock
  author_email: younesagma@gmail.com
  author_url: ''
  date: '2013-02-12 20:36:00 +0800'
  date_gmt: '2013-02-12 20:36:00 +0800'
  content: |
    <p>Thank you so much for this library !<&#47;p>

    <p>I have a question though...<&#47;p>

    <p>I would like to know if the order is important.. For instance, is it possible to write something like :<&#47;p>

    <p>squel.select().from("table").group.("id").field("id").field("name");<&#47;p>

    <p>Or group should be the last as it is required in a normal SQL request ?<&#47;p>
- id: 4812
  author: Ramesh Nair
  author_email: ''
  author_url: http://twitter.com/hiddentao
  date: '2013-02-13 04:18:00 +0800'
  date_gmt: '2013-02-13 04:18:00 +0800'
  content: |
    <p>No, order does not matter. It's flexible.<&#47;p>

    <p>Enjoy!<&#47;p>
---
[Squel](https://squeljs.org) version 1.0.6 is now out. You can now tell Squel to [automatically quote table and field names](http://hiddentao.github.com/squel/#autoquotes). In addition the query builder options code was refactored and simplified.

**How to use**

Let's say you build a query:

```js
squel.select()
  .from("students")
  .field("name", "Student name");
```

By default this will give you:

```sql
SELECT name AS "Student name" FROM students
```

Now you can pass in the following options:

```js
squel.select({
  autoQuoteTableNames: true,
  autoQuoteFieldNames: true,
  nameQuoteCharacter: '|'
})
  .from("students")
  .field("name", "Student name");
```

This will give:

```sql
SELECT |name| AS "Student name" FROM |students|
```

*Note: if `nameQuoteCharacter` is ommitted then ` is assumed to be the quote character.*

**Download it**

Install squel using npm:

```bash
$ npm install squel
```

Homepage: [squeljs.org](http://squeljs.org)

Github: [github.com/hiddentao/squel](https://github.com/hiddentao/squel)