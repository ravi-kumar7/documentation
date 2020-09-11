# FinBox Lending: Android

FinBox Lending SDK is a drop-in module that can add a digital lending journey to any mobile application.

## Setting up the SDK

1. Add the repository url in the project `build.gradle` file
   ```groovy
   maven {
     url "s3://risk-manager-android-sdk/artifacts"
     credentials(AwsCredentials) {
            accessKey = 'ACCESS_KEY'
            secretKey = 'SECRET_KEY'
       }
   }
   ```
2. Add the Lending SDK dependency in the app `build.gradle` file

   ```groovy
    implementation("in.finbox.lending:core-uat:<LENDING_SDK_VERSION>:uat@aar") {
        transitive = true
    }
    implementation("in.finbox.lending:onboarding-uat:<LENDING_SDK_VERSION>:uat@aar") {
        exclude group: 'in.finbox', module: 'mobileriskmanager'
        transitive = true
    }
    implementation("in.finbox.lending:dashboard-uat:<LENDING_SDK_VERSION>:uat@aar") {
        exclude group: 'in.finbox.lending', module: 'core'
        transitive = true
    }
    implementation("in.finbox.lending:preloan-uat:<LENDING_SDK_VERSION>:uat@aar") {
        exclude group: 'in.finbox.lending', module: 'core'
        transitive = true
    }
    implementation("in.finbox.lending:kyc-uat:<LENDING_SDK_VERSION>:uat@aar") {
        exclude group: 'in.finbox.lending', module: 'core'
        transitive = true
    }
    implementation("in.finbox.lending:pennydrop-uat:<LENDING_SDK_VERSION>:uat@aar") {
        exclude group: 'in.finbox.lending', module: 'core'
        transitive = true
    }
    implementation("in.finbox:mobileriskmanager:<RISK_SDK_VERSION>:parent-release@aar") {
        exclude group: 'in.finbox.lending', module: 'core'
        transitive = true
    }
   ```

## Start SDK flow

Once all dependencies are added, SDK requires 3 inputs: `customer_id`, `user_token` and `client_api_key`.

::: tip Note
`user_token` needs to be generated against a `customer_id` on backend before starting the SDK. Refer [here](/middleware/sourcing-rest-api.html#get-eligibility)
:::

Now that all required parameters are available, we can start the SDK flow as follows:

<CodeSwitcher :languages="{kotlin:'Kotlin',java:'Java'}">
<template v-slot:kotlin>

```kotlin
val REQUEST_CODE_ONBOARDING = 101
FinBoxLending.Builder(context)
    .setCustomerId(<customer_id>)
    .setFinBoxApiKey(<client_api_key>)
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
FinBoxLending builder = FinBoxLending.Builder(context)
    .setCustomerId(<customer_id>)
    .setFinBoxApiKey(<client_api_key>)
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
        val result = data.extras.getParcelable<FinBoxJourneyResult>(FINBOX_JOURNEY_RESULT)
        // callback when user exits the flow, intent data has information holding users state
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
            // callback when user exits the flow, intent data has information holding users state
            FinBoxJourneyResult result = data.getExtras().getParcelable(FinBoxLendingConstants.FINBOX_JOURNEY_RESULT); // contains status of the journey
        }
    }
}
```

</template>
</CodeSwitcher>

FinBoxJourneyResult has the following values:
- `resultCode`: Status code for the journey.
- `screen`: Name of the last screen in the journey
- `message`: Any additional message to describe the resultCode

Possible values for `resultCode` are as follows:
| Result Code | Description |
| - | - | - |
| `MW200` | Journey is completed successfully |
| `MW500` | User exits the journey |
| `MW400` | Some error occurred in the SDK |
 

Possible values for `screen` are as follows:
| Screen | Description |
| - | - | - |
| `Launcher` | Permission list screen |
| `Permissions` | Permission list screen |
| `SMS Permission` | Permission list screen |
| `PAN Consent` | PAN consent screen |
| `Profile` | Basic profile screen |
| `Pre Loan` | Loan application screen |
| `Dashboard` | Dashboard screen |
| `KYC` | KYC screen |
| `KYC Address` | KYC Submit address screen |
| `KYC Analysis` | KYC Processing screen |
 

 
