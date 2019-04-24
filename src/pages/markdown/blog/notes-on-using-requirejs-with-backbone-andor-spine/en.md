---
title: 'Notes on using RequireJS with Backbone and&#47;or Spine'
date: '2011-08-17'
summary: "For a project I'm currently working on I've decided to jump on the Javascript bandwagon with full weight. I intend to code in [CoffeeScript](http:&#47;&#47;jashkenas.github.com&#47;coffee-script&#47;), use either [Spine](http:&#47;&#47;maccman.github.com&#47;spine&#47;) or [Backbone](http:&#47;&#47;documentcloud.github.com&#47;backbone&#47;) to give me a light-weight MVC architecture, and then deploy it all together in a clean, optimized way using [RequireJS](http:&#47;&#47;requirejs.org&#47;). If you're not familiar with these tools and libraries then I recommend you follow the links to find out more about them. Basically, client-side Javascript-driven web app development is getting very exciting :)\r\n\r\nI started off by getting Spine to to work with the [RequireJS CoffeeScript adapter](https:&#47;&#47;github.com&#47;jrburke&#47;require-cs). In development mode everything worked fine but when I tested using the RequireJS-optimized output some of my Spine code didn't seem to work. Here is my HTML file:\r\n"
tags:
  - Javascript
  - RequireJS
  - Spine
  - Backbone
  - CoffeeScript
---
For a project I'm currently working on I've decided to jump on the Javascript bandwagon with full weight. I intend to code in [CoffeeScript](http://jashkenas.github.com/coffee-script/), use either [Spine](http://maccman.github.com/spine/) or [Backbone](http://documentcloud.github.com/backbone/) to give me a light-weight MVC architecture, and then deploy it all together in a clean, optimized way using [RequireJS](http://requirejs.org/). If you're not familiar with these tools and libraries then I recommend you follow the links to find out more about them. Basically, client-side Javascript-driven web app development is getting very exciting :)

I started off by getting Spine to to work with the [RequireJS CoffeeScript adapter](https://github.com/jrburke/require-cs). In development mode everything worked fine but when I tested using the RequireJS-optimized output some of my Spine code didn't seem to work. Here is my HTML file:

```html
<!DOCTYPE html>
<html>
<head>
    <title>CoffeeScript Loader Plugin Demo</title>
    <script data-main="lib/main" src="lib/require-jquery.js"></script>
</head>
<body>
<p>
  <a class="test" href="#">Test</a>
</p>
</body>
</html>
```

The `main.js` script:

```js
require({
    paths: {
        cs: '../../demo/lib/cs'
    }
}, ['spine','cs!csmain']);
```

And the `csmain.coffee` script:

```js
define () ->
  Tasks = Spine.Controller.create
    tag: "body"

    events:
      "click .test" : "clicked"

    init: ->
      alert "loaded"

    clicked: (event) ->
      alert "clicked"

  Tasks.init
    el: document.body
```

_I built on top of the [RequreJS CoffeeScript demo files](https://github.com/jrburke/require-cs/tree/master/demo) to save time_.

On page load I should see an alert containing the text "loaded". When I click the link I should get an alert containing the text "clicked". In the RequireJS-optimized version (where all the scripts were compressed and inlined into `main.js`) I got the initial page load alert but no alert when I clicked on the link. Thinking that the use of coffeescript might have jinxed it I decided to code the Spine stuff in plain old Javascript instead, to no avail. I then replaced Spine with Backbone and coded the equivalent as such:

```js
View = Backbone.View.extend
  el: $("body")

  events:
  "click .test" : "clicked"

  initialize: ->
  alert "loaded"

  clicked: ->
  alert "clicked"

new View()
```

_CoffeeScript is beautiful, no!?_

This failed in the same exact way that Spine did. So it wasn't an issue with either of these libraries. Eventually, I took a chance and decided to not to use the combined RequireJS jQuery script and instead opted to include them separately. This is not the most recommended way of using RequireJS with jQuery, as is clearly stated in the [RequireJS docs](https://github.com/jrburke/require-jquery). Yet this combination worked for me - when I ran the optimized version I got the click-triggered alert box showing too. I can only guess that the RequireJS jQuery combo file breaks either jQuery or the assumptions Spine and Backbone make about jQuery.

So here is how I now initialize the scripts in the HTML:

```html
<script>
require({
  baseUrl: 'lib',
  priority: ['jquery']
}, ['main']);
</script>
```

The RequireJS docs recommend additional configuration steps for the optimizer to work properly but I didn't need to do that. My existing configuration worked fine:

```js
({
    appDir: '.',
    baseUrl: 'lib',
    //Uncomment to turn off uglify minification.
    //optimize: 'none',
    dir: '../demo-build',
    paths: {
        cs: '../../demo/lib/cs'
    },
    // Exclude CoffeeScript compiler code
    pragmasOnSave: {
        excludeCoffeeScript: true
    },
    modules: [{
        name: "main"
    }]
})
```
