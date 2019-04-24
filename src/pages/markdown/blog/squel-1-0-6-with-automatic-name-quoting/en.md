---
title: Squel 1.0.6 with automatic name quoting
date: '2013-01-10'
summary: ''
tags:
  - Javascript
  - CoffeeScript
  - node.js
  - Squel
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
