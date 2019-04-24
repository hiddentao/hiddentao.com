---
title: Deploying single-page apps on Zeit using Now
date: '2019-02-07'
summary: ''
tags:
  - Zeit
  - Deployments
  - SPA
---

This is quick post to illustrate how to deploy single-page static web apps to [Zeit](https://zeit.co) using
the [now](https://zeit.co/now) cli.

Let's assume we are building a React app and that our build scripts have created
an optimized production build in the `build/` folder of our project. This is
the folder we wish to serve on Zeit when requests are made to our domain `example.com`.

Let's assume our `build` folder looks like the following:

```
build/index.html <- SPA handler
build/favicon.png
build/service-worker.js  <- must NOT be cached by browser
build/static/js/main.js
build/static/css/main.css
```

And let's say our routes are as follows:

```
/
/events
/events/event-id-slug
```

Now we can setup `now.json` accordingly:

```
{
  "version": 2,
  "name": "example-app",
  "alias": "example.com",
  "builds": [
    { "src": "build/**", "use": "@now/static" }
  ],
  "routes": [
    { "src": "/", "dest": "build/index.html" },
    { "src": "/events/?", "dest": "build/index.html" },
    { "src": "/events/.*", "dest": "build/index.html" },
    { "src": "/service-worker.js", "dest": "build/service-worker.js", "headers": { "cache-control": "no-cache" } },
    { "src": "/(.+)", "dest": "build/$1" }
  ]
}
```

The above routemap states that we want our app's URL paths to be handled by `index.html`.
All other requests (e.g. for CSS and JS resources) should be handled by the static
file server. For `service-worker.js` we specifically want to ensure the browser
never caches it, and thus we modify the header response in that instance.

To use this config run:

```shell
$ npx now --public

> Deploying ~/dev/example/app under example-app
> Using project example-app
> Synced 1 file (226B) [1s]
> https://example-app-cdqx1bncr.now.sh [v2] [in clipboard] [3s]
┌ build/**        Ready               [878ms]
├── build/static/css/main.css
├── build/static/js/main.js
├── build/index.html
├── build/favicon.png
├── build/service-worker.js
> Success! Deployment ready [8s]
```

The `alias` config key in the JSON wasn't strictly necessary, but by placing it
there we can run a command to auto-alias our domain name to the just-deployed instance:

```shell
$ npx now alias

> Assigning alias example.com to deployment example-app-cdqx1bncr.now.sh
> Success! example.com now points to example-app-cdqx1bncr.now.sh [4s]
```

And that's it!
