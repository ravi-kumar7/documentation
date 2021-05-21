# BankConnect: React Client SDK
The React Client SDK helps user submit their bank statements via upload or net banking credentials in your React application.

## See in action
The demo video below shows how a user submit bank statement using net banking credentials:
<div class="embed-container">
<iframe src="https://www.youtube.com/embed/lynnwojp0vA?rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

The video below shows a user submit bank statement by uploading the PDF file:
<div class="embed-container">
<iframe src="https://www.youtube.com/embed/ZUGDZqico2o?rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Integration Workflow
The diagram below illustrates the integration workflow in a nutshell:
<img src="/client_sdk.jpg" alt="Client SDK Workflow" />

## Sample Project
We have hosted a sample project on GitHub, you can check it out here:
<div class="button_holder">
<a class="download_button" target="_blank" href="https://github.com/finbox-in/bankconnect-react">Open GitHub Repository</a>
</div>

## Including the library
The library is available as an npm package. To install the dependency 

<CodeSwitcher :languages="{npm:'npm',yarn:'yarn'}">
<template v-slot:npm>

```sh
npm install finbox-bank-connect-js
```

</template>
<template v-slot:yarn>

```sh
yarn add finbox-bank-connect-js
```

</template>
</CodeSwitcher>

After installing this, you have to install an additional dependency, you can skip this if its already part of your project:

<CodeSwitcher :languages="{npm:'npm',yarn:'yarn'}">
<template v-slot:npm>

```sh
npm install styled-components
```

</template>
<template v-slot:yarn>

```sh
yarn add styled-components
```

</template>
</CodeSwitcher>

## Adding the BankConnect Component

Once the dependency is added. You can use a BankConnect view anywhere in your component. Since the SDK opens a modal it is recommended to add it to the top hierarchy of you View.

```js
<FinBoxBankConnect
    linkId="<LINK_ID>"
    apiKey="<FINBOX_API_KEY>"
    onExit="<EXIT_CALLBACK>"
    onSuccess="<UPLOAD_SUCCESS_CALLBACK>" />
```

| Attribute | Description | Required |
| - | - | - |
| `linkId` | unique identifier for the user. The view will not work if `linkId` is not specified | Yes |
| `apiKey` | holds the unique [API Key](/bank-connect/#getting-api-keys) provided. | Yes |
| `onExit` | specifies the callback when the user exits the SDK | No, but recommended |
| `onSuccess`| specifies the callback when the document has been successfully uploaded. | No, but recommended |
| `onError`| specifies the callback when an error occurred | No, but recommended |
| `fromDate` and `toDate` | specifies the time period for which the statements will be fetched. If not provided the default date range is 6 months from the current date. Its format should be in `dd/MM/yyyy`. | No |
| `bankName` | pass the [bank identifier](/bank-connect/appendix.html#bank-identifiers) to skip the bank selection screen and directly open a that bank's screen instead | No |

`fromDate` and `toDate` specify the period for which the statements will be fetched. For example, if you need the last 6 months of statements, `fromDate` will be today's date - 6 months and `toDate` will be today's date - 1 day. If not provided the default date range is 6 months from the current date. It should be in `dd/MM/yyyy` format.

::: warning Period Values
- Please make sure `fromDate` is always less than `toDate`
- Make sure `toDate` is never today's date, the maximum possible value for it is today's date - 1 day
:::

## Callback
This section lists the different callbacks:

### Success
`onSuccess` function will be called when the document has been successfully uploaded.

```js
const onSuccess = (payload) => {
    console.log("Payload", payload)
}
```

`payload` object will have following structure:
```json
{
    "entityId": "1d1f-sfdrf-17hf-asda",
    "linkId": "link_id"
}
```
| Key | Description |
| - | - |
| `entityId` | Unique identifier used for fetching statement data |
| `linkId` | Identifier passed while initializing the SDK |

### Exit
`OnExit` function will be called when the user exits the SDK.

```js
const onExit = (payload) => {
    console.log("Payload", payload)
}
```

`payload` object will have following structure:
```json
{
    "linkId": "link_id"
}
```
| Key | Description |
| - | - |
| `linkId` | Identifier passed while initializing the SDK |

### Error
`OnError` function will be called whenever any error occurs in the user flow.

```js
const onError = (payload) => {
    console.log("Payload", payload)
}
```

`payload` object will have following structure:
```json
{
    "linkId": "link_id",
    "error_type": "MUXXX",
    "reason": "Reason for failure"
}
```
| Key | Description |
| - | - |
| `linkId` | Identifier passed while initializing the SDK |
| `reason` | Reason for failure |


:::warning Webhook
To track additional errors, and transaction process completion at the server-side, it is recommended to also integrate [Webhook](/bank-connect/webhook.html).
:::

##### Error types
In case of Error, error_type of  ```MUXXX``` implies an error in Manual PDF Upload and ```NBXXX``` implies its from Netbanking.

| Case | error_type | Sample payload|
| - |  - | - |
| Trial Expired for Dev Credentials  | MU002 | ```{"reason:"Trial Expired for Dev Credentials",linkID:"<USER_ID_PASSED>","error_type":"MU002"}```| 
| PDF Password Incorrect | MU003 | ```{"reason:"Password Incorrect",linkID:"<USER_ID_PASSED>","error_type":"MU003"}```|
| Specified bank doesn't match with detected bank | MU004 | ```{"reason:"Not axis statement",linkID:"<USER_ID_PASSED>","error_type":"MU004"}```|
| Non Parsable PDF - PDF file is corrupted or has no selectable text (only scanned images)| MU006 | ```{"reason:"",linkID:"<USER_ID_PASSED>","error_type":"MU006"}```|
| Not a valid statement or bank is not supported | MU020 | ```{"reason:"Not a valid statement or bank is not supported",linkID:"<USER_ID_PASSED>","error_type":"MU020"}```|
| Invalid Date Range | MU021 | ```{"reason:"Please upload statements within the date range fromDate to toDate",linkID:"<USER_ID_PASSED>","error_type":"MU021"}```|
| NetBanking Failed| NB000 | ```{"reason:"failure_message",linkID:"<USER_ID_PASSED>","error_type":"NB000"}```|
| Netbanking Login Error | NB003 | ```{"reason:"failure_message",linkID:"<USER_ID_PASSED>","error_type":"NB003"}```|
| Captcha Error | NB004 | ```{"reason:"Invalid Captcha",linkID:"<USER_ID_PASSED>","error_type":"NB004"}```|
| Security Error | NB005 | ```{"reason:"failure_message",linkID:"<USER_ID_PASSED>","error_type":"NB005"}```|

## Events
Android and JS events are passed which can used for purposes such as analytics.The object passed is of the following format.
```json
{
    "status":"<EVENT_NAME>",
    "data":"EXTRA_INFO"
}
```

| Event | status | data|
| - |  - | - |
|Bank selected|bank_selected|`<BANK NAME>`|
|Manual upload screen opened|open_manual_upload|-|
|Clicked back in Manual Upload|manual_upload_back|-|
|Clicked back in Netbanking|net_banking_back|-|


Above Events can be recieved in two ways

1. Listen to window postMessage via `target.addEventListener("message", (event) =>{});`
   

2. In case the SDK is used in a Android WebView. A [Javascript Interface](https://developer.android.com/guide/webapps/webview#UsingJavaScript) can be used to get the events.
- Interface Name: `BankConnectAndroid`
- Callback Function: `onResult`.
