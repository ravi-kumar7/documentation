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
      content {
            includeGroup("in.finbox")
            includeGroup("in.finbox.lending")
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
    implementation("in.finbox.lending:loan-uat:<LENDING_SDK_VERSION>:uat@aar") {
        exclude group: 'in.finbox.lending', module: 'core'
        transitive = true
    }
    implementation("in.finbox.lending:esign-uat:<LENDING_SDK_VERSION>:uat@aar") {
        exclude group: 'in.finbox.lending', module: 'core'
        transitive = true
    }
    implementation("in.finbox.lending:enach-uat:<LENDING_SDK_VERSION>:uat@aar") {
        exclude group: 'in.finbox.lending', module: 'core'
        transitive = true
    }
    implementation("in.finbox.lending:payment-uat:<LENDING_SDK_VERSION>:uat@aar") {
        exclude group: 'in.finbox.lending', module: 'core'
        transitive = true
    }
    implementation("in.finbox.lending:bankconnect-uat:<LENDING_SDK_VERSION>:uat@aar") {
        exclude group: 'in.finbox.lending', module: 'core'
        transitive = true
    }
    implementation("in.finbox.lending:pennydrop-uat:<LENDING_SDK_VERSION>:uat@aar") {
        exclude group: 'in.finbox.lending', module: 'core'
        transitive = true
    }
    implementation("in.finbox:mobileriskmanager:<RISK_SDK_VERSION>:parent-release@aar") {
        transitive = true
    }
   ```

3. SDK requires java 8 version for project, add next lines to your module's build.gradle file

```groovy
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
```

:::warning ProGuard
While generating a signed application, make sure **ProGuard** file uses `proguard-android.txt` **not** `proguard-android-optimize.txt`, i.e. make sure it is:
```groovy
proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
```
:::

## Start SDK flow

Once all dependencies are added, SDK requires 3 inputs: `customer_id`, `user_token` and `client_api_key`.

::: tip Note
`user_token` needs to be generated against a `customer_id` on backend before starting the SDK. Refer [here](/middleware/sourcing-rest-api.html#generate-token)
:::

Now that all required parameters are available, we can start the SDK flow as follows:

<CodeSwitcher :languages="{kotlin:'Kotlin',java:'Java'}">
<template v-slot:kotlin>

```kotlin
val REQUEST_CODE_ONBOARDING = 101
val builder = FinBoxLending.Builder(context)
    .setCustomerId("<customer_id>")
    .setFinBoxApiKey("<client_api_key>")
    .setUserToken("<user_token>")
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

## Credit Line

For credit line journey, include the following dependency in the app `build.gradle` file:
```groovy
implementation("in.finbox.lending:creditline-uat:<LENDING_SDK_VERSION>:uat@aar") {
    exclude group: 'in.finbox.lending', module: 'core'
    transitive = true
}
```

In case of credit line product, once the lending journey is completed, user can opt-in for a credit while doing a transaction. For such a case use following method to start the credit line withdrawl journey:

<CodeSwitcher :languages="{kotlin:'Kotlin',java:'Java'}">
<template v-slot:kotlin>

```kotlin
val REQUEST_CODE_ONBOARDING = 101
val builder = FinBoxLending.Builder(context)
    .setCustomerId("<customer_id>")
    .setFinBoxApiKey("<client_api_key>")
    .setUserToken("<user_token>")
    .setCreditLineAmount(<withdraw_amount>)
    .setCreditLineTransactionId("<transaction_id>")
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
    .setCustomerId("<customer_id>")
    .setFinBoxApiKey("<client_api_key>")
    .setUserToken("<user_token>")
    .setCreditLineAmount(<withdraw_amount>)
    .setCreditLineTransactionId("<transaction_id>")
    .build();

startActivityForResult(
 builder.getLendingIntent(getContext()),
 REQUEST_CODE_ONBOARDING
)

```
</template>
</CodeSwitcher>

- `setCreditLineAmount` is the method that will contain the amount (in **Float**) that a user is trying to withdraw
- `setCreditLineTransactionId` will hold the transaction id (in **String**) for the withdrawal flow

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
| `CL200` | Credit line withdrawal success |
| `CL500` | Credit line withdrawal failed |

Possible values for `screen` are as follows:
| Screen | Description |
| - | - | - |
| `Launcher` | The base screen (Hidden Activity) |
| `Permissions` | Permission list screen |
| `Profile` | Basic profile screen |
| `PAN Consent` | PAN consent screen |
| `Dashboard` | Dashboard screen |
| `Loan Form` | Loan application screen |
| `KYC` | KYC screen |
| `Bank Verification` | Bank verification screen |
| `Loan Offer` | Loan details screen |
| `Sign Agreement` | Sign agreement screen |


 
## Customizations

1. The privacy policy URL needs to be updated to the company policy. The default privacy policy is pointing to FinBox privacy. Add a String resource to specify the policy URL.

```xml
<string name="finbox_lending_privacy_policy_url">https://finbox.in/about/privacy</string>
```

::: tip Note
Make sure the value passed is a valid URL
:::

2. The toolbar title can be updated which will be visible in the Dashboard module. In order to update the toolbar just add a String resource for the same.

```xml
<string name="finbox_appbar_title">My App</string>
```

3. SDK fonts can be customised to match the parent application. The SDK used 3 main fonts as mentioned below:

```xml
<style name="FBLendingAppTheme.FinBox.TextPrimary" parent="TextAppearance.AppCompat">
    <item name="fontFamily">bold-font</item>
</style>

<style name="FBLendingAppTheme.FinBox.TextSecondary" parent="TextAppearance.AppCompat">
    <item name="fontFamily">regular-font</item>
</style>

<style name="FBLendingAppTheme.FinBox.TextSubHead" parent="TextAppearance.AppCompat">
    <item name="fontFamily">semibold-font</item>
</style>
```

- `FBLendingAppTheme.FinBox.TextPrimary` is used for all buttons and bold headers
- `FBLendingAppTheme.FinBox.TextSecondary` is the regular font that is used for regular text
- `FBLendingAppTheme.FinBox.TextSubHead` is the medium bold font that is used for Sections or subheadings

Customize the SDK font by adding the application `fontFamily` in the styles.

4. SDK Buttons can be customized by overriding `FBLendingAppTheme`

```xml
<style name="FBLendingAppTheme.FinBox.Button" parent="Widget.MaterialComponents.Button">
    <item name="cornerRadius">16dp</item>
    <item name="fontFamily">button-font</item>
</style>

<style name="FBLendingAppTheme.FinBox.TextButton" parent="Widget.MaterialComponents.Button.TextButton"></style>
```

Change button corner radius and text font as per your application theme.