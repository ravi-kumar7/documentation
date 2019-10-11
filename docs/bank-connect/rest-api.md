## REST API
The REST APIs have predictable resource-oriented URLs, accepts JSON-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.

## Authentication
FinBox Bank Connect REST API uses API keys to authenticate requests. Please keep the API keys secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth. All API requests must be made over HTTPS. Calls made over plain HTTP will fail. API requests without authentication will also fail.

To provide API key while making a request, `X-API-KEY` must be present in the request header with API key value.

::: warning Additional layer of security
FinBox also provides an additional layer of authentication on request. If enabled, then other than usual API key check, Bank Connect expects `ACCESS_TOKEN` and `TIMESTAMP` in header, where `ACCESS_TOKEN` is generated using a _function_ that takes `TIMESTAMP` and a _secret key_ as input. The _function_ and _secret key_ is shared on request.
:::

## Creating Entity
here goes stuff about entity creation

## Uploading Statement
here goes stuff about uploading statement pdf
