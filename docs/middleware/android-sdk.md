# Sourcing Entity - Android SDK
FinBox Lending SDK is a one stop solution to seamlessly onboard users to a loan application journey.

## Modules
The SDK is broken down into multiple modules which can be customizable as per requirements. Complete SDK has following modules:
1. Onboarding
2. Loan dashboard
3. KYC
4. Loan offer and agreement

### Onboarding module
Onboarding user is the first and the most critical of the SDK. FinBox does onboarding based on OTP phone verification and the Device Connect is initialized while onboarding to get an eligibility criteria of the user. This criteria will play an important role when user applies for loan.

### Loan dashboard
Loan dashboard screen will have details of the active/ongoing loan for that user. This screen gives an overview about the loan journey. 
In case the user has an disbursed loan he can view his EMI details in the Repay section.

### KYC 
KYC is critical to a loan application and there are rules set in place to ensure a smooth journey for the user while applying for KYC and giving a continuous update on the status of KYC and approval.
KYC rules are based on 3 main tiers. 
1. Address proof
2. PAN Card
3. Photo

E-KYC is available for Address proof for a hassle free journey.

### Loan offer and agreement
- Once KYC and loan approval is done, user will see list of loan offers made by lenders.
- The user can select any one of the offer and attach a bank for the loan. Once the bank verification is done and the user is taken to the legality screen where the full agreement is shown and users consent is requested.
- A final OTP verification is done and loan request is placed for disbursal.

## Setting up the SDK

1. Add the Bintray repo url in the project `build.gradle` file
    ```groovy
	maven {  
	  url "s3://risk-manager-android-sdk/artifacts"  
	  credentials(AwsCredentials) {  
	  accessKey = properties.getProperty('AWS_ACCESS_KEY')  
	        secretKey = properties.getProperty('AWS_SECRET_KEY')  
	    }  
	}
    ```
2.  Add the Lending SDK dependency in the app `build.gradle` file
    ```groovy
	implementation "in.finbox.lending:lending-sdk:1.0.1"
    ```
3. Specify the following in `local.properties` file:
    ```
    AWS_KEY=<ACCESS_KEY>
    AWS_SECRET=<SECRET_KEY>
    FINBOX_RM_VERSION=<DC_SDK_VERSION>
    FINBOX_RM_ARTIFACT=pfm-release
    ```

## Authentication
In order to use the SDK FinBox will provide API-Key that will be used to validate the client. Please add this `api-key` in the Application manifest file.
First add the API-key in the `strings.xml`
```xml
<string name="finbox_client_key">provided-api-key</string>
```

Then add the meta-data tag to application element.

```xml
<meta-data
    android:name="in.finbox.CLIENT_KEY_LENDING"
    android:value="@string/finbox_client_key" />
```

## Getting Configuration ID
This can be obtained for a given user, by calling the following API

::: tip Endpoint
POST **https://lending.finbox.in/v1/sourcing/get_configuration/**
:::
This API requires an API Key shared by FinBox team to be passed in `X-API-KEY` field in header.

It receives following **request body** in `application/json` content type:
```json
{
    "mobile": "XXXXXXXXXX",
    "skip_modules": {
        "onboarding": true,
        "kyc": false
    }
}
```
The above request indicates to skip the onboarding steps, but ask for kyc step for the user of given mobile number.

:::warning IMPORTANT
Right now only onboarding and kyc modules can be skipped, rest modules are compulsory.
:::

On successful run, it will give a configuration id in `data` field in response as follows:
```json
{
    "status": true,
    "error": "",
    "data": "<CONFIGURATION_ID>"
}
```

## Initializing SDK
Once API key is added. We need to initialize the SDK. Before initializing the SDK configuration ID obtained by calling `get_configuration` API needs to be passed. Based on this ID the modules and the flow will be set in the SDK. 

:::danger NOTE
The configuration ID is mandatory. If the ID passed is invalid the SDK will not start.
:::

Pass the configuration ID in the intent while starting the activity.

```java
val CALLBACK_REQUEST_CODE = 101 //request code use to read from activity callback

startActivityForResult(Actions.openOnBoardingIntent(context, "<configuration-id>"), CALLBACK_REQUEST_CODE)
```

## Handling callbacks

You can track status of the user exit actions in the `onActivityResult` callback function

```kotlin
override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {  
    super.onActivityResult(requestCode, resultCode, data)
    if (requestCode == REQUEST_CODE_ONBOARDING) {
	    if (resultCode != FinBoxLendingConstants.RESULT_EXIT) {
		    //Callback when user exits the flow, intent data has information holding users state
	    }
    }
}
```

## Forwarding FCM Notifications
FinBox lending app will send notifications to user regarding their loan journey. It is expected that the parent app will forward these notifications to the SDK.

In your `FirebaseMessagingService` make sure you add following to ensure the FCM notifications are  forwarded.

```kotlin
override fun onMessageReceived(message: RemoteMessage) {  
    //....  
  if (MessagingService.forwardToFinBoxSDK(message.data)) {  
        routeMessage(message)  
    }  
    //....  
}

private fun routeMessage(remoteMessage: RemoteMessage) {  
    val firebaseMessagingService = MessagingService()  
    firebaseMessagingService.attachContext(this)  
    firebaseMessagingService.onMessageReceived(remoteMessage)  
}
```

## Customizing Theme
FinBox Lending SDK allows you to customize colors and theme to match your brand

### App Bar Text
​
Currently, the app bar shows the name of the application, You can update app bar text by the updating the `app_name` in the `strings.xml` file.

```xml
<string name="app_name">FinBox</string>
```
### App Bar and Status Colors
​
App bar and status colors can be overridden by overwriting `colorPrimary` and `colorPrimaryDark` colors in the `colors.xml`.

```xml
<color name="colorPrimary">#00C398</color>
<color name="colorPrimaryDark">#00574B</color>
```
### Fonts
​
Default font can be changed to the desired font by specifying `fontFamily` under the style with name `AppTheme.FinBox`.

```xml
<style name="AppTheme.FinBox" parent="AppTheme.NoActionBar">
    <item name="android:fontFamily">@font/lato</item>
</style>
```
### Window Background Color
​
Use `windowBackground` item to update the background color of the screens.

```xml
<style name="AppTheme.FinBox" parent="AppTheme.NoActionBar">
    <item name="android:windowBackground">@color/colorBlackText</item>
</style>
```