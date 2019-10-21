# Device Connect: REST API

FinBox DeviceConnect Android SDK enables borrowers to share device data to avail credit even if they are new to credit or thin file customers and helps them get better terms based on the shared data.

This document will enable integration of FinBox DeviceConnect API for &quot; **server to server data**&quot; fetching by the client from its end customers&#39; Android mobile devices.

# 2. FinBox DeviceConnect REST API

Using FinBox DeviceConnect SDK API, client can get the feature vector corresponding to the requested **customer\_id.**

## 2.1 Request Response Format

The FinBox DeviceConnect API is a JSON REST API. The request and response will be in JSON.

## 2.2 Security and SSL

FinBox provides a valid and signed certificate for all API methods and endpoints. To access the API methods clients must ensure that their connection library supports HTTPS.

## 2.3 Authentication based on API Key and IP Whitelisting

1. The FinBox servers authenticate based on **FinBox**** server API key** provided by the FinBox.
2. Server to server communication can commence when **client&#39;s IP&#39;s** are whitelisted on the FinBox servers. This can be easily done upon request.

# 3. API Integration Workflow

## 3.1 Fetching Data for a customer\_id

Once FinBox DeviceConnect SDK is initialized, data from device is sent to FinBox processing engine against an anonymous customer\_id which will be the primary key from retrieving any information from the server.

### 3.1.1 Results API

Clients need to call the results API with customer\_id to get the predictors for a given customer. A sample workflow is shown in section 3.1.2. In case results API returns with status **&quot;in\_progress&quot;** (meaning data is currently being processed), client should poll the Results API with a delay of at least 10 seconds

### 3.1.2 Sample Workflow

Image Here

1. Call FinBox Results API
2. In case response status = &quot;in\_progress&quot;, retry after 10 seconds
3. In case response status = &quot;success&quot;, receive data as per format mentioned in Section 4.1.3

# 4. API Details

## 4.1 API URL and Request Structure

#### Results API URL

|   | UAT Endpoint | Production Endpoint |
| --- | --- | --- |
| Base URL | [https://insightsdev.finbox.in/v2](https://insightsdev.finbox.in/v2/risk/predictors) | [https://insights.finbox.in/v2](https://insights.finbox.in/v2/) |
| Request Type | POST | POST |
| General Predictors | /risk/predictors | /risk/predictors |
| Apps Predictors | /apps | /apps |
| Device Predictors | /device | /device |

The request-response structure of all the resources is same. The key names of predictors in response will change only.

#### Request

Following parameters must be passed in request

**Body**

| Parameter Name | Parameter Type | Parameter Description |
| --- | --- | --- |
| customer\_id | STRING | Customer ID for which feature vector is required |
| version | INTEGER | Version of the feature set. The latest version applicable for client will be communicated by FinBox team |
| salt | STRING | A secret key which is computed basis logic mentioned in section below |

#### Calculating salt

Salt is calculated as follows:

1. A = Create MD5 hash of customer\_id
2. B = Concatenated string of A and secret key shared by FinBox.
3. C = Create SHA 256 hash of B
4. Salt = base64 encoded version of C

Sample Java and Python codes for salt calculation will be shared separately

#### Headers

| Header Name | Header Description |
| --- | --- |
| x-api-key | API Key shared by FinBox team |



#### Sample Snippets

Image Here



**/\*\* Headers \*\*/**

Content-Type: application/json

x-api-key: XXXX-XXXX-XXXX



Image Here

**/\*\* REQUEST BODY \*\*/**

{

&quot;customer\_id&quot;:&quot;1234ABCD4567&quot;,

&quot;version&quot;: 1,

&quot;salt&quot;: &quot;5vVMNofMy5kQXx647sBdYBoMolMb1GGBSYLkzwaa9v8=&quot;

}

## 4.2 API Response Structure

In case of successful processing, API would return with predictors data.

Depending on the availability of data response could be:

1. **Case 1 : Calculation in progress** –  The request input is correct and processing has started. Please retry in 10 seconds
2. **Case 2 : Calculation complete and data is available** – The request input is correct and processing has completed. Response contains the predictors
3. **Case 3** : **Calculation complete and data is unavailable** – The request input is correct and processing has completed but response contains no predictors because of lack of data from user&#39;s device
4. **Case 4** : **Invalid customer ID**** –** User does not exist in FinBox system
5. **Case 5** : **Bad request –** The request input is incorrect / malformed. More details available in description key
6. **Case 6 : Unauthorized  -** This happens in case API key is incorrect or IP address in not whitelisted
7. **Case 7** : **Internal Server Error –** The request processing failed because of some internal error. Please retry with exponential back-off. If the issue persists, please contact support
8. **Case 8** : **Quota Exceeded –** This happens in case the maximum allowed rate limit on API exceeds

#### Response Keys

| **Sl. No.** | **Column Name** | **Description** | **Type** | **Nullable** |
| --- | --- | --- | --- | --- |
| **1** | customer\_id | Customer ID for which data was requested | STRING [260] | Yes |
| **2** | request\_id | A unique string for each request | STRING [32] | Yes |
| **3** | status | Status of the operation. | STRING [20] | No |
| **4** | message | Description of status | STRING [200] | No |
| **5** | date\_requested | Timestamp of processing request | STRING YYYY-MM-DDThh:mm:ss:mil | Yes |
| **6** | date\_processed | Timestamp of processing completion | STRING YYYY-MM-DDThh:mm:ss:mil | Yes |
| **7** | data | A dictionary of predictors. Key – predictor nameValue – predictor value **The keys for different resources will be different and will be shared separately** | JSON | Yes |



### 4.2.1 Case 1 – Calculation in Progress

Image Here

**HTTP Status Code = 202**

**/\*\* RESPONSE BODY \*\*/**

{

&quot;customer\_id&quot;:&quot;A145BC6312B50CA2B58233288F81C02114A6A74E9A62482169F9F&quot;,

&quot;request\_id&quot;:&quot;abcd-def-dfdf-xcds1&quot;,

&quot;date\_requested&quot;:&quot;2019-01-03T06:37:44:003&quot;,

&quot;status&quot;:&quot;in\_progress&quot;,

&quot;message&quot;:&quot;Featurization in Progress, please try again in 10 Seconds&quot;

}



### 4.2.2 Case 2 – Calculation complete and data is available

Image Here

**HTTP Status Code = 200**

##### **/\*\* RESPONSE BODY\*\*/**

 {

&quot;customer\_id&quot;:&quot;A145BC6312B50CA2B58233288F81C02114A6A74E9A62482169F9F&quot;,

&quot;request\_id&quot;:&quot;abcd-def-dfdf-jjj1&quot;,

&quot;date\_requested&quot;:&quot;2019-01-03T06:37:44:003&quot;,

&quot;date\_processed&quot;:&quot;2018-12-12T01:01:57:221&quot;,

&quot;status&quot;: &quot;complete&quot;,

&quot;message&quot;:&quot;data processed successfully&quot;,

&quot;data&quot;: {

                        &quot;av\_balance\_c30&quot;: 7890.1,

                        &quot;num\_cheque\_bounces\_c30&quot;:0,

                        ...

                        ...

                        &quot;is\_postpaid&quot;: false

          }

 }

A list of predictor keys will be made available along with the integration document.



### 4.2.3 Case 3 – Calculation complete and data is unavailable

Image Here

**HTTP Status Code = 200**

**/\*\* RESPONSE BODY \*\*/**

{

&quot;customer\_id&quot;:&quot;A145BC6312B50CA2B58233288F81C02114A6A74E9A62482169F9F&quot;,

&quot;request\_id&quot;:&quot;abcd-def-dfdf-000l&quot;,

&quot;date\_requested&quot;:&quot;2019-01-03T06:37:44:003&quot;,

&quot;date\_processed&quot;:&quot;2018-12-12T01:01:57:221&quot;,

&quot;status&quot;: &quot;no\_data&quot;,

&quot;message&quot;:&quot;No data available for user&quot;,

&quot;data&quot;: null

}



### 4.2.4 Case 4 – Invalid Customer ID

Image Here

**HTTP Status Code = 200**

**/\*\* RESPONSE BODY \*\*/**

{

&quot;customer\_id&quot;:&quot;A145BC6312B50CA2B58233288F81C02114A6A74E9A62482160F9F&quot;,

&quot;request\_id&quot;:&quot;abcd-def-dfdf-ddd1&quot;,

&quot;date\_requested&quot;:&quot;2019-01-03T06:37:44:003&quot;,

&quot;date\_processed&quot;:null,

&quot;status&quot;: &quot;not\_found&quot;,

&quot;message&quot;:&quot;User not found&quot;,

&quot;data&quot;: null

#### }



### 4.2.5 Case 5 – Bad Request

Image Here

**HTTP Status Code = 400**

**/\*\* RESPONSE BODY \*\*/**

{

&quot;customer\_id&quot;:&quot;A145BC6312B50CA2B58233288F81C02114A6A74E9A62482160F9F&quot;,

&quot;request\_id&quot;:&quot;abcd-def-dfdf-ddd1&quot;,

&quot;date\_requested&quot;:&quot;2019-01-03T06:37:44:003&quot;,

&quot;status&quot;: &quot;error&quot;,

&quot;message&quot;:&quot;Missing Key version&quot;

}

### 4.2.6 Case 6 – Unauthorized

Image Here

**HTTP Status Code = 403**

**/\*\* RESPONSE BODY \*\*/**

{

&quot;status&quot;: &quot;error&quot;,

&quot;message&quot;:&quot;Incorrect API Key&quot;

#### }



### 4.2.7 Case 7 – Internal Server Error

Image Here

**HTTP Status Code = 5xx**

**/\*\* RESPONSE BODY \*\*/**

{

&quot;status&quot;: &quot;error&quot;,

&quot;message&quot;:&quot;Internal Server Error. Please retry. If issue persists, please                    contact support&quot;

#### }

### 4.2.8 Case 8 – Rate Limit Exceeded

Image Here

**HTTP Status Code = 429**

**/\*\* RESPONSE BODY \*\*/**

{

&quot;status&quot;: &quot;error&quot;,

&quot;message&quot;:&quot;Rate limit exceeded&quot;

#### }

## 4.3 Status Codes and Messages

| **Sl. No.** | **HTTP Status Code** | **Status** | **Message** |
| --- | --- | --- | --- |
| **1** | 200 | complete | Request processed successfully.  Predictor vector returned in response |
| **2** | 200 | no\_data | Request processed successfully. No data exists for user |
| **3** | 202 | in\_progress | Request processing in Progress, Please Try Again in 10 Seconds |
| **4** | 200 | not\_found | Unrecognised customer\_id  |
| **5** | 400 | error | Bad Request. Missing Keys |
| **6** | 400 | error | Bad Request. Timestamp format incorrect |
| **7** | 400 | error | Bad Request. Version is not correct |
| **8** | 429 | error | Rate Limit Exceeded. Please try again |
| **9** | 403 | error | Unauthorized. Incorrect API Key |
| **10** | 403 | error | Unauthorized IP address |
| **11** | 500 | error | Internal Server Error. Please contact support |
| **12** | 429 | error | Rate limit exceeded |