---
base_url: https://portal.finbox.in/bank-connect #base URL for the API
version: v1 # version of API
---

# Bank Connect: Uploading using REST API
Bank Connect REST APIs can be used to submit bank statement PDFs for an entity.

You can also try these APIs on Postman. Check out [this](/bank-connect/#postman-collection) article for more details.

:::warning Request Format
Bank connect accepts all requests with form fields, so please make sure that all requests must be made with content type `application/x-www-form-urlencoded` or `multipart/form-data; boundary={boundary string}`
:::

## Authentication
FinBox Bank Connect REST API uses API keys to authenticate requests. Please keep the API keys secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth. All API requests must be made over HTTPS. Calls made over plain HTTP will fail. API requests without authentication will also fail.

To provide API key while making a request, `X-API-KEY` must be present in the request header with API key value.

## Specifying the Entity
For all the upload APIs, the `entity_id` is an optional parameter for the below APIs, if specified, the statement gets uploaded against that entity. If not specified, a new entity is created and the statement is uploaded against it.

You can optionally specify `link_id` instead of `entity_id` in the APIs as well. If an entity was already created with the given `link_id`, the upload will happen under the same entity, if not it will create a new entity with the `link_id` and return the `entity_id` in response.

:::danger IMPORTANT
In case both `link_id` and `entity_id` are present in request, `link_id` will be ignored and `entity_id` will be used.
:::

## Uploading statements in files

### Bank name is known

::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/statement/upload/?identity=true**
:::

### Parameters
| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| file | file  | the statement pdf file | Yes | - |
| bank_name | string | a valid bank identifier | Yes | - |
| entity_id | string | an `entity_id` against which you want to upload the statement | No | - |
| link_id | string | a `link_id` against which you want to upload the statement | No | - |
| pdf_password | string | password for the pdf in case it is password protected | No | - |

::: warning Bank Name Identifiers
Refer to [this](/bank-connect/appendix.html#bank-identifiers) to get list of valid bank name identifiers
:::

### Bank name not known <Badge text="beta" type="warn"/>

In case you don't know bank name, and want Bank Connect to automatically identify the bank name:

::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/statement/bankless_upload/?identity=true**
:::

### Parameters
| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| file | file  | the statement pdf file | Yes | - |
| entity_id | string | an `entity_id` against which you want to upload the statement | No | - |
| link_id | string | a `link_id` against which you want to upload the statement | No | - |
| pdf_password | string | password for the pdf in case it is password protected | No | - |

## Uploading base 64 encoded statements

### Bank name known

::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/statement/upload_base64/?identity=true**
:::

### Parameters
| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| file | string  | the statement pdf file in base 64 encoded string | Yes | - |
| bank_name | string | a valid bank identifier | Yes | - |
| entity_id | string | an `entity_id` against which you want to upload the statement | No | - |
| link_id | string | a `link_id` against which you want to upload the statement | No | - |
| pdf_password | string | password for the pdf in case it is password protected | No | - |

::: warning Bank Name Identifiers
Refer to [this](/bank-connect/appendix.html#bank-identifiers) to get list of valid bank name identifiers
:::

### Bank name not known <Badge text="beta" type="warn"/>

In case you don't know bank name, and want Bank Connect to automatically identify the bank name:

::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/statement/bankless_upload_base64/?identity=true**
:::

### Parameters
| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| file | string  | the statement pdf file in base 64 encoded format | Yes | - |
| entity_id | string | an `entity_id` against which you want to upload the statement | No | - |
| link_id | string | a `link_id` against which you want to upload the statement | No | - |
| pdf_password | string | password for the pdf in case it is password protected | No | - |

## Uploading statement file URL

### Bank name known

::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/statement/upload/?identity=true**
:::

### Parameters
| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| file_url | string  | publicly accessible full file URL with protocol (HTTP / HTTPS) | Yes | - |
| entity_id | string | an `entity_id` against which you want to upload the statement | No | - |
| link_id | string | a `link_id` against which you want to upload the statement | No | - |
| pdf_password | string | password for the pdf in case it is password protected | No | - |

### Bank name not known <Badge text="beta" type="warn"/>

In case you don't know bank name, and want Bank Connect to automatically identify the bank name:

::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/statement/bankless_upload/?identity=true**
:::

### Parameters
| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| file_url | string  | publicly accessible full file URL with protocol (HTTP / HTTPS) | Yes | - |
| entity_id | string | an `entity_id` against which you want to upload the statement | No | - |
| link_id | string | a `link_id` against which you want to upload the statement | No | - |
| pdf_password | string | password for the pdf in case it is password protected | No | - |

## Response Format

All the above APIs give the response in the format below in case of successful file upload with a **200 HTTP Code**:

```json
{
    "bank_name": "axis",
    "statement_id": "uuid4_for_statement",
    "entity_id": "uuid4_for_entity",
    "date_range": {
        "from_date": "2018-11-18",
        "to_date": "2019-01-18"
    },
    "is_fraud": false,
    "identity": {
        "account_id": "uuid4_for_account",
        "account_number": "Account Number Extracted",
        "address": "Address extracted",
        "name": "Name Extracted"
    },
    "fraud_type": null
}
```

The identity information returned in the response can be used to verify the customer, while the time periods can be used to check whether the statement was uploaded for the required period.

| Key | Type | Description |
| - | - | - | - | - |
| `bank_name` | string  | indicates the bank, refer [here](/bank-connect/appendix.html#bank-identifiers) for complete list |
| `statement_id` | string | Unique identifier for Statement |
| `entity_id` | string | unique identifier for entity |
| `date_range` | object | contains `from_date` and `to_date` strings indicating the time period in `YYYY-MM-DD` format |
| `is_fraud` | boolean | indicates if a file level fraud was detected |
| `fraud_type` | string | indicates the fraud type, if no fraud its value is `null` |
| `identity` | object | contains multiple identity information keys extracted from the statement |
| `account_id` | string | unique identifier for account |
| `account_number` | string | bank account number |
| `address` | string | address of the bank account holder |
| `name` | string | name of the bank account holder |

::: warning NOTE
- `fraud_type` field is `null` in case `is_fraud` field is false, otherwise it is a string. Please refer to [Fraud](/bank-connect/fraud.html) section in Basics to know more about it.
- Some of the fields within the identity dictionary, or the `from_date` and `to_date` maybe `null` for few statements depending on the bank statement format and what all information is present on the top of the statement. The `from_date` and `to_date` in case was null, are updated for the statement at a later stage when transaction are extracted.
- The query parameter `?identity=true` is optional for both the APIs above, if not specified the response will only include `entity_id`, `statement_id` and `bank_name` fields in case of successful upload.
:::

## Bad Request Cases
1. In case a compulsory field is missing the APIs will throw a **400 (Bad Request)** as follows:
    ```json
    {"file": ["This field is required."]}
    ```
    This error is also thrown in case of base64 encoded files, if base64 to file decoding fails. Error in that case is as follows:
    ```json
    {"file": ["Invalid Base 64 string"]}
    ```
2. In case the request content type is not `application/x-www-form-urlencoded` or `multipart/form-data; boundary={boundary string}`, APIs will throw **400 (Bad Request)** as follows:
    ```json
    {"file": ["This field must be present as a form field. Send request with content type x-www-form-urlencoded or form-data"]}
    ```
3. In other error cases, the APIs will throw a **400 (Bad Request)** with appropriate message in `message` field:
    - **Not able to identify the bank name** (In bank less upload only)
    - **Incorrect bank name specified** (When bank is provided with request, and we detected it to be of different bank)
    - **Incorrect Password**
    - **Non Parsable PDF** (PDF file has only images or is corrupted)
    ```json
    {
        "entity_id": "some_entity_id_created",
        "message": "error message here"
    }
    ```

::: danger 402 HTTP Status Code
In case you are in **DEV** environment and your **trial period has expired**, then upload APIs will give you a response with 402 HTTP Code. To fix this please request FinBox to upgrade your plan.
:::