# Device Connect: Transactions and Accounts

This page is an **extension** to the documentation [here](/device-connect/rest-api.html) and lists additional **Insights API Endpoints** for fetching captured **Transactions** and **Accounts** information of customers.
​
:::danger IMPORTANT
- Please refer to [Insights API Request](/device-connect/rest-api.html#insights-api-request) and [Insights API Response](/device-connect/rest-api.html#insights-api-response) to understand the **request** and **response** structure (including the data key) respectively.
 - It is to be noted that for **Transactions** and **Accounts** APIs, instead of `customer_id`, you have to provide `user_hash` key.
 - `user_hash` can be obtained using List Devices API. It is same as the `device_name` key in the `data` key object, as mentioned [here](/device-connect/transactions.html#list-devices-api).
:::


## Insights Endpoint Request
| Insights | Endpoint | Request Type | Description | 
| - | - | - | - |
| List Devices | /risk/list-devices | POST | Lists all the devices a customer has logged into |
| Transactions | /risk/transactions | POST | Captured and enriched bank transactions of customer |
| Accounts | /risk/accounts | POST | Captured financial accounts of customer |

## `data` Key

### List Devices API
List Devices API lists the devices that a customer has logged into. We use the keyword `device_name` to denote a unique pair of customer and device. **It is important to note that two customers using the same device will generate two different device names.**

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
            "device_name": "4aba67b51ef8c95bef2dd9f5cd6c0d08",
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
- **device_name**: A unique identifier for each device logged in by a user.
- **last_opened**: Last time user opened the app on this device.
- **created**: UTC time of when the device_name was created.
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
- In the **Transactions** and **Accounts** API you need `user_hash` key instead of `customer_id` in the request body.
- `user_hash` key value is the `device_name` key value in the **List Devices** API response.
:::

### Transactions API
In case of transactions API, the `data` key in response holds an array of transaction objects.
​

It is to be noted that **Transactions captured over only the last 6 months are given in
response.**

​
A sample transaction object is listed below:

```json
{
    "transaction_hash": "unique_transaction_hash",
    "tag": "Regular",
    "account_hash": "unique_account_hash",
    "category": "Travel",
    "type": "debit",
    "channel": "card",
    "merchant": "Uber",
    "timeinmilis": 1571732881768,
    "amount": 99.0,
    "servicename": "HDFC",
    "account_number": "HDFC 1234",
    "time": "2019-10-22 13:58:01"
}
```

Each of the transaction object has following keys:
- **transaction_hash**: it is a unique identifier for each transaction made by the user. This
doesn’t change for any transaction over time.
- **tag**: We identify certain transactions as special transactions. They can be used to gain a
deeper sense of the user's financial profile. Such transactions are tagged as one of the
below:
    - `Fixed Deposit`
    - `Salary`
    - `Self Transfer`
    - `Credit Card Payment`
    - `Auto Pay`
    - `Refund`
    - `Regular`
- **acount_hash**: it is a unique identifier for the account in which the transaction was made.
- **category**: All debit transactions are categorized into one of the following categories to gain a deeper insight into the user’s spending behavior:
    - `Cash`
    - `Transfers`
    - `Other`
    - `Bills`
    - `Entertainment`
    - `eWallet`
    - `Food`
    - `Fuel`
    - `Groceries`
    - `Investments`
    - `Loans`
    - `Medical`
    - `Shopping`
    - `Travel`
- **type**: this indicates the transaction type. It can be `debit` or `credit`.
- **channel**: this indicates the transaction channel. It can be one of the following:
    - `netbanking`
    - `card`
    - `cash`
    - `cheque`
    - `upi`
    - `auto-debit`
- **merchant**: the Point of Sale or Receiving Party in case of a debit transaction
- **servicename**: The service whose message was captured to extract the given transaction. For example, if HDFC Bank sent an sms to notify a debit, the **servicename** would be HDFC. This
won’t always be the the bank that is associated with the transaction.
- **time**: The UTC time at which the transaction message was received by the user's device. It is of the format YYYY-MM-DD HH:MM:SS.
- **timeinmilis**: Time in milliseconds at which the transaction message was received since
epoch
- **amount**: this indicates monetary amount that the transaction was made for.
- **account_number**: a human readable account number of the format: `<account company> <last 4 digits of account number>`

### Accounts API
In case of accounts API, the data key in response holds an array of account objects.
​

It is to be noted that **Account Information captured over only the last 6 months are given in
response.**
​

A sample account object is listed below:
​
```json
{
    "type": "credit-card",
    "latest_bill_date": "2019-10-13 12:20:00",
    "is_primary": false,
    "company": "KOTAK",
    "last_used_date": "2019-10-13 12:40:01",
    "number": "1234",
    "latest_bill": 40000.00,
    "limit": 43369.53,
    "latest_balance_date": "2019-10-13 12:50:01",
    "active_months_list": ["2019-09", "2019-10"],
    "account_hash": "unique_account_hash",
    "latest_balance": 30500.00
}
```

:::warning IMPORTANT
Some of the keys in response can be null, if not captured or not relevant for the account.
:::

Each of account object has following keys:
- **type**: this indicates the type of account. Can be one of the following:
    - `bank`
    - `ewallet`
    - `debit-card`
    - `credit-card`
- **is_primary**: a boolean value which indicates whether the account is the user's primary account (as per our analysis)
- **company**: name of the bank or institution which issued the account
- **last_used_date**: the UTC date time of the last recorded activity of that bank account. It is of the format YYYY-MM-DD HH:MM:SS.
- **number**: the last 4 digits of the account number
- **latest_bill**: (only applicable for `credit-card`) The latest bill paid by the user
- **latest_bill_date**: (only applicable for `credit-card`) The UTC date time of the latest credit card bill paid by the user. It is of the format YYYY-MM-DD HH:MM:SS.
- **limit**: (only applicable for account `credit-card`) The Credit Limit of the account
- **active_months_list**: A list of months in which any activity was done with the account
- **account_hash**: it is a unique identifier for the account that the transaction was made from.
- **latest_balance**: indicates the latest balance in case of `bank`, `ewallet` and `debit-card`, and available limit in case of `credit-card`.
- **latest_balance_date**: The UTC date time at which the latest balance was captured. It is of the format YYYY-MM-DD HH:MM:SS.