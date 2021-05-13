# FinBox Lending: Flutter

FinBox Lending SDK is a drop-in module that can add a digital lending journey to any mobile application.

## Setting up the SDK

1. FinBox Lending SDK requires a `minSdkVersion` of **21**
2. Add the repository url in the project `build.gradle` file
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
3. Add the Lending SDK dependency in the app `build.gradle` file

   ```groovy
    implementation ("in.finbox.lending:onboarding:<LENDING_SDK_VERSION>:release@aar") {
        exclude group: 'in.finbox', module: 'mobileriskmanager'
        exclude group: 'in.finbox', module: 'common'
        exclude group: 'in.finbox', module: 'logger'
        transitive = true
    }
    implementation ("in.finbox.lending:preloan:<LENDING_SDK_VERSION>:release@aar") {
        exclude group: 'in.finbox.lending', module: 'core'
        transitive = true
    }
    implementation ("in.finbox.lending:dashboard:<LENDING_SDK_VERSION>:release@aar") {
        exclude group: 'in.finbox.lending', module: 'core'
        transitive = true
    }
    implementation ("in.finbox.lending:kyc:<LENDING_SDK_VERSION>:release@aar") {
        exclude group: 'in.finbox.lending', module: 'core'
        transitive = true
    }
    implementation ("in.finbox.lending:loan:<LENDING_SDK_VERSION>:release@aar") {
        exclude group: 'in.finbox.lending', module: 'core'
        transitive = true
    }
    implementation ("in.finbox.lending:esign:<LENDING_SDK_VERSION>:release@aar") {
        exclude group: 'in.finbox.lending', module: 'core'
        transitive = true
    }
    implementation ("in.finbox.lending:enach:<LENDING_SDK_VERSION>:release@aar") {
        exclude group: 'in.finbox.lending', module: 'core'
        transitive = true
    }
    implementation ("in.finbox.lending:payment:<LENDING_SDK_VERSION>:release@aar") {
        exclude group: 'in.finbox.lending', module: 'core'
        transitive = true
    }
    implementation ("in.finbox.lending:bankconnect:<LENDING_SDK_VERSION>:release@aar") {
        exclude group: 'in.finbox.lending', module: 'core'
        exclude group: 'in.finbox', module: 'bankconnect'
        transitive = true
    }
    implementation ("in.finbox.lending:pennydrop:<LENDING_SDK_VERSION>:release@aar") {
        exclude group: 'in.finbox.lending', module: 'core'
        transitive = true
    }
    implementation ("in.finbox.lending:gst:<LENDING_SDK_VERSION>:release@aar") {
        exclude group: 'in.finbox.lending', module: 'core'
        transitive = true
    }
    implementation ("in.finbox.lending:videokyc:<LENDING_SDK_VERSION>:release@aar") {
        exclude group: 'in.finbox.lending', module: 'core'
        transitive = true
    }
    implementation ("in.finbox.lending:core:<LENDING_SDK_VERSION>:release@aar") {
        transitive = true
    }
    implementation('in.finbox:mobileriskmanager:<RISK_SDK_VERSION>:parent-release@aar') {
        transitive = true
    }
    implementation("in.finbox:common:0.4.2:release@aar") {
        transitive = true
    }
    implementation("in.finbox:logger:0.4.0:release@aar") {
        transitive = true
    }
    implementation('in.finbox:bankconnect:1.5.39:release@aar') {
        transitive = true
    }
   ```

4. SDK requires java 8 version for project, add next lines to your module's build.gradle file

```groovy
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
```

::: tip Note
Lending SDK needs `SMS` and `Location` permission as mandatory. Make sure you **dont** have any node markers that remove these permissions in your manifest file

Manifest **should not** have any of the following
```xml
<uses-permission
    android:name="android.permission.RECEIVE_SMS"
    tools:node="remove" />
<uses-permission
    android:name="android.permission.READ_SMS"
    tools:node="remove" />
<uses-permission
    android:name="android.permission.ACCESS_COARSE_LOCATION"
    tools:node="remove" />
<uses-permission
    android:name="android.permission.ACCESS_FINE_LOCATION"
    tools:node="remove" />
```
:::

:::warning ProGuard
While generating a signed application, make sure **ProGuard** file uses `proguard-android.txt` **not** `proguard-android-optimize.txt`, i.e. make sure it is:
```groovy
proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
```
:::

## Start SDK flow

Once all dependencies are added, SDK requires 3 inputs: `CUSTOMER_ID`, `USER_TOKEN` and `CLIENT_API_KEY`.
`ENVIRONMENT` is an optional field. Default value of environment is UAT.

::: tip Note
`USER_TOKEN` needs to be generated against a `CUSTOMER_ID` on backend before starting the SDK. Refer [here](/middleware/sourcing-rest-api.html#generate-token)

`ENVIRONMENT` needs to be updated to `PROD` when migrating application to production.
:::

Now that all required parameters are available, we can start the SDK flow as follows:

1. Invoke MethodChannel for communicate between Flutter and Android Module.

```flutter
static const platform = const MethodChannel('in.finbox.lending/middleware');

Future _loadLending() async {
    try {
      await platform.invokeMethod('launchMiddleware', <String, dynamic>{
        'customer_id': customerId,
        'api_key': apiKey,
        'token': token,
        'env': environment
      }).then((result) {
        print("Result -> " + result);
      });
    } on PlatformException catch (e) {
      print(e.message);
    }
  }
```

2. FinBoxLending requires `CoreApp` in your Application class of Android module.

<CodeSwitcher :languages="{kotlin:'Kotlin',java:'Java'}">

<template v-slot:kotlin>

```kotlin
CoreApp.initDi(this)
```
</template>

<template v-slot:java>
```java
CoreApp.Companion.initDi(context);
```
</template>

</CodeSwitcher>

Once Application class gets created, you can add that class in AndroidManifest.xml along with **tools:replace="android:label"**.
```xml
 <application
       android:name="ApplicationClass"
       android:label="Name Of Your app"
       android:icon="@mipmap/ic_launcher"
       tools:replace="android:label">
    
    ---
    ---
    ---

</application>
```

3. Get invoked MethodChannel in your FlutterActivity

<CodeSwitcher :languages="{kotlin:'Kotlin',java:'Java'}">
<template v-slot:kotlin>

```kotlin
private val CHANNEL = "in.finbox.lending/middleware"
private var callback: MethodChannel.Result? = null
private val REQUEST_CODE_ONBOARDING = 101

GeneratedPluginRegistrant.registerWith(flutterEngine!!)
MethodChannel(flutterEngine?.dartExecutor, CHANNEL)
            .setMethodCallHandler { methodCall, result ->
                methodCall.method?.let {
                    if (it.contentEquals("launchMiddleware")) {
                        Log.d("Sanoop", "Arguments -> ${methodCall.arguments}")
                        val builder = FinBoxLending.Builder(this)
                            .setLendingEnvironment(methodCall.argument("env")!!)
                            .setFinBoxApiKey(methodCall.argument("api_key")!!)
                            .setCustomerId(methodCall.argument("customer_id")!!)
                            .setUserToken(methodCall.argument("token")!!)
                            .build()
                        startActivityForResult(
                            builder.getLendingIntent(this),
                            123
                        )
                    }
                }
            }
```

</template>
<template v-slot:java>

```java
private String CHANNEL = "in.finbox.lending/middleware";
private MethodChannel.Result callback = null;
private int REQUEST_CODE_ONBOARDING = 101;

GeneratedPluginRegistrant.registerWith(Objects.requireNonNull(getFlutterEngine()));
new MethodChannel(getFlutterEngine().getDartExecutor(), CHANNEL)
                .setMethodCallHandler((call, result) -> {
                    if (call.method != null) {
                        if (call.method.contentEquals("launchMiddleware")) {
                            FinBoxLending builder = null;
                            try {
                                builder = new FinBoxLending.Builder(this)
                                        .setLendingEnvironment(Objects.requireNonNull(call.argument("env")))
                                        .setCustomerId(Objects.requireNonNull(call.argument("customer_id")))
                                        .setFinBoxApiKey(Objects.requireNonNull(call.argument("api_key")))
                                        .setUserToken(Objects.requireNonNull(call.argument("token")))
                                        .build();
                            } catch (Exception e) {
                                e.printStackTrace();
                            }

                            if (builder != null) {
                                startActivityForResult(
                                        builder.getLendingIntent(getContext()),
                                        REQUEST_CODE_ONBOARDING
                                );
                            }
                        }
                    }
                });
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

private val CHANNEL = "in.finbox.lending/middleware"
private var callback: MethodChannel.Result? = null
private val REQUEST_CODE_ONBOARDING = 101

GeneratedPluginRegistrant.registerWith(flutterEngine!!)
MethodChannel(flutterEngine?.dartExecutor, CHANNEL)
            .setMethodCallHandler { methodCall, result ->
                methodCall.method?.let {
                    if (it.contentEquals("launchMiddleware")) {
                        Log.d("Sanoop", "Arguments -> ${methodCall.arguments}")
                        val builder = FinBoxLending.Builder(this)
                            .setLendingEnvironment(methodCall.argument("env")!!)
                            .setFinBoxApiKey(methodCall.argument("api_key")!!)
                            .setCustomerId(methodCall.argument("customer_id")!!)
                            .setUserToken(methodCall.argument("token")!!)
                            .setCreditLineAmount(methodCall.argument("transaction_amount")!!)
                            .setCreditLineTransactionId(methodCall.argument("transaction_id")!!)
                            .build()
                        startActivityForResult(
                            builder.getLendingIntent(this),
                            123
                        )
                    }
                }
            }
```

</template>
<template v-slot:java>

```java
private String CHANNEL = "in.finbox.lending/middleware";
private MethodChannel.Result callback = null;
private int REQUEST_CODE_ONBOARDING = 101;

GeneratedPluginRegistrant.registerWith(Objects.requireNonNull(getFlutterEngine()));
new MethodChannel(getFlutterEngine().getDartExecutor(), CHANNEL)
                .setMethodCallHandler((call, result) -> {
                    if (call.method != null) {
                        if (call.method.contentEquals("launchMiddleware")) {
                            FinBoxLending builder = null;
                            try {
                                builder = new FinBoxLending.Builder(this)
                                        .setLendingEnvironment(Objects.requireNonNull(call.argument("env")))
                                        .setCustomerId(Objects.requireNonNull(call.argument("customer_id")))
                                        .setFinBoxApiKey(Objects.requireNonNull(call.argument("api_key")))
                                        .setUserToken(Objects.requireNonNull(call.argument("token")))
                                        .setCreditLineAmount(Objects.requireNonNull(call.argument("creditline_amount")))
                                        .setCreditLineTransactionId(Objects.requireNonNull(call.argument("creditline_transaction_id")))
                                        .build();
                            } catch (Exception e) {
                                e.printStackTrace();
                            }

                            if (builder != null) {
                                startActivityForResult(
                                        builder.getLendingIntent(getContext()),
                                        REQUEST_CODE_ONBOARDING
                                );
                            }
                        }
                    }
                });

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
    data?.let {
        val result = data.extras?.getParcelable<FinBoxJourneyResult>(FINBOX_JOURNEY_RESULT)
        if (result?.resultCode == FINBOX_RESULT_CODE_SUCCESS) {
                callback?.success(result.message)
        } else if (result?.resultCode == FINBOX_RESULT_CODE_ERROR) {
            callback?.error(FINBOX_RESULT_CODE_ERROR, result.message, result.screen)
        } else if (result?.resultCode == FINBOX_RESULT_CODE_FAILURE) {
            callback?.error(FINBOX_RESULT_CODE_FAILURE, result.message, result.screen)
        }
        result?.message?.let { it1 -> showToast(it1) }
        Log.i("Sanoop", "Message -> ${result?.message}, Screen ${result?.screen}")
    }
}
```

</template>
<template v-slot:java>

```java
@Override
public void onActivityResult(int requestCode, int resultCode, Intent data) {
   super.onActivityResult(requestCode, resultCode, data);
   if (data != null) {
       FinBoxJourneyResult result = data.getExtras().getParcelable(ConstantKt.FINBOX_JOURNEY_RESULT);
       if (result.getResultCode().equals(ConstantKt.FINBOX_RESULT_CODE_SUCCESS)) {
           callback.success(result.getMessage());
       } else if (result.getResultCode().equals(ConstantKt.FINBOX_RESULT_CODE_ERROR)) {
           callback.error(ConstantKt.FINBOX_RESULT_CODE_ERROR, result.getMessage(), result.getScreen());
       } else if (result.getResultCode().equals(ConstantKt.FINBOX_RESULT_CODE_FAILURE)) {
           callback.error(ConstantKt.FINBOX_RESULT_CODE_FAILURE, result.getMessage(), result.getScreen());
       }
       if (result.getMessage() != null) {
           Toast.makeText(this, result.getMessage(), Toast.LENGTH_SHORT).show();
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