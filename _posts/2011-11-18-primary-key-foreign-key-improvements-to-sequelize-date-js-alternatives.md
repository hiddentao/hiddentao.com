---
layout: post
published: true
title: Primary key, foreign key improvements to Sequelize + Date.js alternatives
excerpt: "I've created a [patch][&#47;patch](https:&#47;&#47;github.com&#47;sdepold&#47;sequelize&#47;pull&#47;110)
  for [Sequelize](http:&#47;&#47;sequelizejs.com&#47;) which enables one to use primary
  key fields as foreign keys too, something I find myself doing often with my relational
  schemas as I don't like using the standard `id` primary key field unless it's the
  most sensible primary key to have. In practice the changes mean you can do the following
  (not currently possible in vanilla Sequelize):\r\n"
date: '2011-11-18 16:54:51 +0800'
categories:
- Uncategorized
tags:
- Javascript
- node.js
- ORM
comments:
- id: 5007
  author: 'How to: Which ORM should I use for Node.js and MySQL? | SevenNet'
  author_email: ''
  author_url: http://sevennet.org/2014/12/07/how-to-which-orm-should-i-use-for-node-js-and-mysql/
  date: '2014-12-07 01:23:03 +0800'
  date_gmt: '2014-12-07 01:23:03 +0800'
  content: "<p>[&#8230;] like to use primary keys as foreign keys, you&#8217;ll need
    the patch that&#8217;s described in this blog post. If you&#8217;d like help for
    persistence.js there is a google group devoted to [&#8230;]<&#47;p>\n"
- id: 5012
  author: 'Fixed Which ORM should I use for Node.js and MySQL? #dev #it #asnwer |
    Good Answer'
  author_email: ''
  author_url: http://goodanswer.biz/2014/12/26/fixed-which-orm-should-i-use-for-node-js-and-mysql-dev-it-asnwer/
  date: '2014-12-26 17:36:44 +0800'
  date_gmt: '2014-12-26 17:36:44 +0800'
  content: "<p>[&#8230;] like to use primary keys as foreign keys, you&#8217;ll need
    the patch that&#8217;s described in this blog post. If you&#8217;d like help for
    persistence.js there is a google group devoted to [&#8230;]<&#47;p>\n"
---
I've created a [patch](https://github.com/sdepold/sequelize/pull/110) for [Sequelize](http://sequelizejs.com/) which enables one to use primary key fields as foreign keys too, something I find myself doing often with my relational schemas as I don't like using the standard `id` primary key field unless it's the most sensible primary key to have. In practice the changes mean you can do the following (not currently possible in vanilla Sequelize):

```js
var User = sequelize.define('user', {
    name: Sequelize.STRING
}, {
    underscored: true
})

var Profile = sequelize.define('profile', {
    user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    dob: Sequelize.DATE
}, {
    underscored: true
})

var Profile2 = sequelize.define('profile2', {
    dob: Sequelize.DATE
}, {
    underscored: true
})

User.hasOne(Profile)
User.hasOne(Profile2)

/*
At this point Profile.user_id will act as both primary and foreign key, whereas Profile2.user_id and Profile.id will have been auto-added by Sequelize and will act as foreign key and primary key respectively.
*/
```

## Date.js alternatives ##

[Date.js](http://www.datejs.com/) has been causing me a number of problems due to its nature of extending/modifying the built-in `Date` object. It really messed up my use of cookie sessions in Express, specifically to do with setting the cookie expiry dates. I still haven't figured out exactly why cookies weren't getting set properly but I suspect that it's some internal change to `Date` made by date.js which was causing the problem. I then also had problems with it on the browser side of things.

Looking for an alternative I'm happy to have found [XDate](http://arshaw.com/xdate/), a more light-weight and better-designed date library than date.js. It wraps the default `Date` object whilst still exposing an identical API as well as providing its own. The nice thing about XDate is that its custom API methods are almost identical to those provided by date.js so switching one out for the other didn't require any massive code changes.

XDate was very recently created and it's on Github too so I expect it will only get better with time. There isn't a node module for it yet, as far as I'm aware. Then again, I've just had a look and found [Moment](http://momentjs.com/), another nice-looking date library available through NPM. I might give that a whirl for my server side.