# Device Connect: Credits

This page is an **extension** to the documentation [here](/device-connect/rest-api.html) and lists additional **Insights API Endpoints** for fetching captured **Credit Transactions**  of customers.
​
:::danger IMPORTANT
- Please refer to [Insights API Request](/device-connect/rest-api.html#insights-api-request) and [Insights API Response](/device-connect/rest-api.html#insights-api-response) to understand the **request** and **response** structure (including the data key) respectively.
 - It is to be noted that for the **Credits** API, instead of `customer_id`, you have to provide `user_hash` key.
 - `user_hash` can be obtained using List Devices API. It is same as the `device_id` key in the `data` key object, as mentioned [here](/device-connect/credits.html#list-devices-api).
:::


## Insights Endpoint Request
| Insights | Endpoint | Request Type | Description | 
| - | - | - | - |
| List Devices | /risk/device-ids | POST | Lists all the devices a customer has logged into |
| Credits | /risk/credits | POST | Captured and enriched credit transactions of customer |


## `data` Key

### List Devices API
List Devices API lists the devices that a customer has logged into. We use the keyword `device_id` to denote a unique pair of customer and device. **It is important to note that two customers using the same device will generate two different device names.**

A sample response for the API is listed below:
```json
{
    "customer_id": "demo_lender_612022",
    "request_id": "d573c4f9-6ad0-4009-ad8b-5fd44e9a17ae",
    "date_requested": "2020-01-06T15:34:15.391554Z",
    "status": "complete",
    "date_processed": "2020-01-06T15:34:15.391554Z",
    "message": "data processed successfully",
    "data": [
        {
            "device_id": "4aba67b51ef8c95bef2dd9f5cd6c0d08",
            "last_opened": "2020-01-06T14:52:52Z",
            "created": "2020-01-06T14:52:51Z",
            "mobile_model": "GOOGLE PIXEL 3A",
            "app_open_count": 1,
            "given_permissions": [
                "contacts_permission",
                "phone_state_permission",
                "location_permission",
                "calendar_permission",
                "accounts_permission",
                "sms_permission",
                "storage_permission"
            ]
        }
    ]
}
```

Each of the object in `data` key has following keys:
- **device_id**: A unique identifier for each device a user has logged into.
- **last_opened**: Last time user opened the app on this device.
- **created**: UTC time of when the device_id was created.
- **mobile_model**: A clean human readable name of the model of the device from which the data is collected. Can be displayed to the user. Not suitable to be used in a program.
- **app_open_count**: The count of invocation of the `createUser` method in the Device Connect Android SDK (Refer [here](/device-connect/android.html#create-user-method)). It is a directional indicator of the number of times the customer has opened the app, though not necessarily the exact number (depends on your Android integration).
- **given_permissions**: The permissions granted by the user on the device. It can have following values in the list:
    - `sms_permission`
    - `calls_permission`
    - `contacts_permission`
    - `location_permission`
    - `phone_state_permission`
    - `storage_permission`
    - `calendar_permission`
    - `accounts_permission`
    - `usage_permission`

:::danger IMPORTANT
- In the **Credits** API you need `user_hash` key instead of `customer_id` in the request body.
- `user_hash` key value is the same as `device_id` key value in the **List Devices** API response.
:::

### Credits API
In case of Credits API, the `data` key in response holds an array of credit transaction objects.
​

It is to be noted that **Credits captured over only the last 6 months are given in
response.**

​
A sample credit object is listed below:

```json
{
    "transaction_hash": "unique_credit_transaction_hash",
    "account_hash": "unique_account_hash",
    "channel": "card",
    "merchant": "XXXX2309",
    "timeinmilis": 1571732881768,
    "amount": 99.0,
    "servicename": "HDFC",
    "account_number": "HDFC 1234",
    "time": "2019-10-22 13:58:01"
}
```

Each of the credit transaction object has following keys:
- **transaction_hash**: it is a unique identifier for each credit transaction made by the user. This
doesn’t change for any credit transaction over time.
- **tag**: We identify certain credits as special credits. They can be used to gain a
deeper sense of the user's financial profile. Such credit transactions are tagged as one of the
below:
    - `Salary`
    - `Self Transfer`
    - `Credit Card Payment`
    - `Refund`
    - `Regular`
- **account_hash**: it is a unique identifier for the account in which the credit transaction was made.
- **channel**: this indicates the channel through which the credit transaction was made. It can be one of the following:
    - `netbanking`
    - `card`
    - `cash`
    - `cheque`
    - `upi`
    - `auto-debit`
- **merchant**: the Sending Party of a credit transaction
- **servicename**: The service whose message was captured to extract the given credit transaction. For example, if HDFC Bank sent an sms to notify a debit, the **servicename** would be HDFC. This
won’t always be the the bank that is associated with the credit transaction in question.
- **time**: The UTC time at which the transaction message was received by the user's device. It is of the format YYYY-MM-DD HH:MM:SS.
- **timeinmilis**: Time in milliseconds at which the transaction message was received since
epoch
- **amount**: this indicates monetary amount that the transaction was made for.
- **account_number**: a human readable account number of the format: `<account company> <last 4 digits of account number>`

