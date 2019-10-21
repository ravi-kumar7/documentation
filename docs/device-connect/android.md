# Android SDK
The Android SDK can be used to integrate mobile apps with Device Connect to share customers' device data.

## Adding Dependency
In the project level `build.gradle` file, add the repository urls to all `allprojects` block.

```groovy
maven {
    url "s3://risk-manager-android-sdk/artifacts"
    credentials(AwsCredentials) {
        accessKey = <ACCESS_KEY>
        secretKey = <SECRET_KEY>
    }
}
```

Now add the dependency to module level `build.gradle`:
```groovy
implementation('in.finbox:mobileriskmanager:<deviceConnectVersion>:parent-release@aar') {
    transitive = true
}
```
::: warning NOTE
Following will be shared by FinBox team at the time of integration:
- `ACCESS_KEY`
- `SECRET_KEY`
- `deviceConnectVersion`
:::

## Create or get reference to User

Call `createUser` method to create the user or get the existing user by passing an unique id for the user and `FinBoxAuthCallback`. The call back methods are called once the authentication is a success and failure.

```java
// Create the username or get a reference to an existing username
FinBox.createUser("provided-api-key", "client_side_borrower_id",
    new FinBox.FinBoxAuthCallback() {
        @Override
        public void onSuccess(@NonNull String accessToken) {
            // Authentication is success
        }

        @Override
        public void onError(@FinBoxErrorCode int error) {
            // Authentication failed
        }
    });
```
::: danger IMPORTANT
This method needs to be called every time the user opens the app.
:::

## Sync Data Periodically

In successful response to `FinBoxAuthCallback`, the syncs should be started. The method below syncs data in background at regular intervals:

```java
FinBox finbox = new FinBox();
finbox.startPeriodicSync();
```

::: warning NOTE
All subscribed data sources for which you have the permission will be synced. To prevent a data source from syncing, please remove its permissions as per the [Handle Permissions](/device-connect/android.html#handle-permissions) section.
:::

## Cancel Periodic Syncing

If you have already set up the sync for the user data, you can cancel it any time by following code:

```java
finBox.stopPeriodicSync();
```

## Handle Sync Frequency

By default sync frequency is set to **8 hours**, you can modify it by passing preferred time **in seconds** as argument to `setSyncFrequency` method once the user is created.

## Handle Permissions

The Runtime permissions needs to handled by the developer when calling the helper methods. Based on the permissions available, the SDK intelligently syncs the alternate data.

Below are the list of Runtime permissions the sdk adds to the application Manifest, if Manifest Merger is enabled:
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


## Forward Notifications to SDK

Using FCM notifications, the SDK requests the device to generate appropriate data for the server to analyze. So, if the FinBox servers sends a notification, you need to forward the data payload to the SDK.

Add the following lines inside the overridden `onMessageReceived` method available in the service that extends `FirebaseMessagingService`.

```java
if(MessagingService.forwardToFinBoxSDK(remoteMessage.getData())) {
    final MessagingService firebaseMessagingService = new MessagingService();
    firebaseMessagingService.attachContext(this);
    firebaseMessagingService.onMessageReceived(remoteMessage);
}
```

## Reset User Data

In case the user data needs to be removed to re-sync the entire data, use the method `resetData`.

```java
FinBox.resetData();
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

### Initialize the SDK

Initialize the FinBox SDK in the `onCreate` method of Application class.

```java
FinBox.initLibrary(this);
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