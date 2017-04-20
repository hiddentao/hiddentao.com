---
layout: post
published: true
title: Using React Native Navigation CardStack with Redux
date: '2017-02-22 17:40:01 +0100'
categories:
- Uncategorized
tags:
- React Native
- React
- Navigation
- Redux
comments: []
---

Although React Native's `NavigationExperimental` `CardStack` is [somewhat documented](https://facebook.github.io/react-native/docs/navigation.html) I
found myself having to look through the source code and some other parts of
the web to fully figure out how to hook everything up with Redux. In this post
I will outline the steps I took to get everything working.

Here are the packages I'm using:

* `react-native` - 0.40.0
* `react-redux` - 5.0.1
* `redux` - 3.6.0

_Note: To keep things and minimize the amount of code I need to show I will be using
Redux in a very basic manner with a very simple app._

## Page components

Let's first define our pages:

* `Home` - Initial page
* `About` - Another page

These will be defined as simple components. Each page, when touched, will cause
the the navigation to transition to the other page:

```js
// file: pages/home.js

import React, { Component } from 'react'
import { TouchableOpacity, Text } from 'react-native'

export default class Home extends Component = {
  render (
    <TouchableOpacity onPress={this.props.navPush('About')}>
      <Text>home</Text>
    </TouchableOpacity>
  )
}
```

```js
// file: pages/about.js

import React, { Component } from 'react'
import { TouchableOpacity, Text } from 'react-native'

export default class About extends Component = {
  render (
    <TouchableOpacity onPress={this.props.navPush('Home')}>
      <Text>about me</Text>
    </TouchableOpacity>
  )
}
```

The `navPush()` method will be made available using a [react-redux](https://github.com/reactjs/react-redux) connector
applied to the root component (see below).

We will access these pages via a wrapper through which we can also
define meta properties (such as header bar title) for each page:

```js
// file: pages/index.js

import home from './home'
import about from './about'

/**
 * Each key in this object represents a page in our UI
 */
export default {
  Home: {
    /* Each page has a component to render */
    Component: Home,
    /* ...and a title to set on the app navbar at the top */
    header: 'Home page'
  },
  About: {
    Component: About,
    header: 'About me'
  }
}
```

## Reducer and Actions

Our navigational reducer (`reducer.js`) looks like this:

```js
// file: reducer.js

import { NavigationExperimental } from 'react-native'

const { StateUtils } = NavigationExperimental

/** When the app loads show this page first */
const START_PAGE = 'Home'

/** We append a timestamp so that each visit to the same page is unique */
const buildNavRoute = (page) => ({
  key: `${page}-${Date.now()}`,
  page: page
})

const initialState = {
  index: 0,
  routes: [buildNavRoute(START_PAGE)]
}

export default function (state = initialState, { type, page }) {
  const { index, routes } = state

  switch (type) {
    /** Reset nav to new page and start from there */
    case 'reset':
      state = {
        index: 0,
        routes: [buildNavRoute(page)]
      })
      break

    /** Goto new page */
    case 'push':
      // only if we're changing the page
      if (routes[index].page !== page) {
        // if same as previous page then just go "back"
        if (routes[index - 1] && routes[index - 1].page === page) {
          state = StateUtils.pop(state)
        } else {
          state = StateUtils.push(state, buildNavRoute(page))
        }
      }
      break

    /** Go "back" */
    case 'pop':
      state = StateUtils.pop(state)
      break
  }

  return state
}
```

And in `actions.js` we define the actions for the redux dispatcher:

```js
// file: actions.js

export const mapActions = (dispatch) => ({
  navReset: (page) => {
    dispatch({
      type: 'reset',
      page: page
    })
  },

  navRest: (page) => {
    dispatch({
      type: 'push',
      page: page
    })
  },

  navPop: () => {
    dispatch({
      type: 'pop'
    })
  },
})
```

## UI components

Here is our root component, the entry point to our app:

```js
// file: index.js

import React from 'react'
import { Provider } from 'react-redux'
import { compose, combineReducers, createStore } from 'redux'

import MainComponent from './Main'
import reducer from './reducers'

// create Redux store
const store = compose()(createStore)(reducer)

// make store available in context
export default (props) => {
  return (
    <Provider store={store}>
      <MainComponent />
    </Provider>
  )
}
```

In `Main.js` we define `MainComponent`, which renders the pages:

```js
// file: Main.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavigationExperimental } from 'react-native'

import { Header, CardStack } from NavigationExperimental

import Pages from './pages'

class MainComponent extends Component {
  /**
   * Handle Android back button
   */
  componentDidMount () {
    BackAndroid.addEventListener('hardwareBackPress', this.back)
  }

  /**
   * Remove previously set event handlers
   */
  componentWillUnmount () {
    BackAndroid.removeEventListener('hardwareBackPress', this.back)
  }

  render () {
    /*
    enableGestures=false means the "swipe to return to previous card" gestures
    and the like in Android will be turned off.
     */
    return (
      <CardStack
        onNavigateBack={this.navBack}
        navigationState={navState}
        enableGestures={false}
        renderScene={this.renderScene}
        renderHeader={this.renderHeader}
      />      
    )
  }

  /**
   * Render given page.
   */
  renderScene = ({ sceneProps: { route: { page } } }) => {
    const { header, Component } = Pages[page]

    return (
      <Component {...this.props} />
    )
  }

  /**
   * Render given page's header bar
   */
  renderHeader = ({ sceneProps: { route: { page } } }) => {
    return (
      <Header
        renderTitleComponent={() => (
          <Header.Title>{Pages[page].header}</Header.Title>
        )}
      />
    )
  }

  /**
   * Go back to previous page
   */
  back = () => {
    const { data: { pageIndex } } = this.props

    // if we're at very first page
    if (0 === pageIndex) {
      // exit the app
      return false
    } else {
      // go back
      this.props.navPop()

      // don't exit the app
      return true
    }

  }
}

import { mapActions } from './actions'

/*
 * The redux-react connector magic allows us to invoke our actions
 */
export default connect(state => {
  const { nav: { index, route, }, ...states } = state

  return {
    data: {
      pageIndex: index,
      page: routes[index].page,
      ...states
    }
  }  
}, mapActions)(MainComponent)
```

**Note that the `renderScene` and `renderHeader`
methods maybe called multiple times on each render**. This is to
support animated transitions - as a page is transitioning in our out the
`CardStack` needs to render both the old and the new page to ensure the UI
flow looks good. This is why in those methods we use the passed-in properties
to determine which page to render rather than the data within our redux store.

---

And that's it! If you have any questions please let me know.
