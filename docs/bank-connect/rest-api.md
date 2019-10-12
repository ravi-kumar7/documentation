---
base_url: https://portal.finbox.in/bank-connect #base URL for the API
version: v1 # version of API
---

# REST API
The REST APIs have predictable resource-oriented URLs, accepts JSON-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.

## Authentication
FinBox Bank Connect REST API uses API keys to authenticate requests. Please keep the API keys secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth. All API requests must be made over HTTPS. Calls made over plain HTTP will fail. API requests without authentication will also fail.

To provide API key while making a request, `X-API-KEY` must be present in the request header with API key value.

::: tip Additional layer of security
FinBox also provides an additional layer of authentication on request. If enabled, then other than usual API key check, Bank Connect expects `ACCESS_TOKEN` and `TIMESTAMP` in header, where `ACCESS_TOKEN` is generated using a _function_ that takes `TIMESTAMP` and a _secret key_ as input. The _function_ and _secret key_ is shared on request.
:::

## Creating Entity
::: warning
This is required only if you want to generate an `entity_id` against a `link_id`, if you use upload statement APIs directly, it will generate `entity_id` automatically, but the option for `link_id` linking id will not be present in that case.
:::
Creates an entity for the given `link_id`. You can also specify if you want to enforce single account for the given entity. By enforcing single account, the upload statement API against the entity id will throw an error if statement uploaded is of different account, but will accept if different statements of same bank accounts are uploaded. By default, every entity supports multiple accounts.

::: warning
Same `link_id` can be used to generate multiple entities.
:::

### Endpoint
::: tip
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/**
:::

### Parameters
| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| link_id | string  | link_id value | No | null |
| is_single_account | boolean | Enforce single account for the entity | No | false |

### Response
On successful creation, the API gives a **201 HTTP code** with following response:
```json
{
    "entity_id": "a_uuid4_string",
    "link_id": "link_id_you_sent"
}
```

## List Entities
Lists all entities (paginated) created under your account.

### Endpoint
::: tip
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/**
:::

### Parameters
| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| page | integer  | page number | No | 1 |

### Response
On successful fetching, the API gives a **200 HTTP code** with following response:
```json
{
    "count": 123,
    "next": "some_url",
    "previous": null,
    "results": [
        {
            "entity_id": "some_uuid4_1",
            "link_id": null
        },
        {
            "entity_id": "some_uuid4_2",
            "link_id": null
        }
    ]
}
```
`count` here indicates the total number of entities, `next` and `previous` have URLs for next and previous pages respectively. If no page exists, they store `null` as value.


## List Entities by `link_id`
Lists all entities linked to a given `link_id`.

### Endpoint
::: tip
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/link_overview/**
:::

### Parameters
| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| link_id | string  | link_id value | Yes | - |

### Response
On successful fetching, the API gives a **200 HTTP code** with following response format:
```json
{
    "progress_data": [
        {
            "entity_id": "some_uuid4_1",
            "months": [
                "2019-04",
                "2019-05",
                "2019-06",
                "2019-07"
            ],
            "bank": "axis"
        },
        {
            "entity_id": "some_uuid4_2",
            "months": [],
            "bank": null
        }
    ],
    "link_id": "link_id_you_sent"
}
```
`progress_data` here contains the list of objects, each having `entity_id`, `months` and `bank`. `months` holds list of month and year for which data is available for the given entity. `bank` and `months` are `null` and `[]` respectively if no statement were uploaded / processed under that entity.

## `link_id` from `entity_id`
If required you can fetch `link_id` from an `entity_id` using the API below:

### Endpoint
::: tip
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/`<entity_id>`/**
:::

### Response
On successful fetching, the API gives a **200 HTTP code** with following response:
```json
{
    "entity_id": "uuid4_you_sent",
    "link_id": "the_link_id"
}
```
In case no `link_id` exists for the given entity, the value of `link_id` comes as `null` in response.

::: danger
In case not entity with the provided `entity_id` exists, the API will return a response with **404 (Not Found) error code**.
:::

## Uploading Statement

::: warning
`entity_id`, is an optional parameter for the below two APIs, if specified, the statement gets uploaded against that entity. If not specified, a new entity is created and the statement is uploaded against it.
:::

In case you already **know the bank name**:

### Endpoint
::: tip
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/statement/upload/?identity=true**
:::

### Parameters
| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| file | file  | the statement pdf file | Yes | - |
| bank_name | string | a valid bank identifier | Yes | - |
| entity_id | string | an `entity_id` against which you want to upload the statement | No | - |
| pdf_password | string | password for the pdf in case it is password protected | No | - |

In case you **don't know bank name**, and want Bank Connect to automatically identify the bank name:

### Endpoint
::: tip
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/statement/bankless_upload/?identity=true**
:::

### Parameters
| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| file | file  | the statement pdf file | Yes | - |
| entity_id | string | an `entity_id` against which you want to upload the statement | No | - |
| pdf_password | string | password for the pdf in case it is password protected | No | - |

### Response

Both the APIs above give the response in the format below in case of successful file upload with a **200 HTTP Code**:

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
::: warning
`fraud_type` field is `null` in case `is_fraud` field is false, otherwise it is a string. Please refer to [Fraud](/bank-connect/basics.html#fraud) section in Basics to know more about it.
:::

::: warning
Some of the fields within the identity dictionary, or the `from_date` and `to_date` maybe `null` for few statements depending on the bank statement format and what all information is present on the top of the statement. The `from_date` and `to_date` in case was null, are updated for the statement at a later stage when transaction are extracted.
:::

::: warning
The query parameter `?identity=true` is optional for both the APIs above, if not specified the response will only include `entity_id`, `statement_id` and `bank_name` fields in case of successful upload.
:::

::: danger
The bank less upload API will throw an error with code **400 (Bad Request)** along with appropriate message in case it is **not able to identify the bank name** from the statement pdf file.
Other cases where both the APIs above throws 400 error (with appropriate message in `message` field) are:
- **Incorrect Password**
- **Unparsable PDF** (PDF file has only images or is corrupted)

Sample error response:
```json
{
    "entity_id": "some_entity_id_created",
    "message": "PDF is not parsable"
}
```

It is to be noted that even though an error is thrown, an entity for the statement upload is created (if `entity_id` was not specified in the request) and `entity_id` is hence always given in response.
:::

## Progress
When a statement is uploaded, identity information and basic fraud checks happen at the same time. However other statement analysis, like transaction extraction, salary, recurring transactions, advanced fraud checks, enrichment happen asynchronously. Hence all the GET APIs for these **analysis parameters** have a `progress` field. You can track the progress of a statement uploaded using this.

`progress` is an array of objects. Each object represents a statement, it has `status` field that can be `processing`, `completed` or `failed` and `statement_id` field which identifies a statement uniquely.

Sample progress value:
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

::: warning
A general rule of thumb would be to make sure all objects in the `progress` field have their `status` as `completed`, by polling the required analysis field API in intervals. As soon as all status are `completed`, the same API will give the correct required values.

Also this progress `status` gets changed only when all analysis is `completed`, hence if you have all statement as `completed`, and no upload has happened to the same entity in meantime, you can fetch all other analysis APIs directly without having to worry about the progress.
:::
