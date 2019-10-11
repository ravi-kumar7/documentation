---
base_url: https://portal.finbox.in/bank-connect #base URL for the API
version: v1 # version of API
---

## REST API
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
On successful fetching, the API gives a **200 HTTP code** with following response:
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


## Uploading Statement specifying bank name
In case you already know the bank name, then you can use this API to upload a bank statement pdf specifying the bank name.
