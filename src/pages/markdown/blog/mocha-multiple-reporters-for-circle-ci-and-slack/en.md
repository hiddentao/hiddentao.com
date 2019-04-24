---
title: Mocha  multiple reporters for CircleCI and Slack
date: '2016-12-27'
summary: ''
tags:
  - CircleCI
  - CI
  - Mocha
  - Testing
  - Slack
---

On a recent project I had to get our automated tests running within our [CircleCI builds](https://circleci.com) in such a way that test results got reported to [Slack](https://slack.com).

Although CircleCI has built-in support for reporting build failures to Slack one cannot customise the notification content. We wanted test failures to reported in a way which allowed us to quickly see which tests had failed and why.

And thus [mocha-ci-slack-reporter](https://github.com/hiddentao/mocha-ci-slack-reporter) was born. This is a Mocha reporter which will send a notification to Slack when your tests pass and/or fail (see configuration below).

Simply use it as you would a normal [Mocha](https://mochajs.org/) reporter:

```bash
$ mocha test --reporter mocha-ci-slack-reporter  --reporter-options username=name,channel=#channel...
```

The supported reporter options:

* `testTitle` _(mandatory)_ - Title of test in report
* `url` _(mandatory)_ - Slack incoming webhook URL
* `username` _(mandatory)_ - Username to post as
* `channel` _(mandatory)_ - Channel to post to
* `logsUrl` - URL to logs page, appended to message text (default is undefined)
* `passEmoji` - Emoji to use for test pass (default is 👌)
* `failEmoji` - Emoji to use for test failure (default is 💣)
* `failuresOnly` - Whether to only report failures (default is false)

The output looks something like this:

![screenshot](mocha-ci-slack-reporter-screenshot.png)

_**Note:** One issue with getting this reporter working in a CI environment was that the HTTP call to notify Slack was often not completing before the test process finished running, due to Mocha not expecting reporters to be asynchronous. To get around this I had to use the [sync-request](https://www.npmjs.com/package/sync-request) package, which effectively allows you to do synchronous HTTP request. This package shouldn't be used in production code but it's perfect for the use-case of running tests in a CI environment!_

In addition to getting these nice-looking notifications in Slack, we still wanted to see the test failures and other details visible within the build console logs.

Since Mocha only allows for the use of one reporter at a time the trick is to use the [mocha-multi-reporters](https://www.npmjs.com/package/mocha-multi-reporters) package to act as a _proxy_ reporter for multiple reporters.

This is how we setup our Gulp script to make use of this to enable both the `spec` and the above Slack reporter simultaneously:

```javascript
gulp.task('test', () => {
  // build reporter config
  const reporterConfig = {
    reporterEnabled: 'spec,mocha-ci-slack-reporter',
    mochaCiSlackReporterReporterOptions: {
      username: 'api_flow_tests_QA',
      channel: '#ci',
      testTitle: 'API flow tests for QA',
      logsUrl: process.env.CIRCLE_BUILD_URL,
      url: process.env.SLACK_URL,
      failuresOnly: false
    }
  }

  // write reporter config file
  fs.writeFileSync(path.join(__dirname, 'mochaReporterConfig.json'), JSON.stringify(reporterConfig))

  // execute the task
  return gulp.src(path.join(__dirname, 'test', '*.js'), {read: false})
    .pipe(mocha({
      ui: 'exports',
      reporter: 'mocha-multi-reporters',
      reporterOptions: 'configFile=mochaReporterConfig.json',
      timeout: 30000
    }))
})
```

Enjoy :)
