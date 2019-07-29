---
title: How to use Serializable Isolation with Postgres transactions
date: '2019-07-29'
---

Postgres is my current RDBMS of choice when it comes to building
on the server-side. Like most respectable RBMSes, Postgres allows for multiple
queries to be executed within a single [atomic transaction](https://en.wikipedia.org/wiki/Atomicity_(database_systems)). Transactions operate in isolation from each other,
and one would expect that one transaction cannot operate on data currently
being operated on within another concurrent transaction. However this is not
always the case, and indeed, with Postgres it's not even the default case!

There are actually [3 different levels of isolation](https://www.postgresql.org/docs/9.5/transaction-iso.html)
provided within Postgres:

* _Read committed_ - This is the default isolation level in Postgres. At this
level, a query within a transaction will pick up updates made by
another quicker transaction has which committed changes to
the data during the current transaction. So it's possible that the data read
from a given table changes during the course of the transaction. This isolation
level is adequate for most application and is fast and simple to use.
* _Repeatable read_ - This is a stricter isolation level than _read commited_
in that data committed by other quicker concurrent transactions will not be
seen by the current transaction. Thus the data it reads may become out-of-date.
If it tries to write to data has already been committed in a quicker, concurrent
transaction then an error will be throw .
* _Serializable_ - This is the strictest isolation level. In this level, it's
as if transactions are executed serially instead of concurrently, thus ensuring
maximum data integrity guarantees. However this does mean that a transaction
will fail if another transaction is currently taking place - meaning one must
be ready to retry a failed transaction in such instances. As such this isolation
level is the least convenient to use.

Thus, by default Postgres does not opt for the strictest isolation level - Serializable - and
this can indeed have [negative consequences](https://news.ycombinator.com/item?id=7353095)
if left as-is.

Although the _Serializable_ isolation level may be considered overkill for
simple applications I prefer to use it whenever possible in order to avoid
potential issues later down the line. However, this does mean needing to
manually retry transactions when they fail due to the isolation check.

I presently use [knex](http://knexjs.org) to connect my Node apps to connect as
Postgres. It provides a nice transaction interface API:

```js
import knex from 'knex'

// setup db connection
const db = knex({ /* config */ })

const updateJob = async (id, values) => {
  // start a transaction
  return db.transaction(async trx => {
    try {
      // set isolation level
      await db
        .raw('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE')
        .transacting(trx)

      // do some querying
      const ret = await db.table('job')
        .update(values)
        .transacting(trx)

      // if we reached this point then let's commit the transaction
      return trx.commit(ret)
    } catch (err) {
      // rollback everything
      await trx.rollback(err)
    }
  })
}
```

_Note: I'm purposefully not including logging statements within these code
examples, just to keep things simple._

That's quite verbose. So we can refactor it by creating a helper function
to generate the transaction so that we don't have to keep setting the
isolation level everywhere:

```js
const dbTrans = async cb => {
  return db.transaction(async trx => {
    try {
      await db.raw('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE')
        .transacting(trx)

      const ret = await cb(trx)

      await trx.commit(ret)
    } catch (err) {
      await trx.rollback(err)
    }
  })
}

const updateJob = async (id, values) => {
  return dbTrans(async trx => {
    return db.table('job')
      .update(values)
      .transacting(trx)
  })
}
```

Now we just need to add an automatic retry mechanism within `dbTrans`:

```js
const dbTrans =  async cb => {
  return new Promise((resolve, reject) => {
    const __tryTransaction = async () => {
      try {
        const ret = await db.transaction(async trx => {
          await db
            .raw('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE')
            .transacting(trx)

          try {
            const result = await cb(trx)
            await trx.commit(result)
          } catch (err) {
            await trx.rollback(err)
          }
        })

        resolve(ret)
      } catch (err) {
        // if it was due to transaction serialization error then retry the transaction
        // see https://www.postgresql.org/docs/9.5/transaction-iso.html
        if (err.toString().includes('could not serialize access')) {
          __tryTransaction()
        } else {
          reject(err)
        }
      }
    }

    // kick things off
    __tryTransaction()
  })
}
```

The above newly improved `dbTrans` method will keep retrying a transaction if
it fails due to a serialization error. For any other error it will throw the
error back to the caller, which is what we want.

A further improvement to the above method would be to limit the number of
retries. If your code is having to retry a transaction numerous times then it
indicates either an extremely high query load, a need to refactor your
database tables (i.e. split them up, perhaps) or a need to simplify your
transactions to reduce the chances of conflicts.
