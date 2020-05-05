# Bank Connect: Android Client SDK
This **SDK** helps users to upload bank statements.
<p style="text-align:center">
<img src="/bc_android.gif" alt="Animated Demo" />
</p>
It includes two methods to upload the file:

- **Using Net Banking:** In this method user only need to enter the credentials of Net Banking to upload their bank statement. The server will automatically download and then upload the pdf.

- **Uploading Manually:** In this method users are required to manually upload the pdf of the bank statement.

:::tip Fetching Transactions
The client SDK will give you an `entity_id` after successful statement upload. This can be used with any of the libraries or REST API to fetch extracted and enriched data like identity, salary, lender, recurring transactions, etc.
:::

## Adding Dependency
- First add the maven dependency to your project level `gradle` file:
```groovy  
maven { url  "https://dl.bintray.com/finbox/BankConnect" }  
```

- Then add the following dependency to your `gradle` file:  
```groovy  
implementation 'in.finbox.bankconnect:bankconnect:1.0.8'  
```

## Authentication
The unique API Key provided needs to be added to the `AndroidManifest.xml` using a `meta-data` tag:
```xml
<meta-data
    android:name="in.finbox.KEY_BANK_CONNECT"
    android:value="<YOUR API KEY>" />
```

::: danger Additional layer of security
FinBox Bank Connect supports an additional layer of security (timestamp and access token based) on request. But is as of now available only for REST APIs. If it is enabled for your organization, this library won't be able to authenticate as it currently supports only the API Key based authentication method.
:::
  
## Initialize the SDK  
  
In your application class initialize FinBox Bank Connect SDK as follows:
```kotlin
FinboxBankConnect.init(this);
```

## Showing Upload Screen 

In order to start showing the Upload screens all you have to do is add the `FinboxBankConnectView` to your layout file.  
  
```xml  
<in.finbox.bankconnect.baseui.FinboxBankConnectView  
    android:id="@+id/bankConnect"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
 ```  
 
 In order to initialize the view and the SDK following statement is mandatory.
```kotlin
bankConnect = findViewById(R.id.bankConnect)
FinBoxBankConnect.Builder(applicationContext, bankConnect)  
    .linkId(UUID.randomUUID().toString())
    .fromDate("01/01/2020") //Optional: Default 3 months old date
    .toDate("01/04/2020") //Optional: Default value 1 day less than current date
    .bank("sbi") //Optional
    .build()
```
Once this is added a series of checks are done to make sure the SDK is implemented correctly. A `RunTimeException` will be thrown while trying to build the project in case any of the checks are not completed.
::: warning NOTE
Following are the minimal requirement for the SDK to get integrated.
1. LinkId is mandatory. And should be at least 8 character long
2. API Key should be present in the manifest
3. In case fromDate/toDate is provided. Make sure they are of correct date format. FinBox requires date to be passed as `dd/MM/yyyy`
:::

Once all these conditions are met  the bank connect view will be visible to the user. Callbacks can be received in real time as the user interacts using `LiveData`.  

::: warning Period Values
Please make sure from date is always less than to date, and is set either in xml or in runtime. There is no default value for the periods if not specified.
:::

## Live Data and Callbacks
As the user interacts, callbacks can be received in real time using `getPayloadLiveData()`.  

FinBox Bank Connect uses life cycle aware live data to provide real time callbacks. You need to do the following steps to listen for events: 

In Kotlin:
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

In Java:
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

## Events

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
