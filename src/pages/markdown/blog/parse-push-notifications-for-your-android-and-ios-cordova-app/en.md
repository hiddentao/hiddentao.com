---
title: Parse push notifications for your Android and iOS Cordova app
date: '2015-04-10'
summary: "I recently had to get [Parse](http:&#47;&#47;parse.com) push notifications working with a Phonegap&#47;Cordova application. It took of a lot of Google-ing and documentation reading to figure out all the steps needed. I'm documenting what's needed here in case it helps anybody else.\r\n\r\nInstructions are for both Android (Jellybean+) and iOS (8+). I'm running Phonegap v4.2.0-0.24.2.\r\n\r\n## Android\r\n\r\nThese steps are based on what's in Parse's [Quickstart guide](https:&#47;&#47;parse.com&#47;apps&#47;quickstart#parse_push&#47;android&#47;existing).\r\n\r\nFirst of all let's write our application code for handling incoming notifications. We need an `Application` class which will be responsible for registering with Parse.\r\n"
tags:
  - Phonegap
  - Push
  - iOS
  - Androd
---
I recently had to get [Parse](http://parse.com) push notifications working with a Phonegap/Cordova application. It took of a lot of Google-ing and documentation reading to figure out all the steps needed. I'm documenting what's needed here in case it helps anybody else.

Instructions are for both Android (Jellybean ) and iOS (8 ). I'm running Phonegap v4.2.0-0.24.2.

## Android

These steps are based on what's in Parse's [Quickstart guide](https://parse.com/apps/quickstart#parse_push/android/existing).

First of all let's write our application code for handling incoming notifications. We need an `Application` class which will be responsible for registering with Parse.  
<a id="more"></a><a id="more-1853"></a>

```java  
package com.mypackage.MyApp;
 
import android.app.Application;
import com.parse.Parse;
import com.parse.PushService;
 
public class MyApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
 
        Parse.initialize(this, "<parse app key>", "<parse client key>" );
        ParseInstallation currentInstallation = ParseInstallation.getCurrentInstallation();
         
        /*
          At this point you may wish to set some data on the installation object in order for you to target this specific instance of the app with a push.
        */
 
        currentInstallation.saveInBackground();
    }
}
```

Then we need to extend [ParsePushBroadcastReceiver](https://parse.com/docs/android/api/com/parse/ParsePushBroadcastReceiver.html) with our own class so that we can customize how we handle pushes:

```java  
package com.mypackage.MyApp;
 
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import com.parse.ParseAnalytics;
import com.parse.ParsePushBroadcastReceiver;
 
public class MyAppPushReceiver extends ParsePushBroadcastReceiver {
    @Override
    public void onPushOpen(Context context, Intent intent) {
        //To track "App Opens"
        ParseAnalytics.trackAppOpenedInBackground(intent);
 
        // start main UI in case we are running in the background
        Intent i = new Intent(context, MyAppActivity.class);
        i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        i.putExtras(intent.getExtras());
        context.startActivity(i);
    }
}
```

Finally we need to create our `Activity` which will actually launch the UI:

```java  
package com.mypackage.MyApp;
 
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import org.apache.cordova.Config;
import org.apache.cordova.CordovaActivity;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.Iterator;
 
public class MyAppActivity extends CordovaActivity
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.init();
        // lanch cordova web UI
        super.loadUrl(Config.getStartUrl());
    }
     
     
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
    }
 
    @Override
    protected void onResume()
    {
        super.onResume();
 
        Intent intent = this.getIntent();
        Bundle intentExtras = intent.getExtras();
 
        if (null != intentExtras) {
            String dataString = intentExtras.getString("com.parse.Data");
 
            if (null != dataString) {
 
                    /*
                    We're going to assume dataString is JSON and decode it as such.
                     
                    We're then going to call pushCallback() within the Cordova app and pass through
                    some parameters.
                     */
                     
                    JSONObject json = new JSONObject(dataString);
 
                    String javascript = "pushCallback('" + json.getString("item1") + "', '" + json.getString("item2")+ "')";
                    this.sendJavascript(javascript);
            } 
       }
    }
 
}
```

_Note: the `sendJavascript` method has recently been deprecated in `CordovaActivity`. Check out [how the Ionic framework does it](https://github.com/mysegfault/ionic-plugins-keyboard/blob/master/src/android/IonicKeyboard.java#L94)._

Now we just need to update `AndroidManifest.xml` to hook everything up:

```xml  
<?xml version='1.0' encoding='utf-8'?>
<manifest android:hardwareAccelerated="true" android:versionCode="10000" android:versionName="1.0.0" android:windowSoftInputMode="adjustPan" package="com.mypackage.MyApp" xmlns:android="http://schemas.android.com/apk/res/android">
    <supports-screens android:anyDensity="true" android:largeScreens="true" android:normalScreens="true" android:resizeable="true" android:smallScreens="true" android:xlargeScreens="true" />
    <uses-permission android:name="android.permission.INTERNET" />
    <application android:hardwareAccelerated="true" android:icon="@drawable/icon" android:label="@string/app_name" android:name=".MyApp">
        <activity android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale" android:label="@string/app_name" android:launchMode="singleTop" android:name="MyAppActivity" android:theme="@android:style/Theme.Black.NoTitleBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            <intent-filter>
                <data android:scheme="cc" />
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
            </intent-filter>
        </activity>
        <service android:name="com.parse.PushService" />
        <receiver android:name="com.parse.ParseBroadcastReceiver">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
                <action android:name="android.intent.action.USER_PRESENT" />
            </intent-filter>
        </receiver>
        <receiver android:name=".MyAppPushReceiver" android:exported="false">
            <intent-filter>
                <action android:name="com.parse.push.intent.RECEIVE" />
                <action android:name="com.parse.push.intent.DELETE" />
                <action android:name="com.parse.push.intent.OPEN" />
            </intent-filter>
        </receiver>
        <receiver android:name="com.parse.GcmBroadcastReceiver" android:permission="com.google.android.c2dm.permission.SEND">
            <intent-filter>
                <action android:name="com.google.android.c2dm.intent.RECEIVE" />
                <action android:name="com.google.android.c2dm.intent.REGISTRATION" />
                <category android:name="com.mypackage.MyApp" />
            </intent-filter>
        </receiver>
        <meta-data android:name="com.google.android.gms.version" android:value="@integer/google_play_services_version" />
    </application>
    <uses-sdk android:minSdkVersion="18" android:targetSdkVersion="18" />
 
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.GET_ACCOUNTS" />
    <uses-permission android:name="com.google.android.c2dm.permission.RECEIVE" />    
    <permission android:protectionLevel="signature" android:name="com.mypackage.MyApp.permission.C2D_MESSAGE" />
    <uses-permission android:name="com.mypackage.MyApp.permission.C2D_MESSAGE" />
</manifest>
```

I copied `Parse-1.9.0.jar` and the accompanying `bolts-android-1.1.4.jar` (you get both of these in the download from Parse) into the `libs` folder and then updated my `build.gradle` file accordingly:

```groovy  
dependencies {
    compile fileTree(dir: 'libs', include: '*.jar')
    for (subproject in getProjectList()) {
        compile project(subproject)
    }
    ... // other dependencies
}
```

That's it. If all goes well you should be able to receive pushes once the app has started.

## iOS

Follow the instructions in the [QuickStart guide](https://parse.com/apps/quickstart#parse_push/ios/native/existing). Near the end you are told to insert the following method:

```cpp  
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
  [PFPush handlePush:userInfo];
}
```

Instead of adding this, add the one recommended by the [official iOS docs](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIApplicationDelegate_Protocol/#//apple_ref/occ/intfm/UIApplicationDelegate/application:didReceiveRemoteNotification:):

```cpp  
- (void)application:(UIApplication *)application
didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))handler {
    // Process the remote notification
    [PFPush handlePush:userInfo];
     
    // Clear notification badge
    [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
    [[UIApplication sharedApplication] cancelAllLocalNotifications];
     
    // Let's invoke the pushCallback() method within Cordova with data from the userInfo boject
    NSString *jsCallBack = [NSString stringWithFormat:@"pushCallback('%@', '%@');", userInfo[@"item1"], userInfo[@"item2"]];
    [self.viewController.webView stringByEvaluatingJavaScriptFromString:jsCallBack];
}
```

That's it. You're ready.
