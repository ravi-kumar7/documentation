---
base_url: https://portal.finbox.in #base URL in python library
version: v1 # version of API
---

# BankConnect: Fetching Enriched data using Python Package
You can use the python package to fetch enriched data for an entity.

**Part 1** of this article with details on installing the package, authentication, advanced settings, identity and uploading statements are listed [on this page](/bank-connect/upload-python.html).

## Accounts
To fetch accounts use the `get_accounts` method. It returns an **iterator** to the account dictionary list, after fetching.

```python
accounts = entity.get_accounts()

# printing the account dictionary using iterator
for account in accounts:
    print(account)
```

::: warning NOTE
If the value was not previously retrieved, it will poll and check for progress, and then fetch and cache the retrieved value for next usage.
:::

### Arguments
This method also has the following **optional** arguments:
| Argument | Type | Description | Default |
| - | - | - | - |
| reload | Boolean | If provided as `True`, it will ignore the cached value, and again make an API call and re-fetch the values | `False` |


### Exceptions
- In case the `create` method was used while creating the entity instance and the entity object was not created on the server yet, it throws `ValueError`.

- In case server could not be reached, it throws `ServiceTimeOutError`
(`finbox_bankconnect.custom_exceptions.ServiceTimeOutError`).

- In case `entity_id` cannot be found in our server, it throws `EntityNotFoundError`
(`finbox_bankconnect.custom_exceptions.EntityNotFoundError`)

- In case the account information could not be extracted by us, it will throw `ExtractionFailedError`
(`finbox_bankconnect.custom_exceptions.ExtractionFailedError`)

### Account Dictionary
Sample account dictionary:
```python
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
    "ifsc": None,
    "micr": None,
    "account_number": "Account Number Extracted",
    "bank": "axis"
}
```
Each of the account dictionary in the account list has the following keys:
- `months`: month and year for which data is available. Each of string in this list is of format `"YYYY-MM"`
- `statements`: list of statement unique identifiers under the account
- `account_id`: unique identifier for an account
- `bank`: name of the bank to which the account belongs

It also has some account level extracted fields like `ifsc`, `micr`, `account_number` (which can be `None` or could hold a `string` value)

## Fraud
To fetch fraud information use the `get_fraud_info` method. It returns an **iterator** to the fraud dictionary list, after fetching.

```python
fraud_list_iter = entity.get_fraud_info()

# printing the fraud dict dictionary using iterator
for fraud_dict in fraud_list_iter:
    print(fraud_dict)
```

::: warning NOTE
If the value was not previously retrieved, it will poll and check for progress, and then fetch and cache the retrieved value for next usage.
:::

### Arguments
This method also has the following **optional** arguments:
| Argument | Type | Description | Default |
| - | - | - | - |
| reload | Boolean | If provided as `True`, it will ignore the cached value, and again make an API call and re-fetch the values | `False` |


### Exceptions
- In case the `create` method was used while creating the entity instance and the entity object was not created on the server yet, it throws `ValueError`.

- In case server could not be reached, it throws `ServiceTimeOutError`
(`finbox_bankconnect.custom_exceptions.ServiceTimeOutError`).

- In case `entity_id` cannot be found in our server, it throws `EntityNotFoundError`
(`finbox_bankconnect.custom_exceptions.EntityNotFoundError`)

- In case the statement could not be extracted by us, it will throw `ExtractionFailedError`
(`finbox_bankconnect.custom_exceptions.ExtractionFailedError`)

### Fraud Dictionary
Sample fraud dictionary:
```python
{
    "statement_id": "uuid4_for_statement",
    "fraud_type": "some_fraud_type"
}
```
Each of the fraud dictionaries includes the keys `statement_id` and `fraud_type` indicating a fraud of which type was found in which statement. 

Optionally a key `transaction_hash` may be present in some cases in this dictionary for transaction-level frauds indicating the transaction in which the fraud was found.

To know more about `fraud_type`, refer to [Fraud](/bank-connect/fraud.html) section in Basics.

## Transactions
To fetch transactions use the `get_transactions` method. It returns an **iterator** to the transaction dictionary list, after fetching.

```python
transactions = entity.get_transactions()

# printing the transaction dictionary using iterator
for transaction in transactions:
    print(transaction)
```

::: warning NOTE
If the value was not previously retrieved, it will poll and check for progress, and then fetch and cache the retrieved value for next usage.
:::

### Arguments
This method also has the following **optional** arguments:
| Argument | Type | Description | Default |
| - | - | - | - |
| reload | Boolean | If provided as `True`, it will ignore the cached value, and again make an API call and re-fetch the values | `False` |
| account_id | String | If provided, only the transactions of specific `account_id` will be retrieved | - |
| from_date | `datetime.date` object | If provided, only the transactions with a date greater than or equal to `from_date` will be retrieved. | - |
| to_date | `datetime.date` object | If provided, only the transactions with a date less than or equal to `to_date` will be retrieved.  | - |

An example for fetching transactions from last 10 days till today:
```python
import datetime
import finbox_bankconnect as fbc

entity = fbc.Entity.get(entity_id="uuid_for_entity")

# fetching transactions from last 10 days
from_date = (datetime.datetime.today() - datetime.timedelta(days=10)).date()
to_date = datetime.datetime.today().date()
transactions = entity.get_transactions(from_date=from_date, to_date=to_date)

# print the transaction dictionary using iterator
for transaction in transactions:
    print(transaction)
```

### Exceptions
- In case there is any problem with arguments passed or if `create` method was used while creating the entity instance and the entity object was not created on the server yet, it throws `ValueError`.

- In case server could not be reached, it throws `ServiceTimeOutError`
(`finbox_bankconnect.custom_exceptions.ServiceTimeOutError`).

- In case `entity_id` cannot be found in our server, it throws `EntityNotFoundError`
(`finbox_bankconnect.custom_exceptions.EntityNotFoundError`)

- In case the transactions could not be extracted by us, it will throw `ExtractionFailedError`
(`finbox_bankconnect.custom_exceptions.ExtractionFailedError`)

### Transaction Dictionary
Sample transaction dictionary:
```python
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
}
```

Each of the transaction dictionary in the transaction list has the following keys:
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
To fetch salary transactions use the `get_salary` method. It returns an **iterator** to the salary dictionary list, after fetching.

```python
salary_iter = entity.get_salary()

# printing the salary dictionary using iterator
for salary_dict in salary_iter:
    print(salary_dict)
```

::: warning NOTE
If the value was not previously retrieved, it will poll and check for progress, and then fetch and cache the retrieved value for next usage.
:::

### Arguments
This method also has the following **optional** arguments:
| Argument | Type | Description | Default |
| - | - | - | - |
| reload | Boolean | If provided as `True`, it will ignore the cached value, and again make an API call and re-fetch the values | `False` |
| account_id | String | If provided, only the salary of specific `account_id` will be retrieved | - |
| from_date | `datetime.date` object | If provided, only the salary with a date greater than or equal to `from_date` will be retrieved. | - |
| to_date | `datetime.date` object | If provided, only the salary with a date less than or equal to `to_date` will be retrieved.  | - |

### Exceptions
- In case there is any problem with arguments passed or if `create` method was used while creating the entity instance and the entity object was not created on the server yet, it throws `ValueError`.

- In case server could not be reached, it throws `ServiceTimeOutError`
(`finbox_bankconnect.custom_exceptions.ServiceTimeOutError`).

- In case `entity_id` cannot be found in our server, it throws `EntityNotFoundError`
(`finbox_bankconnect.custom_exceptions.EntityNotFoundError`)

- In case the transactions could not be extracted by us, it will throw `ExtractionFailedError`
(`finbox_bankconnect.custom_exceptions.ExtractionFailedError`)

### Salary Dictionary
Sample salary dictionary:
```python
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
```

Each of the salary dictionary in the transaction list has the following keys:
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
To fetch recurring transactions use the `get_credit_recurring` and `get_debit_recurring` methods for credit and debit respectively. Both of these return an **iterator** to the recurring dictionary list, after fetching.

```python
credit_recurring = entity.get_credit_recurring()

# printing the credit recurring dictionary using iterator
for credit_recurr_dict in credit_recurring:
    print(credit_recurr_dict)
```

```python
debit_recurring = entity.get_debit_recurring()

# printing the debit recurring dictionary using iterator
for debit_recurr_dict in debit_recurring:
    print(debit_recurr_dict)
```

::: warning NOTE
If the value was not previously retrieved, it will poll and check for progress, and then fetch and cache the retrieved value for next usage.
:::

### Arguments
Both of these methods have the following **optional** arguments:
| Argument | Type | Description | Default |
| - | - | - | - |
| reload | Boolean | If provided as `True`, it will ignore the cached value, and again make an API call and re-fetch the values | `False` |
| account_id | String | If provided, only the recurring transactions of specific `account_id` will be retrieved | - |

### Exceptions
- In case there is any problem with arguments passed or if `create` method was used while creating the entity instance and the entity object was not created on the server yet, it throws `ValueError`.

- In case server could not be reached, it throws `ServiceTimeOutError`
(`finbox_bankconnect.custom_exceptions.ServiceTimeOutError`).

- In case `entity_id` cannot be found in our server, it throws `EntityNotFoundError`
(`finbox_bankconnect.custom_exceptions.EntityNotFoundError`)

- In case the transactions could not be extracted by us, it will throw `ExtractionFailedError`
(`finbox_bankconnect.custom_exceptions.ExtractionFailedError`)

### Recurring Transaction Dictionary
Sample recurring transaction dictionary:
```python
{
    "account_id": "uuid4_for_account",
    "end_date": "2019-01-11 00:00:00",
    "transactions": [
        {
            "transaction_channel": "net_banking_transfer",
            "transaction_note": "SOME LONG TRANSACTION NOTE",
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
```

Each of the recurring transaction dictionary (both credit and debit) has the following keys:
- `account_id`: unique UUID4 identifier for the account to which transaction set belongs to
- `start_date`: the start date for the recurring transaction set
- `end_date`: end date for the recurring transaction set
- `transaction_channel`: transaction channel in upper case. Refer to [this](/bank-connect/appendix.html#transaction-channel) list for possible values.
- `median`: median of the transaction amounts under the given recurring transaction set
- `transactions`: list of transaction dictionary under the recurring transaction set. Each transaction dictionary here has the same keys as a transaction dictionary in `get_transactions` (Refer [here](/bank-connect/python.html#transaction-dictionary) to know about the keys).




## Lender Transactions
To fetch lender transactions use the `get_lender_transactions` method. It returns an **iterator** to the lender transaction dictionary list, after fetching.

```python
lender_transactions = entity.get_lender_transactions()

# printing the lender transaction dictionary using iterator
for lender_transaction in lender_transactions:
    print(lender_transaction)
```

::: warning NOTE
If the value was not previously retrieved, it will poll and check for progress, and then fetch and cache the retrieved value for next usage.
:::

### Arguments
This method also has the following **optional** arguments:
| Argument | Type | Description | Default |
| - | - | - | - |
| reload | Boolean | If provided as `True`, it will ignore the cached value, and again make an API call and re-fetch the values | `False` |
| account_id | String | If provided, only the lender transactions of specific `account_id` will be retrieved | - |
| from_date | `datetime.date` object | If provided, only the lender transactions with a date greater than or equal to `from_date` will be retrieved. | - |
| to_date | `datetime.date` object | If provided, only the lender transactions with a date less than or equal to `to_date` will be retrieved.  | - |

### Exceptions
- In case there is any problem with arguments passed or if `create` method was used while creating the entity instance and the entity object was not created on the server yet, it throws `ValueError`.

- In case server could not be reached, it throws `ServiceTimeOutError`
(`finbox_bankconnect.custom_exceptions.ServiceTimeOutError`).

- In case `entity_id` cannot be found in our server, it throws `EntityNotFoundError`
(`finbox_bankconnect.custom_exceptions.EntityNotFoundError`)

- In case the transactions could not be extracted by us, it will throw `ExtractionFailedError`
(`finbox_bankconnect.custom_exceptions.ExtractionFailedError`)

### Lender Transaction Dictionary
Sample lender transaction dictionary:
```python
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
```

Each of the lender transaction dictionary in the transaction list has the following keys:
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