---
layout: post
published: true
title: React.js cached function binding for efficient props
date: '2017-11-16 20:13:01 +0100'
categories:
- Uncategorized
tags:
- React Native
- React
- Functions
- Performance
comments: []
---

When building React components it's sometimes easy to end up in a situation
whereby you have a list of identical child components which each expect a
callback function that behaves slightly different for each child.

For example, let's say we have an array of links and we wish to know within our
callback which link (i.e. the index number) was clicked. Here is how one may
set this up:

```js
// Link.js
import React, { PureComponent } from 'react'

export default class Link extends PureComponent {
  render () {
    const { url, text } = this.props

    return <a onClick={this.onClick} href={url}>{text}</a>
  }

  onClick () {
    const { onClick, index } = this.props

    onClick(index)
  }
}
```

And here is our parent component which renders the links:

```js
// MyLinks.js
import React, { PureComponent } from 'react'

import Link from './Link'

export default class MyLinks extends PureComponent {
  render () {
    return [
      { url: 'https://hiddentao.com', text: 'Homepage' },
      { url: 'https://github.com/hiddentao', text: 'Github' }
    ].map((item, index) => (
      <Link {...item} index={index} onClick={this.onLinkClick} />
    ))
  }

  onLinkClick (index) {
    // do something with "index"
  }
}
```

The above code works just fine. But you may ask:

_"Why does a Link even need to know about its index if all it does is pass it
to the onClick callback?"_.

This is a good question, because `index` isn't actually needed by `Link` in
order to render its content. A better approach would be for the parent
component - `MyLinks` - to pass the link index to the callback:

```js
// MyLinks.js
import React, { PureComponent } from 'react'

import Link from './Link'

export default class MyLinks extends PureComponent {
  render () {
    return [
      { url: 'https://hiddentao.com', text: 'Homepage' },
      { url: 'https://github.com/hiddentao', text: 'Github' }
    ].map((item, index) => (
      <Link {...item} onClick={() => this.onLinkClick(index)} />
    ))
  }

  onLinkClick (index) {
    // do something with "index"
  }
}
```

We can now simplify `Link` to be:

```js
// Link.js
import React from 'react'

export default ({ url, text, onClick }) => (
  <a onClick={onClick} href={url}>{text}</a>
)
```

Awesome. Except that, now every time `render()` gets called in `MyLinks`,
every `Link` will also get re-rendered, despite the fact that the links aren't
changing. What's happening is that the `onClick` property is getting calculated
every time:

```js
onClick={() => this.onLinkClick(index)}
```

Every evaluation of the above results in a completely new function!

This is where _cached function binding_ can help us. What we need to be able to
do is only have to generate the above bound function once per `index` value.

We can do this my adding some code to `MyLinks` as such:

```js
// MyLinks.js
import React, { PureComponent } from 'react'

import Link from './Link'

export default class MyLinks extends PureComponent {
  cache = {}

  bind (methodName, ...args) {
    const key = JSON.stringify({ methodName, args })

    if (!this.cache[key]) {
      this.cache[key] = this[methodName].bind(this, ...args)
    }

    return this.cache[key]
  }

  render () {
    return [
      { url: 'https://hiddentao.com', text: 'Homepage' },
      { url: 'https://github.com/hiddentao', text: 'Github' }
    ].map((item, index) => (
      <Link {...item} onClick={this.bind('onLinkClick', index)} />
    ))
  }

  onLinkClick (index) {
    // do something with "index"
  }
}
```

What's going to happen now is that the first time `MyLinks.render()` gets
called it will generate the bound `onClick` callback functions and save them
to `cache`. Subsequent `render()` calls will use the cached bound functions.

Note that the cache key for each bound function is effectively an amalgamation
of the method name (`onLinkClick`) and the parameters meant for the method
(in this case the value of `index`), meaning that it doesn't matter if the
link text and/or URL properties get changed.

You can take the above cacheing mechanism and make it re-usable by constructing
a base component class from which your other components can extend:

```js
// CachePureComponent.js
import { PureComponent } from 'react'

export class CachePureComponent extends PureComponent {
  cache = {}

  bind (methodName, ...args) {
    const key = JSON.stringify({ methodName, args })

    if (!this.cache[key]) {
      this.cache[key] = this[methodName].bind(this, ...args)
    }

    return this.cache[key]
  }
}
```

Then in `MyLinks` we would just need to do:

```js
import CachePureComponent form './CachePureComponent'

class MyLinks extends CachePureComponent { ... }
```

**Further ideas**

Although we use a string to refer to the method in the `bind()` function we
could modify it to take a reference, i.e:

```js
import { PureComponent } from 'react'
import { createHash } from 'crypto'

const sha256 = str => createHash('sha256').update(str).digest('hex')

export class CachePureComponent extends PureComponent {
  cache = {}

  bind = (fn, ...args) => {
    const fnSig = sha256(fn.toString())

    const key = JSON.stringify({ fnSig, args })

    if (!this.cache[key]) {
      this.cache[key] = fn.bind(this, ...args)
    }

    return this.cache[key]
  }
}
```

Then we can change the invocation of `bind()` to:

```js
this.bind(this.onLinkClick, index)
```
