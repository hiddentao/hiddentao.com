---
layout: post
published: true
title: Thinodium - a light-weight Object Document Mapper for Node.js
excerpt: "I've just released [Thinodium](https:&#47;&#47;github.com&#47;hiddentao&#47;thinodium),
  a flexible yet light-weight Object Document Mapper (ODM) for Node.js. In this post
  I'm going to talk about what it is, why it's useful, and my motivations for building
  it the way I did.\r\n"
date: '2016-05-08 06:51:36 +0800'
categories:
- Uncategorized
tags:
- node.js
- Database
- ODM
comments: []
---
I've just released [Thinodium](https://github.com/hiddentao/thinodium), a flexible yet light-weight Object Document Mapper (ODM) for Node.js. In this post I'm going to talk about what it is, why it's useful, and my motivations for building it the way I did.  
<a id="more"></a><a id="more-1969"></a>

## What is an ODM?

An ODM is a tool which allows you to interact with database tables as if they're objects (in the [OOP](https://en.wikipedia.org/wiki/Object-oriented_programming) sense). The benefit of this approach is that you get to interact with your database in a way which matches the mental model you use to interact with other objects within your app, without having to actually write database queries.

ODMs are built for interacting with document-oriented databases such as Mongo, CouchDB, etc. Their cousins - ORMs (Object Relationship Mappers) - are usually meant for interacting with relational databases such as Postgres. Nowadays though, many ODM and ORM libraries support both types, making the names almost interchangeable.

For example, in a typical ODM this is how I might update a user's last name:

```js  
// tell the ODM about the User table and provide its schema  
const User = ODM.table('User');

// get user with id = 1  
const doc = User.get(1);

// update the user's last name  
doc.lastName = 'Smith';

// save it  
doc.save();  
```  


The query to update the user's last name in SQL would look something like `UPDATE Users SET lastName='Smith' WHERE ID=1`. If it was RethinkDB the underlying raw query might be: `r.table('Users').get(1).update({ lastName: 'Smith' });`. Clearly the ODM API is more intuitive to use.

## What's the downside?

Relational databases don't just hold data in tables, they also specify how data in one table relates to data in another. Document-oriented databases don't really enforce inter-table relationships as they have different use-cases in mind. However, most ODMs will allow you to model inter-table relationships such that you can rely on them without thinking about what queries need to be run at the database level to maintain those relationships.

For example, let's assume that we're using RethinkDB and that every user has an associated country, i.e. `User.countryId` points to `Country.id`. In a typical ODM we would model this relationship in such a way that when we retrieve a user we will get the country too automatically:

```js  
// define the Country table  
const Country = ODM.table('Country');

// define the User table  
const User = ODM.createTable('User', {  
  // tell ODM to model our relationship  
  foreignKey: {  
    countryId: 'Country.id',  
  }  
});

// get user with id = 1  
const doc = User.get(1);

// output the user  
console.log( doc instanceof User ); /* true */

// output the country  
console.log( doc.country instanceof Country ) ; /* true */

// update country name  
doc.country.name = 'France';

// this will update the country table  
doc.country.save();  
```  


How convenient. If we were to use raw querying we would have to do something like:

```js  
// get connection to db  
const r = require('rethinkdbdash')().db('mydb');

// get the user, and get the connected country, all in one  
const ret = yield r.table('User').get(1)  
  .filter({id: 1})  
  .eqJoin('countryId', r.table('Country'))  
  .run();

// source table result is on the left, joined other table is on the right  
const doc = ret.left[0];  
const country = ret.right[0];

// console.log...

// update country name  
yield r.table('Country').get(country.id).update({name: 'France'}).run();  
```  


Clearly it's easier with the ODM. But even though an ODM makes life easier there are issues one must generally keep in mind:

* The ODM may not necessarily map what you want to do into the most efficient underlying database calls. A less-efficient ODM may have used two `get()` fetches instead of `eqJoin()` in the example above.

* An ODM will never be able to abstract away all the types of queries supported by the underlying database engine, e.g. [filter()](https://rethinkdb.com/api/javascript/filter/), [innerJoin()](https://rethinkdb.com/api/javascript/inner_join/).

Thus at some point, in order to ensure maximum querying efficiency you will be forced to use raw querying, despite the fact that you are using an ODM/ORM. In other words the abstraction being presented to you can never fully meet your needs without also enabling you to bypass the abstraction itself and run raw queries.

## How is Thinodium better?

Thinodium tries to compensate for the limitations of an ODM by not trying to do too much in the first place. Thinodium does not model inter-table relationships, and it does not try to hide the underlying database engine's querying methods behind abstractions.

The user-country fetch we did earlier would look like the following in Thinodium:

```js  
const Thinodium = require('thinodium');
 
// connect to db
const db = yield Thinodium.connect('rethinkdb', {
  db: 'mydb'
});
 
// define the tables
const User = yield db.model('User');
const Country = yield db.model('Country');
 
// fetch user and associated country using raw querying mode
const ret = yield User.rawQry()
  .filter({id: 1})
  .eqJoin('countryId', r.table('Country'))
  .run();
 
// wrapRaw() wraps raw query results into ODM document objects
const doc = User.wrapRaw(ret.left[0]);
const country = Country.wrapRaw(ret.right[0]);
 
// update country name
country.name = 'France';
yield country.save();
```  


_Note: Thinodium uses Promises, no callbacks._

As you can see we have the best of both worlds. We can write powerful, optimised queries using the underlying database engine's methods. At the same time we can wrap the results within ODM document objects, allowing us to manipulate data with the same convenience as a typical ODM.

There are of course some basic methods built-in. You don't always have to use raw querying:

```js  
// insert a new user, will return a Thinodium.Document instance  
const doc = yield User.insert({  
  firstName: 'john',  
  lastName: 'smith',  
  countryId: 1,  
});

// update user's last name  
doc.lastName = 'Wiley';  
yield country.save();

// get country  
let country = yield Country.get(1);

// update country name  
country.name = 'France';  
yield country.save();  
```  


Thinodium documents can also have [virtual fields](https://hiddentao.github.io/thinodium/#customization) and [custom methods](https://hiddentao.github.io/thinodium/#customization). Model instances (i.e. the objects representing tables) can also be enhanced with [schema validation](https://hiddentao.github.io/thinodium/#schema) and [hooks](https://hiddentao.github.io/thinodium/#hooks) among other things.

_Note: For those who have used [Robe](https://github.com/hiddentao/robe) (my ODM for MongoDB), you will notice that Thinodium re-uses and improves upon Robe's document architecture._

### Adapter architecture

Since Thinodium exposes the underlying raw querying engine and doesn't try to abstract away the details too much it is easy to support more than one database engine. To install and use thinodium you need both the core package as well as an _adapter_ for your database of choice. E.g. for RethinkDB:

```bash
$ npm install thinodium thinodium-rethinkdb  
```  


Writing your own adapter means extending the base `Thinodium.Database` and `Thinodium.Model` classes and implementing the necessary methods therein. More information on this is available in the [adapter docs](https://hiddentao.github.io/thinodium/#adapters).

## Future work and links

Right now there is just one adapter, and that's for RethinkDB. I plan to add support for Mongo at some point, which may result in [Robe](https://github.com/hiddentao/robe) being deprecated. Also, I'm wondering whether to add first-class support for database updates observes (i.e. oplog tailing in Mongo, [changes()](https://rethinkdb.com/api/javascript/changes/) in Rethink) or leaves that to library users to do so themselves.

The current list of adapters is always visible at [https://www.npmjs.com/search?q=thinodium](https://www.npmjs.com/search?q=thinodium).

Links:

* Github - [thinodium](https://github.com/hiddentao/thinodium), [thinodium-rethinkdb](https://github.com/hiddentao/thinodium-rethinkdb)  
* Documentation - [https://hiddentao.github.io/thinodium/](https://hiddentao.github.io/thinodium/)











