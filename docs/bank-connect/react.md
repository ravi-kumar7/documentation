# Bank Connect: React JS SDK
This **SDK** helps users to upload bank statements.
<p style="text-align:center">
<img src="/bc_js.gif" alt="Animated Demo" />
</p>
It includes two methods to upload the file:

- **Using Net Banking:** In this method user only need to enter the credentials of Net Banking to upload their bank statement. The server will automatically download and then upload the pdf.

- **Uploading Manually:** In this method users are required to manually upload the pdf of the bank statement.

:::tip Fetching Transactions
The client SDK will give you an `entity_id` after successful statement upload. This can be used with any of the libraries or REST API to fetch extracted and enriched data like identity, salary, lender, recurring transactions, etc.
:::

## Including the library
The library is available as a npm package. To install the dependency 

```sh
npm install finbox-bank-connect-js
```
Once the dependency is added. You can use bank connect view anywhere in your component. Since the SDK opens a modal it is recommemnded to add it to top heirarchy of you View.

```js
<FinBoxBankConnect
    linkId="<Enter random linkid>"
    apiKey="<FINBOX_API_KEY>"
    onExit="<EXIT_CALLBACK>"
    onSuccess="<UPLOAD_SUCCESS_CALLBACK>" />}
```


`linkId` attribute is a unique identifier for the user. This is mandatory and the view will not work if linkId is not specified

`apiKey` attribute should hold the unique API Key provided.

`onExit` attribute gives callback when user exits the SDK

`onSuccess` attribute gives callback when document has been successfully uploaded.

`fromDate` & `toDate` attributes will be used to fetch statement for the given time period.

::: danger Additional layer of security
FinBox Bank Connect supports an additional layer of security (timestamp and access token based) on request. But is as of now available only for REST APIs. If it is enabled for your organization, this library won't be able to authenticate as it currently supports only the API Key based authentication method.
:::

::: warning Period Values
Please make sure from date is always less than to date. 
:::

## Callback
Additional callbacks are provided via web hooks. Success and error payload will be available in these callbacks.