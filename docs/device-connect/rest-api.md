# Device Connect: REST API

The FinBox Device Connect REST API enables **"server to server data"** fetching of customers' Android device data. The customer's data can be fetched using the `customer_id`. API accepts JSON-encoded request bodies, returns JSON-encoded responses.

## Authentication

FinBox provides a valid and signed certificate for all API methods and endpoints. To access the API methods requester must ensure that their connection library supports HTTPS.

Authentication for the APIs are based on **API key** provided by the FinBox. Server to server communication can commence when **IP of requester are whitelisted** on the FinBox servers. This can be easily done upon request.

## API Integration Workflow

### Results API

Once FinBox DeviceConnect SDK is initialized, data from device is sent to FinBox processing engine against an anonymous `customer_id` which will be the primary key from retrieving any information from the server.

Clients need to call the **Results API** with `customer_id` to get the predictors for a given customer. A sample workflow is shown in section [below](/device-connect/rest-api.html#sample-workflow). In case results API returns with status `"in_progress"` (meaning data is currently being processed), client should poll the Results API with a delay of at least **10 seconds**

### Sample Workflow

<img src="/sample_workflow.png" alt="Sample Workflow" />

1. Call FinBox Results API
2. In case the response status is `"in_progress"`, retry after 10 seconds
3. In case the response status is `"complete"`, receive data as per format mentioned in [this](/device-connect/rest-api.html#results-api-response) section.

## Results API Endpoints

::: tip Base URL
For all the endpoints, the base URL is **https://insights.finbox.in/v2/**
:::

| Results | Endpoint | Request Type | Description |
| - | - | -| - |
| General Predictors | **/risk/predictors** | POST | General features extracted from customer's data |

::: tip Predictors
Other than general predictors, there are also more predictor endpoints which will be shared based on the  requirement by FinBox team.
:::

## Results API Request

### Request Header and Body
For all the results API request structure is same, all requests must have `x-api-key` field in **header** having the value as the API Key shared by FinBox team. The following **keys** must be passed in every request body as keys to a json document:

**Request Body**
| Key | Type | Description |
| --- | --- | --- |
| customer_id | String | Customer ID for which feature vector is required |
| version | Integer | Version of the feature set. The latest version applicable for client will be communicated by FinBox team |
| salt | String | A secret key which is computed basis logic mentioned in section below |

### Calculating salt

Salt is calculated as follows:
1. A = Create MD5 hash of `customer_id`
2. B = Concatenate string of A and secret key shared by FinBox.
3. C = Create SHA-256 hash of B
4. Salt = base64 encoded version of C

Sample code for salt generation in **Java**:
```java
/**
 * Method that takes customer_id and secret key as input, and returns the salt
 *
 * @param clientId String representing the customer_id
 * @param finboxKey String representing the secret key shared by FinBox
 * @return Salt
 */
private static String getSecretKey(String clientId, String finboxKey) throws NoSuchAlgorithmException {
    MessageDigest mdigest = MessageDigest.getInstance("MD5");
    mdigest.update(clientId.getBytes());
    String hashedOutput = DatatypeConverter.printHexBinary(mdigest.digest());
    String concatString = hashedOutput + finboxKey;
    return get256Encoded(concatString);
}

/**
 * Helper method that converts the string into SHA 256 and returns it
 *
 * @param s String to be 256 encoded
 * @return Converted 256 hash
 */
private static String get256Encoded(final String s) {
    MessageDigest digest = null;
    String hash = null;
    try {
        digest = MessageDigest.getInstance("SHA-256");
        digest.update(s.getBytes());

        hash = Base64.getEncoder().encodeToString(digest.digest());
        System.out.println("SHA-256 -> " + hash);
        return hash;
    } catch (NoSuchAlgorithmException e1) {
        e1.printStackTrace();
    }
    return "";
}
```

Sample code for salt generation in **Python**:
```python
import hashlib, base64

def create_salt(customer_id, client_secret):
    """
    Takes customer_id (unique identifier of customer)
    and client_secret (shared by FinBox) as input
    and returns salt in response
    """
    customer_hash = hashlib.md5(customer_id.encode('utf-8')).hexdigest().upper()
    intermediate_hash = customer_hash + client_secret
    salt_encoded = hashlib.sha256(intermediate_hash.encode('utf-8')).digest()
    salt = base64.b64encode(salt_encoded).decode()
    return salt
```
### Sample Request

**Headers**
```yaml
Content-Type: application/json
x-api-key: XXXX-XXXX-XXXX
```

**Request Body**
```json
{
    "customer_id": "1234ABCD4567",
    "version": 1,
    "salt": "5vVMNofMy5kQXx647sBdYBoMolMb1GGBSYLkzwaa9v8="
}
```

## Results API Response
API will give a JSON Response with following keys:

### Response Keys

| Key | Description | Type | Nullable |
| --- | --- | --- | --- |
| customer_id | Customer ID for which data was requested | STRING [260] | Yes |
| request_id | A unique string for each request | STRING [32] | Yes |
| status | Status of the operation. | STRING [20] | No |
| message | Description of status | STRING [200] | No |
| date_requested | Timestamp of processing request | STRING with `YYYY-MM-DDThh:mm:ss:mil` format | Yes |
| date_processed | Timestamp of processing completion | STRING with `YYYY-MM-DDThh:mm:ss:mil` format | Yes |
| data | An array of objects, each object representing the predictors, having keys `name` indicating the predictor name and `value` indicating the values | JSON | Yes |

::: danger data key
The list of predictors in `data` key will be different based on the result API endpoint, feature set version and requester. This **list will hence be shared separately** by FinBox team during the integration.
:::

::: warning NOTE
Some of the keys in response may be missing based on availability of data and HTTP Status code. Please refer to examples for each of the cases listed [here](/device-connect/rest-api.html#status-values).
:::

### `status` values
Depending on the availability of data, there can be different cases with different `status` values as follows:

| Case | `status` value | HTTP Status Code | Description / Action |
| - | - | - | - |
| [Calculation in progress](/device-connect/rest-api.html#case-1-calculation-in-progress) | `"in_progress"` | 202 | The request input is correct and processing has started. Please retry in 10 seconds |
| [Calculation complete and data is available](/device-connect/rest-api.html#case-2-calculation-complete-and-data-is-available) | `"complete"` | 200 | The request input is correct and processing has completed. Response contains the predictors |
| [Calculation complete and data is unavailable](/device-connect/rest-api.html#case-3-calculation-complete-and-data-is-unavailable) | `"no_data"` | 200 | The request input is correct and processing has completed but response contains no predictors because of lack of data from user's device |
| [Invalid customer ID](/device-connect/rest-api.html#case-4-invalid-customer-id) | `"not_found"` | 200 | User does not exist in FinBox system |
| [Bad request](/device-connect/rest-api.html#case-5-bad-request) | `"error"` | 400 | The request input is incorrect / malformed. More details available in `message` key |
| [Unauthorized](/device-connect/rest-api.html#case-6-unauthorized) | `"error"` | 403 | This happens in case API key is incorrect or IP address in not whitelisted |
| [Internal Server Error](/device-connect/rest-api.html#case-6-unauthorized) | `"error"` | 5xx | The request processing failed because of some internal error. Please retry with exponential back-off. If the issue persists, please contact support |
| [Rate Limit Exceeded](/device-connect/rest-api.html#case-8-rate-limit-exceeded) | `"error"` | 429 | This happens in case the maximum allowed rate limit on API exceeds |

### Case 1 - Calculation in Progress

HTTP Status Code: **202**

Sample Response Body:

```json
{
    "customer_id": "A145BC6312B50CA2B58233288F81C02114A6A74E9A62482169F9F",
    "request_id": "abcd-def-dfdf-xcds1",
    "date_requested": "2019-01-03T06:37:44:003",
    "status": "in_progress",
    "message": "Featurization in Progress, please try again in 10 Seconds"
}
```

### Case 2 - Calculation complete and data is available

HTTP Status Code: **200**

Sample Response Body:

```json
{
    "customer_id": "A145BC6312B50CA2B58233288F81C02114A6A74E9A62482169F9F",
    "request_id": "abcd-def-dfdf-jjj1",
    "date_requested": "2019-01-03T06:37:44:003",
    "date_processed": "2018-12-12T01:01:57:221",
    "status": "complete",
    "message": "data processed successfully",
    "data": [] // will hold the predictor objects
}
```

### Case 3 - Calculation complete and data is unavailable

HTTP Status Code: **200**

Sample Response Body:

```json
{
    "customer_id": "A145BC6312B50CA2B58233288F81C02114A6A74E9A62482169F9F",
    "request_id": "abcd-def-dfdf-000l",
    "date_requested": "2019-01-03T06:37:44:003",
    "date_processed": "2018-12-12T01:01:57:221",
    "status": "no_data",
    "message": "No data available for user",
    "data": null
}
```

### Case 4 - Invalid Customer ID

HTTP Status Code: **200**

Sample Response Body:

```json
{
    "customer_id": "A145BC6312B50CA2B58233288F81C02114A6A74E9A62482160F9F",
    "request_id": "abcd-def-dfdf-ddd1",
    "date_requested": "2019-01-03T06:37:44:003",
    "date_processed":null,
    "status": "not_found",
    "message": "User not found",
    "data": null
}
```

### Case 5 - Bad Request

HTTP Status Code: **400**

Sample Response Body:

```json
{
    "customer_id": "A145BC6312B50CA2B58233288F81C02114A6A74E9A62482160F9F",
    "request_id": "abcd-def-dfdf-ddd1",
    "date_requested": "2019-01-03T06:37:44:003",
    "status": "error",
    "message":"Missing Key version"
}
```

### Case 6 - Unauthorized

HTTP Status Code: **403**

Sample Response Body:

```json
{
    "status": "error",
    "message": "Incorrect API Key"
}
```

### Case 7 - Internal Server Error

HTTP Status Code: **5xx**

Sample Response Body:

```json
{
    "status": "error",
    "message": "Internal Server Error. Please retry. If issue persists, please contact support"
}
```

### Case 8 - Rate Limit Exceeded

HTTP Status Code: **429**

Sample Response Body:

```json
{
    "status": "error",
    "message": "Rate limit exceeded"
}
```