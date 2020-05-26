# DeviceConnect: React Native
The React Native package can be used to integrate mobile apps with DeviceConnect so that users can share their data.

::: warning NOTE
Following will be shared by FinBox team at the time of integration:
- `ACCESS_KEY`
- `SECRET_KEY`
- `DC_SDK_VERSION`
- `CLIENT_API_KEY`
:::

## Integration Flow
Assuming the bridge has been setup between your project and DeviceConnect as per [this](/device-connect/react-native.html#setting-up-the-bridge) section, the following would be the flow in your app:

<img src="/client_workflow.png" alt="Client Workflow" style="width:80%;height:80%" />

### Step 1: Requesting Runtime Permissions
It is required to show what all permissions you will be needing from users in your app, and then ask them for the permissions. Please refer [this](/device-connect/react-native.html#handle-permissions) section to get the list of permissions the SDK needs. Also in case you want to exclude certain permissions, you can use a `remove` rule as mentioned in the same article.

### Step 2: Creating the User
After requesting, the `createUser` method can be called specifying a `CUSTOMER_ID` (Refer to [this](/device-connect/react-native.html#create-user-method) section for sample code and response), which represents a unique identifier for the user.

::: tip TIP
- It is recommended that `CUSTOMER_ID` is a masked value not a unique personal identifier like a phone number or email id so that the user remains anonymous to FinBox.
- SDK will automatically consider syncing based on whether permission was granted by the user or not and what was configured, hence the `createUser` method must be called even though the user denies certain permissions.
:::

`createUser` in general acts as a check for API credentials. For the first time when the user doesn't exists, it will create a user on the FinBox side. The next step will work only if this function returns a success response.

### Step 3: Start Syncing Data
If the `createUser` response is successful, you can call `startPeriodicSync` function (Refer [this](/device-connect/react-native.html#start-periodic-sync-method) article) which will sync data in period intervals in background.

::: danger IMPORTANT
The recommended approach is to call `createUser` (and then `startPeriodicSync` on success) method every time user accesses the app, so that the background sync process remains in check.
:::

## Setting up the bridge

1. Install the React SDK from the npm package:
    ```sh
    yarn add react-native-risk-sdk
    ```
2. Now to auto link this native module to your app, run following command:
    ```sh
    react-native link
    ```
3. Once the linking is done you need to open Android Studio and add a maven repository url in your project level `build.gradle` file
    ```groovy
    maven {  
        url "s3://risk-manager-android-sdk/artifacts"  
        credentials(AwsCredentials) {  
            accessKey = "<ACCESS_KEY>"
            secretKey = "<SECRET_KEY>"  
        }
    }
    ```
4. Specify the following in `local.properties` file:
    ```
    AWS_KEY=<ACCESS_KEY>
    AWS_SECRET=<SECRET_KEY>
    FINBOX_RM_VERSION=<DC_SDK_VERSION>
    FINBOX_RM_ARTIFACT=parent-release
    ```
5. Final change required is in the `MainApplication` class of your native app.
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
For Xiaomi Devices, Service SMS need to be enabled to retrieve SMS from Device. In the Sample App a `NativeModule` is created named as `XiaomiPermissionModule` where a native bridge is created to show user settings page where they can provide permission.
:::

To remove the unused permissions, add a `remove` rule to that permission as shown below:
```xml
<uses-permission
    android:name="android.permission.READ_CALL_LOG"
    tools:node="remove" />
```

In case the Manifest merger is not enabled add the above-specified permissions manually.

## Create User Method
Call `createUser` method using the `FinBoxRiskSdk` instance to create the user (first time) or check the API credentials for the SDK. It takes `CUSTOMER_ID` as one of its arguments which is a unique identifier for a user.

::: danger IMPORTANT
Please make sure `CUSTOMER_ID` is **not more than 64** characters and is **alphanumeric** (with no special characters). Also it should never `null` or a blank string `""`.
:::

The response to this method (success or failure) can be captured using the callback, and on success [Start Periodic Sync Method](/device-connect/react-native.html#start-period-sync-method) should be called.
```javascript
import FinBoxRiskSdk from 'react-native-risk-sdk';
//Function to trigger RiskSdk
const callModule = () => {
    FinBoxRiskSdk.createUser(
        "CLIENT_API_KEY",
        "CUSTOMER_ID",
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

You can read about the error codes in [this](/device-connect/react-native.html#error-codes) section.

## Start Periodic Sync Method

This is to be called only on a successful response to `createUser` method's callback. On calling this the syncs will start for all the data sources configured as per permissions. The method below syncs data in the background at regular intervals:

```javascript
FinBoxRiskSdk.startPeriodicSync(12) //Start the sync periodically after every 12 hour
```

::: tip Handle Sync Frequency
`startPeriodicSync` takes one argument which indicates the frequency of sync **in hours**.
:::

## Cancel Periodic Syncing

If you have already set up the sync for the user data, you can cancel it any time by the following code:

```javascript
FinBoxRiskSdk.stopPeriodicSync();
```

## Reset User Data

In case the user data needs to be removed to re-sync the entire data, use the method `resetData`.

```javascript
FinBoxRiskSdk.resetData();
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

Some error codes can be resolved by validating the implementation and some by retrying the creation of the user, while other error codes can only be resolved by contacting FinBox.