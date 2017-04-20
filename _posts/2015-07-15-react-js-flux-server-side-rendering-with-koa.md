---
layout: post
published: true
title: React.js + Flux server-side rendering with Koa
excerpt: "I recently had to get server-side rendering working on a React.js client
  project. We had augmented our front-end React app with [flummox](https:&#47;&#47;github.com&#47;acdlite&#47;flummox)
  and [react-router](https:&#47;&#47;github.com&#47;rackt&#47;react-router) and I
  wanted to be sure that we could re-use these components on the server-side without
  much extra work. I'm going to document our final file structure and code in this
  article.\r\n"
date: '2015-07-15 14:05:03 +0800'
categories:
- Uncategorized
tags:
- Javascript
- node.js
- Isomorphic
- React.js
comments: []
---
I recently had to get server-side rendering working on a React.js client project. We had augmented our front-end React app with [flummox](https://github.com/acdlite/flummox) and [react-router](https://github.com/rackt/react-router) and I wanted to be sure that we could re-use these components on the server-side without much extra work. I'm going to document our final file structure and code in this article.  

## Front-end

Our front-end code is laid out as such:

```  
frontend/  
frontend/app.js  
frontend/routes.js  
frontend/ui/...  
```

The `frontend` folder contains our React app. The `ui` subfolder contains our React components and the `data` subfolder contains our Flux stores. The `app.js` file gets run on the client-side (but not the server-side):

```js  
var React = require('react'),
  Router = require('react-router'),
  appRoutes = require('./routes');
 
 
Router.run(appRoutes, Router.HistoryLocation, (Handler, state) => {
  React.render(
    <Handler routes={state.routes} params={state.params} query={state.query} />,
    document.getElementById('main')
  );
});
```

As you can see it bootstraps `react-router` and renders the page. The `routes` file contains our routes and our root `App` component:

```js  
var React = require('react'),
    Router = require('react-router');
 
var { Route, DefaultRoute, RouteHandler } = Router;
 
var Layout = require('./ui/pages/layout'),
    HomePage = require('./ui/pages/home');
 
var FluxManager = require('./data/index'),
  FluxComponent = require('./ui/components/fluxComponent');
 
 
var App = React.createClass({
  getInitialState: function() {
    return {
      flux: new FluxManager(),
    };
  },
 
  render: function() {
    return (
      <FluxComponent flux={this.state.flux}  connectToStores={['catalogue']}>
        <Layout {...this.state}>
          <RouteHandler {...this.props} {...this.state}/>
        </Layout>
      </FluxComponent>
    );
  },
 
  componentDidMount: function() {
    this.state.flux.getActions('catalogue').fetchData();
  }
});
 
 
module.exports = (
  <Route handler={App}>
    <DefaultRoute name="home" handler={HomePage} />
  </Route>
);
```

We have a `FluxManager` class which inherits from the `Flux` class within the `flummox` package. You don't need to use a Flux implementation when building your React app and you certainly don't need one for server-side rendering. However if you do decide you need one then `flummox` is a pretty good choice as it's isomorphic.

## Back-end

In the back-end we replicate what was in the front-end `app.js` but instead render to a string which we then return to the client:

```js  
var frontendRoutes = require('../frontend/routes'),
  koa = require('koa'),
  Q = require('bluebird'),
  Router = require('react-router'),
  React = require('react');
 
var app = koa();
 
app.use(function *(){
  var reactOutput = yield new Q((resolve, reject) => {
    Router.run(frontendRoutes, this.request.path, (Handler, state) => {
      resolve(React.renderToString( 
        <Handler routes={state.routes} params={state.params} query={state.query} />
      ));
    });
  });
 
  this.body = '<!DOCTYPE html><html><body><div id="main">'
     + reactOutput 
     + '</div></body></html>';
});
 
app.listen(3000);
```

_Note: For simplicity sake I wrap the React output in a HTML string in the above code. In a practical implementation I would use a template engine like [Jade](http://jade-lang.com/) instead_.

## Final thoughts

This setup works pretty well. One caveat to note is that server-side rendering just means your component's initial UI is rendered server-side. The `componentDidMount()` method and other related lifecycle methods only get executed on the client. Which means that if you're initiating a data fetch from within these methods (like I do above) then you'll still have the same behaviour you had before (in that data isn't fetched until client-side rendering has finished).

There are [some](https://github.com/RickWong/react-transmit) [solutions](https://github.com/ericclemmons/react-resolver) out there which attempt to make data-loading itself isomorphic. I have yet to investigate these fully.

One thing to keep in mind when shifting data fetches to be done server-side (i.e. prior to page rendering) is that your initial page load time will increase - which means your user will have to wait longer for your page to load from your server. If you fetch data once the app has rendered in the browser at least you can then display a loading indicator or a similar mechanism to the user to make your app feel responsive.