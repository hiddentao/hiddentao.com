---
title: React Native push notification using Batch and Fastlane
date: '2017-03-15'
summary: ''
tags:
  - React Native
  - React
  - Batch
  - Push notifications
  - Google
  - Apple
---

Following on my previous post on setting up
[Continuous Deployment for React Native](/archives/2017/02/01/continuous-integration-for-react-native-with-testfairy-testflight-deploy/),
this post outlines how to get push notifications working reliably for both
Android and iOS using [Batch](https://batch.com) as the intermediary that sits
between your server and Google's and Apple's push servers.

For the app I'm working on there were a number of requirements:

* Ability to push a message to devices in batches of 1000's at a time.
* Ability to handle a push notification differently depending on whether the
app is in the foreground or background
* Ability to know if/when app was started due to the user clicking on a push
notification
* Ability to know if user has disabled push notifications for the app via their
device settings, and if so, to be able to take them to their settings page
* On iOS, the ability to choose when we ask the user for push notification
permissions instead of automatically at app startup.

_Why use Batch and not just make direct calls to Apple and Google's
servers?_

Batch and other push notification services like it abstract away the differences
in dealing with Apple's and Google's services. Batch in particular provides a
transactional API which allows you to [push a message to upto 10000 devices](https://batch.com/doc/api/transactional.html)
at a time, all through a simple REST API.

Another advantage is that it provides an online interface through which you can
easily test push notifications without having to write any code yourself.
Finally, if you're just using the transactional API without the need to push
JSON data (i.e. silent notifications) it's [free to use](https://batch.com/pricing).

## The push notifications process

**iOS**

In order to receive a push notification in your app, the following must happen:

1. Request push notifications permission (the user will be shown
  a native dialog asking for permission)
2. If permission is granted then APNS (Apple Push Notification Service) will
issue a _token_ which is unique to your app and the user's device. If you
restart your app the token will be generated as soon as it's requested, since
the user has already previously granted permission.
3. The token must be sent along with a notification message to Batch, which
will then call through to APNS to send a push notification to the device

**Android**

The procedure is the same as for iOS (see above) except that the user does not
get prompted with a dialog asking for permission - the permission is granted by
default.

The token is generated by FCM (Firebase Cloud Messaging), Google's equivalent to
APNS. It is made use of in the same way (i.e. sending it to Batch).

### What if the user declines permission?

If the user declines push notification permission, either via the prompted dialog
or manually in their app settings then a dialog will not get shown again. Thus
you must first instruct the user to re-enable push notifications manually before
asking for a registration token.

## Android setup

You first need to setup FCM (Firebase Cloud Messaging) for your Android app:

1. Sign up at [https://console.firebase.google.com/](https://console.firebase.google.com/)
1. Create a new Android app (with the right package name for your app)
1. Download the `google-services.json` file and place it in `<project folder>/android/app`
1. Note down the cloud messaging _server key_ and _sender ID_:

![screenshot](fcm-settings.png)

_Note: You can use either the legacy or non-legacy key, both are fine._

We will enter these details into Batch later on (see below) so that it will be
able to push to our Android app.

## iOS Setup

_Note: I will assume you are using [Match](https://github.com/fastlane/fastlane/tree/master/match)
for managing your certificates and provisioning profiles._

Go into the Apple Developer portal and create new _Development_ and _Production_
push certificates for your app:

![screenshot](apn-push.png)

Now you just need to re-generate your provisioning profiles from scratch:

```shell
$ bundle exec fastlane match --force development
$ bundle exec fastlane match --force adhoc
$ bundle exec fastlane match --force appstore
```

The _Development_ push certificate is used with the development provisioning
profile, and the _Production_ with Ad-hoc and Appstore profiles.

If you build your app in _Release_ mode then it will must use either the Ad-hoc
or Appstore profile. In _Debug_ mode it must use the development profile.
Since iTunes/TestFlight recommends using the Appstore profile here is how your
profile settings should look in XCode:

![screenshot](xcode-profiles.png)

## Batch dashboard setup

You need to create **2 apps** in your Batch account, one for each platform.

For the Android app you need to enter your FCM settings you obtained earlier:

![screenshot](batch-android-settings.png)

_Note: Default priority is set to high to ensure rapid message delivery._

For iOS app you first need to export your _Production_ push certificate as a `.p12`
file ([see instructions](https://batch.com/doc/ios/prerequisites.html#_generating-the-p12-file))
and then upload it into Batch:

![screenshot](batch-ios-settings.png)

## App native integration

The next piece of the puzzle is setting up the platform-native part of the app
to enable it to receive push notifications.

### iOS

If you integrate the Batch SDK in the default recommended way you end up with a
situation where the user is asked for push notifications permission as soon as
the app starts.

To avoid this it's better to opt for [manual integration](https://batch.com/doc/ios/advanced/manual-integration.html) and then
use React Native's [built-in push API](http://facebook.github.io/react-native/releases/0.42/docs/pushnotificationios.html#pushnotificationios) to ask for permissions.

Once you've added the Batch SDK to your project, modify your `AppDelegate` as such:

```
/* AppDelegate.h */

#import <UIKit/UIKit.h>
@interface AppDelegate : UIResponder <UIApplicationDelegate>
@property (nonatomic, strong) UIWindow *window;
@property (nonatomic, strong) NSData *devicePushToken; // for storing the token given to us by APNS
@end
```

```
/* AppDelegate.m */

#import "AppDelegate.h"

@import Batch;
#import <React/RCTPushNotificationManager.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"myMobileApp"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  // Start Batch.
  [BatchPush disableAutomaticIntegration];
  [Batch startWithAPIKey:@"58459349083048038"];

  return YES;
}

// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];

  self.devicePushToken = deviceToken;
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RCTPushNotificationManager didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for the notification event.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification
{
  [RCTPushNotificationManager didReceiveRemoteNotification:notification];
}
// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RCTPushNotificationManager didReceiveLocalNotification:notification];
}

@end
```

Note the use of the Batch API key. This is obtained from your Batch dashboard
for your iOS app:

![screenshot](batch-api-key.png)

_Note: If you're only using Batch for its transactional push API (as this post
  is showing) then you only every need to use the LIVE api key, and can ignore
  the DEV one._

When the app starts up, one of the following two happen:

* If the user hasn't previously enabled push notifications then nothing happens.
* If the user HAS previously enabled push notifications then the obtained token
is stored in the `devicePushToken` member of `AppDelegate` for use later on (see below).

When doing manual integration, the APNS-provided push token must be passed to
Batch manually. Let's create a `Notifications` module which you can call through
to from Javascript:

```
/* Notifications.h */

#ifndef Notifications_h
#define Notifications_h
#import <React/RCTBridgeModule.h>
@interface Notifications : NSObject<RCTBridgeModule>
@end
#endif
```

```
/* Notifications.m */

#import <Foundation/Foundation.h>
#import "AppDelegate.h"
#import "Notifications.h"
@import Batch;
@implementation Notifications

// Expose this module to the React Native bridge
RCT_EXPORT_MODULE(Notifications)

RCT_EXPORT_METHOD(setPushToken:(NSString *)token) {
  AppDelegate* app = (AppDelegate*)[[UIApplication sharedApplication] delegate];

  NSLog(@"RNBatch: setPushToken: passed-in = %@, stored = %@", token, app.devicePushToken);

  [BatchPush handleDeviceToken:app.devicePushToken];
}

@end
```

Finally, enable push notifications in the app's capability list:

![screenshot](xcode-push-1.png)
![screenshot](xcode-push-2.png)

### Android

Android integration needs a bit more work since there is not yet a React Native
built-in push notifications API for Android. Most importantly, you want to know
within Javascript when the user receives a notification.

Once you've added the Batch SDK to your project, modify `AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android" ...>
  ...

  <permission android:name="${applicationId}.permission.C2D_MESSAGE" android:protectionLevel="signature"/>
  <uses-permission android:name="${applicationId}.permission.C2D_MESSAGE"/>
  <uses-permission android:name="android.permission.WAKE_LOCK" />
  <uses-permission android:name="android.permission.VIBRATE" />
  <uses-permission android:name="com.google.android.c2dm.permission.RECEIVE"/>

  <application ...>
    ...

    <!-- Handle recieved pushes -->
    <service android:name="com.mycompany.myapp.notifications.PushService" />
    <receiver android:name="com.mycompany.myapp.notifications.PushReceiver" android:permission="com.google.android.c2dm.permission.SEND">
        <intent-filter>
            <action android:name="com.google.android.c2dm.intent.RECEIVE" />
            <category android:name="${applicationId}" />
        </intent-filter>
    </receiver>
    <!-- Push token registration listeners -->
    <service android:name="com.mycompany.myapp.notifications.InstanceIdService" android:exported="true">
        <intent-filter>
            <action android:name="com.google.firebase.INSTANCE_ID_EVENT"/>
        </intent-filter>
    </service>
    <service android:name="com.batch.android.BatchPushInstanceIDService" android:exported="true">
        <intent-filter>
            <action android:name="com.google.android.gms.iid.InstanceID"/>
        </intent-filter>
    </service>
    <!-- Handle notification messages which get clicked/processed -->
    <service android:name="com.mycompany.myapp.notifications.MessagingService">
        <intent-filter>
            <action android:name="com.google.firebase.MESSAGING_EVENT"/>
        </intent-filter>
    </service>

  </application>
</manifest>
```

Let's write these one by one.

First we need a component which listens for new push tokens assigned by FCM:

```java
package com.mycompany.myapp.notifcations;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.FirebaseInstanceIdService;

public class InstanceIdService extends FirebaseInstanceIdService {
    @Override
    public void onTokenRefresh() {
        // Get updated InstanceID token.
        String refreshedToken = FirebaseInstanceId.getInstance().getToken();

        // Broadcast refreshed token to all Activity instances
        Intent i = new Intent("RefreshToken");
        Bundle bundle = new Bundle();
        bundle.putString("token", 'RefreshToken');
        i.putExtras(bundle);
        sendBroadcast(i);
    }
}
```

We need a `MessagingService` which will handle received push messages:

```java
package com.mycompany.myapp.notifications;

import android.content.Intent;
import android.util.Log;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class MessagingService extends FirebaseMessagingService {
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        Intent i = new Intent("Message");
        i.putExtra("data", remoteMessage);
        sendOrderedBroadcast(i, null);
    }
}
```

Handle the push notification once the app gets woken up:

```java
package com.mycompany.myapp.notifications;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.support.v4.content.WakefulBroadcastReceiver;

public class PushReceiver extends WakefulBroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        ComponentName comp = new ComponentName(context.getPackageName(), PushService.class.getName());
        startWakefulService(context, intent.setComponent(comp));
        setResultCode(Activity.RESULT_OK);
    }
}
```

Handle the _Message_ intents:


```java
package com.mycompany.myapp.notifications;

import android.app.IntentService;
import android.content.Intent;
import android.util.Log;

import com.batch.android.Batch;

public class PushService extends IntentService
{
    @Override
    protected void onHandleIntent(Intent intent)
    {
        try
        {
            if( Batch.Push.shouldDisplayPush(this, intent) )
            {
                // show notification icon and display only if app is NOT in foreground
                if (!State.getInstance().isInForeground()) {
                    Batch.Push.displayNotification(this, intent);
                }
            }
        }
        finally
        {
            PushReceiver.completeWakefulIntent(intent);
        }
    }
}
```

The `State` object used above is just a singleton used to track whether the
app is in the foreground or not:

```java
package com.mycompany.myapp.notifications;

public class State {
    private static State ourInstance = new State();

    public static State getInstance() {
        return ourInstance;
    }

    private boolean inForeground = false;

    public boolean isInForeground() {
        return this.inForeground;
    }

    public void setIsInForeground(boolean val) {
        this.inForeground = val;
    }
}
```

Finally, the big one. The `Notifications` module which will send the token and
any incoming notification up into Javascript layer, and expose methods to be
called from therein (most of this code is derived from
  [react-native-fcm](https://github.com/evollu/react-native-fcm)):

```java
package com.mycompany.myapp.notifications;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.IntentFilter;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.messaging.RemoteMessage;

import android.os.Bundle;

import android.content.Context;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class NotificationsModule extends ReactContextBaseJavaModule implements LifecycleEventListener, ActivityEventListener {
    private Intent initIntent;

    public NotificationsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        getReactApplicationContext().addLifecycleEventListener(this);
        getReactApplicationContext().addActivityEventListener(this);
        registerTokenRefreshHandler();
        registerMessageHandler();
    }

    @Override
    public Map<String, Object> getConstants() {
        Map<String, Object> constants = new HashMap<>();
        return constants;
    }

    @Override
    public String getName() {
        return "Notifications";
    }


    @ReactMethod
    public void getToken(Promise promise) {
        promise.resolve(FirebaseInstanceId.getInstance().getToken());
    }

    private void sendEvent(String eventName, Object params) {
        if (getReactApplicationContext().hasActiveCatalystInstance()) {
            getReactApplicationContext()
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        }
    }

    private void sendNotificationToApp(Object params) {
        sendEvent("notification", params);
    }

    private void registerTokenRefreshHandler() {
        IntentFilter intentFilter = new IntentFilter("RefreshToken");
        getReactApplicationContext().registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if (getReactApplicationContext().hasActiveCatalystInstance()) {
                    String token = intent.getStringExtra("token");
                    sendEvent("pushToken", token);
                    abortBroadcast();
                }
            }
        }, intentFilter);
    }

    private void registerMessageHandler() {
        IntentFilter intentFilter = new IntentFilter("Message");

        getReactApplicationContext().registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if (getReactApplicationContext().hasActiveCatalystInstance()) {
                    RemoteMessage message = intent.getParcelableExtra("data");
                    WritableMap params = Arguments.createMap();
                    if(message.getData() != null){
                        Map data = message.getData();
                        Set<String> keysIterator = data.keySet();
                        for(String key: keysIterator){
                            params.putString(key, (String) data.get(key));
                        }
                        sendNotificationToApp(params);
                        abortBroadcast();
                    }
                }
            }
        }, intentFilter);
    }

    private WritableMap parseIntent(Intent intent){
        WritableMap params;
        Bundle extras = intent.getExtras();
        if (extras != null) {
            try {
                params = Arguments.fromBundle(extras);
            } catch (Exception e){
                Log.e(TAG, e.getMessage());
                params = Arguments.createMap();
            }
        } else {
            params = Arguments.createMap();
        }
        WritableMap fcm = Arguments.createMap();
        fcm.putString("action", intent.getAction());
        params.putMap("fcm", fcm);
        params.putInt("opened_from_tray", 1);
        return params;
    }

    @Override
    public void onHostResume() {
        State.getInstance().setIsInForeground(true);

        if (initIntent == null){
            //the first intent is initial intent that opens the app
            Intent newIntent = getCurrentActivity().getIntent();
            sendEvent("initialNotification", parseIntent(newIntent));
            initIntent = newIntent;
        }
    }

    @Override
    public void onHostPause() {
        State.getInstance().setIsInForeground(false);
    }

    @Override
    public void onHostDestroy() {
        State.getInstance().setIsInForeground(false);
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
    }

    @Override
    public void onNewIntent(Intent intent){
        sendNotificationToApp(parseIntent(intent));
    }
}
```

And as with any React Native native module for Android there has to be an
accompanying `ReactPackage`:

```java
package com.mycompany.myapp.notifications;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class NotificationsPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new NotificationsModule(reactContext));
        return modules;
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList();
    }
}
```

To complete Batch integration, the `MainActivity` will look like this:

```java
package com.mycompany.myapp;

import android.content.Intent;

import com.batch.android.Batch;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {
    @Override
    protected String getMainComponentName() {
        return "myMobileApp";
    }

    @Override
    protected void onStart()
    {
        super.onStart();
        Batch.onStart(this);
    }

    @Override
    protected void onStop()
    {
        Batch.onStop(this);
        super.onStop();
    }

    @Override
    protected void onDestroy()
    {
        Batch.onDestroy(this);
        super.onDestroy();
    }

    @Override
    public void onNewIntent(Intent intent)
    {
        Batch.onNewIntent(this, intent);
        super.onNewIntent(intent);
    }
}
````

And the `MainApplication`:

```java
package com.mycompany.myapp;

import android.app.Application;
import android.content.Context;

import com.batch.android.Batch;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.joshblour.reactnativepermissions.ReactNativePermissionsPackage;
import com.mycompany.myapp.notifications.NotificationsPackage;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected List<ReactPackage> getPackages() {
      return new ArrayList<>(Arrays.asList(
          new MainReactPackage(),
          new ReactNativePermissionsPackage(),
          new NotificationsPackage()
      ));
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();

    Batch.Push.setGCMSenderId('983247928738492');
    Batch.Push.setManualDisplay(true);
    Batch.setConfig(new com.batch.android.Config("58459349083048038"));

    SoLoader.init(this, /* native exopackage */ false);
  }
}
```

As you can see above, you need both the FCM/GCM _Sender ID_ you obtained from
FCM, and your Batch API key from within the Batch dashboard. Note that the API
key should be the one for the Android app, not the iOS app.

## Javascript layer

Finally, let's see how to hook things up in the Javascript layer.

Let's build a unified interface doing push notifications. First, define the
`PushBase` class:

```js
/* PushBase.ios */

import Q from 'bluebird'

export default class PushBase {
  checkPermission () {
    return this._checkPermission()
  }

  askForPermission () {
    return this._requestPermission()
  }

  getToken () {
    return this.token
  }

  initService () {
    return Q.try(() => {
      if (!this.initialized) {
        this.initialized = true

        return this._initService()
      }
    })
  }

  clearAppIconBadgeNumber () {
    this._clearBadge()
  }

  _onError = (err) => {
    console.warn(err)
  }

  _onRegisterToken = (token) => {
    this.token = token

    this._sendTokenToNativeLayer()

    /* TODO: push token to server */
  }

  _onNotification = (notification) => {
    console.log('Raw notification:', notification)

    const parsed = this._parseNotification(notification)

    if (parsed) {
      /* TODO: handle push notification */
    }
  }

  _parseNotification = (n) => n

  _clearBadge () {}

  _sendTokenToNativeLayer = (token) => {}
}
```

This base class exposes three methods:

* `initService()` - initialise push notifications service and obtain a token from
APNS/FCM
* `checkPermission()` - check to see if push notifications is enabled for the app
* `askForPermission()` - ask the user for push notifications permission (if not already enabled)

Each method will call through to methods implemented in subclasses.


**Android**

```js
/* PushAndroid.js */

import Q from 'bluebird'
import { NativeModules, DeviceEventEmitter } from 'react-native'
import PushBase from './PushBase'

const NativeNotifications = NativeModules.Notifications

class PushAndroid extends PushBase {
  constructor () {
    super()

    DeviceEventEmitter.addListener('notification', this._onNotification)
    DeviceEventEmitter.addListener('pushToken', this._onRegisterToken)
  }

  _checkPermission () {
    // in Android notifications are enabled by default
    return Q.resolve(true)
  }

  _requestPermission () {
    // in Android notifications are enabled by default
    return Q.resolve(true)
  }

  _initService () {
    return NativeNotifications.getToken()
    .then(this._onRegisterToken)
    .then(() => {
      if (this._initialNotification) {
        const n = this._initialNotification
        this._initialNotification = null
        n.background = true
        this._onNotification(n)
      }
    })
  }

  _parseNotification = (n) => {
    const ret = n.batchPushPayload || (n.title ? n : null)

    if (n && ret) {
      ret.background = !!n.background
    }

    return ret
  }
}

const push = new PushAndroid()
export default push

DeviceEventEmitter.addListener('initialNotification', (data) => {
  push._initialNotification = data
})
```

The `PushAndroid` class communicates with the native `Notifications` module we
created earlier. It asks for a token during initialisation. It also listens for the
`initialNotification` event, to capture the cases where the app was started due
to the user clicking on a notification.

Note that the notification object which gets passed to `_onNotification()`
will just be a JSON object, and will have the `background` key set to `true` if
the notification was received whilst the app was in the background or not running
 at all.

 This lets you apply different logic depending on how the notification
 was received. For example, if a notification is received when your app is in
 the foreground you may wish to show a popup to the user. Whereas in other
 cases you may wish to automatically navigate the user to the relevant page
 within your app according to the notification's meaning.


**iOS**

```js
/* PushIos.js */

import Q from 'bluebird'
import { PushNotificationIOS, NativeModules } from 'react-native'
import PushBase from './PushBase'

class PushIos extends PushBase {
  constructor () {
    super()

    PushNotificationIOS.addEventListener('register', this._onRegisterToken)
    PushNotificationIOS.addEventListener('registrationError', this._onError)
    PushNotificationIOS.addEventListener('notification', this._onNotification)
  }

  _checkPermission () {
    return PushNotificationIOS.checkPermissions((state)
    .then((state) => ( this._isEnabled(state) ? true : false ))
  }

  _requestPermission () {
    return PushNotificationIOS.requestPermissions()
    .then((state) => ( this._isEnabled(state) ? true : false ))
  }

  _initService () {
    return this._requestPermission()
    .then(() => {
      return PushNotificationIOS.getInitialNotification().then((notification) => {
        if (notification) {
          notification.background = true
          this._onNotification(notification)
        }
      })
    })
  }

  _parseNotification = (n) => {
    const ret = n._data

    if (n && ret) {
      ret.background = !!n.background
    }

    return ret
  }

  _clearBadge () {
    PushNotificationIOS.setApplicationIconBadgeNumber(0)
  }

  _sendTokenToNativeLayer = (token) => {
    NativeModules.Notifications.setPushToken(this.token)
  }

  _isEnabled (state) {
    return _.get(state, 'alert') || _.get(state, 'badge') || _.get(state, 'sound')
  }
}

export default new PushIos()
```

Same as for `PushAndroid`, `PushIos` also sets the `background` key to `true` if
a notification was received whilst the app was not in the foreground.

Notice that the when checking or asking for permission, the code parses the
resulting notification permission state to verify that atleast one type of
notification mechanism is enabled for the app (sound, badge and/or alert).

Also note that it calls through to the the native `Notifications` module once a
token is available, to ensure that the Batch iOS native layer gets initialised.
It doesn't strictly need to pass the token through (since we already obtain and
  save it in the native layer), this is just for convenience.

## Permission detection

So far all the original requirements have been met, except one:

* ~~Ability to push a message to devices in batches of 1000's at a time.~~
* ~~Ability to handle a push notification differently depending on whether the
app is in the foreground or background~~
* ~~Ability to know if/when app was started due to the user clicking on a push
notification~~
* Ability to know if user has disabled push notifications for the app via their
device settings, and if so, to be able to take them to their settings page
* ~~On iOS, the ability to choose when we ask the user for push notification
permissions instead of automatically at app startup.~~

However this is now trivial to achieve given the methods for checking and
asking for permission. To take a user to the device settings page associated
with your app you can do:

```js
import { Linking } from 'react-native'
Linking.openURL('app-settings:').catch(console.warn)
```

If you do this then you'll also want to recheck permissions once the user returns
to your app. This can be accomplished by listening in for app state changes
using the built-in [AppState](http://facebook.github.io/react-native/releases/0.42/docs/appstate.html#appstate) API.

## Triggering push notifications from your server

In the `PushBase` class above you'll notice the `_onRegisterToken()` method:

```js
_onRegisterToken = (token) => {
  this.token = token

  this._sendTokenToNativeLayer()

  /* TODO: push token to server */
}
```

In the final part of this method you would send the push token to your server.
Once the server has the token, triggering a push notification to be sent to
the device is just a matter of using [the Batch API](https://batch.com/doc/api/transactional.html).

Note the `sandbox` parameter:

![screenshot](batch-sandbox.png)

For iOS, it must be set to `true` if pushing to a `Debug` build of your app
(since this type of  build uses a `Development` provisioning profile). For
`Release` builds and any build of the Android app you should have it set to `false`.