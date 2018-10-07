---
layout: post
published: true
title: Authentication in GraphQL via directives and custom Apollo links
date: '2018-10-07 12:17:01 +0100'
categories:
- Uncategorized
tags:
- Apollo
- GraphQL
- Links
- Authentication
- JWT
comments: []
---

A requirement of [our Ethereum Dapp](https://kickback.events?utm_source=hiddentao_blog&utm_medium=post) is that we sign the user into our backend prior to allowing them to make an modification
to either on-chain (smart contract) or off-chain (cloud db) data.

Since we're using [GraphQL](https://graphql.org/) for our frontend to backend
API connection we decided to introduce a directive - `@auth` - for use with our
GraphQL queries and mutations that would indicate when the user needed to first
be logged in prior to executing the call.

For example, to deploy a new on-chain contact instance we first need to log the
user in (duh!), so the GraphQL query would be:


```
mutation create($name: String, $deposit: String, $limitOfParticipants: String) {
  create(name: $name, deposit: $deposit, limitOfParticipants: $limitOfParticipants) @auth
}
```

Doing an authenticated request requires adding the `Authorization` header to
the outgoing AJAX call. The easiest way to add such a header when using the
[Apollo GraphQL client](https://www.apollographql.com/client) is through writing
a custom [Apollo link](https://www.apollographql.com/docs/link/). A _Link_
allows one to modify a GraphQL request and its corresponding response whilst
in transit. By default you may use a [HTTP Link](https://github.com/apollographql/apollo-link-http) to send GraphQL requests to
a server, or a [Local Link](https://github.com/apollographql/apollo-link-state) to serve requests locally within the client
itself.

Our custom link will look for the `@auth` directive in a request, strip it out
of the request, and add an `Authorization` header to the request before the
request reaches the HTTP Link that will actually send it to our backend server:

```js
import gql from 'graphql-tag'
import { Observable, ApolloLink } from 'apollo-link'
import { hasDirectives, checkDocument, removeDirectivesFromDocument } from 'apollo-utilities'

const sanitizedQueryCache = new Map()

const authManager = {
  isLoggedIn: () => { /* return if user logged in */ },
  logIn: () => { /* show modal/page/etc to log user in */ },
  authHeaderValue: () => { /* return "Bearer 0x23..." */ },
}

export default new ApolloLink((operation, forward) => {
  // if no @auth directive then nothing further to do!
  if (!hasDirectives(['auth'], operation.query)) {
    return forward(operation)
  }

  // get sanitized query (remove @auth directive since server won't understand it)
  const cacheKey = JSON.stringify(operation.query)
  let sanitizedQuery = sanitizedQueryCache[cacheKey]
  if (!sanitizedQuery) {
    // remove directives (inspired by https://github.com/apollographql/apollo-link-state/blob/master/packages/apollo-link-state/src/utils.ts)
    checkDocument(operation.query)
    sanitizedQuery = removeDirectivesFromDocument( [{ name: 'auth' }], operation.query)
    // save to cache for next time!
    sanitizedQueryCache[cacheKey] = sanitizedQuery
  }

  // overwrite original query with sanitized version
  operation.query = sanitizedQuery

  // build handler
  return new Observable(async observer => {
    let handle

    // if user is not logged in
    if (!authManager.isLoggedIn()) {
      try {
        await authManager.logIn()
      } catch (err) {
        console.error(err)
        observer.complete([])
      }
    }

    // add auth headers (by this point we should have them!)
    operation.setContext({
      headers: {
        Authorization: authManager.authHeaderValue()
      }
    })

    // pass request down the chain
    handle = forward(operation).subscribe({
      next: observer.next.bind(observer),
      error: observer.error.bind(observer),
      complete: observer.complete.bind(observer),
    })

    // return unsubscribe function
    return () => {
      if (handle) {
        handle.unsubscribe()
      }
    }
  })
})
```

The key things to note from above:

* If the `@auth` directive is not present in the query then this Link simply
passes the query forward in the chain of Links.
* If the directive is present it strips it out of the query otherwise our HTTP
backend will complain about the directive when it receives the query. If we
intend for our backend to also understand and make use of the directive then
obviously we wouldn't need to strip it out there.
* If the user is not logged in we log them in, and only then do we forward the
original request (this time with the `Authorization` header set).

We would make use of this Link as follows when setting up `ApolloClient`:

```js
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'

import auth from './auth' // our custom Link

const http => new HttpLink({ uri: `https://mybackend.com/graphql` })

const cache = new InMemoryCache()

const clientInstance = new ApolloClient({
  cache,
  link: ApolloLink.from([
    auth, /* comes before http */
    http
  ])
})
```

The only part of the code I haven't written out fully is the `authManager`. This is
specific to each app - in our case it dispays a sign-in modal when the use wishes
to sign in, and it saves the authentication token obtained into Local Storage
so that on page reloads the user is still signed in.

You can see our full working code example at [https://github.com/noblocknoparty/app/blob/dev/src/graphql/links/auth.js](https://github.com/noblocknoparty/app/blob/dev/src/graphql/links/auth.js).
