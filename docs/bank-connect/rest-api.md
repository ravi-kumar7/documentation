---
base_url: https://portal.finbox.in/bank-connect #base URL for the API
version: v1 # version of API
---

# BankConnect: Uploading using REST API
BankConnect REST APIs can be used to fetch enriched data for an entity. This guide first lists some basic fields like [Progress](/bank-connect/rest-api.html#progress-field) and [Fraud](/bank-connect/rest-api.html#fraud-field), and then explores different enriched data APIs.

You can also try these APIs on Postman. Check out [this](/bank-connect/#postman-collection) article for more details.

To know how to upload statements using REST API, check out [this](/bank-connect/#upload-rest-api.html) article.

:::warning Request Format
BankConnect accepts all requests with form fields, so please make sure that all requests must be made with content-type `application/x-www-form-urlencoded` or `multipart/form-data; boundary={boundary string}`
:::

## Authentication
FinBox BankConnect REST API uses API keys to authenticate requests. All API requests must be made over HTTPS. Calls made over plain HTTP will fail. API requests without authentication will also fail.

To make a successful request, required **headers mentioned with each API** must be present in the request.

In case wrong/incomplete/no keys were passed in headers, response will have **401** HTTP Code and payload as follows:
```json
{
    "detail": "Authentication credentials were not provided."
}
```

## Progress Field
When a statement is uploaded, identity information and basic fraud checks happen at the same time. However other statement analyses, like transaction extraction, salary, recurring transactions, advanced fraud checks, enrichment happen in parallel. Hence all the GET APIs for these **analysis fields** have a `progress` field. You can track the progress of a statement uploaded using this.

`progress` is an array of objects. Each object represents a statement and has a `status` field that can be `processing`, `completed` or `failed` and `statement_id` field which identifies a statement uniquely.

Sample `progress` value:
```json
[
  {
    "status": "completed",
    "message": null,
    "statement_id": "some_uuid4_1"
  },
  {
    "status": "processing",
    "message": null,
    "statement_id": "some_uuid4_2"
  }
]
```

::: warning TIP
A general rule of thumb would be to make sure all objects in the `progress` field have their `status` as `completed`, by polling the required analysis field API in intervals. As soon as all statuses are `completed`, the same API will give the correct required values.

It is to be noted that `status` for all different analysis APIs are separate, that is identity and progress might have different statuses for the document, depending on whichever is taking less or more time. So make sure to check the status for each of the analysis API before trying to use the extracted values.
:::

## Fraud Field <Badge text="beta" type="warn" />
In all of the analysis field APIs (transaction, accounts, etc.), there is a field `fraud` present, that holds an object with two fields:
- `fraudulent_statements`: array of `statement_id`s which have some sort detected after analysis or in first basic check)
- `fraud_type`: array of fraud objects having following keys:
    | Key | Type | Description |
    | - | - | - |
    | `statement_id` | String | Specifies the statement id for statement-level fraud. In case of account-level fraud, its value is `null` |
    | `fraud_type` | String | It indicates the fraud type |
    | `transaction_hash` | String | Specifies the transaction hash in case of transaction-level fraud, will be `null` otherwise |
    | `account_id` | String | Indicates the account id |
    | `fraud_category` | String | Indicates the fraud category |

:::tip NOTE
To know more about fraud categories and fraud type, refer to [Fraud](/bank-connect/fraud.html) section.
:::

Sample `fraud` field value:
```json
{
    "fraudulent_statements": [
        "uuid4_for_statement"
    ],
    "fraud_type": [
        {
            "statement_id": "uuid4_for_statement",
            "fraud_type": "some_fraud_type",
            "account_id": "uuid4_for_account",
            "fraud_category": "some_fraud_category",
            "transaction_hash": null
        }
    ]
}
```

## List Accounts
Lists accounts under a given entity.

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/`<entity_id>`/accounts/**
:::

### Authentication
Request headers `x-api-key` with API Key as value and `server-hash` with Server Hash as value must be present in request.

### Response
On fetching information successfully, the response would be of the following format with **200 HTTP code**:
```json
{
    "entity_id": "uuid4_for_entity",
    "progress": [
        {
            "status": "completed",
            "message": null,
            "statement_id": "uuid4_for_statement"
        }
    ],
    "accounts": [
        {
            "months": [
                "2018-11",
                "2018-12",
                "2019-01"
            ],
            "statements": [
                "uuid4_for_statement"
            ],
            "account_id": "uuid4_for_account",
            "ifsc": null,
            "micr": null,
            "account_number": "Account Number Extracted",
            "account_category": "individual",
            "bank": "axis"
        }
    ],
    "fraud": {
        "fraudulent_statements": [
            "uuid4_for_statement"
        ],
        "fraud_type": [
            {
                "statement_id": "uuid4_for_statement",
                "fraud_type": "some_fraud_type",
                "account_id": "uuid4_for_account",
                "fraud_category": "some_fraud_category",
                "transaction_hash": null
            }
        ]
    }
}
```
The response has the following fields:
- `accounts` holds the array of account objects, each having:

    | Field | Type | Description |
    | - | - | - |
    | months | array of strings | month and year for which data is available|
    | statements | array of strings | list of statement unique identifiers under the account |
    | account_id | string | unique identifier for account |
    | bank | string | [bank identifier](/bank-connect/appendix.html#bank-identifiers) to which the account belongs  |
    | ifsc | string | IFSC code of bank account |
    | micr | string | MICR code of bank account |
    | account_category | string | account category, can be `individual` or `corporate` |
    | account_number | string | account number |

- `progress` (read more in [Progress Field](/bank-connect/rest-api.html#progress-field) section)
- `fraud` (read more in [Fraud Field](/bank-connect/rest-api.html#fraud-field) section)

## Identity
Lists extracted identities for a given entity.

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/`<entity_id>`/identity/**
:::

### Authentication
Request headers `x-api-key` with API Key as value and `server-hash` with Server Hash as value must be present in request.

### Response
On fetching information successfully, the response would be of the following format with **200 HTTP code**:
```json
{
    "entity_id": "uuid4_for_entity",
    "progress": [
        {
            "status": "completed",
            "message": null,
            "statement_id": "uuid4_for_statement"
        }
    ],
    "accounts": [
        {
            "months": [
                "2018-11",
                "2018-12",
                "2019-01"
            ],
            "statements": [
                "uuid4_for_statement"
            ],
            "account_id": "uuid4_for_account",
            "ifsc": null,
            "micr": null,
            "account_category": "individual",
            "account_number": "Account Number Extracted",
            "bank": "axis"
        }
    ],
    "fraud": {
        "fraudulent_statements": [
            "uuid4_for_statement"
        ],
        "fraud_type": [
            {
                "statement_id": "uuid4_for_statement",
                "fraud_type": "some_fraud_type",
                "account_id": "uuid4_for_account",
                "fraud_category": "some_fraud_category",
                "transaction_hash": null
            }
        ]
    },
    "identity": [
        {
            "address": "Extracted Address",
            "account_number": "Extracted Account Number",
            "account_id": "uuid4_for_account",
            "name": "Extracted Name"
        }
    ]
}
```
The response fields are the same as in [List Accounts](/bank-connect/rest-api.html#list-accounts), but there is an additional `identity` field that holds an array of identity objects. Each object has:

| Field | Type | Description |
| - | - | - |
| account_id | string | a unique identifier for the account for which the identity information is referred to in the object |
| name | string | extracted account holder name |
| address | string | extracted account holder address |
| account_number | string | account number |
| account_category | string | account category, can be `individual` or `corporate` |

## Transactions
Get extracted and enriched transactions for a given entity.

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/`<entity_id>`/transactions/**
:::

### Authentication
Request headers `x-api-key` with API Key as value and `server-hash` with Server Hash as value must be present in request.

### Query Parameters
Query parameters can be appended at end of the URL like `/?account_id=somevalue`

| Parameter | Optional | Type | Description |
| - | - | - | - |
| account_id | Yes | String | If specified, it filter outs the transactions for a particular account | 

### Response
On fetching information successfully, the response would be of the following format with **200 HTTP code**:
```json
{
    "entity_id": "uuid4_for_entity",
    "progress": [
        {
            "status": "completed",
            "message": null,
            "statement_id": "uuid4_for_statement"
        }
    ],
    "accounts": [
        {
            "months": [
                "2018-11",
                "2018-12",
                "2019-01"
            ],
            "statements": [
                "uuid4_for_statement"
            ],
            "account_id": "uuid4_for_account",
            "ifsc": null,
            "micr": null,
            "account_category": "individual",
            "account_number": "Account Number Extracted",
            "bank": "axis"
        }
    ],
    "fraud": {
        "fraudulent_statements": [
            "uuid4_for_statement"
        ],
        "fraud_type": [
            {
                "statement_id": "uuid4_for_statement",
                "fraud_type": "some_fraud_type",
                "account_id": "uuid4_for_account",
                "fraud_category": "some_fraud_category",
                "transaction_hash": null
            }
        ]
    },
    "transactions": [
      {
            "transaction_note": "SOME LONG TRANSACTION NOTE",
            "hash": "unique_transaction_identifier",
            "description": "lender_transaction",
            "account_id": "uuid4_for_account",
            "transaction_type": "debit",
            "amount": 5188.0,
            "date": "2019-01-08 00:00:00",
            "merchant_category": "",
            "balance": 922.15,
            "transaction_channel": "salary"
      },
      //...
    ]
}
```
The response fields are the same as in [List Accounts](/bank-connect/rest-api.html#list-accounts), but there is an additional `transactions` field that holds an array of transaction objects. Each object has the following fields:
- `transaction_note`: exact transaction note / description present in the statement PDF
- `hash`: a unique identifying hash for each transaction
- `description`: describes more information about the `transaction_channel` field. Refer to [this](/bank-connect/appendix.html#description) list for possible values.
- `account_id`: unique UUID4 identifier for the account to which the transaction belongs to
- `transaction_type`: can be `debit` or `credit`
- `amount`: indicates the transaction amount
- `date`: date of transaction
- `merchant_category`: the category of the merchant in case a transaction is with a merchant. Refer to [this](/bank-connect/appendix.html#merchant-category) list of possible values.
- `balance`: account balance just after this transaction
- `transaction_channel`: refer to [this](/bank-connect/appendix.html#transaction-channel) list for possible values.

## Salary
Get extracted salary transactions for a given entity.

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/`<entity_id>`/salary/**
:::

### Authentication
Request headers `x-api-key` with API Key as value and `server-hash` with Server Hash as value must be present in request.

### Query Parameters
Query parameters can be appended at end of the URL like `/?account_id=somevalue`

| Parameter | Optional | Type | Description |
| - | - | - | - |
| account_id | Yes | String | If specified, it filter outs the transactions for a particular account | 

### Response
On fetching information successfully, the response would be of the following format with **200 HTTP code**:
```json
{
    "entity_id": "uuid4_for_entity",
    "progress": [
        {
            "status": "completed",
            "message": null,
            "statement_id": "uuid4_for_statement"
        }
    ],
    "accounts": [
        {
            "months": [
                "2018-11",
                "2018-12",
                "2019-01"
            ],
            "statements": [
                "uuid4_for_statement"
            ],
            "account_id": "uuid4_for_account",
            "ifsc": null,
            "micr": null,
            "account_category": "individual",
            "account_number": "Account Number Extracted",
            "bank": "axis"
        }
    ],
    "fraud": {
        "fraudulent_statements": [
            "uuid4_for_statement"
        ],
        "fraud_type": [
            {
                "statement_id": "uuid4_for_statement",
                "fraud_type": "some_fraud_type",
                "account_id": "uuid4_for_account",
                "fraud_category": "some_fraud_category",
                "transaction_hash": null
            }
        ]
    },
    "transactions": [
        {
            "balance": 32682.78,
            "hash": "unique_transaction_identifier_1",
            "description": "",
            "clean_transaction_note": "Clean Transaction Note",
            "account_id": "uuid4_for_account",
            "transaction_type": "credit",
            "date": "2018-12-12 00:00:00",
            "amount": 27598.0,
            "month_year": "12-2018",
            "merchant_category": "",
            "transaction_channel": "net_banking_transfer",
            "transaction_note": "SOME LONG TRANSACTION NOTE"
        },
        {
            "balance": 29979.15,
            "hash": "unique_transaction_identifier_2",
            "description": "",
            "clean_transaction_note": "Clean Transaction Note",
            "account_id": "uuid4_for_account",
            "transaction_type": "credit",
            "date": "2019-01-11 00:00:00",
            "amount": 29057.0,
            "month_year": "1-2019",
            "merchant_category": "",
            "transaction_channel": "net_banking_transfer",
            "transaction_note": "SOME LONG TRANSACTION NOTE"
        }
    ]
}
```
The response fields are the same as in [List Accounts](/bank-connect/rest-api.html#list-accounts), but there is an additional `transactions` field that holds an array of salary transaction objects. Each object has the following fields:
- `balance`: account balance just after this transaction
- `hash`: a unique identifying hash for each transaction
- `description`: describes more information about the `transaction_channel` field. Refer to [this](/bank-connect/appendix.html#description) list for possible values.
- `clean_transaction_note`: Transaction note in clean English words
- `account_id`: unique UUID4 identifier for the account to which the transaction belongs to
- `transaction_type`: can be `debit` or `credit`
- `date`: date of transaction
- `amount`: indicates the transaction amount
- `month_year`: month and year for which the salary is
- `merchant_category`: the category of the merchant in case a transaction is with a merchant. Refer to [this](/bank-connect/appendix.html#merchant-category) list of possible values.
- `transaction_channel`: refer to [this](/bank-connect/appendix.html#transaction-channel) list for possible values.
- `transaction_note`: exact transaction note / description present in the statement PDF

## Recurring Transactions
Get extracted recurring transactions for a given entity.

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/`<entity_id>`/recurring_transactions/**
:::

### Authentication
Request headers `x-api-key` with API Key as value and `server-hash` with Server Hash as value must be present in request.

### Query Parameters
Query parameters can be appended at end of the URL like `/?account_id=somevalue`

| Parameter | Optional | Type | Description |
| - | - | - | - |
| account_id | Yes | String | If specified, it filter outs the transactions for a particular account | 

### Response
On fetching information successfully, the response would be of the following format with **200 HTTP code**:
```json
{
    "entity_id": "uuid4_for_entity",
    "progress": [
        {
            "status": "completed",
            "message": null,
            "statement_id": "uuid4_for_statement"
        }
    ],
    "accounts": [
        {
            "months": [
                "2018-11",
                "2018-12",
                "2019-01"
            ],
            "statements": [
                "uuid4_for_statement"
            ],
            "account_id": "uuid4_for_account",
            "ifsc": null,
            "micr": null,
            "account_category": "individual",
            "account_number": "Account Number Extracted",
            "bank": "axis"
        }
    ],
    "fraud": {
        "fraudulent_statements": [
            "uuid4_for_statement"
        ],
        "fraud_type": [
            {
                "statement_id": "uuid4_for_statement",
                "fraud_type": "some_fraud_type",
                "account_id": "uuid4_for_account",
                "fraud_category": "some_fraud_category",
                "transaction_hash": null
            }
        ]
    },
    "transactions": {
        "credit_transactions": [
            {
                "account_id": "uuid4_for_account",
                "end_date": "2019-01-11 00:00:00",
                "clean_transaction_note": "A SHORT AND CLEAN TRANSACTION NOTE",
                "transactions": [
                    {
                        "transaction_channel": "net_banking_transfer",
                        "transaction_note": "SOME LONG TRANSACTION NOTE",
                        "clean_transaction_note": "A SHORT AND CLEAN TRANSACTION NOTE",
                        "hash": "unique_transaction_identifier_1",
                        "account_id": "uuid4_for_account",
                        "transaction_type": "credit",
                        "amount": 27598.0,
                        "date": "2018-12-12 00:00:00",
                        "balance": 32682.78,
                        "description": ""
                    },
                    {
                        "transaction_channel": "net_banking_transfer",
                        "transaction_note": "SOME LONG TRANSACTION NOTE",
                        "clean_transaction_note": "A SHORT AND CLEAN TRANSACTION NOTE",
                        "hash": "unique_transaction_identifier_2",
                        "account_id": "uuid4_for_account",
                        "transaction_type": "credit",
                        "amount": 29057.0,
                        "date": "2019-01-11 00:00:00",
                        "balance": 29979.15,
                        "description": ""
                    }
                ],
                "median": 29057.0,
                "start_date": "2018-12-12 00:00:00",
                "transaction_channel": "NET_BANKING_TRANSFER"
            }
        ],
        "debit_transactions": [
            {
                "account_id": "uuid4_for_account",
                "end_date": "2019-01-18 00:00:00",
                "clean_transaction_note": "A SHORT AND CLEAN TRANSACTION NOTE",
                "transactions": [
                    {
                        "transaction_channel": "debit_card",
                        "transaction_note": "SOME LONG TRANSACTION NOTE",
                        "clean_transaction_note": "A SHORT AND CLEAN TRANSACTION NOTE",
                        "hash": "unique_transaction_identifier_3",
                        "account_id": "uuid4_for_account",
                        "transaction_type": "debit",
                        "amount": 80.0,
                        "date": "2019-01-16 00:00:00",
                        "balance": 1912.85,
                        "description": ""
                    },
                    {
                        "transaction_channel": "debit_card",
                        "transaction_note": "SOME LONG TRANSACTION NOTE",
                        "clean_transaction_note": "A SHORT AND CLEAN TRANSACTION NOTE",
                        "hash": "unique_transaction_identifier_4",
                        "account_id": "uuid4_for_account",
                        "transaction_type": "debit",
                        "amount": 70.0,
                        "date": "2019-01-17 00:00:00",
                        "balance": 1840.85,
                        "description": ""
                    },
                    {
                        "transaction_channel": "debit_card",
                        "transaction_note": "SOME LONG TRANSACTION NOTE",
                        "clean_transaction_note": "A SHORT AND CLEAN TRANSACTION NOTE",
                        "hash": "unique_transaction_identifier_5",
                        "account_id": "uuid4_for_account",
                        "transaction_type": "debit",
                        "amount": 70.0,
                        "date": "2019-01-18 00:00:00",
                        "balance": 249335.95,
                        "description": ""
                    }
                ],
                "median": 70.0,
                "start_date": "2019-01-16 00:00:00",
                "transaction_channel": "DEBIT_CARD"
            }
        ]
    }
}
```
The response fields are the same as in [List Accounts](/bank-connect/rest-api.html#list-accounts), but there are two additional fields `credit_transactions` and `debit_transactions` that holds an array of **recurring transaction set** objects for credit and debit transaction type respectively.
Each of the recurring transaction set object has the following fields:
- `account_id`: unique UUID4 identifier for the account to which transaction set belongs to
- `start_date`: the start date for the recurring transaction set
- `end_date`: end date for the recurring transaction set
- `transaction_channel`: transaction channel in upper case. Refer to [this](/bank-connect/appendix.html#transaction-channel) list for possible values.
- `median`: median of the transaction amounts under the given recurring transaction set
- `clean_transaction_note`: contains a clean and small transaction note, it can be used as an identifier for source/destination for the recurring transaction set
- `transactions`: list of transaction objects under the recurring transaction set. Each transaction object here has the same fields as the transaction object in transactions API (Refer the response section [here](/bank-connect/rest-api.html/#transactions) to know about the fields).

## Lender Transactions
Get extracted lender transactions for a given entity.

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/`<entity_id>`/lender_transactions/**
:::

### Authentication
Request headers `x-api-key` with API Key as value and `server-hash` with Server Hash as value must be present in request.

### Query Parameters
Query parameters can be appended at end of the URL like `/?account_id=somevalue`

| Parameter | Optional | Type | Description |
| - | - | - | - |
| account_id | Yes | String | If specified, it filter outs the transactions for a particular account | 

### Response
On fetching information successfully, the response would be of the following format with **200 HTTP code**:
```json
{
    "entity_id": "uuid4_for_entity",
    "progress": [
        {
            "status": "completed",
            "message": null,
            "statement_id": "uuid4_for_statement"
        }
    ],
    "accounts": [
        {
            "months": [
                "2018-11",
                "2018-12",
                "2019-01"
            ],
            "statements": [
                "uuid4_for_statement"
            ],
            "account_id": "uuid4_for_account",
            "ifsc": null,
            "micr": null,
            "account_category": "individual",
            "account_number": "Account Number Extracted",
            "bank": "axis"
        }
    ],
    "fraud": {
        "fraudulent_statements": [
            "uuid4_for_statement"
        ],
        "fraud_type": [
            {
                "statement_id": "uuid4_for_statement",
                "fraud_type": "some_fraud_type",
                "account_id": "uuid4_for_account",
                "fraud_category": "some_fraud_category",
                "transaction_hash": null
            }
        ]
    },
    "transactions": [
      {
          "transaction_note": "SOME LONG TRANSACTION NOTE",
          "hash": "unique_transaction_identifier_1",
          "description": "lender_transaction",
          "account_id": "uuid4_for_account",
          "transaction_type": "debit",
          "amount": 5188.0,
          "date": "2018-12-12 00:00:00",
          "merchant_category": "",
          "balance": 27494.78,
          "transaction_channel": "net_banking_transfer"
      },
      {
          "transaction_note": "SOME LONG TRANSACTION NOTE",
          "hash": "unique_transaction_identifier_2",
          "description": "lender_transaction",
          "account_id": "uuid4_for_account",
          "transaction_type": "debit",
          "amount": 5188.0,
          "date": "2019-01-08 00:00:00",
          "merchant_category": "",
          "balance": 922.15,
          "transaction_channel": "net_banking_transfer"
      }
    ]
}
```
The response fields are the same as in [List Accounts](/bank-connect/rest-api.html#list-accounts), but there is an additional `transactions` field that holds an array of lender transaction objects. Each object has the following fields:
- `transaction_note`: exact transaction note / description present in the statement PDF
- `hash`: a unique identifying hash for each transaction
- `description`: describes more information about the `transaction_channel` field. Refer to [this](/bank-connect/appendix.html#description) list for possible values.
- `account_id`: unique UUID4 identifier for the account to which the transaction belongs to
- `transaction_type`: can be `debit` or `credit`
- `amount`: indicates the transaction amount
- `date`: date of transaction
- `merchant_category`: the category of the merchant in case a transaction is with a merchant. Refer to [this](/bank-connect/appendix.html#merchant-category) list of possible values.
- `balance`: account balance just after this transaction
- `transaction_channel`: refer to [this](/bank-connect/appendix.html#transaction-channel) list for possible values.

## Expense Categories <Badge text="New" />
Get expense category wise percentage distribution of transaction amounts for a given entity.

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/`<entity_id>`/get_expense_categories/**
:::

### Authentication
Request headers `x-api-key` with API Key as value and `server-hash` with Server Hash as value must be present in request.

### Query Parameters
Query parameters can be appended at end of the URL like `/?account_id=somevalue`

| Parameter | Optional | Type | Description |
| - | - | - | - |
| account_id | Yes | String | If specified, it filter outs the transactions for a particular account | 

### Response
On fetching information successfully, the response would be of the following format with **200 HTTP code**:
```json
{
    "entity_id": "uuid4_for_entity",
    "progress": [
        {
            "statement_id": "uuid4_for_statement",
            "status": "completed",
            "message": null
        }
    ],
    "categories": [
        {
            "category": "Transfers",
            "percentage": 46
        },
        {
            "category": "Bills",
            "percentage": 42
        },
        {
            "category": "Loans",
            "percentage": 5
        },
        {
            "category": "Ewallet",
            "percentage": 5
        },
        {
            "category": "Cash",
            "percentage": 1
        },
        {
            "category": "Others",
            "percentage": 1
        }
    ]
}
```
Here, the `progress` field holds an array of statement wise progress status, while the `categories` field holds a list of objects each having following fields:

| Field | Type | Description |
| - | - | - |
| category | String | contains the expense category, it is a mix of [merchant category](/bank-connect/appendix.html#merchant-category) and [transaction channel](/bank-connect/appendix.html#transaction-channel) |
| percentage | Integer | percentage for the expense category rounded to nearest integer with some of all percentage equal to 100 |

## Monthly Analysis <Badge text="New" />
Get monthly analysis for a given entity.

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/`<entity_id>`/monthly_analysis/**
:::

### Authentication
Request headers `x-api-key` with API Key as value and `server-hash` with Server Hash as value must be present in request.

### Response
On fetching information successfully, the response would be of the following format with **200 HTTP code**:
```json
{
    "entity_id": "uuid4_for_entity",
    "progress": [
        {
            "status": "completed",
            "message": null,
            "statement_id": "uuid4_for_statement"
        }
    ],
    "monthly_analysis": {
        "amt_bill_payment_debit": {
            "Feb-2020": 1107,
            "Jan-2020": 0,
            "Dec-2019": 0,
            "Mar-2020": 574
        },
        "avg_credit_transaction_size": {
            "Feb-2020": 4432,
            "Jan-2020": 3134,
            "Dec-2019": 141,
            "Mar-2020": 3465
        },
        ...
    }
}
```
Here, the `progress` field holds an array of statement wise progress status, while the `monthly_analysis` field holds an object of fields, each having an object of month-wise keys having numerical values.

Months are represented in `Mmm-YYYY` format in key.

Different fields that hold this monthly analysis are as follows:

- `amt_auto_debit_payment_bounce_credit`: Total Amount of Auto debit bounce
- `amt_auto_debit_payment_debit`: Total Amount of Auto-Debit Payments
- `amt_bank_charge_debit`: Total Amount of Bank Charges
- `amt_bank_interest_credit`: Total Amount of Bank Interest
- `amt_bill_payment_debit`: Total Amount of Bill Payments
- `amt_cash_deposit_credit`: Total Amount of Cash Deposited
- `amt_cash_withdrawl_debit`: Total Amount of Cash Withdrawal
- `amt_chq_credit`: Total Amount Credited through Cheque
- `amt_chq_debit`: Total Amount Debited through Cheque
- `amt_credit`: Total Amount Credited
- `amt_debit`: Total Amount Debited
- `amt_debit_card_debit`: Total Amount Spend through Debit card
- `amt_international_transaction_arbitrage_credit`: Total Amount of International Credit
- `amt_international_transaction_arbitrage_debit`: Total Amount of International Debit
- `amt_investment_cashin_credit`: Total Amount of Investment Cash-ins
- `amt_net_banking_transfer_credit`: Total Amount Credited through transfers
- `amt_net_banking_transfer_debit`: Total Amount Debited through transfers
- `amt_outward_cheque_bounce_debit`: Total Amount Debited through Outward Cheque Bounce
- `amt_inward_cheque_bounce_credit`: Total Amount Credited through Inward Cheque Bounce
- `amt_payment_gateway_purchase_debit`: Total Amount of Payment Gateway Purchase
- `amt_refund_credit`: Total Amount of Refund
- `amt_upi_credit`: Total Amount Credited through UPI
- `amt_upi_debit`: Total Amount Debited through UPI
- `amt_emi_debit`: Total Amount Debited as Loan EMI
- `amt_credit_card_bill_debit` : Total Amount Debited for Credit Card Bill
- `amt_investment` : Total Amount of Investments
- `amt_loan_credits`: Total Amount of Loan Credits
- `avg_bal`: Average Balance* ( = Average of EOD Balances after filling in missing daily Balances) 
- `avg_credit_transaction_size`: Average Credit Transaction Size
- `avg_debit_transaction_size`: Average Debit Transaction Size
- `avg_emi`: Average Loan EMI Amount
- `closing_balance`: Closing balance
- `cnt_auto_debit_payment_bounce_credit`: Number of Auto-Debit Bounces
- `cnt_auto_debit_payment_debit`: Number of Auto-debited payments
- `cnt_bank_charge_debit`: Number of Bank Charge payments
- `cnt_bank_interest_credit`: Number of Bank Interest Credits
- `cnt_bill_payment_debit`: Number of Bill Payments
- `cnt_cash_deposit_credit`: Number of Cash Deposit Transactions
- `cnt_cash_withdrawl_debit`: Number of Cash Withdrawal Transactions
- `cnt_chq_credit`: Number of Credit Transactions through cheque
- `cnt_chq_debit`: Number of Debit Transactions through cheque
- `cnt_credit`: Number of Credit Transactions
- `cnt_debit`: Number of Debit Transactions
- `cnt_debit_card_debit`: Number of Debit Card Transactions
- `cnt_international_transaction_arbitrage_credit`: Number of International Credit transactions
- `cnt_international_transaction_arbitrage_debit`: Number of International Debit transactions
- `cnt_investment_cashin_credit`: Number of Investment Cash-ins
- `cnt_net_banking_transfer_credit`: Number of Net Banking Credit Transactions
- `cnt_net_banking_transfer_debit`: Number of Net Banking Debit Transactions
- `cnt_outward_cheque_bounce_debit`: Number of Debit Transactions through Outward Cheque Bounce
- `cnt_inward_cheque_bounce_credit`: Number of Credit Transactions through Inward Cheque Bounce
- `cnt_payment_gateway_purchase_debit`: Number of Payment Gateway Purchase
- `cnt_emi_debit`: Number of Loan EMI Debit Transactions
- `cnt_refund_credit`: Number of Refund Transactions
- `cnt_transactions`: Number of Transactions
- `cnt_upi_credit`: Number of Credit Transactions through UPI
- `cnt_upi_debit`: Number of Debit Transactions through UPI
- `cnt_investment` : Number of Investment
- `cnt_credit_card_bill_debit` : Number of Credit Card Bill Transactions
- `cnt_loan_credis`: Number of Loan Credit Transactions
- `max_bal`: Maximum Balance
- `max_eod_balance`: Maximum EOD Balance
- `median_balance`: Median Balance* ( = Median of EOD Balances after filling in missing daily Balances) 
- `min_bal`: Minimum Balance
- `min_eod_balance`: Minimum EOD Balance
- `mode_balance`: Mode Balance* ( = Mode of EOD Balances after filling in missing daily Balances)
- `net_cash_inflow`: Net Cashflow
- `opening_balance`: Opening Balance
- `number_of_salary_transactions`: Number of Salary Transactions
- `total_amount_of_salary`: Total Amount of Salary
- `perc_salary_spend_bill_payment`: % Salary Spent on Bill Payment (7 days)
- `perc_salary_spend_cash_withdrawl`: % Salary Spent Through Cash Withdrawal (7 days)
- `perc_salary_spend_debit_card`: % Salary Spent through Debit Card (7 days)
- `perc_salary_spend_net_banking_transfer`: % Salary Spent through Net Banking (7 days)
- `perc_salary_spend_upi`: % Salary Spent through UPI (7 days)

> \* We extrapolate previous available EOD balance as a proxy for EOD balances for dates missing in the statement. In case when no previous EOD balance is available, EOD balance of the closest available dates are used.


<!-- ## Transactions in Excel Workbook <Badge text="New" />
Get **enriched transactions** and **monthly analysis** for a given entity **account wise** in .xlsx (Excel workbook) format.

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/`<entity_id>`/raw_excel_report/**
:::

### Authentication
Request headers `x-api-key` with API Key as value and `server-hash` with Server Hash as value must be present in request.

### Response
On fetching information successfully, the response would be of the following format with **200 HTTP code**:
```json
{
    "entity_id": "uuid4_for_entity",
    "progress": [
        {
            "status": "completed",
            "message": null,
            "statement_id": "uuid4_for_statement"
        }
    ],
    "reports": [
        {
            "link": "long_url_for_the_excel_report",
            "account_id": "uuid4_for_account"
        }
    ]
}
```

The list value of `reports` key will be empty if any one of the statements have the `status` value other than `completed` in `progress`. When the transactions are successfully processed for all statements, within the entity, a list of report links will be available account wise.

In the case of multiple accounts within the same entity, you can have multiple reports within the `reports` key. The `account_id` will represent the account for which the report is, while the `link` key holds URL for the **.xlsx file**. The link will be active only for **1-hour**, post which the API has to be re-hit to obtain the new link.

The Excel workbook will contain three worksheets, first containing the extracted information like Account Holder's Name, Bank, Account Number, Missing Periods, Available Periods, etc., the second sheet contains the enriched extracted transactions for the account, and the third sheet contains the monthly analysis for the account. -->

## Detailed Excel Report <Badge text="New" />
Get detailed report for a given entity **account wise** in .xlsx (Excel workbook) format.

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/`<entity_id>`/xlsx_report/**
:::

### Authentication
Request headers `x-api-key` with API Key as value and `server-hash` with Server Hash as value must be present in request.

### Response
On fetching information successfully, the response would be of the following format with **200 HTTP code**:
```json
{
    "entity_id": "uuid4_for_entity",
    "progress": [
        {
            "status": "completed",
            "message": null,
            "statement_id": "uuid4_for_statement"
        }
    ],
    "reports": [
        {
            "link": "long_url_for_the_excel_report",
            "account_id": "uuid4_for_account"
        }
    ]
}
```

The list value of `reports` key will be empty if any one of the statements have the `status` value as `processing` in `progress`. When the transactions are successfully processed for all statements, within the entity, a list of report links will be available account wise.

In the case of multiple accounts within the same entity, you can have multiple reports within the `reports` key. The `account_id` will represent the account for which the report is, while the `link` key holds URL for the **.xlsx file**. The link will be active only for **1-hour**, post which the API has to be re-hit to obtain the new link.

The Excel workbook contains a detailed analysis of different parameters in the form of separate sheets.

## Predictors <Badge text="beta" type="warn" />
Give **account wise** predictors for a given entity.

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/`<entity_id>`/predictors/**
:::

### Authentication
Request headers `x-api-key` with API Key as value and `server-hash` with Server Hash as value must be present in request.

### Response
On fetching information successfully, the response would be of the following format with **200 HTTP code**:
```json
{
    "entity_id": "uuid4_for_entity",
    "progress": [
        {
            "status": "completed",
            "message": null,
            "statement_id": "uuid4_for_statement"
        }
    ],
    "predictors": [
        {
            "account_id": "uuid4_for_account",
            "predictors": {
                "end_date": "15-Apr-20",
                "start_date": "29-Sep-19",
                "avg_expense_to_income_perc": 113.99999999999999,
                "avg_monthly_closing_balance": 27637.93,
                ...
            }
        }
    ]
}
```

The list value of `predictors` key will be empty if any one of the statements have the `status` value as `processing` in `progress`. When the transactions are successfully processed for all statements, within the entity, it will be the list of account wise predictors, with `account_id` indicating the account.

`predictors` key present in each of the account-wise object, will have following keys:

| Field                         | Type            | Description                                                  |
| ----------------------------- | --------------- | ------------------------------------------------------------ |
| customer_name                 | String or `null`  | name of the account holder                                   |
| bank_name                     | String or `null`  | bank identifier to which the account belongs                 |
| account_type                  | String or `null`  | account category                                             |
| accountnumber                 | Integer or `null` | account number                                               |
| ifsc_code                     | String or `null`  | IFSC code of bank account                                    |
| month_0                       | String or `null`  | name of the month 0 in format (Mmm-yy)                       |
| month_1                       | String or `null`  | name of the month 1 in format (Mmm-yy)                       |
| month_2                       | String or `null`  | name of the month 2 in format (Mmm-yy)                       |
| month_3                       | String or `null`  | name of the month 3 in format (Mmm-yy)                       |
| month_4                       | String or `null`  | name of the month 4 in format (Mmm-yy)                       |
| month_5                       | String or `null`  | name of the month 5 in format (Mmm-yy)                       |
| end_date                      | Float or `null`   | last date of transaction in 6 months                         |
| start_date                    | String or `null`  | first date of transaction                                    |
| month_duration                | Integer         | total number of months                                       |
| annualised_credit             | Float           | total amount credited in 1 year (credits/total days)*365)    |
| avg_balance_0                 | Float or `null`   | average eod balance of month 0 (filling in missing balances) |
| avg_balance_1                 | Float or `null`   | average eod balance of month 1 (filling in missing balances) |
| avg_balance_2                 | Float or `null`   | average eod balance of month 2 (filling in missing balances) |
| avg_balance_3                 | Float or `null`   | average eod balance of month 3 (filling in missing balances) |
| avg_balance_4                 | Float or `null`   | average eod balance of month 4 (filling in missing balances) |
| avg_balance_5                 | Float or `null`   | average eod balance of month 5 (filling in missing balances) |
| avg_daily_closing_balance     | Float           | average of sum of closing balance to total days              |
| avg_monthly_closing_balance   | Float           | average of sum of closing balance to month duration          |
| bal_last_0                    | Float or `null`   | eod balance on last date of month 0 (filling in missing balances) |
| bal_last_1                    | Float or `null`   | eod balance on last date of month 1 (filling in missing balances) |
| bal_last_2                    | Float or `null`   | eod balance on last date of month 2 (filling in missing balances) |
| bal_last_3                    | Float or `null`   | eod balance on last date of month 3 (filling in missing balances) |
| bal_last_4                    | Float or `null`   | eod balance on last date of month 4 (filling in missing balances) |
| bal_last_5                    | Float or `null`   | eod balance on last date of month 5 (filling in missing balances) |
| balance_on_10th_0             | Float or `null`   | eod balance on 10th of month 0 (filling in missing balances) |
| balance_on_10th_1             | Float or `null`   | eod balance on 10th of month 1 (filling in missing balances) |
| balance_on_10th_2             | Float or `null`   | eod balance on 10th of month 2 (filling in missing balances) |
| balance_on_10th_3             | Float or `null`   | eod balance on 10th of month 3 (filling in missing balances) |
| balance_on_10th_4             | Float or `null`   | eod balance on 10th of month 4 (filling in missing balances) |
| balance_on_10th_5             | Float or `null`   | eod balance on 10th of month 5 (filling in missing balances) |
| balance_on_15th_0             | Float or `null`   | eod balance on 15th of month 0 (filling in missing balances) |
| balance_on_15th_1             | Float or `null`   | eod balance on 15th of month 1 (filling in missing balances) |
| balance_on_15th_2             | Float or `null`   | eod balance on 15th of month 2 (filling in missing balances) |
| balance_on_15th_3             | Float or `null`   | eod balance on 15th of month 3 (filling in missing balances) |
| balance_on_15th_4             | Float or `null`   | eod balance on 15th of month 4 (filling in missing balances) |
| balance_on_15th_5             | Float or `null`   | eod balance on 15th of month 5 (filling in missing balances) |
| balance_on_1st_0              | Float or `null`   | eod balance on 1st of month 0 (filling in missing balances)  |
| balance_on_1st_1              | Float or `null`   | eod balance on 1st of month 1 (filling in missing balances)  |
| balance_on_1st_2              | Float or `null`   | eod balance on 1st of month 2 (filling in missing balances)  |
| balance_on_1st_3              | Float or `null`   | eod balance on 1st of month 3 (filling in missing balances)  |
| balance_on_1st_4              | Float or `null`   | eod balance on 1st of month 4 (filling in missing balances)  |
| balance_on_1st_5              | Float or `null`   | eod balance on 1st of month 5 (filling in missing balances)  |
| balance_on_20th_0             | Float or `null`   | eod balance on 20th of month 0 (filling in missing balances) |
| balance_on_20th_1             | Float or `null`   | eod balance on 20th of month 1 (filling in missing balances) |
| balance_on_20th_2             | Float or `null`   | eod balance on 20th of month 2 (filling in missing balances) |
| balance_on_20th_3             | Float or `null`   | eod balance on 20th of month 3 (filling in missing balances) |
| balance_on_20th_4             | Float or `null`   | eod balance on 20th of month 4 (filling in missing balances) |
| balance_on_20th_5             | Float or `null`   | eod balance on 20th of month 5 (filling in missing balances) |
| balance_on_25th_0             | Float or `null`   | eod balance on 25th of month 0 (filling in missing balances) |
| balance_on_25th_1             | Float or `null`   | eod balance on 25th of month 1 (filling in missing balances) |
| balance_on_25th_2             | Float or `null`   | eod balance on 25th of month 2 (filling in missing balances) |
| balance_on_25th_3             | Float or `null`   | eod balance on 25th of month 3 (filling in missing balances) |
| balance_on_25th_4             | Float or `null`   | eod balance on 25th of month 4 (filling in missing balances) |
| balance_on_25th_5             | Float or `null`   | eod balance on 25th of month 5 (filling in missing balances) |
| balance_on_30th_0             | Float or `null`   | eod balance on 30th of month 0 (filling in missing balances) |
| balance_on_30th_1             | Float or `null`   | eod balance on 30th of month 1 (filling in missing balances) |
| balance_on_30th_2             | Float or `null`   | eod balance on 30th of month 2 (filling in missing balances) |
| balance_on_30th_3             | Float or `null`   | eod balance on 30th of month 3 (filling in missing balances) |
| balance_on_30th_4             | Float or `null`   | eod balance on 30th of month 4 (filling in missing balances) |
| balance_on_30th_5             | Float or `null`   | eod balance on 30th of month 5 (filling in missing balances) |
| balance_on_5th_0              | Float or `null`   | eod balance on 5th of month 0 (filling in missing balances)  |
| balance_on_5th_1              | Float or `null`   | eod balance on 5th of month 1 (filling in missing balances)  |
| balance_on_5th_2              | Float or `null`   | eod balance on 5th of month 2 (filling in missing balances)  |
| balance_on_5th_3              | Float or `null`   | eod balance on 5th of month 3 (filling in missing balances)  |
| balance_on_5th_4              | Float or `null`   | eod balance on 5th of month 4 (filling in missing balances)  |
| balance_on_5th_5              | Float or `null`   | eod balance on 5th of month 5 (filling in missing balances)  |
| bal_avgof_6dates_0            | Float or `null`   | average eod balances of 6 days for month 0 (filling in missing balances) |
| bal_avgof_6dates_1            | Float or `null`   | average eod balances of 6 days for month 1 (filling in missing balances) |
| bal_avgof_6dates_2            | Float or `null`   | average eod balances of 6 days for month 2 (filling in missing balances) |
| bal_avgof_6dates_3            | Float or `null`   | average eod balances of 6 days for month 3 (filling in missing balances) |
| bal_avgof_6dates_4            | Float or `null`   | average eod balances of 6 days for month 4 (filling in missing balances) |
| bal_avgof_6dates_5            | Float or `null`   | average eod balances of 6 days for month 5 (filling in missing balances) |
| cash_withdrawals              | Integer         | number of cash withdrawal transactions in last 6 months      |
| chq_deposits                  | Integer         | number of credit transactions through cheque in last 6 months |
| chq_issues                    | Integer         | number of debit transactions through cheque in last 6 months |
| credits                       | Float           | total amount of credit transactions in last 6 months         |
| credits_0                     | Float or `null`   | total amount of credit transactions in month 0               |
| credits_1                     | Float or `null`   | total amount of credit transactions in month 1               |
| credits_2                     | Float or `null`   | total amount of credit transactions in month 2               |
| credits_3                     | Float or `null`   | total amount of credit transactions in month 3               |
| credits_4                     | Float or `null`   | total amount of credit transactions in month 4               |
| credits_5                     | Float or `null`   | total amount of credit transactions in month 5               |
| debitless_charges             | Float           | total amount of bank charges in last 6 months                |
| debitless_charges_0           | Float or `null`   | total amount of bank charges in month 0                      |
| debitless_charges_1           | Float or `null`   | total amount of bank charges in month 1                      |
| debitless_charges_2           | Float or `null`   | total amount of bank charges in month 2                      |
| debitless_charges_3           | Float or `null`   | total amount of bank charges in month 3                      |
| debitless_charges_4           | Float or `null`   | total amount of bank charges in month 4                      |
| debitless_charges_5           | Float or `null`   | total amount of bank charges in month 5                      |
| debits                        | Float           | total amount of debit transactions in last 6 months          |
| debits_0                      | Float or `null`   | total amount of debit transactions in month 0                |
| debits_1                      | Float or `null`   | total amount of debit transactions in month 1                |
| debits_2                      | Float or `null`   | total amount of debit transactions in month 2                |
| debits_3                      | Float or `null`   | total amount of debit transactions in month 3                |
| debits_4                      | Float or `null`   | total amount of debit transactions in month 4                |
| debits_5                      | Float or `null`   | total amount of debit transactions in month 5                |
| expense_0                     | Float or `null`   | total amount of debit in month 0 excluding amount of outward cheque bounce |
| expense_1                     | Float or `null`   | total amount of debit in month 1 excluding amount of outward cheque bounce |
| expense_2                     | Float or `null`   | total amount of debit in month 2 excluding amount of outward cheque bounce |
| expense_3                     | Float or `null`   | total amount of debit in month 3 excluding amount of outward cheque bounce |
| expense_4                     | Float or `null`   | total amount of debit in month 4 excluding amount of outward cheque bounce |
| expense_5                     | Float or `null`   | total amount of debit in month 5 excluding amount of outward cheque bounce |
| avg_monthly_expense           | Float           | average of total amount of expense to month duration         |
| expense_to_income_ratio_5     | Float or `null`   | ratio of expense to income for month 5                       |
| income_0                      | Float or `null`   | total amount of credit in month 0 excluding amount of inward cheque bounce, auto debit payment bounce, international transaction arbitrage credits and loan credits |
| income_1                      | Float or `null`   | total amount of credit in month 1 excluding amount of inward cheque bounce, auto debit payment bounce, international transaction arbitrage credits and loan credits  |
| income_2                      | Float or `null`   | total amount of credit in month 2 excluding amount of inward cheque bounce, auto debit payment bounce, international transaction arbitrage credits and loan credits  |
| income_3                      | Float or `null`   | total amount of credit in month 3 excluding amount of inward cheque bounce, auto debit payment bounce, international transaction arbitrage credits and loan credits  |
| income_4                      | Float or `null`   | total amount of credit in month 4 excluding amount of inward cheque bounce, auto debit payment bounce, international transaction arbitrage credits and loan credits  |
| income_5                      | Float or `null`   | total amount of credit in month 5 excluding amount of inward cheque bounce, auto debit payment bounce, international transaction arbitrage credits and loan credits  |
| avg_monthly_income            | Float           | average of total amount of income to month duration                        |
| avg_expense_to_income_perc    | Float           | average total amount of expense to total income percentage   |
| expense_to_income_ratio_0     | Float or `null`   | ratio of expense to income for month 0                       |
| expense_to_income_ratio_1     | Float or `null`   | ratio of expense to income for month 1                       |
| expense_to_income_ratio_2     | Float or `null`   | ratio of expense to income for month 2                       |
| expense_to_income_ratio_3     | Float or `null`   | ratio of expense to income for month 3                       |
| expense_to_income_ratio_4     | Float or `null`   | ratio of expense to income for month 4                       |
| inward_chq_bounces            | Float           | total amount credited through inward cheque bounce in last 6 months |
| max_balance_0                 | Float or `null`   | maximum balance in month 0                                   |
| max_balance_1                 | Float or `null`   | maximum balance in month 1                                   |
| max_balance_2                 | Float or `null`   | maximum balance in month 2                                   |
| max_balance_3                 | Float or `null`   | maximum balance in month 3                                   |
| max_balance_4                 | Float or `null`   | maximum balance in month 4                                   |
| max_balance_5                 | Float or `null`   | maximum balance in month 5                                   |
| min_balance_0                 | Float or `null`   | minimum balance in month 0                                   |
| min_balance_1                 | Float or `null`   | minimum balance in month 1                                   |
| min_balance_2                 | Float or `null`   | minimum balance in month 2                                   |
| min_balance_3                 | Float or `null`   | minimum balance in month 3                                   |
| min_balance_4                 | Float or `null`   | minimum balance in month 4                                   |
| min_balance_5                 | Float or `null`   | minimum balance in month 5                                   |
| net_banking_credits           | Float           | total amount credited through transfers                      |
| net_banking_debits            | Float           | total amount debited through transfers                       |
| number_of_transactions_0      | Integer or `null` | number of transactions in month 0                            |
| number_of_transactions_1      | Integer or `null` | number of transactions in month 1                            |
| number_of_transactions_2      | Integer or `null` | number of transactions in month 2                            |
| number_of_transactions_3      | Integer or `null` | number of transactions in month 3                            |
| number_of_transactions_4      | Integer or `null` | number of transactions in month 4                            |
| number_of_transactions_5      | Integer or `null` | number of transactions in month 5                            |
| outward_chq_bounces           | Float           | total amount debited through outward cheque bounce in last 6 months |
| pos_expenses                  | Float           | total amount spend through debit card in last 6 months       |
| reversals                     | Float           | total amount of refund in last 6 months                      |
| total_bounce_or_penal_charge  | Float           | total amount of bounce or penal charges in last 6 months     |
| total_cash_withdrawal         | Float           | total amount of cash withdrawal in last 6 months             |
| total_chq_deposit             | Float           | total amount credited through cheque in last 6 months        |
| total_chq_issue               | Float           | total amount debited through cheque in last 6 months         |
| total_creditcard_payment      | Float           | total amount of credit card payment in last 6 months         |
| total_creditcard_payment_0    | Float or `null`   | total amount of credit card payment in month 0               |
| total_creditcard_payment_1    | Float or `null`   | total amount of credit card payment in month 1               |
| total_creditcard_payment_2    | Float or `null`   | total amount of credit card payment in month 2               |
| total_creditcard_payment_3    | Float or `null`   | total amount of credit card payment in month 3               |
| total_creditcard_payment_4    | Float or `null`   | total amount of credit card payment in month 4               |
| total_creditcard_payment_5    | Float or `null`   | total amount of credit card payment in month 5               |
| total_emi_ecs_loan            | Float           | total amount debited as loan emi in last 6 months            |
| total_expense                 | Float           | total amount of expense in last 6 months                     |
| total_income                  | Float           | total amount of income in last 6 months                      |
| total_inward_payment_bounce_0 | Float or `null`   | total amount of inward payment bounce in month 0             |
| total_inward_payment_bounce_1 | Float or `null`   | total amount of inward payment bounce in month 1             |
| total_inward_payment_bounce_2 | Float or `null`   | total amount of inward payment bounce in month 2             |
| total_inward_payment_bounce_3 | Float or `null`   | total amount of inward payment bounce in month 3             |
| total_inward_payment_bounce_4 | Float or `null`   | total amount of inward payment bounce in month 4             |
| total_inward_payment_bounce_5 | Float or `null`   | total amount of inward payment bounce in month 5             |
| total_salary_0                | Float or `null`   | total amount of salary credited in month 0                   |
| total_salary_1                | Float or `null`   | total amount of salary credited in month 1                   |
| total_salary_2                | Float or `null`   | total amount of salary credited in month 2                   |
| total_salary_3                | Float or `null`   | total amount of salary credited in month 3                   |
| total_salary_4                | Float or `null`   | total amount of salary credited in month 4                   |
| total_salary_5                | Float or `null`   | total amount of salary credited in month 5                   |
| balance_net_off_on_1st_0 | Float or `null` | eod balance on 1st of month 0 excluding loan credits |
| balance_net_off_on_1st_1 | Float or `null` | eod balance on 1st of month 1 excluding loan credits |
| balance_net_off_on_1st_2 | Float or `null` | eod balance on 1st of month 2 excluding loan credits |
| balance_net_off_on_1st_3 | Float or `null` | eod balance on 1st of month 3 excluding loan credits |
| balance_net_off_on_1st_4 | Float or `null` | eod balance on 1st of month 4 excluding loan credits |
| balance_net_off_on_1st_5 | Float or `null` | eod balance on 1st of month 5 excluding loan credits |
| balance_net_off_on_5th_0 | Float or `null` | eod balance on 5th of month 0 excluding loan credits |
| balance_net_off_on_5th_1 | Float or `null` | eod balance on 5th of month 1 excluding loan credits |
| balance_net_off_on_5th_2 | Float or `null` | eod balance on 5th of month 2 excluding loan credits |
| balance_net_off_on_5th_3 | Float or `null` | eod balance on 5th of month 3 excluding loan credits |
| balance_net_off_on_5th_4 | Float or `null` | eod balance on 5th of month 4 excluding loan credits |
| balance_net_off_on_5th_5 | Float or `null` | eod balance on 5th of month 5 excluding loan credits |
| balance_net_off_on_10th_0 | Float or `null` | eod balance on 10th of month 0 excluding loan credits |
| balance_net_off_on_10th_1 | Float or `null` | eod balance on 10th of month 1 excluding loan credits |
| balance_net_off_on_10th_2 | Float or `null` | eod balance on 10th of month 2 excluding loan credits |
| balance_net_off_on_10th_3 | Float or `null` | eod balance on 10th of month 3 excluding loan credits |
| balance_net_off_on_10th_4 | Float or `null` | eod balance on 10th of month 4 excluding loan credits |
| balance_net_off_on_10th_5 | Float or `null` | eod balance on 10th of month 5 excluding loan credits |
| balance_net_off_on_15th_0 | Float or `null` | eod balance on 15th of month 0 excluding loan credits |
| balance_net_off_on_15th_1 | Float or `null` | eod balance on 15th of month 1 excluding loan credits |
| balance_net_off_on_15th_2 | Float or `null` | eod balance on 15th of month 2 excluding loan credits |
| balance_net_off_on_15th_3 | Float or `null` | eod balance on 15th of month 3 excluding loan credits |
| balance_net_off_on_15th_4 | Float or `null` | eod balance on 15th of month 4 excluding loan credits |
| balance_net_off_on_15th_5 | Float or `null` | eod balance on 15th of month 5 excluding loan credits |
| balance_net_off_on_20th_0 | Float or `null` | eod balance on 20th of month 0 excluding loan credits |
| balance_net_off_on_20th_1 | Float or `null` | eod balance on 20th of month 1 excluding loan credits |
| balance_net_off_on_20th_2 | Float or `null` | eod balance on 20th of month 2 excluding loan credits |
| balance_net_off_on_20th_3 | Float or `null` | eod balance on 20th of month 3 excluding loan credits |
| balance_net_off_on_20th_4 | Float or `null` | eod balance on 20th of month 4 excluding loan credits |
| balance_net_off_on_20th_5 | Float or `null` | eod balance on 20th of month 5 excluding loan credits |
| balance_net_off_on_25th_0 | Float or `null` | eod balance on 25th of month 0 excluding loan credits |
| balance_net_off_on_25th_1 | Float or `null` | eod balance on 25th of month 1 excluding loan credits |
| balance_net_off_on_25th_2 | Float or `null` | eod balance on 25th of month 2 excluding loan credits |
| balance_net_off_on_25th_3 | Float or `null` | eod balance on 25th of month 3 excluding loan credits |
| balance_net_off_on_25th_4 | Float or `null` | eod balance on 25th of month 4 excluding loan credits |
| balance_net_off_on_25th_5 | Float or `null` | eod balance on 25th of month 5 excluding loan credits |
| balance_net_off_on_30th_0 | Float or `null` | eod balance on 30th of month 0 excluding loan credits |
| balance_net_off_on_30th_1 | Float or `null` | eod balance on 30th of month 1 excluding loan credits |
| balance_net_off_on_30th_2 | Float or `null` | eod balance on 30th of month 2 excluding loan credits |
| balance_net_off_on_30th_3 | Float or `null` | eod balance on 30th of month 3 excluding loan credits |
| balance_net_off_on_30th_4 | Float or `null` | eod balance on 30th of month 4 excluding loan credits |
| balance_net_off_on_30th_5 | Float or `null` | eod balance on 30th of month 5 excluding loan credits |

:::warning NOTE
- month decreases going from 0 to 5, that is month 0 is the latest month while 5 is older
- `null` value will come for some fields (mentioned in types), when that month's data is unavailable
- total days = (`end_date` - `start_date`) in days
:::