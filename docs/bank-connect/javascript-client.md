---
base_url: https://portal.finbox.in/bank-connect #base URL for the API
version: v1 # version of API
---
# Bank Connect: JavaScript Client SDK
This **SDK** helps users to upload bank statements.
<p style="text-align:center">
<img src="/bc_js.gif" alt="Animated Demo" />
</p>

The SDK will be opened via a web URL. So it can be used inside an Iframe or can be opened in a new tab.

:::tip Fetching Transactions
The client SDK will give you an `entity_id` after successful statement upload. This can be used with any of the libraries or REST API to fetch extracted and enriched data like identity, salary, lender, recurring transactions, etc.
:::

## Fetching the SDK
In order start with bankconnect call following api to create a session.

::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/session/**
:::

### Parameters
| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| link_id | string  | link_id value | Yes | - |
| api_key | string | API key provided by FinBox | Yes | - |
| redirect_url | string | URL to redirect to incase of success or failure | Yes | null |
| from_date | string | Start date range to fetch statemnts. Should be of format `dd/MM/YYYY` | No | Last 6 month start date |
| to_date | string | End date range to fetch statemnts. Should be of format `dd/MM/YYYY` | No | Yesterday |
| bank_name | string | Name of the bank to open upload page directly | No | null |

::: warning Date Values
Please make sure `from_date` is always less than `to_date`. 
:::

### Response
On successful api call, it gives a **200 HTTP code** with a response in following format:
```json
{
  "redirect_url": "https://bankconnectclient.finbox.in/?session_id=127d12db1d71bd182b"
}
```
Use `redirect_url` to open up the bank connect SDK. This url can be used inside an iframe or can be opened in a new tab. URL points to the bank connect SDK with the specified parameters. 

## Callbacks
All callbacks are given to the client via a web hook which specifies the reason for failure or payload for success. Please refer [Web hook Integration](/bank-connect/rest-api.html#web-hook) for details of integrating web hook.