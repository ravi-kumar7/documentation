# Bank Connect: Android Client SDK
The Android Client SDK helps user submit their bank statements via upload or net banking credentials in your Android application.

## See in action
The demo video below shows how a user submit bank statement using net banking credentials:
<p style="text-align:center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/SvRV5BX1gSo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

The video below shows a user submit bank statement by uploading the PDF file:
<p style="text-align:center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/hxG9H9_iX8E" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

## Adding Dependency
First add the maven dependency to your project level `gradle` file:
```groovy  
maven { url  "https://dl.bintray.com/finbox/BankConnect" }  
```

Then add the following dependency to your `gradle` file:  
```groovy  
implementation 'in.finbox.bankconnect:bankconnect:1.0.8'  
```

## Authentication
The unique [API Key](/bank-connect/#getting-api-keys) provided needs to be added to the `AndroidManifest.xml` using a `meta-data` tag:
```xml
<meta-data
    android:name="in.finbox.KEY_BANK_CONNECT"
    android:value="<YOUR API KEY>" />
```
  
## Initialize the SDK  
  
In your application class initialize FinBox Bank Connect SDK as follows:
```kotlin
FinboxBankConnect.init(this);
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
```kotlin
bankConnect = findViewById(R.id.bankConnect)
FinBoxBankConnect.Builder(applicationContext, bankConnect)  
    .linkId("link_id")
    .fromDate("01/01/2020") // Optional: Default 3 months old date
    .toDate("01/04/2020") // Optional: Default value 1 day less than current date
    .bank("sbi") // Optional
    .build()
```

| Builder Property | Description | Required |
| - | - | - |
| `linkId` | specifies the `link_id` | Yes |
| `fromDate` and `toDate` | specifies the time period for which the statements will be fetched. If not provided default date range is 3 months from current date. Its format should be in `dd/MM/yyyy` | No |
| `bank` | enforces a specific bank for the user and stops user from selecting the bank in SDK flow | No |

Once the above statement is added, a series of checks are done to make sure the SDK is implemented correctly. A `RunTimeException` will be thrown while trying to build the project in case any of the checks are not completed.

::: warning Minimal Requirements for SDK to work:
1. `linkId` is mandatory, and should be at least 8 character long
2. API Key should be present in the manifest
3. In case `fromDate` / `toDate` is provided, make sure they are of correct date format: `dd/MM/yyyy`.
4. Make sure `fromDate` is always less than `toDate`
Once all these conditions are met, the bank connect view will be visible to the user.
:::

## Live Data and Callbacks
As the user interacts, callbacks can be received in real time using `getPayloadLiveData()`.  

FinBox Bank Connect uses life cycle aware live data to provide real time callbacks. You need to do the following steps to listen for events: 

<CodeSwitcher :languages="{kotlin:'Kotlin',java:'Java'}">
<template v-slot:kotlin>

```kotlin
bankConnect.getPayloadLiveData().observe(this, Observer {
    when (it) {
        is FinboxResult.OnExit -> {
            Log.i("BankConnect", "On Exit -> ${it.exitPayload}")
        }
        is FinboxResult.OnEntityDestroyed -> {
            Log.i("BankConnect", "On Entity destroyed -> ${it.entityDestroyed}")
        }
        is FinboxResult.OnFinished -> {
            Log.i("BankConnect", "On Finished -> ${it.onFinished}")
        }
        is FinboxResult.OnError -> {
            Log.i("BankConnect", "On Error -> ${it.onError}")
        }
        is FinboxResult.OnUpload -> {
            Log.i("BankConnect", "On Upload -> ${it.uploadPayload}")
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
            } else if (finboxResult instanceof FinboxResult.OnEntityDestroyed) {
                FinboxOnEntityDestroyed payload = ((FinboxResult.OnEntityDestroyed) finboxResult).getEntityDestroyed();
                Log.i(TAG, "On Entity Destroyed payload " + payload);
            } else if (finboxResult instanceof FinboxResult.OnFinished) {
                FinboxOnFinishedPayload payload = ((FinboxResult.OnFinished) finboxResult).getFinishPayload();
                Log.i(TAG, "On Finished payload " + payload);
            } else if (finboxResult instanceof FinboxResult.OnError) {
                FinboxOnErrorPayload payload = ((FinboxResult.OnError) finboxResult).getErrorPayload();
                Log.i(TAG, "Error payload " + payload);
            } else if (finboxResult instanceof FinboxResult.OnUpload) {
                FinboxOnUploadPayload payload = ((FinboxResult.OnUpload) finboxResult).getUploadPayload();
                Log.i(TAG, "Upload payload " + payload);
            }
        }
    }
});
```

</template>
</CodeSwitcher>

## Events
This section list the events in detail:
### `FinboxResult.OnExit`
`FinboxResult.OnExit` will be called when user exits the flow by selecting the cross icon and accepting to close the flow.

The exit payload structure is as follows:
```json  
{
    "entityId" : "uuid4_for_entity",
    "linkId" : "your_link_id",
    "screenName" : "1"
}  
```

The `screenName` field helps in understanding that at what step the user exited the flow.

In case of **manual upload mode**, the `screenName` holds the following meanings:
| `screenName` | Exited on the screen |
| - | - |
| 1 | Bank list screen |
| 2 | PDF upload screen |
| 3 | Upload in process screen |

In case of **internet banking mode**, the `screenName` holds the following meanings:
| `screenName` | Exited on the screen |
| - | - |
| 1 | Bank list screen |
| 2 | Enter credentials screen |
| 3 | Authentication or Upload in process screen |
| 4 | Additional security check screen (captcha / question / OTP) |

### `FinboxResult.OnEntityDestroyed`
`FinboxResult.OnEntityDestroyed` will be called when a user navigates back and selects a different bank.
On entity destroyed will have a payload structure as follows:
```json  
{  
    "entityId" : "uuid4_for_entity",
    "linkId" : "your_link_id"
}  
```

### `FinboxResult.OnError`
`FinboxResult.OnError` will be called whenever any error occurs in the user flow.  
On error will have a payload structure as follows:
```json  
{
    "entityId" : "uuid4_for_entity",
    "linkId" : "your_link_id",
    "message" : "Error message."
}  
```

### `FinboxResult.OnFinished`
`FinboxResult.OnFinished` will be called when user completes the upload process.  
On finished will have a payload structure as follows:  

```json  
{
    "entityId": "uuid4_for_entity",
    "linkId": "your_link_id",
    "statementId": "uuid4_for_statement",
    "progress": ["2019-04, 2019-05"]
}  
```
`progress` field gives the month and year for which the statement was uploaded.

### `FinboxResult.OnUpload`
`FinboxResult.OnUpload` will be called when user uploads a document.  
On upload will have a payload structure as follows:

```json  
{
    "entityId": "uuid4_for_entity",
    "linkId": "your_link_id",
    "statementId": "uuid4_for_statement",
    "isFraudDetected": false,
    "bank": "axis",
    "progress": ["2019-04, 2019-05"]
}  
```

`isFraudDetected` is a boolean field indicating whether a fraud was detected in the statement uploaded (this will be helpful in case of manual upload mode).

`bank` field contains the bank name identifier (click [here](/bank-connect/appendix.html#bank-identifiers) to see the full list).

`progress` field gives the month and year for which the statement was uploaded.

## Customization
Since FinBox BankConnect is a view embedded in your application in order to make it look compatible there are certain view level customization that can be done.

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
