# FinBox Lending: Android

FinBox Lending SDK is a drop-in module that can add a digital lending journey to any mobile application.
The SDK has the following modules:

1. OnBoarding
2. Bureau consent
3. User profile
4. KYC
5. BankConnect
6. Bank Verification
7. Loan Agreement
8. ENach

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
   maven {
        url  "https://dl.bintray.com/finbox/LendingMiddleware"
    }
   ```
2. Add the Lending SDK dependency in the app `build.gradle` file

   ```groovy
    implementation 'in.finbox.lending:onboarding:1.2.0'
    
    implementation('in.finbox:mobileriskmanager:2.4:parent-release@aar') {
        transitive = true
    }
   ```

3. Specify the following in `local.properties` file:
   ```
   AWS_KEY=<ACCESS_KEY>
   AWS_SECRET=<SECRET_KEY>
   FINBOX_RM_VERSION=<DC_SDK_VERSION>
   FINBOX_RM_ARTIFACT=pfm-release
   ```

## Start SDK flow

Once all dependencies are added SDK requires 3 inputs customerId, token and API Key

::: tip Note
CustomerId and Token need to be generated from the backend before starting the SDK. Refer [here](/middleware/sourcing-rest-api.html#get-eligibility)
:::

Now that all required parameters are available we can start with the integration

<CodeSwitcher :languages="{kotlin:'Kotlin',java:'Java'}">
<template v-slot:kotlin>

```kotlin
val REQUEST_CODE_ONBOARDING = 101
FinBoxLending.Builder(context, REQUEST_CODE_ONBOARDING)
    .setCustomerId(<customer_id>)
    .setFinBoxApiKey(<api_key_provided>)
    .setUserToken(<user_token>)
    .build()

startActivityForResult(
    builder.getLendingIntent(context),
    REQUEST_CODE_ONBOARDING
)
```

</template>
<template v-slot:java>

```java
private String REQUEST_CODE_ONBOARDING = 101;
FinBoxLending builder = FinBoxLending.Builder(context, REQUEST_CODE_ONBOARDING)
    .setCustomerId(<customer_id>)
    .setFinBoxApiKey(<api_key_provided>)
    .setUserToken(<user_token>)
    .build();

startActivityForResult(
 builder.getLendingIntent(getContext()),
 REQUEST_CODE_ONBOARDING
)

```

</template>
</CodeSwitcher>

## Callback

The callback will be provided when the user exits the SDK. You can track the status of user exit actions in the `onActivityResult` callback function

<CodeSwitcher :languages="{kotlin:'Kotlin',java:'Java'}">
<template v-slot:kotlin>

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

</template>
<template v-slot:java>

```java
@Override
private void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (requestCode == REQUEST_CODE_ONBOARDING) {
        if (resultCode == FinBoxLendingConstants.RESULT_EXIT) {
            //Callback when user exits the flow, intent data has information holding users state
            data.getExtras().getInt(FinBoxLendingConstants.JOURNEY_RESULT_KEY); //Contains status of the journey
            data.getExtras().getString(FinBoxLendingConstants.JOURNEY_VALUE); //Contains message for exit of the journey

        }
    }
}
```

</template>
</CodeSwitcher>

Journey result is passed to the intent and can have the following values:

```
FinBoxLendingConstants.JOURNEY_COMPLETE - When the user completes the entire journey
FinBoxLendingConstants.JOURNEY_ABANDON - When the user exits the SDK without completing
FinBoxLendingConstants.JOURNEY_FAILURE - When some error occurs in the SDK

FinBoxLendingConstants.JOURNEY_VALUE - Contains string result that can contain error message or screen name
```
