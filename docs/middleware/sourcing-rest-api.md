# Sourcing Entity - Rest API
These APIs are called from the **server side**. The workflow is as follows:
- First a user is created by calling [Create User](/middleware/sourcing-rest-api.html#create-user) API
- Eligibility for the given user is checked by calling [Get Eligibility](/middleware/sourcing-rest-api.html#get-eligibility) API
- Token is generated for the user by calling [Generate Token](/middleware/sourcing-rest-api.html#generate-token) API and is sent to the Android app to be used with the [SDK](/middleware/android-sdk.html)

## Authentication
All the APIs below require a **Server API Key** to be passed in `x-api-key` header. This API Key will be shared directly by FinBox. Make sure this key is not exposed in any of your client side applications.

## Postman Collection
Postman **collection** for the REST APIs can be downloaded using the button below:

<div class="button_holder">
<a class="download_button" download href="/finbox_source_entity.postman_collection.json">Download Postman Collection</a>
</div>

Postman environment having `base_url` and `server-api-key` will be shared separately.

## Request and Response formats
All APIs accept request body with `application/json` content type, the response body is as follows:
```json
{
    "status": true,
    "error": "",
    "data": ""
}
```
On successful response you'll receive 200 HTTP status, with `status` value as `true`.
On failure, response will have `status` key as `false`, and `error` will hold the message indicating the failure.

## Create User
This API creates a FinBox lending user for a given customer ID.
::: tip Endpoint
POST **`base_url`/v1/user/create**
:::

**Request Format**
```json
{
    "customerID": "somecustomerid",
    "mobile": "9999999999"
}
```
**Response**
```json
{
    "data": {
        "message": "user created!"
    },
    "error": "",
    "status": true
}
```

## Get Eligibility
This API checks for a user's eligibility and returns the eligible amount
::: tip Endpoint
GET **`base_url`/v1/user/eligibility?customerID=`somecustomerid`**
:::

**Response**
```json
{
    "data": {
        "eligible_amount": 15000,
        "is_eligible": true
    },
    "error": "",
    "status": true
}
```
Here `is_eligible` is a **boolean** indicating whether the user is eligible or not, while `eligibility_amount` is a **float** that indicates the loan eligibility amount.

## Generate Token
This API can be called multiple times for an eligible user, and is used to get a valid token that can be used by the Android App to initialize the SDK.
::: tip Endpoint
POST **`base_url`/v1/user/token**
:::

**Request Format**
```json
{
    "customerID": "somecustomerid"
}
```
**Response**
```json
{
    "data": {
        "token": "123LN5hAeH6LgDzhmtJs12345678q3G25QAMLinE77IE123yrT7GWZpwNyPO3123"
    },
    "error": "",
    "status": true
}
```
Here `token` field indicates the token.