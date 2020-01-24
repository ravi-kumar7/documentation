# Device Connect: Cordova
The Cordova plugin can be used to integrate mobile apps with Device Connect, so that users can share their data.

::: warning NOTE
Following will be shared by FinBox team at the time of integration:
- `ACCESS_KEY`
- `SECRET_KEY`
- `DC_SDK_VERSION`
- `CLIENT_API_KEY`
:::

## Integration Flow
Assuming the bridge has been setup between your project and device connect as per [this](/device-connect/cordova.html#setting-up-the-bridge) section, the following would be the flow in your app:

<img src="/client_workflow.png" alt="Client Workflow" style="width:80%;height:80%" />

### Step 1: Requesting Runtime Permissions
It is required to show what all permissions you will be needing from users in app, and then ask them for the permissions. Please refer [this](/device-connect/cordova.html#handle-permissions) section to get the list of permissions the SDK needs. Also in case you want to exclude certain permissions, you can use a `remove` rule as mentioned in the same article.

### Step 2: Creating the User
After requesting, the `createUser` method can be called specifying a `CUSTOMER_ID` (Refer to [this](/cordova/cordova
cordova.html#create-user-method) section for sample code and response), which represents a unique identifier for the user.

::: tip TIP
- It is recommended that `CUSTOMER_ID` is a masked value not a unique personal identifier like phone number or email id, so that user remains anonymous to FinBox.
- SDK will automatically consider syncing based on whether permission was granted by user or not and what was configured, hence the `createUser` method must be called even though user denies certain permissions.
:::

`createUser` in general acts as a check for API credentials. For the first time when the user doesn't exists, it will create user on FinBox side. The next step will work only if this function returns a success response.

### Step 3: Start Syncing Data
If the `createUser` response is successful, you can call `startPeriodicSync` function (Refer [this](/device-connect/cordova
cordova.html#start-periodic-sync-method) article) which will sync data in period intervals in background.

::: danger IMPORTANT
Recommended approach is to call `createUser` (and then `startPeriodicSync` on success) method every time user accesses the app, so that background sync process remains in check.
:::

## Setting up the bridge

1. Install the Cordova SDK from the npm package:
    ```sh
    cordova plugin add cordova-plugin-finbox-risk-manager
    ```

2. Specify the following in `local.properties` file:
    ```
    AWS_KEY=<ACCESS_KEY>
    AWS_SECRET=<SECRET_KEY>
    FINBOX_RM_VERSION=<DC_SDK_VERSION>
    FINBOX_RM_ARTIFACT=pfm-release
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

To remove the unused permissions, add a `remove` rule to that permission as shown below:
```xml
<uses-permission
    android:name="android.permission.READ_CALL_LOG"
    tools:node="remove" />
```

In case the Manifest merger is not enabled add the above specified permissions manually.

## Create User Method
Call `createUser` method using the `FinBoxRiskManager` instance to create the user (first time) or check the API credentials for the SDK. It takes `CUSTOMER_ID` as one of its arguments which is a unique identifier for a user.

::: danger IMPORTANT
Please make sure `CUSTOMER_ID` is **not more than 64** characters and is **alphanumeric** (with no special characters).
:::

The response to this method (success or failure) can be captured using the callback, and on success [Start Periodic Sync Method](/device-connect/cordova.html#start-period-sync-method) should be called.
```javascript
cordova.plugins.FinBoxRiskManager.createUser("CLIENT_API_KEY", "CUSTOMER_ID", function (response) {
    console.log(response);
    cordova.plugins.FinBoxRiskManager.startPeriodicSync(12); 
}, function (error) {
    console.log(error);
});
```

## Start Periodic Sync Method

This is to be called only on successful response to `createUser` method's callback. On calling this the syncs will start for all the data sources configured as per permissions. The method below syncs data in background at regular intervals:

```javascript
cordova.plugins.FinBoxRiskManager.startPeriodicSync(12) //Start the sync periodically after every 12 hour
```

::: tip Handle Sync Frequency
`startPeriodicSync` takes one argument which indicates the frequency of sync **in hours**.
:::

## Cancel Periodic Syncing

If you have already set up the sync for the user data, you can cancel it any time by following code:

```javascript
cordova.plugins.FinBoxRiskManager.stopPeriodicSync();
```

## Reset User Data

In case the user data needs to be removed to re-sync the entire data, use the method `resetData`.

```javascript
cordova.plugins.FinBoxRiskManager.resetData();
```

## Error Codes

Below table contains the constant name, error code value and the description of error code:


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