---
title: Tabbed pages using React Native NavigationExperimental
date: '2017-03-16'
summary: ''
tags:
  - React Native
  - React
  - Navigation
  - Tabs
  - Experimental
---

In a [previous post](/archives/2017/02/23/using-react-native-navigation-cardstack-with-redux/)
I outlined how to use React Native's [NavigationExperimental CardStack](https://facebook.github.io/react-native/docs/navigation.html) with
Redux in your app. In this post I will expand on this further to show how you
can do in-page "tabbed" navigation for certain pages whilst working within the same Redux
structure.

First of all, this is what I mean by in-page tabbed navigation:

![screenshot](react-native-tabbed-nav.gif)

As you can see, the tabbed pages can be navigated to as first-class pages (with the
  default page sliding animation), yet when navigating between each other they
  behave like tabs.

Let's see how to set this up...

_Note: I will build on [previous code I've shown](/archives/2017/02/23/using-react-native-navigation-cardstack-with-redux/)
so please refer to that as well._

### Page components

As before, you need to have a component for each page:

```js
/* Page1.js */

export default Page1 extends Components {
  render () {
    return (
      <View>
        <Text>This is page 1</Text>
        <Button title="Goto page 2" onPress={() => navPush('Page2')} />
        <Button title="Goto page 3" onPress={() => navPush('Page3')} />
      </View>
    )
  }
}
```

```js
/* Page2.js */

export default Page2 extends Component {
  render () {
    return (
      <View>
        <Text>This is page 2</Text>
        <Button title="Goto page 2" onPress={() => navPush('Page2')} />
        <Button title="Goto page 3" onPress={() => navPush('Page3')} />
      </View>
    )
  }
}
```

```js
/* Page3.js */

export default Page3 extends Component {
  render () {
    return (
      <View>
        <Text>This is page 3</Text>
        <Button title="Goto page 1" onPress={() => navPush('Page1')} />
        <Button title="Goto page 3" onPress={() => navPush('Page3')} />
      </View>
    )
  }
}
```

But the `Page2` and `Page3` components will actually be rendered within a
parent component which will also render the tabs at the top:

```js
/* TabbedPages.js */

import Page2 from './Page2'
import Page3 from './Page3'
import TabButtons from './TabButtons'

export default TabbedPages extends Component {
  render () {
    const { data: { navPageKey } } = this.props

    const navTabs = this.renderTabs(navPageKey)

    let content

    switch (navPageKey) {
      case 'Page2':
        content = <Page2 {...this.props} />
        break
      case 'Page3':
        content = <Page3 {...this.props} />
        break
    }

    return (
      <View>
        {navTabs}
        <View>
          {content}
        </View>
      </View>        
    )
  }

  renderTabs (active) {
    const tabs = [
      {
        title: 'Page 2',
        page: 'Page2'
      },
      {
        title: 'Page 3'
        page: 'Page3'
      }
    ]

    tabs.forEach(tab => {
      if (tab.page === active) {
        tab.active = true
      }
    })

    return <TabButtons tabs={tabs} />
  }  
}
```

I have left out the definition of the `TabButtons` component above - it
simply renders the passed in tabs as buttons shown in the animation above.

Let's add these pages to the `pages.js` wrapper:

```js
/* pages.js */

import Page1 from './Page1'
import TabbedPages from './TabbedPages'

/**
 * Each key in this object represents a page in our UI
 */
export default {
  Page1: {
    /* Each page has a component to render */
    Component: Page1
  },
  Page2: {
    Component: TabbedPages,
    /* This page is part of the given tab group */
    tab: 'tabGroup1'
  },
  Page3: {
    Component: TabbedPages,
    /* This page is part of the given tab group */
    tab: 'tabGroup1'
  }  
}
```

The above configuration marks `Page2` and `Page3` as part of the same tab
group. And note that the corresponding component for them both is `TabbedPages`
rather than the respective page components themselves.


### Redux reducer

The reducer is where the tab group logic comes into play. We don't want the UI
to visually navigate to a new page if the new page is part of the same tab
group as the current page.

We also need to ensure that if we navigate within
a tab group and then press _Back_ we actually navigate back to the last page
prior to the tab group rather than back within the tab group itself. Thus if
we navigate from `Page1` to `Page2` and then `Page3`, pressing _Back_ should
take us back to `Page` rather than `Page2`.

With these requirements in mind, here is the reducer code:

```js
/* reducer.js */

import _ from 'lodash'
import { NavigationExperimental } from 'react-native'
import Pages from './pages'

const { StateUtils } = NavigationExperimental

/** When the app loads show this page first */
const START_PAGE = 'Page1'

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
      state = pushState(state, page)
      break

    /** Go "back" */
    case 'pop':
      state = StateUtils.pop(state)
      break
  }

  return state
}

const isSamePage = (routes, index, newPage) => {
  const C1 = _.get(Pages, `${_.get(routes[index], 'page')}.Component`)
  const C2 = _.get(Pages, `${newPage}.Component`)

  return C1 === C2
}

const isSamePageButDifferentTab = (routes, index, newPage) => {
  const same = isSamePage(routes, index, newPage)

  const t1 = _.get(Pages, `${_.get(routes[index], 'page')}.tab`)
  const t2 = _.get(Pages, `${newPage}.tab`)

  const p1 = _.get(routes[index], 'page')
  const p2 = newPage

  return same && (t1 === t2) && (p1 !== p2)
}

const pushState = (navState, page) => {
  const { index, routes } = navState

  // if we're changing the page
  if (!isSamePage(routes, index, page)) {
    // if same as previous page then do a pop
    if (isSamePage(routes, index - 1, page)) {
      const newNavState = StateUtils.pop(navState)

      // ensure correct tab is selected
      newNavState.routes[newNavState.index].page = page

      return newNavState
    }
    // else add to routes
    else {
      return StateUtils.push(navState, buildNavRoute(page))
    }
  }
  // if we're on same page but different tab then show that instead
  else if (isSamePageButDifferentTab(routes, index, page)) {
    // set the desired tab
    routes[navState.index].page = page

    // force a refresh
    return { index, routes }
  }

  return navState
}
```

Effectively what this does is modify the route index as and when the current
active tab changes. When the re-render occurs the page corresponding to the
active tab will be rendered, all without a page transition and without adding
to the navigation route history.
