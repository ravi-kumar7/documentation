---
base_url: https://portal.finbox.in/bank-connect #base URL for the API
version: v1 # version of API
---
# BankConnect: JavaScript Client SDK
The JavaScript Client SDK helps user submit their bank statements via upload or net banking credentials in your Web applications. The SDK will be opened via a web URL.

The first step in integration involves calling the [Session API](/bank-connect/javascript-client.html#session-api)
Then the workflow can be implemented in one of the following ways:
- [Load in a new page with redirect URL](/bank-connect/javascript-client.html#redirect-workflow)
- [Embedding inside an Inline Frame (`<iframe>`)](/bank-connect/javascript-client.html#inline-frame-workflow)

## See in action
The demo video below shows how a user submit bank statement using net banking credentials:
<div class="embed-container">
<iframe src="https://www.youtube.com/embed/lynnwojp0vA?rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

The video below shows a user submit bank statement by uploading the PDF file:
<div class="embed-container">
<iframe src="https://www.youtube.com/embed/ZUGDZqico2o?rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Session API
To start with the integration, call the following API to create a session:

::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/session/**
:::

### Parameters
| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| link_id | string  | link_id value | Yes | - |
| api_key | string | API key provided by FinBox | Yes | - |
| redirect_url | string | URL to redirect to incase of success or failure | Yes for **Redirect Workflow** | - |
| from_date | string | Start date range to fetch statements. Should be of format `dd/MM/YYYY` | No | Last 6 month start date |
| to_date | string | End date range to fetch statements. Should be of format `dd/MM/YYYY` | No | Yesterday |
| bank_name | string | pass the [bank identifier](/bank-connect/appendix.html#bank-identifiers) to skip the bank selection screen and directly open a that bank's screen instead | No | - |

`from_date` and `to_date` specify the period for which the statements will be fetched. For example, if you need the last 6 months of statements, `from_date` will be today's date - 6 months and `to_date` will be today's date - 1 day. If not provided the default date range is 6 months from the current date. It should be in `dd/MM/yyyy` format.

::: warning NOTE
- `redirect_url` in request is a compulsory field in [Redirect Workflow](/bank-connect/javascript-client.html#redirect-workflow) but is not required with the [Inline Frame workflow](/bank-connect/javascript-client.html#inline-frame-workflow)
- Please make sure `from_date` is always less than `to_date`
- Make sure `to_date` is never today's date, the maximum possible value for it is today's date - 1 day
:::

### Response
On successful API call, it gives a **200 HTTP code** with a response in following format:
```json
{
  "redirect_url": "https://bankconnectclient.finbox.in/?session_id=127d12db1d71bd182b"
}
```
Use `redirect_url` to open up the BankConnect SDK. This URL can be used embedded inside an `<iframe>` or can be opened in a new tab or current window.

## Redirect Workflow

<img src="/javascript_redirect.jpg" alt="JavaScript Client SDK Redirect Workflow" />

The flow for this involves following steps:
- Create a session using [Session API](/bank-connect/javascript-client.html#session-api)
- Get the URL received from above API and open it in a new tab
- On success / failure, Client SDK will redirect to the specified redirect URL with parameters as follows:
  - Exit: `{url}?success=false`
  - Success: `{url}?success=true&entity_id=<some-entity-id>`

:::warning NOTE
Since there is no callback received on this flow, it is recommended to configure [Webhook](/bank-connect/webhook.html)
:::

## Inline Frame Workflow

<img src="/javascript_iframe.jpg" alt="JavaScript Client SDK iframe Workflow" />

The flow for this involves the following steps:
- Create a session using [Session API](/bank-connect/javascript-client.html#session-api)
- Get the URL received from above API and embed it in an `<iframe>`
- You'll [receive callbacks](/bank-connect/javascript-client.html#receive-callbacks) by implementing an event listener. Based on the event you can close / hide the inline frame.

## Receive callbacks
To receive callbacks in `<iframe>` workflow, you need to implement an event listener. It can be implemented as follows:

```html
<!DOCTYPE html>
<html lang="en">
<body>
  <script>
    window.addEventListener('message', function (event) {
      console.log("Event -> ", event)
    });
  </script>
  <iframe src="<url-from-create-session>" width="500px" height="700px"></iframe>
</body>Ï
</html>
```

### Event Object
The `event` object received by the listener can be one of the following:
#### Success
This is received when user completes the upload process.
```js
{
  type: "finbox-bankconnect",
  status: "success",
  payload: {
      "entityId": "1d1f-sfdrf-17hf-asda", //Unique ID that will used to fetch statement data
      "linkId": "<USER_ID_PASSED>" //Link ID is the identifier that was passed while initializing the SDK
  }
}
```
#### Exit
This is received when user exits the SDK.
```js
{
  type: "finbox-bankconnect",
  status: "exit",
  payload: {
      "linkId": "<USER_ID_PASSED>" //Link ID is the identifier that was passed while initializing the SDK
  }
}
```
#### Error
This is received whenever any error occurs in the user flow.

```js
{
  type: "finbox-bankconnect",
  status: "exit",
  payload: {
      "reason": "Reason for failure",
      "linkId": "<USER_ID_PASSED>", //Link ID is the identifier that was passed while initializing the SDK
      "error_type": "MUXXX",//MUXXX for Manual Upload and NBXXX for Net Banking
  }
}
```

:::warning Two Events
In case an error occurs, you'll receive `OnError` event payload, and then if the user exits the SDK, you'll receive another event payload, this time for `OnExit`.
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