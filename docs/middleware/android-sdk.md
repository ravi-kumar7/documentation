# FinBox Lending: Android

FinBox Lending SDK is a drop-in module which can add a digital lending journey to any mobile application.
The SDK has the following modules:

1. OnBoarding
2. Loan Dashboard
3. KYC
4. Loan offer and Agreement

## Modules

### OnBoarding module

Onboarding the user is the first and the most critical step of the SDK. FinBox does the onboarding based on OTP verification of the user's mobile number.

### Loan Dashboard

The loan dashboard screen will have details of the active/ongoing loan for that user. This screen gives an overview of the loan journey. In case the user has a disbursed loan he can view his EMI details in the Repay section.

### KYC

KYC is critical to a loan application. There are rules set in place to ensure a smooth journey for the user while applying for KYC. KYC rules are based on 3 main tiers.

1. Address proof
2. PAN Card
3. Photo

E-KYC is available for Address proof for a hazel free journey.

### Loan offer and Agreement

Once KYC and loan approval is done, the user will see a list of loans available based on the credit score determined by FIS (FinBox Inclusion Score). The user can select any one of the offers and attach a bank for the loan. A final OTP verification is done and loan request is placed for disbursal.

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
2. Add the Lending SDK dependency in the app `build.gradle` file
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

In case the Manifest merger is not enabled add the above-specified permissions manually.

## Add lending flow

Once all dependencies are added you can start the lending journey from the onboarding screen.

```kotlin
val REQUEST_CODE_ONBOARDING = 101
FinBoxLending.Builder(context, REQUEST_CODE_ONBOARDING)
    .setCustomerId(<customer_id>)
    .setFinBoxApiKey(<api_key_provided>)
    .start()
```


This will start the FinBox SDK onboarding screen. The callback will be provided when the user exits the SDK. You can track the status of user exit actions in the `onActivityResult` callback function

```kotlin
override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)
    if (requestCode == REQUEST_CODE_ONBOARDING) {
        if (resultCode != FinBoxLendingConstants.RESULT_EXIT) {
            //Callback when user exits the flow, intent data has information holding users state
            data.extras.getInt(FinBoxLendingConstants.JOURNEY_RESULT_KEY) //Contains status of the journey
        }
    }
}
```

Journey result is passed to the intent and can have following values:

```
FinBoxLendingConstants.JOURNEY_COMPLETE - When user completes entire journey
FinBoxLendingConstants.JOURNEY_ABANDON - When user exits the SDK without completing
FinBoxLendingConstants.JOURNEY_FAILURE - When some error occurs in the SDK
```