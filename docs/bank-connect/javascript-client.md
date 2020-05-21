---
base_url: https://portal.finbox.in/bank-connect #base URL for the API
version: v1 # version of API
---
# Bank Connect: JavaScript Client SDK
The JavaScript Client SDK helps user submit their bank statements via upload or net banking credentials in your Web applications. The SDK will be opened via a web URL. It can be used in one of the following ways:
- Embedding inside an Inline Frame (`<iframe>`)
- Load in a new page with redirect URL

## See in action
The demo video below shows how a user submit bank statement using net banking credentials:
<p style="text-align:center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/lynnwojp0vA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

The video below shows a user submit bank statement by uploading the PDF file:
<p style="text-align:center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/ZUGDZqico2o" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</p>

## Embedding in an inline frame
The flow for this involves following steps:
- Create a session using [Session API](/bank-connect/javascript-client.html#session-api)
- Get the URL received from above API and embed it in an `<iframe>`
- You'll [receive callbacks](/bank-connect/javascript-client.html#receive-callbacks) by implementing an event listener. Based on the event you can close / hide the inline frame.

## Load in a new page with redirect URL
The flow for this involves following steps:
- Create a session using [Session API](/bank-connect/javascript-client.html#session-api)
- Get the URL received from above API and open it in a new tab
- On success / failure, Client SDK will redirect to the specified redirect URL with parameters as follows:
  - Exit: `{url}?success=false`
  - Success: `{url}?success=true&entity_id=<some-entity-id>`

:::warning NOTE
Since there is no callback received on this flow, it is recommended to configure [Webhook](/bank-connect/webhook.html)
:::

## Session API
In order start with the integration, first call following API to create a session.

::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/session/**
:::

### Parameters
| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| link_id | string  | link_id value | Yes | - |
| api_key | string | API key provided by FinBox | Yes | - |
| redirect_url | string | URL to redirect to incase of success or failure | Yes | null |
| from_date | string | Start date range to fetch statements. Should be of format `dd/MM/YYYY` | No | Last 6 month start date |
| to_date | string | End date range to fetch statements. Should be of format `dd/MM/YYYY` | No | Yesterday |
| bank_name | string | Name of the bank to open upload page directly | No | null |

::: warning NOTE
Please make sure `from_date` is always less than `to_date`. 
:::

### Response
On successful API call, it gives a **200 HTTP code** with a response in following format:
```json
{
  "redirect_url": "https://bankconnectclient.finbox.in/?session_id=127d12db1d71bd182b"
}
```
Use `redirect_url` to open up the bank connect SDK. This URL can be used embedded inside an `<iframe>` or can be opened in a new tab or current window.

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
#### Success Event
```js
{
  type: "finbox-bankconnect",
  status: "fb-success",
  payload: {
      "entityId": "1d1f-sfdrf-17hf-asda", //Unique ID that will used to fetch statement data
      "linkId": "<USER_ID_PASSED>" //Link ID is the identifier that was passed while initializing the SDK
  }
}
```
#### Exit Event
This is called on an exit or failure.

:::warning NOTE
In case a failure happens and then the user exits the SDK, you'll receive two events in that case, first because of failure, and then because of user exiting
:::

```js
{
  type: "finbox-bankconnect",
  status: "fb-exit",
  payload: {
      "reason": "Reason for exit. This also hold net banking failure", //Reason for exit
      "linkId": "<USER_ID_PASSED>" //Link ID is the identifier that was passed while initializing the SDK
  }
}
```