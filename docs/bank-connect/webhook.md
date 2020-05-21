# Webhook
You can also configure a custom web hook to be invoked whenever extraction process is completed or failed (because of extraction failure in manual mode or user entering a wrong credentials for example in net banking mode).

To configure this, you have to share with us a **valid endpoint**.

:::danger A Valid Endpoint:
- receives a POST request
- receives a request body with content type `application/json`
- returns a 200 status code on successful reception.
:::

All the APIs listed below use the same authentication method as listed [here](/bank-connect/rest-api.html#authentication).

## Updating web hook endpoint
To update your valid endpoint use the API below:

::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/update_webhook/**
:::

It receives following **request body** in `application/json` content type:
```json
{
    "webhook_url": "https://postman-echo.com/post"
}
```
Here, `https://postman-echo.com/post` is an example for valid endpoint.

On updating the web hook endpoint successfully, the `update_webhook` API will give **200 Status Code**.

:::danger IMPORTANT
By default web hook is enabled only for net banking mode, in case you want it to be enabled for manual mode as well, then you need to pass an additional field `webhook_mode` with a value `1`. Hence the payload will look like this:
```json
{
    "webhook_url": "https://postman-echo.com/post",
    "webhook_mode": 1
}
```
Make sure to specify webhook mode every time you update webhook in case you want web hook to be invoked for both manual as well as net banking mode, if not specified `webhook_mode` will reset to default value `0` (Net Banking Mode only)  
:::


## Receiving payload
We'll be sending json encoded body in following payload format:
```json
{
    "entity_id": "unique_entity_id",
    "statement_id": "unique_statement_id",
    "link_id": "link_id",
    "progress": "completed",
    "reason": ""
}
```

Here, `progress` field can be `completed` or `failed`. In case of `failed`, `reason` field will specify the reason for failure.

In case of failure in Net Banking mode, actual upload might not have happened as in case of wrong credentials entered by user, hence `statement_id` will be unavailable, and will be blank string `""`. Similarly in case of manual upload if `link_id` doesn't exists, its value will be `null`.

## Handling cases when webhook endpoint is down
In case the webhook endpoint is down or a webhook call was failed, you can have the polling mechanism as a backup. However, the polling mechanism requires you to have the `entity_id`. 

In case you just have the `link_id` you can also request for all the webhook payloads for a given `link_id` using the following API:

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/webhook_payloads/?link_id=`link_id`**
:::
Response format will be as follows:
```json
{
    "payloads": [
        {
            "statement_id": "STATEMENT_UUID4",
            "entity_id": "ENTITY_UUID4",
            "link_id": "LINK ID HERE",
            "progress": "completed",
            "reason": "",
            "date_time": "2020-03-06 12:46:33"
        },
        ....
    ]
}
```

This API returns the data in decreasing order of time, i.e. the latest payloads will be on top and the oldest on the bottom. In each of the payload there is an additional field `date_time` which indicates the date and time at which the webhook payload was supposed to be sent. `date_time` is in `YYYY-MM-DD HH:MM:SS` format.

In case you have `entity_id` you can also poll the transactions API and check for `progress` field.