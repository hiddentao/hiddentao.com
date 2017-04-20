---
layout: post
published: true
title: Redux asynchronous dispatcher pattern
date: '2016-09-27 15:53:23 +0800'
categories:
- Uncategorized
tags:
- React
- SPA
- Redux
- Dispatcher
comments: []
---

Having worked with React and Redux for a while one problem I keep having to 
solve is how to asynchronously dispatch actions. For a while I was using 
[redux-thunk](https://github.com/gaearon/redux-thunk) to accomplish this, but 
recently I've developed a new pattern which removes the need for such 
middleware in the first place.

## Using thunks (old pattern)

First, let's consider the old pattern using thunk-based action creators:

```js
// actionCreators.js

export function doSomething() {
  return function(dispatch, getState) {
    $.apiCall().then(() => {
      dispatch({
        type: 'SOMETHING',
        payload: 123
      });      
    });
  }
}

export function doSomethingElse() {
  return function(dispatch, getState) {
    return dispatch(doSomething());
  }
}
```

With action creators defined, I would then use [react-redux](https://github.com/reactjs/react-redux) to create a *decorator* 
to connect my components to the action creators:

```js
// decorators.js
...
import * as ActionCreators from 'actionCreators';

export function connectRedux(actionCreators = []) {
  return function decorator(Component) {
    return connect(
      function mapStateToProps(state) {...},
      function mapDispatchToProps(dispatch) {
        let ret = {};

        actionCreators.forEach(function(ac) {
          ret[ac] = function() {
            return dispatch(ActionCreators[ac].apply(null, arguments));
          }
        });

        return {
          actions: ret
        };
      }
    )(Component);
  }
}
```

Finally, defining a component:

```js
// component.js

import { connectRedux } from './decorators';

var Component = React.createClass({
  render: function() { 
    return <div>Hello World!</div>;
  },
  
  componentDidMount: function() {
    this.props.actions.doSomething();
  }  
});

module.exports = connectRedux([
  'doSomething'
])(Component);
```

The main problems with this setup are:

* **Clunky action creators.** We export functions which return 
functions. Though arrow function can help with this, it still feels a little 
unnecessary.

* **Duplicating effort.** The `dispatch` and `getState` methods are actually 
taken straight from the Redux store - so it begs the question: *why do we need 
to be constantly passing these in to action creators*?

* **Inter-calling complexity**. If we wish to call an action creator from within 
another action creator (something I often find myself doing) then we have to 
remember to wrap the call in `dispatch` (see above).

* **Thunks cannot be cancelled**. Once an action creator has been dispatched it 
cannot easily be cancelled. We could have the action creator return a 
cancellable `Promise` (and this is indeed what I started doing) but then why 
use thunks in the first place?

## Dispatcher object (new pattern)

The key enabling feature here is the fact that `dispatch` and `getState` are 
directly available on the Redux store object as soon as the store has been 
created.

We can thus define a `Dispatcher` class:

```js
// dispatcher.js

export class Dispatcher {
  setStore (store) {
    this._dispatch = store.dispatch;
    this._getState = store.getState;
  }
  
  doSomething() {
    return $.apiCall.then(() => {
      this._do({
        type: 'SOMETHING',
        payload: 123
      });            
    });
  }

  doSomethingElse() {
    return this.doSomething();
  }
  
  _do () {
    this._dispatch.apply(this._dispatch, arguments);
  }
}

module.exports = new Dispatcher();
```

We can then initialize this Dispatcher as soon as the store is ready, e.g:

```js
// app.js

import { createStore } from 'redux'
import Dispatcher from './dispatcher';

let store = createStore();

Dispatcher.setStore(store);
```

*Note: I recommend that you setup the `Dispatcher` instance as a 
singleton and have it accessible throughout your React app.*

Apart from solving the problems outlined above regarding thunks, the following 
additional benefits are obtained:

* **Calls to dispatch() are basic**. Now we only call `dispatch()` to actually 
dispatch an action to the reducers in a synchronous fashion, as it was 
originally designed to. No need for any async-enabling middleware.

* **Use any async technique**. In the above example the action creators both 
return `Promise` objects. But this isn't strictly necessary. They could return 
thunks intead, or they could be generator functions, or they could be synchronous 
functions. It's upto you.

If we used a [decent `Promise` library](http://bluebirdjs.com) then we would even have the ability to abort/cancel previous promises. This would provide a way to cancel 
previous calls to a give action creator from within subsequent calls.

As for the component connector part of the equation we could rewrite it thus:

```js
// decorators.js

import Dispatcher from './dispatcher';

export function connectRedux() {
  return function decorator(Component) {
    return connect(
      function mapStateToProps(state) {...},
      function mapDispatchToProps() {
        return {
          dispatcher: Dispatcher
        }
      }
    )(Component);
  }
}
```

Or we could import it directly within the component file, it doesn't make a 
difference:

```js
// component.js

import { connectRedux } from './decorators';
import Dispatcher from './dispatcher';

var Component = React.createClass({
  render: function() { 
    return <div>Hello World!</div>;
  },
  
  componentDidMount: function() {
    Dispatcher.doSomething();
  }
});

module.exports = connectRedux()(Component);
```

---

With this pattern we can now dispatch actions from any part of our app, 
whilst still handling all action dispatches in one place 
(the `Dispatcher` instance). Since the pattern is so simple I haven't bothered 
to code it up as a separate package, but I may do so in future if the pattern 
evolves.