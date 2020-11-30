---
base_url: https://portal.finbox.in/bank-connect #base URL for the API
version: v1 # version of API
---

# BankConnect: Uploading using REST API
BankConnect REST APIs can be used to submit bank statement PDFs for an entity.

You can also try these APIs on Postman. Check out [this](/bank-connect/#postman-collection) article for more details.

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

:::danger IMPORTANT
Upload APIs do not require use of **Server Hash**
:::

## Specifying the Entity
In Upload API, `link_id` needs to be specified as a parameter. If an entity was already created with the given `link_id`, the upload will happen under the same entity, if not it will create a new entity with the `link_id` and return the `entity_id` in response.

If you already have an `entity_id`, you can mention it directly as well instead of `link_id`.

:::danger IMPORTANT
In case both `link_id` and `entity_id` are present in request, `link_id` will be ignored and `entity_id` will be used.
:::

## Password Protected PDFs
If the bank statements are password protected it is required to pass the password in the `pdf_password` parameter in upload APIs. The next section lists the upload APIs.

## Uploading statements in files
This section lists the endpoint and request format for upload APIs that accepts file in request. Response Format is [present here](/bank-connect/upload-rest-api.html#response-format).

### Bank name is known

::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/statement/upload/?identity=true**
:::

### Authentication
Request header `x-api-key` with API Key as value must be present in request.

### Parameters
| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| file | file  | the statement pdf file | Yes | - |
| bank_name | string | a valid [bank identifier](/bank-connect/appendix.html#bank-identifiers) | Yes | - |
| link_id | string | a `link_id` against which you want to upload the statement | Yes | - |
| entity_id | string | an `entity_id` against which you want to upload the statement | No | - |
| pdf_password | string | password for the pdf in case it is password protected | No | - |

### Bank name not known <Badge text="beta" type="warn"/>

In case you don't know bank name, and want BankConnect to automatically identify the bank name:

::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/statement/bankless_upload/?identity=true**
:::

### Authentication
Request header `x-api-key` with API Key as value must be present in request.

### Parameters
| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| file | file  | the statement pdf file | Yes | - |
| link_id | string | a `link_id` against which you want to upload the statement | Yes | - |
| entity_id | string | an `entity_id` against which you want to upload the statement | No | - |
| pdf_password | string | password for the pdf in case it is password protected | No | - |

## Uploading base 64 encoded statements
This section lists the endpoint and request format for upload APIs that accepts base 64 encoded files. Response Format is [present here](/bank-connect/upload-rest-api.html#response-format).

### Bank name known

::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/statement/upload_base64/?identity=true**
:::

### Authentication
Request header `x-api-key` with API Key as value must be present in request.

### Parameters
| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| file | string  | the statement pdf file in base 64 encoded string | Yes | - |
| bank_name | string | a valid [bank identifier](/bank-connect/appendix.html#bank-identifiers) | Yes | - |
| link_id | string | a `link_id` against which you want to upload the statement | Yes | - |
| entity_id | string | an `entity_id` against which you want to upload the statement | No | - |
| pdf_password | string | password for the pdf in case it is password protected | No | - |

### Bank name not known <Badge text="beta" type="warn"/>

In case you don't know bank name, and want BankConnect to automatically identify the bank name:

::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/statement/bankless_upload_base64/?identity=true**
:::

### Authentication
Request header `x-api-key` with API Key as value must be present in request.

### Parameters
| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| file | string  | the statement pdf file in base 64 encoded format | Yes | - |
| link_id | string | a `link_id` against which you want to upload the statement | Yes | - |
| entity_id | string | an `entity_id` against which you want to upload the statement | No | - |
| pdf_password | string | password for the pdf in case it is password protected | No | - |

## Uploading statement file URL
This section lists the endpoint and request format for upload APIs that accepts file URLs. Response Format is [present here](/bank-connect/upload-rest-api.html#response-format).

### Bank name known

::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/statement/upload/?identity=true**
:::

### Authentication
Request header `x-api-key` with API Key as value must be present in request.

### Parameters
| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| file_url | string  | publicly accessible full file URL with protocol (HTTPS) | Yes | - |
| bank_name | string | a valid [bank identifier](/bank-connect/appendix.html#bank-identifiers) | Yes | - |
| link_id | string | a `link_id` against which you want to upload the statement | Yes | - |
| entity_id | string | an `entity_id` against which you want to upload the statement | No | - |
| pdf_password | string | password for the pdf in case it is password protected | No | - |

### Bank name not known <Badge text="beta" type="warn"/>

In case you don't know bank name, and want BankConnect to automatically identify the bank name:

::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/statement/bankless_upload/?identity=true**
:::

### Authentication
Request header `x-api-key` with API Key as value must be present in request.

### Parameters
| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| file_url | string  | publicly accessible full file URL with protocol (HTTP / HTTPS) | Yes | - |
| link_id | string | a `link_id` against which you want to upload the statement | Yes | - |
| entity_id | string | an `entity_id` against which you want to upload the statement | No | - |
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
        "name": "Name Extracted",
        "account_category": "individual"
    },
    "fraud_type": null,
    "status": 1
}
```

The identity information returned in the response can be used to verify the customer, while the time periods can be used to check whether the statement was uploaded for the required period.

| Key | Type | Description |
| - | - | - | - | - |
| bank_name | string  | indicates the bank, refer [here](/bank-connect/appendix.html#bank-identifiers) for complete list |
| statement_id | string | Unique identifier for Statement |
| entity_id | string | unique identifier for entity |
| date_range | object | contains `from_date` and `to_date` strings indicating the time period in `YYYY-MM-DD` format |
| is_fraud | boolean | indicates if a metadata fraud was detected |
| fraud_type | string | indicates the metadata fraud type, if no metadata fraud found, its value is `null` |
| identity | object | contains multiple identity information keys extracted from the statement |
| account_id | string | unique identifier for account |
| account_number | string | bank account number |
| account_category | string | account category, can be `individual` or `corporate` |
| address | string | address of the bank account holder |
| name | string | name of the bank account holder |
| status | integer | contains the status code for API, should be 1 for success. Other possible values are listed in Bad Requests(/bank-connect/upload-rest-api.html#bad-request-cases) section |

::: warning NOTE
- `fraud_type` field is `null` in case `is_fraud` field is false, otherwise it is a string. Please refer to [Fraud](/bank-connect/fraud.html) section to know more about it.
- Some of the fields within the identity dictionary, or the `from_date` and `to_date` maybe `null` for few statements depending on the bank statement format and what all information is present on the top of the statement. The `from_date` and the `to_date` in case are returned as `null`, are updated for the statement at a later stage when transactions are extracted.
- The query parameter `?identity=true` is optional for both the APIs above, if not specified the response will only include `entity_id`, `statement_id` and `bank_name` fields in case of successful upload.
:::

## Bad Request Cases

In case of successful upload, you'll get the `status` field value as `1`. Following are bad request cases with status codes:
| Case | HTTP status code | status field value | Sample response |
| - | - | - | - |
| Compulsory field is missing |  400 | 0 | `{"file": ["This field is required."], "status": 0}` |
| Invalid field value | 400 | 0 | `{"file": ["Invalid Base 64 string"], "status": 0}` |
| Incorrect Content Type | 400 | 0 | `{"file": ["This field must be present as a form field. Send request with content type x-www-form-urlencoded or form-data"], "status": 0}` |
| Trial Expired for Dev Credentials | 402 | 2 | `{"message": "Your trial period has expired. Please request FinBox to upgrade your plan", "status": 2}` |
| Password Incorrect | 400 | 3 | `{"entity_id": "some_long_uuid4", "message": "Password incorrect", "status": 3}` |
| Specified bank doesn't match with detected bank | 400 | 4 | `{"entity_id": "some_long_uuid4", "message": "Not axis statement", "status": 4}` |
| Cannot Detect Bank (Bank less APIs only) | 400 | 5 | `{"entity_id": "some_long_uuid4", "message": "Unable to detect bank. Please provide BANK NAME.", "status": 5}` |
| Non Parsable PDF - PDF file is corrupted or has no selectable text (only scanned images) | 400 | 6 | `{"entity_id": "some_long_uuid4", "message": "PDF is not parsable", "status": 6}` |
| Balance, date and amount columns are not present in the statement | 400 | 7 | `{"entity_id": "some_long_uuid4", "message": "Unsupported Bank Statement Format. It should have balance, date and amount columns.", "status": 7}` |

::: danger IMPORTANT
- We do not support scanned PDF images, if uploaded we throw a **400 HTTP Code** with the `status` as `6`
- In case a valid PDF comes as an input, and we are not able to extract information from it, API will give a **200 HTTP Code** but will have **identity** information in response as `null`. Our quality team takes care of such cases, and new templates are added within 24 hours.
- In case you are in **DEV** environment and your **trial period has expired**, then upload APIs will give you a response with **402 HTTP Code**. To fix this please request FinBox to upgrade your plan.
:::