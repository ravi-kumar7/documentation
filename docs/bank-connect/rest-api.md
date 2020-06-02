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

To make a successful request, `X-API-KEY` and `SERVER-HASH` must be present in the request header with API key and Server Hash values respectively.

Please keep the Server Hash secure! Do not share your Server Hash in publicly accessible areas such as GitHub, client-side code, and so forth.

In case wrong/incomplete/no keys were passed, response will have **401** HTTP Code and payload as follows:
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

## Fraud Field
In all of the analysis field APIs (transaction, accounts, etc.), there is always a field `fraud`, that holds two fields `fraudulent_statements` (array of `statement_id`s which have some sort detected after analysis or in first basic check) and `fraud_type` (array of objects having `statement_id` and `fraud_type` (string) indicating a fraud of which type was found for which statement).
Optionally a key `transaction_hash` may be present in some cases in `fraud_type` (array) for transaction-level frauds indicating the transaction in which the fraud was found.


To know more about `fraud_type`, refer to [Fraud](/bank-connect/fraud.html) section in Basics.

Sample `fraud` field value:
```json
{
    "fraudulent_statements": [
        "uuid4_for_statement"
    ],
    "fraud_type": [
        {
            "statement_id": "uuid4_for_statement",
            "fraud_type": "some_fraud_type"
        }
    ]
}
```

## List Accounts
Lists accounts under a given entity.

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/`<entity_id>`/accounts/**
:::

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
                "fraud_type": "some_fraud_type"
            }
        ]
    }
}
```
The response has the following fields:
- `accounts` holds the array of account objects, each having `months` (month and year for which data is available), `statements` (list of statement unique identifiers under the account), `account_id` (unique identifier for account), `bank` (name of the bank to which the account belongs) and some account level extracted fields like `ifsc`, `micr`, `account_number` (which can be `null` or could hold a `string` value)
- `progress` (read more in [Progress Field](/bank-connect/rest-api.html#progress-field) section)
- `fraud` (read more in [Fraud Field](/bank-connect/rest-api.html#fraud-field) section)

## Identity
Lists extracted identities for a given entity.

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/`<entity_id>`/identity/**
:::

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
                "fraud_type": "some_fraud_type"
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
The response fields are the same as in [List Accounts](/bank-connect/rest-api.html#list-accounts), but there is an additional `identity` field that holds an array of identity objects. Each object has `account_id` (a unique identifier for the account for which the identity information is referred to in the object) and extracted identity fields like `name`, `address`, `account_number`.

## Transactions
Get extracted and enriched transactions for a given entity.

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/`<entity_id>`/transactions/**
:::

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
                "fraud_type": "some_fraud_type"
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
                "fraud_type": "some_fraud_type"
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
                "fraud_type": "some_fraud_type"
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
                "fraud_type": "some_fraud_type"
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

## Monthly Analysis <Badge text="New" />
Get monthly analysis for a given entity.

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/`<entity_id>`/monthly_analysis/**
:::

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
- `avg_bal`: Average Balance* ( = Average of EOD Balances after filling in missing daily Balances) 
- `avg_credit_transaction_size`: Average Credit Transaction Size
- `avg_debit_transaction_size`: Average Debit Transaction Size
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
- `cnt_refund_credit`: Number of Refund Transactions
- `cnt_transactions`: Number of Transactions
- `cnt_upi_credit`: Number of Credit Transactions through UPI
- `cnt_upi_debit`: Number of Debit Transactions through UPI
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


## Transactions in Excel Workbook <Badge text="New" />
Get **enriched transactions** and **monthly analysis** for a given entity **account wise** in .xlsx (Excel workbook) format.

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/`<entity_id>`/raw_excel_report/**
:::

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

The Excel workbook will contain three worksheets, first containing the extracted information like Account Holder's Name, Bank, Account Number, Missing Periods, Available Periods, etc., the second sheet contains the enriched extracted transactions for the account, and the third sheet contains the monthly analysis for the account.

## Detailed Excel Report <Badge text="New" />
Get a detailed excel report for a given entity in .xlsx (Excel workbook) format.

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/`<entity_id>`/get_excel_report/**
:::

### Response
On fetching information successfully, the response would be of the following format with **200 HTTP code**:
```json
{
    "entity_id": "uuid4_for_entity",
    "progress": "completed",
    "report": "long_url_for_the_excel_report"
}
```

Possible value for `progress` are listed here [Progress Field](/bank-connect/rest-api.html#progress-field). The value of the `report` key will be empty if the progress is not `completed`. The Excel workbook contains a detailed analysis of different parameters in the form of separate sheets.