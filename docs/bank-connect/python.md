---
base_url: https://portal.finbox.in #base URL in python library
version: v1 # version of API
---

# Python
FinBox provides an official python package for Bank Connect product. This package has functions to upload statement PDF Files and get enriched data.

## Requirements
The package currently supports Python 3.4+

## Installing Package
To use the package, install it using pip / pip3
```sh
pip3 install finbox_bankconnect
```

Now in your python code you can import the package as follows:
```python
import finbox_bankconnect as fbc
```

## Authentication
You can set your unique API Key by setting the `api_key` value as follows:
```python
fbc.api_key = "YOUR_API_KEY"
```

::: danger Additional layer of security
FinBox Bank Connect supports an additional layer of security (timestamp and access token based) on request. But is as of now available only for REST APIs. If it is enabled for your organization, this library won't be able to authenticate as it currently supports only the API Key based authentication method.
:::

## `Entity` class
The python package will provide you with an `Entity` class, all actions like uploading or fetching information will be done using an instance of this `Entity` class.

::: warning Creating Entity Instance
Instance of `Entity` can be created only via static methods: `get` and `create`, not by constructor.
:::

### Creating new Entity (`get` method)
To create a new entity, use the `create` method as follows:
```python
entity = fbc.Entity.create()
```
Here `entity` is instance of `Entity` class.

In case you want to create an entity instance with a `link_id`, you can also provide an optional `link_id` string in create method as follows:

```python
entity = fbc.Entity.create(link_id="YOUR_LINK_ID")
```

::: warning Lazy operations
This python package uses lazy approach for actions, hence an actual Entity on server will not get created until or unless some action is taken, for example uploading statement. This is also true for fetching as well, until data is requested, no request over the network will be made even though you defined an entity instance.
:::

### Fetching already created Entity (`create` method)
To fetch an entity using `entity_id`, use the `get` method as follows:
```python
entity = fbc.Entity.get(entity_id="uuid4_for_entity")
```

## Entity Properties
Each entity instance has two **read only properties** that can be accessed at any time:

### **`entity_id`**
This gives a unique identifier for an entity. The table below indicates the results of fetching `entity_id` in different cases:

| Instance creation case | PDF uploaded | Result |
| - | - | - |
| `get` | Yes/No |  `entity_id` used while calling `get` method |
| `create` with `link_id` | Yes | `entity_id` of newly created Entity after upload |
| `create` with `link_id` | No | `entity_id` of Entity created against the `link_id` |
| `create` without `link_id` | Yes | `entity_id` of newly created Entity after upload |
| `create` without `link_id` | No | throws `ValueError` |

### **`link_id`**
This gives the `link_id` string value. The table below indicates the results of fetching `link_id` in different cases:

| Instance creation case | PDF uploaded | Result |
| - | - | - |
| `get` | Yes/No | `link_id` after fetching from server, if no `link_id` exists give `None` |
| `create` with `link_id` | Yes/No | `link_id` provided in `create` method |
| `create` without `link_id` | Yes | `None` |
| `create` without `link_id` | No | throws `ValueError` |

### Exceptions
- In both the properties, whenever server is being contacted and in case it could not reach, it will throw `ServiceTimeOutError`
(`finbox_bankconnect.custom_exceptions.ServiceTimeOutError`).

- In case `get` method was used, `link_id` was being fetched and `entity_id` doesn't existed on our server then it will throw `EntityNotFoundError`
(`finbox_bankconnect.custom_exceptions.EntityNotFoundError`).

### Using Properties
To use properties, you can simply treat them as read only members of `Entity` instance as follows:
```python
# printing link_id and entity_id, where entity is instance of Entity class
print(entity.link_id)
print(entity.entity_id)
```

## Uploading Statement
For any entity instance at any point, a PDF statement can be uploaded using the `upload_statement` method of entity instance. Its syntax is follows:
```python
is_authentic = entity.upload_statement("path/to/file", bank_name="axis")
```
`bank_name` in the input should be a valid bank name identifier (See [this](/bank-connect/appendix.html#bank-identifiers) for list of valid bank name identifiers).

The function returns a boolean value `is_authentic` that is `True` if no fraud were detected in the initial check (pre transaction level checks) otherwise `False`. 

The function also sets `entity_id` property in the instance in case the instance was created via `create` method.

In case **PDF is password protected** then you can specify the optional `pdf_password` field:
```python
is_authentic = entity.upload_statement("path/to/file", pdf_password="PDF_PASSWORD", bank_name="axis")
```

In case you **don't know the bank** <Badge text="beta" type="warn"/> of the statement, you can skip the `bank_name` field :
```python
is_authentic = entity.upload_statement("path/to/file")
# or with password
is_authentic = entity.upload_statement("path/to/file", pdf_password="PDF_PASSWORD")
```

### Exceptions
- In case there is any problem with arguments passed, it throws `ValueError` and if in reading file, it throws standard python file exceptions.

- In case server could not be reached, it throws `ServiceTimeOutError`
(`finbox_bankconnect.custom_exceptions.ServiceTimeOutError`).

- In case invalid bank name identifier was specified in `bank_name` field, it throws `InvalidBankNameError`
(`finbox_bankconnect.custom_exceptions.InvalidBankNameError`).

- In case password provided was incorrect and the PDF was password protected, it throws `PasswordIncorrectError`
(`finbox_bankconnect.custom_exceptions.PasswordIncorrectError`).

- In case PDF was non parsable, i.e. was corrupted or had only images or too few text, it throws `UnparsablePDFError`
(`finbox_bankconnect.custom_exceptions.UnparsablePDFError`)

- In case `bank_name` was not specified, and our server could not detect the bank, it will throw `CannotIdentityBankError`
(`finbox_bankconnect.custom_exceptions.CannotIdentityBankError`)

- In due to any other reason, file could not be processed by us, it will throw `FileProcessFailedError`
(`finbox_bankconnect.custom_exceptions.FileProcessFailedError`)

## Identity
To fetch identity information for an entity use the `get_identity` method.
```python
identity_dict = entity.get_identity()
```

It returns the identity `dict` for the last uploaded / updated account within the entity. The dictionary has the `account_id` and extracted identity keys like `address`, etc. as shown in a sample dictionary value below:
```python
{
    "account_id": "uuid4_for_account",
    "account_number": "Account Number Extracted",
    "address": "Address extracted",
    "name": "Name Extracted"
}
```
::: warning NOTE
If the value was not previously retrieved, it will poll and check for progress, and then fetch and cache the retrieved value for next usage.
:::

### Arguments
This method also has following **optional** arguments:
| Argument | Type | Description | Default |
| - | - | - | - |
| reload | Boolean | If provided as `True`, it will ignore the cached value, and again make an API call and re-fetch the values | `False` |

### Exceptions
- In case `create` method was used while creating the entity instance and the entity object was not created on server yet, it throws `ValueError`.

- In case server could not be reached, it throws `ServiceTimeOutError`
(`finbox_bankconnect.custom_exceptions.ServiceTimeOutError`).

- In case `entity_id` cannot be found in our server, it throws `EntityNotFoundError`
(`finbox_bankconnect.custom_exceptions.EntityNotFoundError`)

- In case the identity could not be extracted by us, it will throw `ExtractionFailedError`
(`finbox_bankconnect.custom_exceptions.ExtractionFailedError`)

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
This method also has following **optional** arguments:
| Argument | Type | Description | Default |
| - | - | - | - |
| reload | Boolean | If provided as `True`, it will ignore the cached value, and again make an API call and re-fetch the values | `False` |


### Exceptions
- In case `create` method was used while creating the entity instance and the entity object was not created on server yet, it throws `ValueError`.

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
Each of the account dictionary in the account list has following keys:
- `months`: month and year for which data is available. Each of string in this list is of format `"YYYY-MM"`
- `statements`: list of statement unique identifiers under the account
- `account_id`: unique identifier for account
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
This method also has following **optional** arguments:
| Argument | Type | Description | Default |
| - | - | - | - |
| reload | Boolean | If provided as `True`, it will ignore the cached value, and again make an API call and re-fetch the values | `False` |


### Exceptions
- In case `create` method was used while creating the entity instance and the entity object was not created on server yet, it throws `ValueError`.

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
Each of the fraud dictionary includes the keys `statement_id` and `fraud_type` indicating fraud of which type was found in which statement. 

Optionally a key `transaction_hash` may be present in some cases in this dictionary for transaction level frauds indicating the transaction in which the fraud was found.

To know more about `fraud_type`, refer to [Fraud](/bank-connect/basics.html#fraud) section in Basics.

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
This method also has following **optional** arguments:
| Argument | Type | Description | Default |
| - | - | - | - |
| reload | Boolean | If provided as `True`, it will ignore the cached value, and again make an API call and re-fetch the values | `False` |
| account_id | String | If provided, only the transactions of specific `account_id` will be retrieved | - |
| from_date | `datetime.date` object | If provided, only the transactions with date greater than or equal to `from_date` will be retrieved. | - |
| to_date | `datetime.date` object | If provided, only the transactions with date less than or equal to `to_date` will be retrieved.  | - |

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
- In case there is any problem with arguments passed or if `create` method was used while creating the entity instance and the entity object was not created on server yet, it throws `ValueError`.

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

Each of the transaction dictionary in the transaction list has following keys:
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




## Advanced Settings <Badge text="Caution" type="error"/>
Other than `api_key`, following values can also be modified globally as per requirement:

| Property | Description | Default Value |
| - | - | - |
| `max_retry_limit` | To set the maximum times library will retry if server was unavailable or unreachable | 2 | 
| `poll_timeout` | To set the timeout time **(in seconds)** after which `ServiceTimeOutError` will be thrown in case of fetching functions | 2 |
| `poll_interval` | To set the polling intervals **(in seconds)** after which the library will try to make an API call | 10 |
| `api_version` | To set the API version to use | {{$page.frontmatter.version}} |
| `base_url` | In case you are using a proxy and want to change the base url for REST API calls that python library makes | {{$page.frontmatter.base_url}} |

::: danger Changing base_url property
In case you are using a proxy, and changed the `base_url` property, just keep in mind that the library will internally make an API call in following format:

`base_url`/bank-connect/`api_version`/`<endpoints>`
:::

Example for changing polling interval to 1 second:
```python
fbc.poll_interval = 1
```
