---
title: Mixpanel server-side proxy to bypass blockers
date: '2018-10-03'
summary: ''
tags:
  - Mixpanel
  - Analytics
  - Nodejs
  - Adblock
---

For my new startup - [Kickback](https://kickback.events?utm_source=hiddentao_blog&utm_medium=post) - we decided to launch a static landing page as a precursor to the full product
(which will be ready in a few weeks). On our landing page we have a
call-to-action button near the bottom for users who wish to register their
interest in our service:

![screenshot](kickback-cta.png)

Naturally, we wanted to track these clicks and visits through analytics, and we
chose [Mixpanel](https://mixpanel.com). Unfortunately, Brave browser and some
other ad blockers block the Mixpanel library from even loading. Looking at
[Mixpanel's own documentation](https://help.mixpanel.com/hc/en-us/articles/115004499463-Ad-Blockers-Affect-Mixpanel) on this issue, it seemed clear to me that a server-side proxy was the only solution
to this problem.

Thus I went ahead and coded [https://github.com/noblocknoparty/analytics-server](https://github.com/noblocknoparty/analytics-server).

It's written using [Koa](https://koajs.com), my goto Node.js framework.

Upon startup this downloads the current [live Mixpanel JS library](https://cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js) into memory. When a
request comes in for `/client.js` it first extracts the `origin` of the request and then
uses string replacement to replace the `api_host` config variable in the
Mixpanel JS code to point to the proxy server at the given origin address.

For example, if the proxy server is running at `https://mproxy.com`, then a
request to `http://mproxy.com/client.js` will return the Mixpanel JS library
but with the `api_host` value set to `https://mproxy.com` instead of
`https://api.mixpanel.com`, thus causing all subsequent analytics requests to
be sent to the proxy server.

The proxy server then forwards all incoming requests from the client library
onto as-is (including headers) onto Mixpanel.

It also sets the `X-Forwarded-For` to the client browser's IP address so that
Mixpanel will still resolve the right location for the user.

The above proxy server can be served up on any domain, it's not specific to our
app. To use it with Mixpanel, follow the standard [Mixpanel setup instructions](https://mixpanel.com/help/reference/javascript) and
then add the following before the Mixpanel block:

```html
  ...
  <script type="text/javascript">
    window.MIXPANEL_CUSTOM_LIB_URL = "https://your.proxy.server/client.js";
  </script>
  <script type="text/javascript">/* mixpanel setup stuff here */</script>
 </head>
```

Enjoy :)
