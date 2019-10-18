# JavaScript Client
This **SDK** helps users to upload bank statements. It includes two methods to upload the file:
- **Using Net Banking:** In this method user only need to enter the credentials of Net Banking to upload their bank statement. The server will automatically download and then upload the pdf.
::: warning NOTE
Currently only five banks: **HDFC, Axis, SBI, Kotak** and **ICICI** are supported in this method.  
:::
- **Uploading Manually:** In this method users are required to manually upload the pdf of the bank statement.

:::tip Fetching Transactions
The client SDK will give you an `entity_id` after successful statement upload. This can be used with any of the libraries or REST API to fetch extracted and enriched data like identity, salary, lender, recurring transactions, etc.
:::

## Including the library
You need to to include the FinBox Bank Connect JavaScript client library using the `<script>` tag in your HTML page.

```html
<script type="text/javascript" 
            src="https://s3.ap-south-1.amazonaws.com/finboximages/JS/bankuploader.js" 
            finbox-api-key="<FINBOX-API-KEY>"
            finbox-uploadType="<UPLOAD-TYPE>" 
            finbox-date-from='<dd/MM/yyyy>' 
            finbox-date-to='<dd/MM/yyyy>'>
</script>
```
`src` attribute specifies the URL to the client library js file

`finbox-api-key` attribute should hold the unique API Key provided

::: danger Additional layer of security
FinBox Bank Connect supports an additional layer of security (timestamp and access token based) on request. But is as of now available only for REST APIs. If it is enabled for your organization, this library won't be able to authenticate as it currently supports only the API Key based authentication method.
:::

`finbox-uploadType` attribute specifies the upload type mode, it can have following three values
- `netbanking`: Net Banking input only
- `manual`: Manual PDF upload only
- `both`: Ask user to choose from Net Banking or Manual PDF upload

`finbox-date-from` attribute holds the date from which you want the statement to be collected. This attribute is **optional** and if not specified, is set to date 6 months back from current date. If specified it accepts the value in **dd/MM/yyyy** format. 

`finbox-date-to` attribute holds the date till which you want the statement to be collected. This attribute is **optional** and if not specified, is set to current date. If specified it accepts the value in **dd/MM/yyyy** format.

::: warning Period Values
Please make sure from date is always less than to date. 
:::

## Showing Upload Screen
Add the `<div>` tag below with the `id` as `finbox-bsm-root` to show the upload screen.
```html
<!-- This div will be replaced by the bank connect sdk -->
<div id="finbox-bsm-root"></div> 
```

## Setting Period in Runtime

Values for attribute `finbox-date-from` and `finbox-date-to` can be set in runtime by defining a ``getFinboxDatePeriod()`` function. The SDK will look for a function with this name, and expect a function as follows (in this example it sets period for last 5 months):

```js 
function getFinboxDatePeriod() {
  var today = new Date();
  var dates = {
    to: {},
    from: {}
  }
  dates['to'].dd = String(today.getDate() - 1).padStart(2, 0);
  dates['to'].mm = String(today.getMonth() + 1).padStart(2, 0);
  dates['to'].yyyy = today.getFullYear();
  dates['from'].dd = dates['to'].dd;

  var period = 5;   // change this value to period you want in months
  if (today.getMonth() < period) {
    dates['from'].yyyy = today.getFullYear() - 1;
    dates['from'].mm = String(12 + today.getMonth() - period + 1).padStart(2, 0);
  }
  else {
    dates['from'].yyyy = today.getFullYear();
    dates['from'].mm = String(today.getMonth() - period + 1);
  }
  var from = dates['from'].dd + '/' + dates['from'].mm + '/' + dates['from'].yyyy;
  var to = dates['to'].dd + '/' + dates['to'].mm + '/' + dates['to'].yyyy;
  return { from, to };
}
```

::: warning Period Values
Please make sure from date is always less than to date.
:::


## Callback
You can define a callback function with the name `statementCallback` to receive a callback:
```js
function statementCallback(payload) {
  // payload contains status, request_id, message.
}
```
`payload` in the function above is an **object** that contains the following **properties**:

`status` is the status code returned by the server. It can be:
- `BSM200`: PDF Upload was successful
- `BSM500`: Some error occurred in uploading of the pdf.
- `BSM101`: User exited the statement upload.

`request_id` represents the `entity_id` that can be used to fetch the analyzed result.

`message` is the status message given by the server.