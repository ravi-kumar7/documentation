# Device Connect: Android SDK
The Android SDK can be used to integrate mobile apps with Device Connect to share customers' device data.

::: warning NOTE
Following will be shared by FinBox team at the time of integration:
- `ACCESS_KEY`
- `SECRET_KEY`
- `DEVICE_CONNECT_VERSION`
- `API_KEY`
:::

## Integration Flow
Assuming the dependency has been added for your project as per [this](/device-connect/android.html#adding-dependency) section, the following would be the flow in your app:

### Step 1: Taking the User Consent
It is required to show what all permissions you will be needing from users in app, and then ask them for the permissions. Please refer [this](/device-connect/android.html#handle-permissions) section to get the list of permissions the SDK needs. Also in case you want to exclude certain permissions, you can use a `remove` rule as mentioned in the same article.

### Step 2: Creating the User
Once all permissions are granted, you can call the `createUser` method specifying a `username` (Refer to [this](/device-connect/android.html#create-user-method) section for sample code and response), this username represents a unique identifier for the user.

::: tip TIP
It is recommended that `username` is a masked value not a unique personal identifier like phone number or email id, so that user remains anonymous to FinBox.
:::

`createUser` in general acts as a check for API credentials. For the first time when the user doesn't exists, it will create user on FinBox side. The next steps will work only if this function returns a success response.

### Step 3: Start Syncing Data
If the `createUser` response is successful, you can call `startPeriodSync` function (Refer [this](/device-connect/android.html#start-period-sync-method) article) which will sync data in period intervals in background.

::: danger IMPORTANT
- Recommended approach is to call `createUser` (and then `startPeriodSync` on success) method every time user accesses the app, so that background sync process remains in check.
- In certain cases, FinBox server often requests critical data from sdk directly (other than scheduled sync period), to make sure this works it is required to **forward FCM Notifications to SDK**. Refer to [this](/device-connect/android.html#forward-notifications-to-sdk) article for it.
- In case of multi process application, it is required to initialize the SDK manually before calling the `createUser` method. Refer [here](/device-connect/android.html#multi-process-support) for such cases.
:::

## Adding Dependency
In the project level `build.gradle` file, add the repository URLs to all `allprojects` block.

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
implementation('in.finbox:mobileriskmanager:<DEVICE_CONNECT_VERSION>:parent-release@aar') {
    transitive = true
}
```

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

::: warning WARNING
In case of Xiaomi we need to ask for a special Service SMS Permission so that SMS Data can be synced. Please look at the sample app in which in order to navigate the user to the settings screen, we are calling the function:
`CommonUtils.showServiceSmsPermissionSetting(this);` and then listening to the callback in `OnActivityResult` with RequestCode `REQUEST_SMS_PERMISSION_CODE`
:::

To remove the unused permissions, add a `remove` rule to that permission as shown below:
```xml
<uses-permission
    android:name="android.permission.READ_CALL_LOG"
    tools:node="remove" />
```

In case the Manifest merger is not enabled add the above specified permissions manually.

## Create User Method

Call `createUser` method to create the user (first time) or check the API credentials for the SDK. It takes `username` as one of its arguments which is a unique identifier for a user.

::: danger IMPORTANT
Please make sure `username` is **not more than 64** characters and is **alphanumeric** (with no special characters).
:::

The response to this method (success or failure) can be captured using the callback `FinBoxAuthCallback`.

```java
// Create the username or get a reference to an existing username
FinBox.createUser("API_KEY", "username",
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

You can read about the error codes in [this](/device-connect/android.html#error-codes) section.

## Start Period Sync Method

This is to be called only on successful response to `createUser` method's callback. On calling this the syncs will start for all the data sources configured as per permissions. The method below syncs data in background at regular intervals:

```java
FinBox finbox = new FinBox();
finbox.startPeriodicSync();
```

## Forward Notifications to SDK

In certain cases, FinBox server often requests critical data from sdk directly (other than scheduled sync period), to make sure this works it is required to forward FCM Notifications to SDK.

Add the following lines inside the overridden `onMessageReceived` method available in the service that extends `FirebaseMessagingService`.

```java
if(MessagingService.forwardToFinBoxSDK(remoteMessage.getData())) {
    final MessagingService firebaseMessagingService = new MessagingService();
    firebaseMessagingService.attachContext(this);
    firebaseMessagingService.onMessageReceived(remoteMessage);
}
```

## Multi Process Support

Device Connect uses a content provider to auto initialize the SDK. The limitation with the OS is that content providers are only initialized once in a **multi process application** and from the main process. For this reason, any calls to the SDK from other processes will lead to unstable behavior.

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

## Cancel Periodic Syncing

If you have already set up the sync for the user data, you can cancel it any time by following code:

```java
finBox.stopPeriodicSync();
```

## Handle Sync Frequency

By default sync frequency is set to **8 hours**, you can modify it by passing preferred time **in seconds** as argument to `setSyncFrequency` method once the user is created.

## Reset User Data

In case the user data needs to be removed to re-sync the entire data, use the method `resetData`.

```java
FinBox.resetData();
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