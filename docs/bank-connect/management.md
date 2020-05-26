---
base_url: https://portal.finbox.in/bank-connect #base URL for the API
version: v1 # version of API
---


# BankConnect: Management

BankConnect REST APIs also provide additional APIs for management purposes. This article lists them.

All the APIs listed below use the same authentication method as listed [here](/bank-connect/rest-api.html#authentication).


## List Entities
Lists all entities (paginated) created under your account.

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/**
:::

### Parameters
| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| page | integer  | page number | No | 1 |
| link_id | string | to filter based on link_id | No | - |

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
            "link_id": null,
            "meta_data": null
        },
        {
            "entity_id": "some_uuid4_2",
            "link_id": null,
            "meta_data": null
        }
    ]
}
```
`count` here indicates the total number of entities, `next` and `previous` have URLs for next and previous pages respectively. If no page exists, they store `null` as value.

::: warning NOTE
There are **10 records** per page at max.
:::

## Getting Link ID from Entity ID
If required you can fetch `link_id` from an `entity_id` using the API below:

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/entity/`<entity_id>`/**
:::

### Response
On successful fetching, the API gives a **200 HTTP code** with following response:
```json
{
    "entity_id": "uuid4_you_sent",
    "link_id": "the_link_id",
    "meta_data": "meta_data_value"
}
```
In case no `link_id` exists for the given entity, the value of `link_id` comes as `null` in response.

::: danger Not Found
In case no entity with the provided `entity_id` exists, the API will return a response with **404 (Not Found) error code**.
:::