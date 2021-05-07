---
base_url: https://portal.finbox.in/bank-connect #base URL for the API
version: v1 # version of API
---

# BankConnect: Fetching Enriched data using REST API
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

`progress` is an array of objects. Each object represents a statement and has the following fields:

| Field | Type | Description |
| - | - | - |
| `status` | String or `null` | Indicates the progress for a statement, and can be `processing`, `completed` or `failed`|
| `statement_id` | String | Identifies a statement uniquely |
| `source` | String | Indicates the source by which the PDF came from. Can be `online` (Net Banking Mode) or `pdf` |
| `message` | String or `null` | An additional message about the progress of the statement |

Sample `progress` value:
```json
[
  {
    "status": "completed",
    "message": null,
    "statement_id": "some_uuid4_1",
    "source": "pdf"
  },
  {
    "status": "processing",
    "message": null,
    "statement_id": "some_uuid4_2",
    "source": "online"
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
            "statement_id": "uuid4_for_statement",
            "source": "pdf"
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
            "credit_limit": "credit limit extracted ",
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
    | credit_limit   | Integer |  limit up to which a company can withdraw from the working capital limit sanctioned |

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
            "statement_id": "uuid4_for_statement",
            "status": "completed",
            "message": null,
            "source": "pdf"
        }
    ],
    "accounts": [
        {
            "account_number": "Account Number Extracted",
            "bank": "sbi",
            "account_id": "uuid4_for_account",
            "micr": null,
            "account_category": "individual",
            "statements": [
                "uuid4_for_statement"
            ],
            "ifsc": null,
            "months": [
                "2019-12",
                "2020-01",
                "2020-02",
                "2020-03"
            ]
        }
    ],
    "fraud": {
        "fraudulent_statements": [],
        "fraud_type": []
    },
    "identity": [
        {
            "name": "Extracted Name",
            "account_category": "individual",
            "credit_limit": 0,
            "account_number": "Extracted Account Number",
            "address": "Extracted Address",
            "account_id": "uuid4_for_account",
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
            "statement_id": "uuid4_for_statement",
            "source": "pdf"
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
            "statement_id": "uuid4_for_statement",
            "source": "pdf"
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
            "statement_id": "uuid4_for_statement",
            "source": "pdf"
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
            "statement_id": "uuid4_for_statement",
            "source": "pdf"
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
            "message": null,
            "source": "pdf"
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
            "statement_id": "uuid4_for_statement",
            "source": "pdf"
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
- `amt_income_credit`: Total Amount Credited excluding inward cheque bounce, auto debit payment bounce, international transaction arbitrage credits and loan credits
- `amt_credit`: Total Amount Credited
- `amt_debit`: Total Amount Debited
- `amt_debit_card_debit`: Total Amount Spend through Debit card
- `amt_international_transaction_arbitrage_credit`: Total Amount of credit due to difference in buying and selling of an asset in two diffrent market (credit)
- `amt_international_transaction_arbitrage_debit`: Total Amount of debit due to difference in buying and selling of an asset in two diffrent market (debit)
- `amt_investment_cashin_credit`: Total Amount of Investment Cash-ins
- `amt_net_banking_transfer_credit`: Total Amount Credited through transfers
- `amt_net_banking_transfer_debit`: Total Amount Debited through transfers
- `amt_outward_cheque_bounce_debit`: Total Amount Debited through Outward Cheque Bounce
- `amt_inward_cheque_bounce_credit`: Total Amount Credited through Inward Cheque Bounce
- `amt_outward_cheque_bounce_insuff_funds_debit`: Total Amount Debited through Outward Cheque Bounce Insufficient Funds
- `amt_inward_cheque_bounce_insuff_funds_credit`: Total Amount Credited through Inward Cheque Bounce Insufficient Funds
- `amt_payment_gateway_purchase_debit`: Total Amount of Payment Gateway Purchase
- `amt_refund_credit`: Total Amount of Refund
- `amt_upi_credit`: Total Amount Credited through UPI
- `amt_upi_debit`: Total Amount Debited through UPI
- `amt_emi_debit`: Total Amount Debited as Loan EMI
- `amt_emi_bounce_credit`: Total Amount Credited through EMI Bounce
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
- `cnt_income_credit`: Number of Income Credit Transactions
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
- `cnt_inward_cheque_bounce_insuff_funds_credit`: Number of Credit Transactions through Inward Cheque Bounce Insufficient Funds
- `cnt_outward_cheque_bounce_insuff_funds_debit`: Number of Debit Transactions through Outward Cheque Bounce Insufficient Funds
- `cnt_payment_gateway_purchase_debit`: Number of Payment Gateway Purchase
- `cnt_emi_debit`: Number of Loan EMI Debit Transactions
- `cnt_emi_bounce_credit`: Number of Credit Transactions through EMI Bounce
- `cnt_refund_credit`: Number of Refund Transactions
- `cnt_transactions`: Number of Transactions
- `cnt_upi_credit`: Number of Credit Transactions through UPI
- `cnt_upi_debit`: Number of Debit Transactions through UPI
- `cnt_investment` : Number of Investment
- `cnt_credit_card_bill_debit` : Number of Credit Card Bill Transactions
- `cnt_loan_credits`: Number of Loan Credit Transactions
- `max_bal`: Maximum Balance
- `max_eod_balance`: Maximum EOD Balance
- `median_balance`: Median Balance* ( = Median of EOD Balances after filling in missing daily Balances) 
- `min_bal`: Minimum Balance
- `min_eod_balance`: Minimum EOD Balance
- `mode_balance`: Mode Balance* ( = Mode of EOD Balances after filling in missing daily Balances)
- `net_cash_inflow`: Net Cashflow (Total amount credited - Total amount debited )
- `opening_balance`: Opening Balance
- `number_of_salary_transactions`: Number of Salary Transactions
- `total_amount_of_salary`: Total Amount of Salary
- `perc_salary_spend_bill_payment`: % Salary Spent on Bill Payment (7 days)
- `perc_salary_spend_cash_withdrawl`: % Salary Spent Through Cash Withdrawal (7 days)
- `perc_salary_spend_debit_card`: % Salary Spent through Debit Card (7 days)
- `perc_salary_spend_net_banking_transfer`: % Salary Spent through Net Banking (7 days)
- `perc_salary_spend_upi`: % Salary Spent through UPI (7 days)

> \* We extrapolate previous available EOD balance as a proxy for EOD balances for dates missing in the statement. In case when no previous EOD balance is available, EOD balance of the closest available dates are used.

## Rolling Monthly Analysis <Badge text="New" />
Get Rolling monthly analysis for a given entity.

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/`<entity_id>`/rolling_monthly_analysis/**
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
            "statement_id": "uuid4_for_statement",
            "source": "pdf"
        }
    ],
    "monthly_analysis": {
      "monthly_analysis": {
            "months_order": [
            "month_2",
            "month_1",
            "month_0",
            "3_months_group"
        ],
        "month_2": {
            "opening_balance": {
                "avg": 10687.84,
                "max": 68149.99,
                "min": 68149.99,
                "count": 1,
                "amt": "10687.84"
            },
            "credit": {
                "sum": 6181099.43,
                "avg": 3090549.71,
                "max": 3181099.43,
                "min": 3000000.0,
                "count": 2,
                "max_date": "19-Mar-21",
                "min_date": "18-Mar-21",
                "amt": "6181099.43"
            },
            "cash_deposit_credit": {
                "sum": 0,
                "avg": 0,
                "max": null,
                "min": null,
                "count": 0,
                "max_date": null,
                "min_date": null,
                "amt": "0"
            },
            "calander_months_order": [
              "Jan-21",
              "Feb-21",
              "Mar-21"
              ],
              "Jan-21": {},
              "Feb-21": {},
              "Mar-21": {},
              "3_months_group": {
                    "credit": {
                        "sum": 266474.0,
                        "avg": 20498.0,
                        "max": 191298.0,
                        "min": 1.0,
                        "count": 13,
                        "max_date": "02-Mar-21",
                        "min_date": "21-Jan-21",
                        "amt": "266474.0"
            },
        ...
    }
}
```
Here, the `progress` field holds an array of statement wise progress status, while the `rolling_monthly_analysis` field holds an object of fields, each having an object of month-wise keys having numerical values.

Months are represented in `Mmm-YYYY` format in key.

Different fields that hold this monthly analysis are as follows:
| Fields(Unique)                       | Finbox variables                           | Definition                                                                                                                                                        | Amount Present| Sum | Avg | Max | Min | Count | Max Date | Min Date | Tx Type         | Data format     |
|--------------------------------------|--------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|-----|-----|-----|-----|-------|----------|----------|-----------------|-----------------|
| Bank Balance (Daily Closing Balance) | closing_balance                            | Closing balance                                                                                                                                                   | Yes           | NA  | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit or Credit | rolling 30 days |
| Banking Turnover                     | income                                     | Total Amount of credit in month excluding amount of inward cheque bounce, auto debit payment bounce, international transaction arbitrage credits and loan credits | Yes           | Yes | Yes | Yes | Yes | Yes   | NA       | NA       | Credit          | rolling 30 days |
| EMI                                  | emi_debit                                  | Total Amount Debited as Loan EMI                                                                                                                                  | Yes           | Yes | NA  | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| Total Inward Bounce                  | inward_cheque_bounce_credit                | Total Amount Credited through Inward Cheque Bounce                                                                                                                | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Credit          | rolling 30 days |
| Total Outward Bounce                 | outward_cheque_bounce_debit                | Total Amount Debited through Outward Cheque Bounce                                                                                                                | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| EMI Bounce                           | emi_bounce                                 | Total Amount credited due to emi bounce                                                                                                                           | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Credit          | rolling 30 days |
| Credit Transactions                  | credit                                     | Total Amount of credit transactions                                                                                                                               | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Credit          | rolling 30 days |
| Debit Transactions                   | debit                                      | Total Amount of debit transactions                                                                                                                                | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| Salary                               | salary                                     | Total Amount of Salary Transactions                                                                                                                               | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Credit          | rolling 30 days |
| Credit Card Payment                  | credit_card_bill_debit                     | Total Amount Debited for Credit Card Bill                                                                                                                         | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| Cash Withdrawl                       | cash_withdrawl_debit                       | Total Amount of Cash Withdrawal                                                                                                                                   | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| Investment                           | investment                                 | Total Amount of Investments                                                                                                                                       | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| Interest Earned                      | bank_interest_credit                       | Total Amount of Bank Interest                                                                                                                                     | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Credit          | rolling 30 days |
| Cash Deposits                        | cash_deposit_credit                        | Total Amount of Cash Deposited                                                                                                                                    | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Credit          | rolling 30 days |
| Loan Credit                          | loan_credits                               | Total Amount of Loan Credits                                                                                                                                      | Yes           | Yes | NA  | Yes | Yes | Yes   | Yes      | Yes      | Credit          | rolling 30 days |
| Cheque issued                        | chq_debit                                  | Total Amount Debited through Cheque                                                                                                                               | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| Cheque Deposit                       | chq_credit                                 | Total Amount Credited through Cheque                                                                                                                              | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Credit          | rolling 30 days |
| Ecommerce                            | shopping                                   | i.e. amazon , flipkart,  myntra                                                                                                                                   | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| Bank Charges                         | bank_charge_debit                          | Total Amount of Bank Charges                                                                                                                                      | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| Travel                               | travel                                     | i.e. redbus , olacabs, irctc                                                                                                                                      | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| Fuel                                 | fuel                                       | i.e. petrol , hpcl , gasoline                                                                                                                                     | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| food                                 | food                                       | i.e. zomato , swiggy , burgerking                                                                                                                                 | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| shopping                             | shopping                                   | i.e. supermarket , megamart                                                                                                                                       | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| No of Negative Balance days          | negative_balance_days                      | Number of negative balance days                                                                                                                                   | Yes           | Yes | Yes | Yes | Yes | NA    | NA       | NA       | Debit or Credit | rolling 30 days |
| Digital Payments Presence            | digital_payments                           | i.e. paytm , phonepe, freecharge                                                                                                                                  | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| Discretionary spends                 | discretionary_spends                       | i.e. investments  , medical , entertainment                                                                                                                       | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| Maturity of investment               | investments                                | Number of Investments                                                                                                                                             | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Credit          | rolling 30 days |
| Opening Balance                      | closing_balance                            | Closing balance                                                                                                                                                   | Yes           | NA  | Yes | Yes | Yes | Yes   | NA       | NA       | Debit or Credit | rolling 30 days |
| Closing Balance                      | opening_balance                            | Opening Balance                                                                                                                                                   | Yes           | NA  | Yes | Yes | Yes | Yes   | NA       | NA       | Debit or Credit | rolling 30 days |
| Net Cashflow                         | net_cash_inflow                            | Net Cashflow (credit-debit)                                                                                                                                       | Yes           | Yes | Yes | Yes | Yes | NA    | NA       | NA       | Debit or Credit | rolling 30 days |
| Average Balance /Average monthly Emi | abb_isto_emi                               | Average Balance / Avg Emi of month (If avg emi is 0 , then avg value will be 99)                                                                                  | Yes           | Yes | Yes | Yes | Yes | NA    | NA       | NA       | Debit or Credit | rolling 30 days |
| Refund                               | refund_credit                              | Total Amount of Refund                                                                                                                                            | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Credit          | rolling 30 days |
| Auto Debit                           | auto_debit_payment_debit                   | Total Amount of Auto-Debit Payments                                                                                                                               | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| International Debit                  | international_transaction_arbitrage_debit  | Total Amount of International Debit                                                                                                                               | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| International Credit                 | international_transaction_arbitrage_credit | Total Amount of International Credit                                                                                                                              | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Credit          | rolling 30 days |
| Negative Balance                     | negative_balance                           | Same day multiple transactions with balance < 0 will be count as 1, EOD balance is negative with no transaction on that date will be count as 1                   | Yes           | NA  | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit or Credit | rolling 30 days |
| Min Balance charges                  | min_balance_charge                         | work in progress                                                                                                                                                  | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| Tax Paid                             | tax_paid                                   | work in progress                                                                                                                                                  | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| Telephone                            | telephone                                  | work in progress                                                                                                                                                  | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| Utilities                            | utilities                                  | work in progress                                                                                                                                                  | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| Bank Balance on 1st                  | balance_on_1st                             | EOD balance on 1st of month                                                                                                                                       | Yes           | NA  | Yes | Yes | Yes | Yes   | NA       | NA       | Debit or Credit | Calander month  |
| Bank Balance on 5th                  | balance_on_5th                             | EOD balance on 5st of month                                                                                                                                       | Yes           | NA  | Yes | Yes | Yes | Yes   | NA       | NA       | Debit or Credit | Calander month  |
| Bank Balance on 10th                 | balance_on_10th                            | EOD balance on 10st of month                                                                                                                                      | Yes           | NA  | Yes | Yes | Yes | Yes   | NA       | NA       | Debit or Credit | Calander month  |
| Bank Balance on 15th                 | balance_on_15th                            | EOD balance on 15st of month                                                                                                                                      | Yes           | NA  | Yes | Yes | Yes | Yes   | NA       | NA       | Debit or Credit | Calander month  |
| Bank Balance on 20th                 | balance_on_20th                            | EOD balance on 20st of month                                                                                                                                      | Yes           | NA  | Yes | Yes | Yes | Yes   | NA       | NA       | Debit or Credit | Calander month  |
| Bank Balance on 25th                 | balance_on_25th                            | EOD balance on 25st of month                                                                                                                                      | Yes           | NA  | Yes | Yes | Yes | Yes   | NA       | NA       | Debit or Credit | Calander month  |
| Bank Balance on 30th/31st            | balance_on_30th                            | EOD balance on 30st of month                                                                                                                                      | Yes           | NA  | Yes | Yes | Yes | Yes   | NA       | NA       | Debit or Credit | Calander month  |
| Adjusted EOD Balance on 1st          | balance_net_off_on_1st_0                   | eod balance on 1st of month 0 excluding loan credits                                                                                                              | Yes           | NA  | Yes | Yes | Yes | Yes   | NA       | NA       | Debit or Credit | Calander month  |
| Adjusted EOD Balance on 5th          | balance_net_off_on_5th_0                   | eod balance on 5th of month 0 excluding loan credits                                                                                                              | Yes           | NA  | Yes | Yes | Yes | Yes   | NA       | NA       | Debit or Credit | Calander month  |
| Adjusted EOD Balance on 10th         | balance_net_off_on_10th_0                  | eod balance on 10th of month 0 excluding loan credits                                                                                                             | Yes           | NA  | Yes | Yes | Yes | Yes   | NA       | NA       | Debit or Credit | Calander month  |
| Adjusted EOD Balance on 15th         | balance_net_off_on_15th_0                  | eod balance on 15th of month 0 excluding loan credits                                                                                                             | Yes           | NA  | Yes | Yes | Yes | Yes   | NA       | NA       | Debit or Credit | Calander month  |
| Adjusted EOD Balance on 20th         | balance_net_off_on_20th_0                  | eod balance on 20th of month 0 excluding loan credits                                                                                                             | Yes           | NA  | Yes | Yes | Yes | Yes   | NA       | NA       | Debit or Credit | Calander month  |
| Adjusted EOD Balance on 25th         | balance_net_off_on_25th_0                  | eod balance on 25th of month 0 excluding loan credits                                                                                                             | Yes           | NA  | Yes | Yes | Yes | Yes   | NA       | NA       | Debit or Credit | Calander month  |
| Adjusted EOD Balance on 30th/31st    | balance_net_off_on_30th_0                  | eod balance on 30th of month 0 excluding loan credits                                                                                                             | Yes           | NA  | Yes | Yes | Yes | Yes   | NA       | NA       | Debit or Credit | Calander month  |
| Auto Debit Bounce                    | auto_debit_payment_bounce_credit           |  Total Amount of Auto debit bounce                                                                                                                                | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Credit          | rolling 30 days |
| Penal Charges                        | total_bounce_or_penal_charge               | total amount of bounce or penal charges in last 6 months                                                                                                          | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| Debit Card payments                  | debit_card_debit                           |  Total Amount Spend through Debit card                                                                                                                            | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| Digital Payments done                | net_banking_transfer_debit                 |  Total Amount Debited through transfers                                                                                                                           | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit           | rolling 30 days |
| Digital Payments Received            | upi_credit                                 |  Total Amount Credited through UPI, net banking, etc                                                                                                              | Yes           | Yes | Yes | Yes | Yes | Yes   | Yes      | Yes      | Credit          | rolling 30 days |
| EOD balance                          | avg_bal                                    |  Average Balance* ( = Average of EOD Balances after filling in missing daily Balances)                                                                            | Yes           | NA  | Yes | Yes | Yes | Yes   | Yes      | Yes      | Debit or Credit | rolling 30 days |                                                                                                                                                   | NA  |     | Yes | Yes | Yes | Yes |                 |                 |

:::warning NOTE
- If input is for 3 months statement, then 0-2 months of monthly data (type monthly), and one aggregated data for 3 months
- If input is for 6 months statement, then 0-5 months of monthly data (type monthly), and two aggregated data for 3 and 6 months 
- If input is for 12 months statement, then 0-11 months of monthly data (type monthly), and three aggregated data for 3, 6 and 12 months
- Validation on  finbox end to throw error in case complete 3 months, or 6 months or, 12 months data not received
:::

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
            "statement_id": "uuid4_for_statement",
            "source": "pdf"
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
            "statement_id": "uuid4_for_statement",
            "source": "pdf"
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

| Field                             | Type            | Description                                                                                                                                                         |
| --------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| customer\_name                    | String or null  | Name of the account holder                                                                                                                                          |
| bank\_name                        | String or null  | Bank name linked to account statement                                                                                                                               |
| account\_type                     | String or null  | Type of bank account category. i.e. current, savings account                                                                                                        |
| accountnumber                     | Integer or null | Account number                                                                                                                                                      |
| ifsc\_code                        | String or null  | Ifsc code of bank account                                                                                                                                           |
| month\_0                          | String or null  | Name of the month 0 in format (mmm-yy)                                                                                                                              |
| month\_1                          | String or null  | Name of the month 1 in format (mmm-yy)                                                                                                                              |
| month\_2                          | String or null  | Name of the month 2 in format (mmm-yy)                                                                                                                              |
| month\_3                          | String or null  | Name of the month 3 in format (mmm-yy)                                                                                                                              |
| month\_4                          | String or null  | Name of the month 4 in format (mmm-yy)                                                                                                                              |
| month\_5                          | String or null  | Name of the month 5 in format (mmm-yy)                                                                                                                              |
| end\_date                         | String or null  | Last date of transaction in 6 months                                                                                                                                |
| start\_date                       | String or null  | First date of transaction in 6 months                                                                                                                               |
| month\_duration                   | Integer         | Total number of months                                                                                                                                              |
| annualised\_credit                | Float           | Total amount credited in 1 year (credits/total days)\*365)                                                                                                          |                                                                                                                      |
| cash\_withdrawals                 | Integer         | Number of cash withdrawal transactions in last 6 months                                                                                                             |
| chq\_deposits                     | Integer         | Number of credit transactions through cheque in last 6 months                                                                                                       |
| chq\_issues                       | Integer         | Number of debit transactions through cheque in last 6 months                                                                                                        |
| credits                           | Float           | Total amount of credit transactions in last 6 months                                                                                                                |
| credits\_0                        | Float or null   | Total amount of credit transactions in month 0                                                                                                                      |
| credits\_1                        | Float or null   | Total amount of credit transactions in month 1                                                                                                                      |
| credits\_2                        | Float or null   | Total amount of credit transactions in month 2                                                                                                                      |
| credits\_3                        | Float or null   | Total amount of credit transactions in month 3                                                                                                                      |
| credits\_4                        | Float or null   | Total amount of credit transactions in month 4                                                                                                                      |
| credits\_5                        | Float or null   | Total amount of credit transactions in month 5                                                                                                                      |
| debitless\_charges                | Float           | Total amount of bank charges in last 6 months                                                                                                                       |
| debitless\_charges\_0             | Float or null   | Total amount of bank charges in month 0                                                                                                                             |
| debitless\_charges\_1             | Float or null   | Total amount of bank charges in month 1                                                                                                                             |
| debitless\_charges\_2             | Float or null   | Total amount of bank charges in month 2                                                                                                                             |
| debitless\_charges\_3             | Float or null   | Total amount of bank charges in month 3                                                                                                                             |
| debitless\_charges\_4             | Float or null   | Total amount of bank charges in month 4                                                                                                                             |
| debitless\_charges\_5             | Float or null   | Total amount of bank charges in month 5                                                                                                                             |
| debits                            | Float           | Total amount of debit transactions in last 6 months                                                                                                                 |
| debits\_0                         | Float or null   | Total amount of debit transactions in month 0                                                                                                                       |
| debits\_1                         | Float or null   | Total amount of debit transactions in month 1                                                                                                                       |
| debits\_2                         | Float or null   | Total amount of debit transactions in month 2                                                                                                                       |
| debits\_3                         | Float or null   | Total amount of debit transactions in month 3                                                                                                                       |
| debits\_4                         | Float or null   | Total amount of debit transactions in month 4                                                                                                                       |
| debits\_5                         | Float or null   | Total amount of debit transactions in month 5                                                                                                                       |
| expense\_0                        | Float or null   | Total amount of debit in month 0 excluding outward cheque bounce                                                                                                    |
| expense\_1                        | Float or null   | Total amount of debit in month 1 excluding outward cheque bounce                                                                                                    |
| expense\_2                        | Float or null   | Total amount of debit in month 2 excluding outward cheque bounce                                                                                                    |
| expense\_3                        | Float or null   | Total amount of debit in month 3 excluding outward cheque bounce                                                                                                    |
| expense\_4                        | Float or null   | Total amount of debit in month 4 excluding outward cheque bounce                                                                                                    |
| expense\_5                        | Float or null   | Total amount of debit in month 5 excluding outward cheque bounce                                                                                                    |
| avg\_monthly\_expense             | Float           | Average of total amount of expense to total months                                                                                                                  |
| income\_0                         | Float or null   | Total amount of credit in month 0 excluding amount of inward cheque bounce, auto debit payment bounce, international transaction arbitrage credits and loan credits |
| income\_1                         | Float or null   | Total amount of credit in month 1 excluding amount of inward cheque bounce, auto debit payment bounce, international transaction arbitrage credits and loan credits |
| income\_2                         | Float or null   | Total amount of credit in month 2 excluding amount of inward cheque bounce, auto debit payment bounce, international transaction arbitrage credits and loan credits |
| income\_3                         | Float or null   | Total amount of credit in month 3 excluding amount of inward cheque bounce, auto debit payment bounce, international transaction arbitrage credits and loan credits |
| income\_4                         | Float or null   | Total amount of credit in month 4 excluding amount of inward cheque bounce, auto debit payment bounce, international transaction arbitrage credits and loan credits |
| income\_5                         | Float or null   | Total amount of credit in month 5 excluding amount of inward cheque bounce, auto debit payment bounce, international transaction arbitrage credits and loan credits |
| avg\_monthly\_income              | Float           | Average of total income to total months                                                                                                                             |
| avg\_expense\_to\_income\_perc    | Float           | Percentage of total expenses to total income                                                                                                                        |
| expense\_to\_income\_ratio\_0     | Float or null   | Ratio of expense to income for month 0                                                                                                                              |
| expense\_to\_income\_ratio\_1     | Float or null   | Ratio of expense to income for month 1                                                                                                                              |
| expense\_to\_income\_ratio\_2     | Float or null   | Ratio of expense to income for month 2                                                                                                                              |
| expense\_to\_income\_ratio\_3     | Float or null   | Ratio of expense to income for month 3                                                                                                                              |
| expense\_to\_income\_ratio\_4     | Float or null   | Ratio of expense to income for month 4                                                                                                                              |
| expense\_to\_income\_ratio\_5     | Float or null   | Ratio of expense to income for month 5                                                                                                                              |
| inward\_chq\_bounces              | Float           | Total amount credited through inward cheque bounce in last 6 months                                                                                                 |                                                                                                                                   |
| net\_banking\_credits             | Float           | Total amount credited through net banking transfer i.e. imps , neft or rtgs                                                                                         |
| net\_banking\_debits              | Float           | Total amount debited through net banking transfer i.e. imps , neft or rtgs                                                                                          |
| number\_of\_transactions\_0       | Integer or null | Number of transactions in month 0                                                                                                                                   |
| number\_of\_transactions\_1       | Integer or null | Number of transactions in month 1                                                                                                                                   |
| number\_of\_transactions\_2       | Integer or null | Number of transactions in month 2                                                                                                                                   |
| number\_of\_transactions\_3       | Integer or null | Number of transactions in month 3                                                                                                                                   |
| number\_of\_transactions\_4       | Integer or null | Number of transactions in month 4                                                                                                                                   |
| number\_of\_transactions\_5       | Integer or null | Number of transactions in month 5                                                                                                                                   |
| outward\_chq\_bounces             | Float           | Total amount debited through outward cheque bounce in last 6 months                                                                                                 |
| pos\_expenses                     | Float           | Total amount spend through debit card in last 6 months                                                                                                              |
| reversals                         | Float           | Total amount of transaction reversals (refund funds)                                                                                                                |
| total\_bounce\_or\_penal\_charge  | Float           | Total amount of bounce or penal charges in last 6 months                                                                                                            |
| total\_cash\_withdrawal           | Float           | Total amount of cash withdrawal in last 6 months                                                                                                                    |
| total\_chq\_deposit               | Float           | Total amount credited through cheque in last 6 months                                                                                                               |
| total\_chq\_issue                 | Float           | Total amount debited through cheque in last 6 months                                                                                                                |
| total\_creditcard\_payment        | Float           | Total amount of credit card payment in last 6 months                                                                                                                |
| total\_creditcard\_payment\_0     | Float or null   | Total amount of credit card payment in month 0                                                                                                                      |
| total\_creditcard\_payment\_1     | Float or null   | Total amount of credit card payment in month 1                                                                                                                      |
| total\_creditcard\_payment\_2     | Float or null   | Total amount of credit card payment in month 2                                                                                                                      |
| total\_creditcard\_payment\_3     | Float or null   | Total amount of credit card payment in month 3                                                                                                                      |
| total\_creditcard\_payment\_4     | Float or null   | Total amount of credit card payment in month 4                                                                                                                      |
| total\_creditcard\_payment\_5     | Float or null   | Total amount of credit card payment in month 5                                                                                                                      |
| total\_emi\_ecs\_loan             | Float           | Total amount debited as loan emi in last 6 months                                                                                                                   |
| total\_expense                    | Float           | Total amount of expense in last 6 months                                                                                                                            |
| total\_income                     | Float           | Total amount of income in last 6 months                                                                                                                             |
| total\_inward\_payment\_bounce\_0 | Float or null   | Total amount of inward payment bounce in month 0                                                                                                                    |
| total\_inward\_payment\_bounce\_1 | Float or null   | Total amount of inward payment bounce in month 1                                                                                                                    |
| total\_inward\_payment\_bounce\_2 | Float or null   | Total amount of inward payment bounce in month 2                                                                                                                    |
| total\_inward\_payment\_bounce\_3 | Float or null   | Total amount of inward payment bounce in month 3                                                                                                                    |
| total\_inward\_payment\_bounce\_4 | Float or null   | Total amount of inward payment bounce in month 4                                                                                                                    |
| total\_inward\_payment\_bounce\_5 | Float or null   | Total amount of inward payment bounce in month 5                                                                                                                    |
| total\_salary\_0                  | Float or null   | Total amount of salary credited in month 0                                                                                                                          |
| total\_salary\_1                  | Float or null   | Total amount of salary credited in month 1                                                                                                                          |
| total\_salary\_2                  | Float or null   | Total amount of salary credited in month 2                                                                                                                          |
| total\_salary\_3                  | Float or null   | Total amount of salary credited in month 3                                                                                                                          |
| total\_salary\_4                  | Float or null   | Total amount of salary credited in month 4                                                                                                                          |
| total\_salary\_5                  | Float or null   | Total amount of salary credited in month 5                                                                                                                          |
| max\_balance\_0                   | Float or null   | Maximum balance in month 0                                                                                                                                          |
| max\_balance\_1                   | Float or null   | Maximum balance in month 1                                                                                                                                          |
| max\_balance\_2                   | Float or null   | Maximum balance in month 2                                                                                                                                          |
| max\_balance\_3                   | Float or null   | Maximum balance in month 3                                                                                                                                          |
| max\_balance\_4                   | Float or null   | Maximum balance in month 4                                                                                                                                          |
| max\_balance\_5                   | Float or null   | Maximum balance in month 5                                                                                                                                          |
| min\_balance\_0                   | Float or null   | Minimum balance in month 0                                                                                                                                          |
| min\_balance\_1                   | Float or null   | Minimum balance in month 1                                                                                                                                          |
| min\_balance\_2                   | Float or null   | Minimum balance in month 2                                                                                                                                          |
| min\_balance\_3                   | Float or null   | Minimum balance in month 3                                                                                                                                          |
| min\_balance\_4                   | Float or null   | Minimum balance in month 4                                                                                                                                          |
| min\_balance\_5                   | Float or null   | Minimum balance in month 5       
| avg\_balance\_0                   | Float or null   | Average eod balance of month 0 \*                                                                                                                                   |
| avg\_balance\_1                   | Float or null   | Average eod balance of month 1 \*                                                                                                                                   |
| avg\_balance\_2                   | Float or null   | Average eod balance of month 2 \*                                                                                                                                   |
| avg\_balance\_3                   | Float or null   | Average eod balance of month 3 \*                                                                                                                                   |
| avg\_balance\_4                   | Float or null   | Average eod balance of month 4 \*                                                                                                                                   |
| avg\_balance\_5                   | Float or null   | Average eod balance of month 5 \*                                                                                                                                   |
| avg\_daily\_closing\_balance      | Float           | Average of daily closing balance to total days                                                                                                                      |
| avg\_monthly\_closing\_balance    | Float           | Average of monthly closing balance to total months                                                                                                                  |
| bal\_last\_0                      | Float or null   | Eod balance on last date of month 0 \*                                                                                                                              |
| bal\_last\_1                      | Float or null   | Eod balance on last date of month 1 \*                                                                                                                              |
| bal\_last\_2                      | Float or null   | Eod balance on last date of month 2 \*                                                                                                                              |
| bal\_last\_3                      | Float or null   | Eod balance on last date of month 3 \*                                                                                                                              |
| bal\_last\_4                      | Float or null   | Eod balance on last date of month 4 \*                                                                                                                              |
| bal\_last\_5                      | Float or null   | Eod balance on last date of month 5 \*                                                                                                                              |
| balance\_on\_10th\_0              | Float or null   | Eod balance on 10th day of month 0 \*                                                                                                                               |
| balance\_on\_10th\_1              | Float or null   | Eod balance on 10th day of month 1 \*                                                                                                                               |
| balance\_on\_10th\_2              | Float or null   | Eod balance on 10th day of month 2 \*                                                                                                                               |
| balance\_on\_10th\_3              | Float or null   | Eod balance on 10th day of month 3 \*                                                                                                                               |
| balance\_on\_10th\_4              | Float or null   | Eod balance on 10th day of month 4 \*                                                                                                                               |
| balance\_on\_10th\_5              | Float or null   | Eod balance on 10th day of month 5 \*                                                                                                                               |
| balance\_on\_15th\_0              | Float or null   | Eod balance on 15th day of month 0 \*                                                                                                                               |
| balance\_on\_15th\_1              | Float or null   | Eod balance on 15th day of month 1 \*                                                                                                                               |
| balance\_on\_15th\_2              | Float or null   | Eod balance on 15th day of month 2 \*                                                                                                                               |
| balance\_on\_15th\_3              | Float or null   | Eod balance on 15th day of month 3 \*                                                                                                                               |
| balance\_on\_15th\_4              | Float or null   | Eod balance on 15th day of month 4 \*                                                                                                                               |
| balance\_on\_15th\_5              | Float or null   | Eod balance on 15th day of month 5 \*                                                                                                                               |
| balance\_on\_1st\_0               | Float or null   | Eod balance on 1st day of month 0 \*                                                                                                                                |
| balance\_on\_1st\_1               | Float or null   | Eod balance on 1st day of month 1 \*                                                                                                                                |
| balance\_on\_1st\_2               | Float or null   | Eod balance on 1st day of month 2 \*                                                                                                                                |
| balance\_on\_1st\_3               | Float or null   | Eod balance on 1st day of month 3 \*                                                                                                                                |
| balance\_on\_1st\_4               | Float or null   | Eod balance on 1st day of month 4 \*                                                                                                                                |
| balance\_on\_1st\_5               | Float or null   | Eod balance on 1st day of month 5 \*                                                                                                                                |
| balance\_on\_20th\_0              | Float or null   | Eod balance on 20th day of month 0 \*                                                                                                                               |
| balance\_on\_20th\_1              | Float or null   | Eod balance on 20th day of month 1 \*                                                                                                                               |
| balance\_on\_20th\_2              | Float or null   | Eod balance on 20th day of month 2 \*                                                                                                                               |
| balance\_on\_20th\_3              | Float or null   | Eod balance on 20th day of month 3 \*                                                                                                                               |
| balance\_on\_20th\_4              | Float or null   | Eod balance on 20th day of month 4 \*                                                                                                                               |
| balance\_on\_20th\_5              | Float or null   | Eod balance on 20th day of month 5 \*                                                                                                                               |
| balance\_on\_25th\_0              | Float or null   | Eod balance on 25th day of month 0 \*                                                                                                                               |
| balance\_on\_25th\_1              | Float or null   | Eod balance on 25th day of month 1 \*                                                                                                                               |
| balance\_on\_25th\_2              | Float or null   | Eod balance on 25th day of month 2 \*                                                                                                                               |
| balance\_on\_25th\_3              | Float or null   | Eod balance on 25th day of month 3 \*                                                                                                                               |
| balance\_on\_25th\_4              | Float or null   | Eod balance on 25th day of month 4 \*                                                                                                                               |
| balance\_on\_25th\_5              | Float or null   | Eod balance on 25th day of month 5 \*                                                                                                                               |
| balance\_on\_30th\_0              | Float or null   | Eod balance on 30th day of month 0 \*                                                                                                                               |
| balance\_on\_30th\_1              | Float or null   | Eod balance on 30th day of month 1 \*                                                                                                                               |
| balance\_on\_30th\_2              | Float or null   | Eod balance on 30th day of month 2 \*                                                                                                                               |
| balance\_on\_30th\_3              | Float or null   | Eod balance on 30th day of month 3 \*                                                                                                                               |
| balance\_on\_30th\_4              | Float or null   | Eod balance on 30th day of month 4 \*                                                                                                                               |
| balance\_on\_30th\_5              | Float or null   | Eod balance on 30th day of month 5 \*                                                                                                                               |
| balance\_on\_5th\_0               | Float or null   | Eod balance on 5th day of month 0 \*                                                                                                                                |
| balance\_on\_5th\_1               | Float or null   | Eod balance on 5th day of month 1 \*                                                                                                                                |
| balance\_on\_5th\_2               | Float or null   | Eod balance on 5th day of month 2 \*                                                                                                                                |
| balance\_on\_5th\_3               | Float or null   | Eod balance on 5th day of month 3 \*                                                                                                                                |
| balance\_on\_5th\_4               | Float or null   | Eod balance on 5th day of month 4 \*                                                                                                                                |
| balance\_on\_5th\_5               | Float or null   | Eod balance on 5th day of month 5 \*                                                                                                                                |
| bal\_avgof\_6dates\_0             | Float or null   | Average eod balances of 6 days(i.e. 1 ,5, 10, 15, 20, 25, 30) for month 0 \*                                                                                                                       |
| bal\_avgof\_6dates\_1             | Float or null   | Average eod balances of 6 days(i.e. 1 ,5, 10, 15, 20, 25, 30) for month 1 \*                                                                                                                       |
| bal\_avgof\_6dates\_2             | Float or null   | Average eod balances of 6 days(i.e. 1 ,5, 10, 15, 20, 25, 30) for month 2 \*                                                                                                                       |
| bal\_avgof\_6dates\_3             | Float or null   | Average eod balances of 6 days(i.e. 1 ,5, 10, 15, 20, 25, 30) for month 3 \*                                                                                                                       |
| bal\_avgof\_6dates\_4             | Float or null   | Average eod balances of 6 days(i.e. 1 ,5, 10, 15, 20, 25, 30) for month 4 \*                                                                                                                       |
| bal\_avgof\_6dates\_5             | Float or null   | Average eod balances of 6 days(i.e. 1 ,5, 10, 15, 20, 25, 30) for month 5 \* 
| balance\_net\_off\_on\_1st\_0     | Float or null   | Eod balance on 1st of month 0 excluding loan credits                                                                                                                |
| balance\_net\_off\_on\_1st\_1     | Float or null   | Eod balance on 1st of month 1 excluding loan credits                                                                                                                |
| balance\_net\_off\_on\_1st\_2     | Float or null   | Eod balance on 1st of month 2 excluding loan credits                                                                                                                |
| balance\_net\_off\_on\_1st\_3     | Float or null   | Eod balance on 1st of month 3 excluding loan credits                                                                                                                |
| balance\_net\_off\_on\_1st\_4     | Float or null   | Eod balance on 1st of month 4 excluding loan credits                                                                                                                |
| balance\_net\_off\_on\_1st\_5     | Float or null   | Eod balance on 1st of month 5 excluding loan credits                                                                                                                |
| balance\_net\_off\_on\_5th\_0     | Float or null   | Eod balance on 5th of month 0 excluding loan credits                                                                                                                |
| balance\_net\_off\_on\_5th\_1     | Float or null   | Eod balance on 5th of month 1 excluding loan credits                                                                                                                |
| balance\_net\_off\_on\_5th\_2     | Float or null   | Eod balance on 5th of month 2 excluding loan credits                                                                                                                |
| balance\_net\_off\_on\_5th\_3     | Float or null   | Eod balance on 5th of month 3 excluding loan credits                                                                                                                |
| balance\_net\_off\_on\_5th\_4     | Float or null   | Eod balance on 5th of month 4 excluding loan credits                                                                                                                |
| balance\_net\_off\_on\_5th\_5     | Float or null   | Eod balance on 5th of month 5 excluding loan credits                                                                                                                |
| balance\_net\_off\_on\_10th\_0    | Float or null   | Eod balance on 10th of month 0 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_10th\_1    | Float or null   | Eod balance on 10th of month 1 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_10th\_2    | Float or null   | Eod balance on 10th of month 2 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_10th\_3    | Float or null   | Eod balance on 10th of month 3 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_10th\_4    | Float or null   | Eod balance on 10th of month 4 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_10th\_5    | Float or null   | Eod balance on 10th of month 5 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_15th\_0    | Float or null   | Eod balance on 15th of month 0 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_15th\_1    | Float or null   | Eod balance on 15th of month 1 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_15th\_2    | Float or null   | Eod balance on 15th of month 2 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_15th\_3    | Float or null   | Eod balance on 15th of month 3 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_15th\_4    | Float or null   | Eod balance on 15th of month 4 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_15th\_5    | Float or null   | Eod balance on 15th of month 5 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_20th\_0    | Float or null   | Eod balance on 20th of month 0 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_20th\_1    | Float or null   | Eod balance on 20th of month 1 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_20th\_2    | Float or null   | Eod balance on 20th of month 2 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_20th\_3    | Float or null   | Eod balance on 20th of month 3 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_20th\_4    | Float or null   | Eod balance on 20th of month 4 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_20th\_5    | Float or null   | Eod balance on 20th of month 5 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_25th\_0    | Float or null   | Eod balance on 25th of month 0 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_25th\_1    | Float or null   | Eod balance on 25th of month 1 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_25th\_2    | Float or null   | Eod balance on 25th of month 2 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_25th\_3    | Float or null   | Eod balance on 25th of month 3 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_25th\_4    | Float or null   | Eod balance on 25th of month 4 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_25th\_5    | Float or null   | Eod balance on 25th of month 5 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_30th\_0    | Float or null   | Eod balance on 30th of month 0 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_30th\_1    | Float or null   | Eod balance on 30th of month 1 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_30th\_2    | Float or null   | Eod balance on 30th of month 2 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_30th\_3    | Float or null   | Eod balance on 30th of month 3 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_30th\_4    | Float or null   | Eod balance on 30th of month 4 excluding loan credits                                                                                                               |
| balance\_net\_off\_on\_30th\_5    | Float or null   | Eod balance on 30th of month 5 excluding loan credits                                                                                                               |

### Important terms 

- `Outward Cheque Bounce `: cheque issued by you is being returned by your bank
- `Inward Cheque Bounce `: cheque deposited by you has been returned unpaid by the banker of the person who issued the cheque.
- `auto debit payment bounce`: Bounce on unprocessed  auto debit payments
- `international transaction arbitrage credits`: Total Amount of credit due to difference in buying and selling of an asset in two diffrent market (credit)
- `Penal charge `:  overdue charges on non-payment of installment on the due date

:::warning NOTE
- \* means filling in missing balances
- month decreases going from 0 to 5, that is month 0 is the latest month while 5 is older
- `null` value will come for some fields (mentioned in types), when that month's data is unavailable
- total days = (`end_date` - `start_date`) in days
:::