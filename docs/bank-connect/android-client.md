# BankConnect: Android Client SDK
The Android Client SDK helps user submits their bank statements via upload or net banking credentials in your Android application.

## See in action
The demo video below shows how a user submit a bank statement using net banking credentials:
<div class="embed-container">
<iframe src="https://www.youtube.com/embed/SvRV5BX1gSo?rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

The video below shows a user submit bank statement by uploading the PDF file:
<div class="embed-container">
<iframe src="https://www.youtube.com/embed/hxG9H9_iX8E?rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Adding Dependency
First, add the maven dependency to your project-level Gradle file:
```groovy  
maven { url  "https://dl.bintray.com/finbox/BankConnect" }  
```

Then add the following dependency to your Gradle file:  
```groovy  
implementation 'in.finbox.bankconnect:bankconnect:1.0.8'  
```

## Integration Workflow
The diagram below illustrates the integration workflow in a nutshell:
<img src="/client_sdk.jpg" alt="Client SDK Workflow" />

## Sample Project
We have hosted a sample project on GitHub, you can check it out here:
<div class="button_holder">
<a class="download_button" target="_blank" href="https://github.com/finbox-in/bankconnect-android">Open GitHub Repository</a>
</div>

## Authentication
The unique [API Key](/bank-connect/#getting-api-keys) provided needs to be added to the `AndroidManifest.xml` using a `meta-data` tag:
```xml
<meta-data
    android:name="in.finbox.KEY_BANK_CONNECT"
    android:value="<YOUR API KEY>" />
```

## Showing SDK Screen 

In order to show SDK Screen, all you have to do is add the `FinboxBankConnectView` to your layout file.  
  
```xml  
<in.finbox.bankconnect.baseui.FinboxBankConnectView  
    android:id="@+id/bankConnect"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
 ```  
 
In order to initialize the view, following statement is mandatory:

<CodeSwitcher :languages="{kotlin:'Kotlin',java:'Java'}">
<template v-slot:kotlin>

```kotlin
bankConnect = findViewById(R.id.bankConnect)
FinBoxBankConnect.Builder(applicationContext, bankConnect)  
    .linkId("link_id")
    .fromDate("01/01/2020") // Optional: Default 3 months old date
    .toDate("01/04/2020") // Optional: Default value 1 day less than current date
    .bank("sbi") // Optional
    .build()
```

</template>
<template v-slot:java>

```java
FinboxBankConnectView bankConnect = findViewById(R.id.bankConnect);
new FinBoxBankConnect.Builder(getApplicationContext(), bankConnect)
        .linkId("link_id")
        .fromDate("01/01/2020") // Optional: Default 3 months old date
        .toDate("01/04/2020") // Optional: Default value 1 day less than current date
        .bank("sbi") // Optional
        .build();
```

</template>
</CodeSwitcher>

| Builder Property | Description | Required |
| - | - | - |
| `linkId` | specifies the `link_id` | Yes |
| `fromDate` and `toDate` | specifies the period for which the statements will be fetched in `dd/MM/yyyy` format | No |
| `bank` | pass the [bank identifier](/bank-connect/appendix.html#bank-identifiers) to skip the bank selection screen and directly open a that bank's screen instead | No |

`fromDate` and `toDate` specify the period for which the statements will be fetched. For example, if you need the last 6 months of statements, `fromDate` will be today's date - 6 months and `toDate` will be today's date - 1 day. If not provided the default date range is 3 months from the current date. It should be in `dd/MM/yyyy` format.

Once the above statement is added, a series of checks are done to make sure the SDK is implemented correctly. A `RunTimeException` will be thrown while trying to build the project in case any of the checks are not completed.

::: warning Minimal Requirements for SDK to work:
1. `linkId` is mandatory, and should be at least 8 characters long
2. API Key should be present in the manifest
3. In case `fromDate` / `toDate` is provided, make sure they are of correct date format: `dd/MM/yyyy`.
4. Make sure `fromDate` is always less than `toDate`
5. Make sure `toDate` is never today's date, the maximum possible value for it is today's date - 1 day
Once all these conditions are met, the BankConnect view will be visible to the user.
:::

## Live Data and Callbacks
As the user interacts, callbacks can be received in real-time using `getPayloadLiveData()`.  

FinBox BankConnect uses life cycle aware live data to provide real time callbacks. You need to do the following steps to listen for events: 

<CodeSwitcher :languages="{kotlin:'Kotlin',java:'Java'}">
<template v-slot:kotlin>

```kotlin
bankConnect.getPayloadLiveData().observe(this, Observer {
    when (it) {
        is FinboxResult.OnExit -> {
            Log.i("BankConnect", "On Exit -> ${it.exitPayload}")
        }
        is FinboxResult.OnSuccess -> {
            Log.i("BankConnect", "On Success -> ${it.onSuccess}")
        }
        is FinboxResult.OnError -> {
            Log.i("BankConnect", "On Error -> ${it.onError}")
        }
    }
}) 
```

</template>
<template v-slot:java>

```java
bankConnect.getPayloadLiveData().observe(this, new Observer < FinboxResult > () {
    @Override public void onChanged(@Nullable FinboxResult finboxResult) {
        if (finboxResult != null) {
            if (finboxResult instanceof FinboxResult.OnExit) {
                FinboxOnExitPayload payload = ((FinboxResult.OnExit) finboxResult).getExitPayload();
                Log.i(TAG, "Exit payload " + payload);
            } else if (finboxResult instanceof FinboxResult.OnSuccess) {
                FinboxSuccessPayload payload = ((FinboxResult.OnSuccess) finboxResult).getSuccessPayload();
                Log.i(TAG, "Success payload " + payload);
            } else if (finboxResult instanceof FinboxResult.OnError) {
                FinboxOnErrorPayload payload = ((FinboxResult.OnError) finboxResult).getErrorPayload();
                Log.i(TAG, "Error payload " + payload);
            }
        }
    }
});
```

</template>
</CodeSwitcher>

## Events
This section list the events in detail:

### Success
`FinboxResult.OnSuccess` will be called when the user completes the upload process. It will have a payload structure is as follows:  

```json  
{
    "entityId": "uuid4_for_entity",
    "linkId": "your_link_id",
    "statementId": "uuid4_for_statement"
}  
```

### Exit
`FinboxResult.OnExit` will be called when the user exits the flow by selecting the cross icon and accepting to close the flow. It will have a payload structure is as follows:  

Its payload structure is as follows:
```json  
{
    "linkId" : "your_link_id"
}  
```

### Error
`FinboxResult.OnError` will be called whenever any error occurs in the user flow. It will have a payload structure is as follows:  
```json  
{
    "linkId" : "your_link_id",
    "message" : "Error message."
}  
```

:::warning Two Events
In case an error occurs, you'll receive `OnError` event payload, and then if the user exits the SDK, you'll receive another event payload, this time for `OnExit`.
:::

:::warning Webhook
To track additional errors, and transaction process completion at the server-side, it is recommended to also integrate [Webhook](/bank-connect/webhook.html).
:::

## Customization
Since FinBox BankConnect is a view embedded in your application, in order to make it look compatible there are certain view level customization that can be done in the `styles.xml` file.

1. Button color. View uses `accentColor` for all button colors
	```xml
	<style name="FinBoxButton"  parent="Button.FinBox">
	  <item name="backgroundColor">@color/colorAccent</item>
	</style>
	```
	Button style can be modified here as per application.
2. Theme: `light` and `dark` 
	```xml
	<style name="FinBoxView" parent="Theme.FinBox">
	  <item name="backgroundColor">@color/colorAccent</item>
	</style>	
	```
