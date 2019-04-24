---
title: React useReducer hook for form handling
date: '2019-03-22'
summary: ''
tags:
  - React
  - Hooks
  - Forms
  - Javascript
---

I've started porting over a recent React project to use the new [Hooks API](https://reactjs.org/docs/hooks-reference.html). Porting
a few state values is relatively simple with the [`useState`](https://reactjs.org/docs/hooks-reference.html#usestate) hook, but when
it comes to larger state objects (e.g. for forms) the [`useReducer`]((https://reactjs.org/docs/hooks-reference.html#usereducer)) hook comes in handy.

If you've built with [Redux](https://redux.js.org/) before then `useReducer` is very straightforward
to understand, as it uses the concept of a [_Dispatcher_ that handles _Actions_](https://redux.js.org/basics/actions),
just like in Redux.

Let's say we have a form that we've so far built using a class-based component
_(for brevity sake I'm not including field labels, styling, etc)_:

```js
import React from 'react'

class MyForm extends React.Component {
  state = {
    name: '',
    address: '',
    age: '',
    favouriteSubject: '',
    likesChess: false,
  }

  render () {
    return (
      <form>
        {Object.keys(this.state).forEach(field => (
          <input key={field} type="text" value={this.state[field]} onChange={this.onChange(field)} />
        ))}
      </form>
    )
  }

  onChange = field => e => {
    this.setState({
      [field]: e.currentTarget.value
    })
  }
}
```

_(Yes, I could probably cache the `onChange` handlers so that they don't get
recreated upon each re-render, but hooks will help us solve that below anyway!)_

Here is how we would write it using `useReducer`:

```js
import React, { useReducer, useMemo, useCallback } from 'react'
import Immutable from 'immutable'

// the reducer (similar to what we'd have in redux)
const formReducer = (state, { field, value }) => state.set(field, value)

// the initial state (separated out here in case we wish to easily reset the state)
const initialState = {
  name: '',
  address: '',
  age: '',
  favouriteSubject: '',
  likesChess: false,
}

// the field names (useful below)
const fieldNames = Object.keys(initialState)

const MyForm = () => {
  // get current state and the dispatcher, wrap the state as an immutable map
  const [ state, dispatch ] = useReducer(formReducer, new Immutable.Map(initialState))

  // build the onChange handlers
  const handlers = fieldNames.reduce((m, field) => {
    // the onChange handler for this field is only re-created if the dispatch method changes
    m[field] = useCallback(e => dispatch({ field, value: e.currentTarget.value }), [ field, dispatch ])
    return m
  }, {})

  // convert the immutable back to an object for easy access
  const stateAsObj = useMemo(() => state.toObject(), [state])

  return (
    <form>
      {fieldNames.forEach(field => (
        <input key={field} type="text" value={stateAsObj[field]} onChange={handlers[field]} />
      ))}
    </form>
  )
}
```

Let's break this down.

We only want to re-render when our `state` changes, so we'll represent it as
an [`Immutable.Map`](https://github.com/immutable-js/immutable-js) instance
instead of a plain Javascript object - this is similar to how we would do this
if we were using Redux. This also allows us
to simplify our actual reducer method to simply return the result of updating the
state:

```js
const formReducer = (state, { field, value }) => state.set(field, value)
```

_Note: In standard Redux patterns, each dispatched Action usually has a `type`
key. But since our action objects are internal to this component we can
just structure them however we want, and so use `field` as the main key._

The [`useCallback`](https://reactjs.org/docs/hooks-reference.html#usecallback) hook is used to build a memoized `onChange` callback handler
for each of the text input components. The memoization is triggered/reset by
the dependences we pass in the as the second parameter to the hook - the `field`
name and the `dispatch` method:

```js
m[field] = useCallback(e => dispatch({ field, value: e.currentTarget.value }), [ field, dispatch ])
```

Finally, for ease of access we convert the `state` to a plain old Javascript
object prior to rendering. We use the [`useMemo`](https://reactjs.org/docs/hooks-reference.html#usememo) hook for this so that we only ever re-do this conversion if the `state` has changed
(another reason why using an `Immutable.Map` is a good idea!):

```js
const stateAsObj = useMemo(() => state.toObject(), [state])
```

And that's all there is to it.
