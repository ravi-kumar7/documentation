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

## Entity properties
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

::: warning Exceptions
- In both the properties, whenever server is being contacted and in case it could not reach, it will throw `ServiceTimeOutError`
(`finbox_bankconnect.custom_exceptions.ServiceTimeOutError`).

- In case `get` method was used, `link_id` was being fetched and `entity_id` doesn't existed on our server then it will throw `EntityNotFoundError`
(`finbox_bankconnect.custom_exceptions.EntityNotFoundError`).
:::

::: tip Using Properties
To use properties, you can simply treat them as read only members of `Entity` instance as follows:
```python
# printing link_id and entity_id, where entity is instance of Entity class
print(entity.link_id)
print(entity.entity_id)
```
:::

## Uploading statement
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

::: warning Exceptions
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

- In due to any other reason, file could not be processed by us, we throw `FileProcessFailedError`
(`finbox_bankconnect.custom_exceptions.FileProcessFailedError`)
:::


