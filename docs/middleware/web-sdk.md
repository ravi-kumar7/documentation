# FinBox Lending: Web

FinBox Lending SDK is a drop-in module that can add a digital lending journey to any mobile or web application.
## Workflow

The flow for web SDK involves following steps:
- Create a user using [Create User](/middleware/sourcing-rest-api.html#create-user) API (One Time)
- Get Eligibility of the user using [Get Eligibility](/middleware/sourcing-rest-api.html#get-eligibility) API (One time)

Now everytime user initiates/resumes their lending journey by clicking on a banner/button on your app/website:
- Call the [Session API](#session-api) to get the URL, which can be rendered in a web view, or can be redirected to
- Once user completes the journey they are redirected to the specified URL.

:::warning NOTE
- All the above APIs are called at server side.
- [Webhook](/middleware/sourcing-rest-api.html#webhook) can be configured to get updates about the loan applications.
:::

## Session API
To start with the integration, call the following API to create a user session:

::: tip Endpoint
POST **`base_url`/v1/user/session/**
:::

### Authentication
This API require a **Server API Key** to be passed in `x-api-key` **header**. This API Key will be shared directly by FinBox along with `base_url`. Make sure this key is not exposed in any of your client side applications.

### Request Format
```json
{
    "customerID": "somecustomerid",
    "redirectURL": "https://yoururl/redirect/to/after/user/exits"
}
```

::: warning NOTE
- Once the user exits the loan journey at any point, the SDK will redirect to the above specified URL
- Make sure this API is called only when the user is created and eligibility is fetched.
:::

### Response
```json
{
    "data": {
        "url": "https://lending.finbox.in/session/167af08b-b33f-47f3"
    },
    "error": "",
    "status": true
}
```
Use `url` to open up the Lending SDK. This URL can be:
- embedded inside an `<iframe>`
- rendered in a mobile Web View
- opened in a new tab or current window.

### Error Cases
| Case | HTTP Code |
| - | - |
| Missing customerID | 403 |
| Missing redirectURL | 403 |
| User does not exist | 404 |
| User eligibility not available | 400 |
| User not eligible for loan | 403 |

## Customizations

You can share the following JSON (or its subset) with FinBox team to customize the look and feel of the lending journey:
```json
{
    "primaryTextColor": "#3E3E3E",
    "secondaryTextColor": "#24CA7A",
    "secondaryTextBackground": "#d8f9ee",
    "primaryButtonBackground": "#24CA7A",
    "primaryButtonTextColor": "white",
    "secondaryButtonBackground": "white",
    "secondaryButtonTextColor": "#3E3E3E",
    "secondaryButtonBorderColor": "#24CA7A",
    "buttonDisabledBackground": "#d4d4d4",
    "buttonDisabledTextColor": "white",
    "cardBackground": "#F4F8FC",
    "warningCardBackground": "#FFF2DC",
    "tileBackground": "#F3F3F3",
    "errorColor": "#ff6d55",
    "focusColor": "#24CA7A",
    "focusBackground": "#d8f9ee"
}
```
