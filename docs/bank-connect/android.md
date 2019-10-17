# Android Client
This **SDK** helps users to upload bank statements. It includes two methods to upload the file:
- **Using Netbanking:** In this method user only need to enter the credentials of Net Banking to upload their bank statement. The server will automatically download and then upload the pdf.
::: warning NOTE
Currently only five banks: **HDFC, Axis, SBI, Kotak** and **ICICI** are supported in this method.  
:::
- **Uploading manually:** In this method users are required to manually upload the pdf of the bank statement.

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
implementation 'in.finbox.bankconnect:bankconnect:1.0.7'  
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
  
In your application class initialize Finbox library as follows:
```kotlin
FinboxBankConnect.init(this);
```

## Showing Upload Screen 

In order to start showing the Upload screens all you have to do is add the `FinboxBankConnectView` to your layout file.  

```xml
<in.finbox.bankconnect.baseui.FinboxBankConnectView
        android:id="@+id/bankConnect"
        app:type="NET_BANKING"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
 ```  
  
`app:type` specifies the type of upload flow that you want to give the user. If user wants to enter his statement manually then pass `app:type="MANUAL"` otherwise `app:type="NET_BANKING"`  
  
This will show the bank connect view to the user.

## Live Data and Callbacks
As the user interacts, callbacks can be received in real time using `getPayloadLiveData()`.  

Finbox Bank Connect uses life cycle aware live data to provide real time callbacks. You need to do the following steps to listen for events:  

```kotlin
bankConnect = findViewById(R.id.bankConnect)
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
bankConnectView.getPayloadLiveData().observe(this, new Observer < FinboxResult > () {
    @Override public void onChanged(@Nullable FinboxResult finboxResult) {
        if (finboxResult != null) {
            if (finboxResult instanceof FinboxResult.OnUpload) {
                FinboxOnUploadPayload payload = ((FinboxResult.OnUpload) finboxResult).getUploadPayload();
                Log.i(TAG, "Upload payload " + payload);
            } else if (finboxResult instanceof FinboxResult.OnError) {
                FinboxOnErrorPayload payload = ((FinboxResult.OnError) finboxResult).getErrorPayload();
                Log.i(TAG, "Error payload " + payload);
            } else if (finboxResult instanceof FinboxResult.OnExit) {
                FinboxOnExitPayload payload = ((FinboxResult.OnExit) finboxResult).getExitPayload();
                Log.i(TAG, "Exit payload " + payload);
            } else if (finboxResult instanceof FinboxResult.OnFinished) {
                FinboxOnFinishedPayload payload = ((FinboxResult.OnFinished) finboxResult).getFinishPayload();
                Log.i(TAG, "OnFinished payload " + payload);
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
| 3 | Processing screen |
| 4 | Additional security check page (captcha / security) |

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