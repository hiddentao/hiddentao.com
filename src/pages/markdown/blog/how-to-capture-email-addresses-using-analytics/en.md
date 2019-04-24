---
title: How to capture email addresses using Analytics
date: '2013-07-06'
summary: "For an upcoming project of mine - [learnchinesegym.com](http:&#47;&#47;learnchinesegym.com) - I wanted a 'soon-to-be-launched' page with a simple sign up form through which users could submit their email addresses in order to be notified of updates. Typically, unless one already has the back-end built one would use [Launchrock](http:&#47;&#47;launchrock.com), [Mailchimp](http:&#47;&#47;mailchimp.com) and similar solutions for something like this. The problem is that, unless you're a paying customer, you just don't have much control over the whole sign up process when using these services. Submitting the form usually causes the page to redirect to one on their server, causing a discontinuity in the user's mental model of your site's flow. Furthermore, you probably already have Google Analytics or something like that setup, giving you information about each visitor - why not link this information directly to that visitor's email address?\r\n"
tags:
  - Piwik
  - Analytics
  - Marketing
---
For an upcoming project of mine - [learnchinesegym.com](http://learnchinesegym.com) - I wanted a 'soon-to-be-launched' page with a simple sign up form through which users could submit their email addresses in order to be notified of updates. Typically, unless one already has the back-end built one would use [Launchrock](http://launchrock.com), [Mailchimp](http://mailchimp.com) and similar solutions for something like this. The problem is that, unless you're a paying customer, you just don't have much control over the whole sign up process when using these services. Submitting the form usually causes the page to redirect to one on their server, causing a discontinuity in the user's mental model of your site's flow. Furthermore, you probably already have Google Analytics or something like that setup, giving you information about each visitor - why not link this information directly to that visitor's email address?

As you may already know, you can send [custom variables](https://developers.google.com/analytics/devguides/collection/gajs/gaTrackingCustomVariables) through to Google Analytics to associate additional information with any given visitor. However, Google [forbids you from sending any personally identifiable information](https://support.google.com/analytics/answer/2795983?hl=en) using this feature in order to protect users' privacy. So what to do?

Enter [Piwik](http://piwik.org/), an excellent open source alternative to Google Analytics which you can host yourself on your own server. The way you use Piwik and include it in your code works pretty much exactly the same as Google Analytics so there's no new learning curve involved. It is built on PHP and MySQL and is fairly [easy to setup](http://piwik.org/docs/installation/). Furthermore, Piwik also supports [custom variables](http://piwik.org/docs/custom-variables/) and since you're hosting it you can send whatever data you want to it, including users's email addresses. I'm now going to show you just how easy it is to capture the user's email address and send it to Piwik.

## Piwik setup

I'm going to assume that you have piwik installed and accessible at something like `https://piwik.mydomain.com/`.

_NOTE: I would recommend enforcing `HTTPS` access to your Piwik installation, though also ensure that the Piwik client script (i.e. what actually gets included in your site's pages using the `script` tag) can be accessed using plain-old HTTP._

Go into your administration section and - just as you would do in Google Analytics - add your website so that you can generate a tracking ID for it. Insert the generated tracking code into your HTML. It should look something like this:

```html
<!-- Piwik -->
<script type="text/javascript">
  var _paq = _paq || [];
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u=(("https:" == document.location.protocol) ? "https" : "http") + "://piwik.mydomain.com/";
    _paq.push(['setTrackerUrl', u+'piwik.php']);
    _paq.push(['setSiteId', 1]);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0]; g.type='text/javascript';
    g.defer=true; g.async=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
  })();
 
</script>
<noscript><p><img src="http://piwik.hiddentao.com/piwik.php?idsite=1" style="border:0" alt="" /></p></noscript>
<!-- End Piwik Code -->
```

## Signup form submission

I'm going to assume that you're using [jQuery](http://jquery.com) for DOM manipulation. Let's say we have a simple sign up form as follows:

```html
<form>
  <label for="signupemail">Enter your email address:</label>
  <input id="signupemail" type="email" maxlength="64" placeholder="Email address">
  <input type="submit" value="Go">
</form>
```

We want to send the email address via Piwik when the user submits the form. So we could have some Javascript as follows:

```js
$(function() {
    $('form').submit(function(e) {
        e.preventDefault();

        var email = $('#signupemail').val();
        if (1 < email.length) /* in reality we would place a more thorough check for email address validity here */ {
            _paq.push(['setCustomVariable', 1, 'Email', email, 'visit']);
            alert('Thank you for signing up!');
        }
    });
});
```

The key line above is this one:

```js
_paq.push(['setCustomVariable', 1, 'Email', email, 'visit']);
```

We're telling Piwik to associate the given email address as a custom variable named `Email` in the `visit` scope, with this custom variable being stored in the Piwik back-end at index 1\. The [custom variable docs](http://piwik.org/docs/javascript-tracking/#toc-custom-variables) explain what each parameter for the method is for. Suffice to say that you can technically track up to 10 different custom variables per page. Custom variable values are expected to be of type `String`. If you want to send a JSON object then [stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) it first. The documentation doesn't state how big a custom variable value can be but I would recommend keeping it small (e.g. <128 characters). If you're needing to send more than that then you ought to question whether your analytics tool is the right place to store such data.

## View data in Piwik

To view the custom variable data associated with each individual visitor you need to log into Piwik, select the website you want to examine, and then goto the **Visitor Log** section:

![Piwik visitor log](http://farm6.staticflickr.com/5481/9219181651_12dc61433c_o.png)

As you scroll down, for any visitor who did submit the sign up form you will see their email address:

![Capture email address](http://farm4.staticflickr.com/3681/9219181593_309b723497_b.jpg)

Any and all custom variables for a visitor will appear in this section. In Piwik you can also view aggregate statistics for given custom variables as well as combine their use with [Goals](http://piwik.org/docs/tracking-goals-web-analytics/) to get a better idea of which visitors have signed up.

---

So there you have it. Now you can track email addresses using just your analytics software. A very useful thing to be able to do as it saves you from having to write a back-end or having to use a third party service just to track email addresses. You stay in control of the data. You stay in control of the UI. With minimal effort.
