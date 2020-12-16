---
base_url: https://portal.finbox.in/middleware #base URL for the API
version: v1 # version of API
---
# FinBox Lending: Web

FinBox Lending SDK is a drop-in module that can add a digital lending journey on click of a button.

## Session API
To start with the integration, call the following API to create a session:

::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/session/**
:::

### Parameters
| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| customer_id | string  | cusomter id value | Yes | - |
| api_key | string | API key provided by FinBox | Yes | - |
| redirect_url | string | URL to redirect to incase of success or failure | Yes for **Redirect Workflow** | - |


::: warning NOTE
:::

### Response
On successful API call, it gives a **200 HTTP code** with a response in following format:
```json
{
  "redirect_url": "https://bankconnectclient.finbox.in/?session_id=127d12db1d71bd182b"
}
```
Use `redirect_url` to open up the Middleware SDK. This URL can be used embedded inside an `<iframe>` or can be opened in a new tab or current window.

## Workflow

The flow for this involves following steps:
- Create a session using [Session API](/middleware/web-sdk.html#session-api)
- Get the URL received from above API and open it in a new tab
- On success / failure, Client SDK will redirect to the specified redirect URL with parameters as follows:
  - Exit: `{url}?success=false`
  - Success: `{url}?success=true&entity_id=<some-entity-id>`

:::warning NOTE
Since there is no callback received on this flow, it is recommended to configure [Webhook](/middleware/webhook.html)
:::