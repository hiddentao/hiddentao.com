---
title: Redmine plugin which pushes updates to external URL
date: '2011-07-24'
summary: "A recent client wished to integrate the [Redmine](http:&#47;&#47;www.redmine.org) issue tracking system with their front-end software change request system. Specifically, they wanted 2-way integration such that changes made in one system were immediately reflected in the other. Redmine provides a REST API for accessing and modifying data which meant it was easy to keep Redmine up-to-date. I needed a way of knowing about Redmine changes as soon as they occurred, separate to the email which Redmine sends out with each change. There were already plugins which would [update specific third-party services when a Redmine issue got updated](http:&#47;&#47;www.redmine.org&#47;boards&#47;3&#47;topics&#47;7117) but I needed one which would call back to a custom URL exposed by our other system. And so the **Updates notifier** plugin was born.\r\n"
tags:
  - Redmine
  - Ruby
  - Plugin
---
A recent client wished to integrate the [Redmine](http://www.redmine.org) issue tracking system with their front-end software change request system. Specifically, they wanted 2-way integration such that changes made in one system were immediately reflected in the other. Redmine provides a REST API for accessing and modifying data which meant it was easy to keep Redmine up-to-date. I needed a way of knowing about Redmine changes as soon as they occurred, separate to the email which Redmine sends out with each change. There were already plugins which would [update specific third-party services when a Redmine issue got updated](http://www.redmine.org/boards/3/topics/7117) but I needed one which would call back to a custom URL exposed by our other system. And so the **Updates notifier** plugin was born.

This plugin is configured to accept a URL which it will call whenever a Redmine issue gets updated. It does this by handling the `controller_issues_edit_after_save` hook that is already available in the `issue` model. I also wanted to it to catch issue changes made via Redmine's bulk-editing interface so I amended the `issues_controller` with a [new hook](https://github.com/7citylearning/redmine/commit/f88c6ca01e89246b5bcd62fa26cc651ee33ba212). Together these allow me to trigger a "push" to the callback URL configured in the plugin whenever an issue gets updated. The plugin also provides an option to ignore issue updates made through Redmine's REST API. For my use case this was important as I didn't want updates made via the REST API from the change request system being propagated back to the change request system via the plugin.

The plugin calls the configured callback URL with JSON data structured as follows:

```json
{
  "type": "issue",
  "user": // ...details of user who made the change, i.e. name, email, etc...,
  "issue": // ...issue id,
  "comment": // ...comment for this update...,
  "changes": //...associative array of fields changes and their new values...,  
}
```

The Redmine page for the plugin is at [http://www.redmine.org/plugins/updates_notifier](http://www.redmine.org/plugins/updates_notifier). The source code is on Github at [https://github.com/7citylearning/updates_notifier](https://github.com/7citylearning/updates_notifier). The plugin was developed and tested against Redmine 1.2.
sends update notifications to a user-configured callback URL when changes are made to an issue within Redmine. It picks up changes made using t
he issue bulk-editing interface and is also smart enough to ignore changes made through the Redmine REST API.
