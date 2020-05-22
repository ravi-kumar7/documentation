# Bank Connect: React Client SDK
The React Client SDK helps user submit their bank statements via upload or net banking credentials in your React application.

## See in action
The demo video below shows how a user submit bank statement using net banking credentials:
<div class="embed-container">
<iframe src="https://www.youtube.com/embed/lynnwojp0vA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

The video below shows a user submit bank statement by uploading the PDF file:
<div class="embed-container">
<iframe src="https://www.youtube.com/embed/ZUGDZqico2o" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Including the library
The library is available as a npm package. To install the dependency 

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

## Adding the Bank Connect Component

Once the dependency is added. You can use bank connect view anywhere in your component. Since the SDK opens a modal it is recommended to add it to top hierarchy of you View.

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
| `onExit` | specifies the callback when user exits the SDK | No, but recommended |
| `onSuccess`| specifies the callback when document has been successfully uploaded. | No, but recommended |
| `onError`| specifies the callback when an error occurred | No, but recommended |
| `fromDate` and `toDate` | specifies the time period for which the statements will be fetched. If not provided default date range is 3 months from current date. Its format should be in `dd/MM/yyyy`. | No |
| `bankName` | pass the [bank identifier](/bank-connect/appendix.html#bank-identifiers) to skip the bank selection screen and directly open a that bank's screen instead | No |

`fromDate` and `toDate` specify the time period for which the statements will be fetched. If not provided default date range is 3 months from current date. For example, if you need last 6 months of statements, `fromDate` will be today's date - 6months and `toDate` will be today's date. If not provided default date range is 3 months from current date. It should be in `dd/MM/yyyy` format.

::: warning Period Values
Please make sure `fromDate` is always less than `toDate`.
:::

## Callback
This section lists the different callbacks:

### Success
`onSuccess` function will be called when document has been successfully uploaded.

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
`OnExit` function will be called when user exits the SDK.

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
    "reason": "Reason for failure"
}
```
| Key | Description |
| - | - |
| `linkId` | Identifier passed while initializing the SDK |
| `reason` | Reason for failure |


:::warning Webhook
To track additional errors, and transaction process completion at server side, it is recommended to also integrate [Webhook](/bank-connect/webhook.html).
:::