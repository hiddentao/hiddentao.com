---
layout: post
published: true
title: Continuous Integration for React Native with TestFlight and TestFairy deployment
date: '2017-02-17 12:22:01 +0100'
categories:
- Uncategorized
tags:
- CircleCI
- CI
- React Native
- React
- TestFlight
- TestFairy
comments: []
---

I started working on a greenfield React Native project two weeks ago and the first
order of business was to get continuous deployment setup so that the rest of the
team could easily trigger and receive test builds of the latest code. In this
post I will outline the process and configuration I used to get this setup and
working.

Our Basic requirements:

* Every time we push changes to our `qa` Git branch we want the CI process to
build the code,
run any tests, and then build and publish release-mode apps to be distributed to
the internal team testers.

* Each test build must have the same version and build number on both
platforms (Android and iOS).

* We want an email to get sent out to all testers
when a new build is available.

_Note: I will assume you have some familiarity with building React Native iOS
and Android apps._

## Tools and services

I will quickly outline the tools and services we used.

**Build distribution services**

We opted to use [TestFlight](https://developer.apple.com/testflight/) for
distributing the iOS test app, and [TestFairy](http://testfairy.com/) for
distributing the Android test app.

Both have provision for auto-emailing testers when a new build becomes
available.

**CI choice**

We're building a React Native app for both iOS and Android devices. Thus we need
OS X to run the build because the iOS build tools are (as far as I'm aware) only
available on OS X. This means we need a CI service which offers OS X machines
on which to build.

After some preliminary research, including trying out dedicated mobile app build
services such as [GreenhouseCI](https://greenhouseci.com/) we opted to for
[CircleCI](https://circleci.com) as our service of choice. They don't try to do
too much, and give
you an [OS X box](https://circleci.com/docs/ios-builds-on-os-x/) on which you
can install and run whatever you want, as well as do iOS builds. Their UI is
also simple enough that other team members can login and trigger builds at will.

Moreover,
they have excellent Github integration - you can not only use repo deploy keys,
but also [user keys](https://circleci.com/docs/github-security-ssh-keys/) if
your build requires pulling in code from multiple private repos (see below).

**Node modules dependency management**

It is imperative that all developers and the CI build have the exact same
package dependencies installed when building the app. I found [yarn](https://yarnpkg.com/) to
be the most reliable package manager so far in this respect, and it has added
benefit that it installs your dependencies a lot faster than NPM. By using Yarn
combined with CI build artefact cacheing we're able to get the dependency
installation part of our build down to <2 seconds.

**Fastlane - command-line build automation**

The most painful part of doing iOS builds - and especially test builds vs
production builds - is including the right provisioning profiles and signing
certificates. Luckily, [fastlane match](https://github.com/fastlane/fastlane/tree/master/match)
automates the entire process of generating and including signing certificates and provisioning
profiles.

Fastlane also provides other useful built-in commands, such as [uploading the iOS app to
TestFlight](https://github.com/fastlane/fastlane/tree/master/pilot), and allows
you to define and write your own commands which can
additionally arbitrary external scripts.

Thanks to Fastlane, each developer is able to execute to build and deploy from
their local machines too, which means we're easily able to diagnose problems
with the CI build.

## 1. Get it running locally

Before we setup the CI service we need to get everything working locally. Once
the React Native app is building and running on devices we setup Fastlane and
the pre-build process.

### Pre-build setup

One of our requirements is for app builds to have the same build number in both
Android and iOS. Fastlane (see below) has mechanisms
for setting the app version and build numbers at buildtime, but not built-in
central place for storing and keeping track of the same.

So, before we actually build the native app we run a _pre-build_ script which sets
up various native dependencies and, importantly, sets the app version and build
number to use.

In our case we can use a private Github repo which contains a single JSON file
to store the current app version and build number:

```json
{
  "appVersion": "1.0",
  "buildNumber": 12
}
```

When the pre-build step gets run we clone this repo, increment the build number
and then push back the changes. We then place the final app version and build
number into a file called `appConfig.json` which the Fastlane build makes use of
(see below).

The pre-build step additionally updates the Android and iOS project files with
the version and build number info (because injecting them via Fastlane) doesn't
always work):

```
# file: android/app/build.gradle

android {
    compileSdkVersion 23
    buildToolsVersion "23.0.3"
    defaultConfig {
        applicationId "com.acme.mobile.app"
        minSdkVersion 16
        targetSdkVersion 22
        versionName "1.0"
        versionCode 12
        ndk {
            abiFilters "armeabi-v7a", "x86"
        }
    }
    ...
}

# file: ios/myApp/Info.plist
...
<dict>
  ...
	<key>CFBundleShortVersionString</key>
  <string>1.0</string>
	<key>CFBundleVersion</key>
	<string>12<string>
  ...
</dict>
```

### Fastlane actions

Our project folder structure looks as follows:

```
<project root>
  package.json
  ...
  fastlane/
    Appfile
    Fastfile
    Matchfile
```

The `Appfile` contains:

```
app_identifier "com.acme.mobile.app" # The bundle identifier of your app
apple_id "tech@acme.com" # Your Apple email address
team_id "3VG4SQ9TN1"  # Developer Portal Team ID
```

The `Matchfile` is used by [match](https://github.com/fastlane/fastlane/tree/master/match) and contains:

```
git_url "git@github.com:acme/fastlane-match-ios-certs.git"
type "development"
app_identifier ["com.acme.mobile.app"]
username "tech@acme.com"
```

Notice the private Github repository entered into the `Matchfile`. This is the
repository in which `match` stores all the generated iOS certificates and
provisioning profiles, encrypted. Even though the data is encrypted in the
repository (`match` will ask you to set an encryption password), I recommend
making this a private repo.

The `apple_id` parameter in the `Appfile`
tells `match` which user to login to the Apple developer portal as in order
to upload the generated certificates and profiles.

The first step is generate the iOS certificates and profiles:

```shell
$ fastlane match development
$ fastlane match appstore
```

One this is done the private Github repo (see above) will be populated with files.

We can now makes use of these files to build iOS apps. The `Fastfile`
contains our custom actions:

```ruby
fastlane_version "2.9.0"
default_platform :ios

# we will call some node scripts which are written in ES6 (see below)
nodeExec = '../node_modules/.bin/babel-node'

# load in config generated in the pre-build step (see above)
file = File.read('../appConfig.json')
appConfig = JSON.parse(file)

# iOS
platform :ios do
  desc "Submit a new Beta Build to Apple TestFlight"
  lane :beta do
    # fetch previously generated certificates, but don't generate new ones if none already exist
    match(type: "appstore", readonly: true)
    # ensure we're on the "qa" git branch
    ensure_git_branch(branch: "qa")
    # set the app build number from our previously generated config
    increment_build_number(
      xcodeproj: "./ios/myApp.xcodeproj",
      build_number: appConfig["buildNumber"]
    )
    # set the app version from our previously generated config
    increment_version_number(
      xcodeproj: "./ios/myApp.xcodeproj",
      version_number: appConfig["appVersion"]
    )
    # build the app for app store export
    gym(
      clean: true,
      export_method: 'app-store',
      workspace: "./ios/myApp.xcworkspace",
      scheme: "myApp",
      output_directory: "./build-tools/deploy/data"
    )
    # upload to TestFlight and notify testers
    testflight(
      skip_submission: true
    )
  end
end

# Android
platform :android do
  desc "Submit a new Beta Build to TestFairy"
  lane :beta do
    # ensure we're on the "qa" git branch
    ensure_git_branch(branch: "qa")
    # build the app in release mode
    gradle(
      project_dir: "./android",
      task: "assemble",
      flavor: "defaultConfog",
      build_type: "Release",
      properties: {
        'versionCode' => appConfig["buildNumber"],
        'versionName' => appConfig["appVersion"]
      }
    )
    # call a Node script to upload the generated APK to TestFairy
    sh "#{nodeExec} ../build-tools/deploy/testfairy-apk-upload.js '../android/app/build/outputs/apk/app-instabug-release.apk'"
  end
end
```

To build the apps we can do:

```shell
$ fastlane ios beta
$ fastlane android beta
```

### Uploading to TestFairy

Fastlane doesn't have built-in support for uploading to TestFairy, which is why
in our Android build action (above) we call a script to do this for us:

```js
// file: build-tools/deploy/testfairy-apk-upload.js

import path from 'path'
import got from 'got'
import fs from 'fs'
import FormData from 'form-data'
import { appVersion, buildNumber } from '../../appConfig'

TESTFAIRY_API_KEY = 'testkey'

const upload = (apkPath, comment) => {
  // upload
  console.log('Upload APK ...')

  const startTime = Date.now()

  const form = new FormData()
  form.append('api_key', TESTFAIRY_API_KEY)
  form.append('file', fs.createReadStream(apkPath))
  form.append('video', 'wifi')
  form.append('duration', '10m')
  form.append('comment', comment)
  form.append('testers-groups', 'internal')
  form.append('auto-update', 'off')
  form.append('notify', 'on')
  form.append('instrumentation', 'off')

  return got.post(`https://app.testfairy.com/api/upload/`, {
    body: form,
    json: true
  })
  .then((res) => {
    console.log(`Upload took: ${parseInt((Date.now() - startTime) / 1000)} seconds`)

    return res.body
  })
}

const apkPath = process.argv.pop()

upload(apkPath, `Build ${appVersion} (${buildNumber})`)
.then(json => {
  console.log(JSON.stringify(json, null, 2))

  if ('ok' !== json.status) {
    throw new Error(`Upload failed: ${json.message}`)
  }
})
.catch(err => {
  console.error(err)

  process.exit(-1)
})
```

## 2. Get it running on CircleCI

Now that the build is running locally we need to get it running on the CircleCI
OS X machine. The key point to note is that the iOS dependencies (XCode, etc)
are already installed whereas the Android SDK isn't. Which means we need to
install the Android SDK before we can do the Android build.

Here is our [circle.yml](https://circleci.com/docs/configuration/) file:

```yml
machine:
  xcode:
    version: '8.0'
  environment:
    YARN_VERSION: 0.18.1
    # Needed for Android SDK installation bash script (see below)
    ANDROID_HOME: "/usr/local/Cellar/android-sdk"
    PATH: "${PATH}:${HOME}/.yarn/bin:${HOME}/${CIRCLE_PROJECT_REPONAME}/node_modules/.bin"
dependencies:
  pre:
    # Install YARN
    - |
      if [[ ! -e ~/.yarn/bin/yarn || $(yarn --version) != "${YARN_VERSION}" ]]; then
        curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version $YARN_VERSION
      fi
  override:
    # The Android Gradle build will need the Android signing keystore keys setup
    - mkdir -p ~/.gradle
    - echo -e "SOFARSOUNDS_RELEASE_STORE_PASSWORD=$ANDROID_KEYSTORE_PASSWORD\nSOFARSOUNDS_RELEASE_KEY_PASSWORD=$ANDROID_KEYSTORE_PASSWORD" >> ~/.gradle/gradle.properties
    # Install Gems (fastlane, etc)
    - bundle check --path=vendor/bundle || bundle install --path=vendor/bundle --jobs=4 --retry=3 --without development
    # Install node modules
    - yarn install
  cache_directories:
    # Let's speed up the next build by cacheing installed dependencies
    - ~/.yarn
    - ~/.cache/yarn
    - vendor/bundle
    - node_modules
    - ~/Library/Caches/CocoaPods
deployment:
  beta:
    branch: qa
    commands:
      # Run our pre-build setup
      - npm run setup
      # Install Android SDK
      - ./ci-install-android-sdk.sh
      # Build and deploy Android app
      - bundle exec fastlane android beta
      # Build and deploy iOS app
      - bundle exec fastlane ios beta
```

Note how we setup a global `gradle.properties` containing our Android app signing key
passwords - this is so that when the Android Gradle build takes place it is able
sign the final APK using our keystore file (bundled inside our repository). Note
that we are using the same password for both the keystore and the private key -
  this is just to reduce the number of passwords we keep track off.

Also note how we set the `ANDROID_HOME` environment to where [Homebrew](https://brew.sh/)
installs the Android SDK by default. This variable gets picked up by the
`ci-install-android-sdk.sh` script:

```bash
#/bin/sh
set -e
# install the sdk
brew install android-sdk
# ensure sdk binaries are made available
brew link android-sdk
# ensure PATH is set correctly
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
# install basic SDK tools
echo y | android update sdk --no-ui --all --filter "android-23"
echo y | android update sdk --no-ui --all --filter "platform-tools"
echo y | android update sdk --no-ui --all --filter "tools"
echo y | android update sdk --no-ui --all --filter "build-tools-23.0.3"
echo y | android update sdk -u -a -t tool
# ensure licenses are already accepted
mkdir -p $ANDROID_HOME/licenses
cp ./android-licenses/* $ANDROID_HOME/licenses
```

The reason for piping `echo y` into the `android update` commands is to auto-accept
any licenses which get presented during installation. This is also why we copy
the contents of our repo's `android-licenses` folder into the SDK's folder path -
  during the Gradle build there are likely to be other SDK tools which need
installing and thus require license acceptance confirmation.

The contents of our `android-licenses` folder is:

```
<project-root>/
  android-licenses/
    android-sdk-license (contents: 8933bad161af4178b1185d1a37fbf41ea5269c55)
    intel-android-extra-license (contents: d975f751698a77b662f1254ddbeed3901e976f5a)
```

_Note: these are [SHA1 hashes of the license text](http://stackoverflow.com/questions/38096225/automatically-accept-all-sdk-licences)
and will only work for so long_.

Certain environment variables need to be set in CircleCI's _Environment Variables_
settings:

![screenshot](/assets/img/circleci-fastlane-env-vars.png)

* `ANDROID_KEYSTORE_PASSWORD` - Password for both the Android signing keystore and its private key.
* `FASTANE_PASSWORD` - Passsword for the Apple Id you entered in the `Fastlane` config file.
* `MATCH_PASSWORD` - Encryption password for Fastlane' `match` to use with the iOS certificate
and provisioning data stored within the private Github repository entered in the `Matchfile`.

In CircleCI's SSH settings (see _Checkout SSH keys_) a _user_ key as opposed to
_deploy_ key needs to be used so that within a build we can clone other private
repos within our Github organization, specifically the repo which contain the
iOS certificates and profiles and the one which tracks the current build
number:

![screenshot](/assets/img/circleci-ssh-settings.png)

---

And that's it! If you now commit and push to the `qa` branch you should soon
have two new test builds pushed to both TestFairy and TestFlight.
