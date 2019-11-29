# Device Connect: React Native Integration
Device connect can be integrated to React Native projects to share customers' device data.

## Install Dependency from NPM
Install the React SDK from the npm package
```sh
yarn add react-native-risk-sdk
```
This will install the native module as a dependency. Since it is a native module you will have to link this to your native app.
Run following command to auto link native modules
```sh
react-native link
```


## Android Studio changes

Once the linking is done you need to open Android Studio and  add a maven repository url in your project level `build.gradle` file
```groovy
maven {  
    url "s3://risk-manager-android-sdk/artifacts"  
    credentials(AwsCredentials) {  
        accessKey = "<access-key>"
	secretKey = "<secret-key>"  
    }
}
```

Final change required is in the `MainApplication` class of your native app.

```java
@Override  
protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        ....
        new RiskSdkPackage(),
        ...
    );
}
```
That's it. Now that the bridge is complete we need to go to React to call the method to trigger the SDK.

## React Implementation
Once the bridge is complete, we should be able to call the methods exposed using the `NativeModules`. Below is a snippet of react code to call the exposed methods.
`createUser` function creates a user with the `username` provided and the periodic sync will be for the assigned `username`
Once the `createUser` is successful you need to call `startPeriodicSync` with the duration to start fetching data from device.

```javascript
import { NativeModules } from 'react-native';
const { FinBoxRiskSdk } = NativeModules

//Function to trigger RiskSdk
const callModule = () => {
    FinBoxRiskSdk.createUser(
        "<API_KEY>",
        "<USERNAME>",
        (errorStatus) => {
	    // Error Callback
            console.log("Error status -> ", errorStatus)
        }, 
        (msg) => {
            // Success Callback, Call the periodic sync once the user has been created
	    console.log("Final message", msg)
	    FinBoxRiskSdk.startPeriodicSync(12) //Start the sync periodically after every 12 hour
	}
    )
}
```

## Sync Data Periodically

In successful response to `FinBoxAuthCallback`, the syncs should be started. The method below syncs data in background at regular intervals:

```javascript
FinBoxRiskSdk.startPeriodicSync(12) //Start the sync periodically after every 12 hour
```

::: warning NOTE
All subscribed data sources for which you have the permission will be synced. To prevent a data source from syncing, please remove its permissions as per the [Handle Permissions](/device-connect/react-native.html#handle-permissions) section.
:::

## Cancel Periodic Syncing

If you have already set up the sync for the user data, you can cancel it any time by following code:

```javascript
FinBoxRiskSdk.stopPeriodicSync();
```

## Handle Permissions

The Run-time permissions needs to handled by the developer when calling the helper methods. Based on the permissions available, the SDK intelligently syncs the alternate data.

Below are the list of Run-time permissions the SDK adds to the application Manifest, if Manifest Merger is enabled:
```xml
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_CALENDAR" />
<uses-permission android:name="android.permission.READ_SMS" />
<uses-permission android:name="android.permission.RECEIVE_SMS" />
<uses-permission android:name="android.permission.READ_CALL_LOG" />
<uses-permission android:name="android.permission.READ_CONTACTS" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.GET_ACCOUNTS" />
<uses-permission
    android:name="android.permission.PACKAGE_USAGE_STATS"
    tools:ignore="ProtectedPermissions" />
```

To remove the unused permissions, add a `remove` rule to that permission as shown below:
```xml
<uses-permission
    android:name="android.permission.READ_CALL_LOG"
    tools:node="remove" />
```

The recommended behavior is to leave the permissions untouched, as it is easier to configure which data points to collect, which ones to skip compared to releasing updates by adding, removing permissions.

In case the Manifest merger is not enabled add the above specified permissions manually.

## Reset User Data

In case the user data needs to be removed to re-sync the entire data, use the method `resetData`.

```javascript
FinBoxRiskSdk.resetData();
```
## MultiProcess Support

Device Connect uses a content provider to auto initialize the SDK. The limitation with the OS is that content providers are only initialized once in a multi process application and from the main process. For this reason, any calls to the SDK from other processes will lead to unstable behavior.

In case, you want to use the SDK from a process other than main process, follow the two steps mentioned below to initialize the SDK.

### Remove the Content Provider

Remove the content provider that auto initializes the SDK from the Android Manifest file.
```xml
<provider
    android:name="in.finbox.mobileriskmanager.init.AutoInitProvider"
    android:authorities="in.finbox.lenderapplication.riskmanagerprovider"
    android:enabled="true"
    android:exported="false"
    tools:node="remove" />
```

## Error Codes

Below table contains the constant name, error code value and the description of error code:

::: tip TIP
All the constants stated below are available as constants in SDK.
:::

| Constant Name                       | Constant Value| Description |
| :------------------------- | :------------- | --------------- |
| QUOTA_LIMIT_EXCEEDED | 7670            | API Key exceeded its quota limit               |
| AUTHENTICATE_FAILED  | 7671              | Authentication of the API Key and the User failed               |
| AUTHENTICATE_API_FAILED | 7672              | Authentication of the API Key failed               |
| AUTHORIZATION_API_FAILED | 7673              | Authorization of the API Key failed               |
| AUTHENTICATE_API_EMPTY | 7676              | API key is empty               |
| AUTHENTICATE_USER_EMPTY | 7677              | User name is empty               |
| NO_ACTIVE_NETWORK | 7678              | Device is not connected to an active network                              |
| NETWORK_TIME_OUT | 7679              | Request timed out               |
| NETWORK_RESPONSE_NULL | 7681              | Network response is null               |
| USER_TOKENS_NULL | 7682              | Both access token and refresh token is null               |
| ACCESS_TOKEN_NULL | 7683              | Access token is null               |
| REFRESH_TOKEN_NULL | 7684              | Refresh token is null               |
| AUTHENTICATE_NOT_FOUND | 7685              | End point is not found               |

Some error codes can be resolved by validating the implementation and some by retrying the creation of user, while other error codes can only be resolved by contacting FinBox.