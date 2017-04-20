---
layout: post
published: true
title: Trigger a Travis CI build from another project's build
date: '2016-08-29 21:01:44 +0800'
categories:
- Uncategorized
tags:
- Travis CI
- Github
- Build
- Continous Integration
comments: []
---

For [Waigo](https://waigojs.com) I wanted the website to get rebuilt every time the [core framework](https://github.com/waigo/waigo) got updated. This is because the actual 
documentation is stored in the core framework repo, and gets downloaded and 
transformed into HTML during the documentation website's build process.

Travis CI doesn't have any way of setting up inter-project build dependencies so I decided to do this using their API. I mostly followed [their instructions](https://docs.travis-ci.com/user/triggering-builds) and you can do the same. In this post I outline a few additional steps I took.

**Pre-requisites**

First of all make sure both repos are enabled for building in Travis CI. Then install the [Travis CI CLI](https://github.com/travis-ci/travis.rb) tools.

**Get API Token**

Follow [official Travis CI instructions](https://docs.travis-ci.com/user/triggering-builds) to obtain an access token which will allow you to call their API from scripts.

**Script to trigger build**

Here is [the Node.js script](https://github.com/waigo/waigo/blob/master/scripts/triggerDocSiteBuild.js) I use to actually trigger a build of the docs site:

```js
#!/usr/bin/env node
"use strict";

const shell = require('shelljs'),
  path = require('path'),
  got = require('got');


console.log(`Fetching Git commit hash...`);

const gitCommitRet = shell.exec('git rev-parse HEAD', {
  cwd: path.join(__dirname, '..')
});

if (0 !== gitCommitRet.code) {
  console.error('Error getting git commit hash');
  
  process.exit(-1);
}

const gitCommitHash = gitCommitRet.stdout.trim();

console.log(`Git commit: ${gitCommitHash}`);

console.log('Calling Travis...');


got.post(`https://api.travis-ci.org/repo/waigo%2Fwaigo.github.io/requests`, {
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Travis-API-Version": "3",
    "Authorization": `token ${process.env.TRAVIS_API_TOKEN}`,
  },
  body: JSON.stringify({
    request: {
      message: `Trigger build at waigo/waigo commit: ${gitCommitHash}`,
      branch: 'source',
    },    
  }),
})
.then(() => {
  console.log("Triggered build of waigo/waigo.github.io");
})
.catch((err) => {
  console.error(err);
  
  process.exit(-1);
});
```

This above script will trigger a build of the [waigo/waigo.github.io](https://github.com/waigo/waigo.github.io) repo, which will auto-deploy [waigojs.com](https://waigojs.com) if successful. The build title (in Travis CI) will be something along the lines *"Triggered build at waigo/waigo commit (sha1 hash)"* so that it's easy to know which commit triggered which build.

**Securing the API token**

Notice that the API call to Travis in the above script relies on the `TRAVIS_API_TOKEN` environment variable being set. The API token is specific to your Travis username and repositories and must not be publicly shared - otherwise anyone would be able to call the Travis API with your "identity".

The way we secure this token such that it's available at build time but not publicly readable within the repo is [using encryption keys](https://docs.travis-ci.com/user/encryption-keys/).

Use the CLI to encrypt and add the following to your `.travis.yml`:

```shell
$ travis encrypt TRAVIS_API_TOKEN=... --add
```

Now in `.travis.yml` I simply need to trigger the above script if the build is successful. Here is [Waigo's](https://github.com/waigo/waigo/blob/master/.travis.yml):

```yml
branches:
  only:
  - master

language: node_js

...

script:
  - npm run test-ci

after_success:
  - node scripts/triggerDocSiteBuild.js

env:
  global:
    secure: S0+kWx+F56zFvFtuoLYlu6BDMjc3U9OZruuCwSYV/aNLdIo/mtpuhYAMgzChlT5K4kVVF2bTeramFTZQ3nxKHKFZ34y8UW+Ju+ARH4oBzUsU+m0W+zKOsovtjLpSv3grS5yz5XqRiYMxJQFlGHdQjqX1/jDeA0KdkQbaLMVktak=
```

Notice the `after_success` and `env` sections. The `env` section was auto-added by the `travis encrypt` command we ran earlier. 

This isn't quite good enough though. If we're building our project for multiple versions of nodejs then our script will get triggered multiple times per build, resulting in multiple travis builds on the 
other projects - not good. To avoid this let's check the Node.js version before triggering the script:

```yml
language: node_js

node_js:
  - '4'
  - '5'
  - '6'

after_success:
  # only execute doc site build once per build
  if [ "${TRAVIS_NODE_VERSION}" = "4" ]; then node scripts/triggerDocSiteBuild.js; fi
```

Now we're done. The caveat of course is that if the Node v4 build succeeds but the v5 and v6 
builds fail then the script will still get triggered. What we really need is a way to run a 
script [after *all* our node builds have succeeded](https://github.com/travis-ci/travis-ci/issues/929).

