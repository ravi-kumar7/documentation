# Sourcing Entity - Rest API
These APIs are called from the **server side**. The workflow is as follows:
- First a user is created by calling [Create User](/middleware/sourcing-rest-api.html#create-user) API
- Eligibility for the given user is checked by calling [Get Eligibility](/middleware/sourcing-rest-api.html#get-eligibility) API
- Token is generated for the user by calling [Generate Token](/middleware/sourcing-rest-api.html#generate-token) API and is sent to the Android app to be used with the [SDK](/middleware/android-sdk.html)

## Authentication
All the APIs below require a **Server API Key** to be passed in `x-api-key` header. This API Key will be shared directly by FinBox. Make sure this key is not exposed in any of your client side applications.

## Postman Collection
Postman **collection** for the REST APIs can be downloaded using the button below:

<div class="button_holder">
<a class="download_button" download href="/finbox_source_entity.postman_collection.json">Download Postman Collection</a>
</div>

Postman environment having `base_url` and `server-api-key` will be shared separately.

## Request and Response formats
All APIs accept request body with `application/json` content type, the response body is as follows:
```json
{
    "status": true,
    "error": "",
    "data": ""
}
```
On successful response you'll receive 200 HTTP status, with `status` value as `true`.
On failure, response will have `status` key as `false`, and `error` will hold the message indicating the failure.

## Create User
This API creates a FinBox lending user for a given customer ID.
::: tip Endpoint
POST **`base_url`/v1/user/create**
:::

**Request Format**
```json
{
    "customerID": "somecustomerid",
    "mobile": "9999999999"
}
```
**Response**
```json
{
    "data": {
        "message": "user created!"
    },
    "error": "",
    "status": true
}
```

## Get Eligibility
This API checks for a user's eligibility and returns the eligible amount. Partner platform data and data from DeviceConnect SDK is used to prequalify the customers. The `customer_id` in DeviceConnect SDK should be same as the `customer_id` of user. 

<img src="https://finbox-cdn.s3.ap-south-1.amazonaws.com/prequalification_illustration.png" alt="Prequalification API Workflow" />

::: tip Endpoint
GET **`base_url`/v1/user/eligibility?customerID=`somecustomerid`**
:::

**Response**
```json
{
    "data": {
        "eligible_amount": 15000,
        "is_eligible": true
    },
    "error": "",
    "status": true
}
```
Here `is_eligible` is a **boolean** indicating whether the user is eligible or not, while `eligibility_amount` is a **float** that indicates the loan eligibility amount.




## Generate Token
This API can be called multiple times for an eligible user, and is used to get a valid token that can be used by the Android App to initialize the SDK.
::: tip Endpoint
POST **`base_url`/v1/user/token**
:::

**Request Format**
```json
{
    "customerID": "somecustomerid"
}
```
**Response**
```json
{
    "data": {
        "token": "123LN5hAeH6LgDzhmtJs12345678q3G25QAMLinE77IE123yrT7GWZpwNyPO3123"
    },
    "error": "",
    "status": true
}
```
Here `token` field indicates the token.

## List Users
Lists all the users created from a given sourcing entity's account. It's a paginated API.
::: tip Endpoint
GET **`base_url`/v1/users?limit=`totalRecords`&page=`numPages`**
:::


### Query Parameters
Query parameters can be appended at end of the URL like `/?account_id=somevalue`

| Parameter | Optional | Type | Description |
| - | - | - | - |
| limit | Yes | Number | Records Per Page. Default Value is 10 | 
| page | Yes | Number | Page Number. Default Value is 1 | 
| from | Yes | Date | Filter by a given start date (IST). Defaults to beginning of time. Format `yyyy-mm-dd`. Needs to be used with query param `to` | 
| to | Yes | Date | Filter by a given end date (IST). Defaults to current date. Format `yyyy-mm-dd`. Needs to be used with query param `from` | 
| customerID | Yes | String | Filter all users of a given `%customerID%` pattern. | 
| mobile | Yes | String | Filter all users of a given `%mobileNumber%` pattern.  | 
| statusText | Yes | String | Filter all loan applications of a given loan status. Status list in [Appendix](/middleware/appendix.md) | 

**Response**
```json
{
    "data": {
        "total": 2,
        "userList": [
            {
                "name": "Firstname LastName",
                "mobile": "9999999999",
                "createdAt": "2020-09-15 18:54:15",
                "status": "USER_PROFILE",
                "customerID": "someCustomerID1"
            },
            {
                "name": "FirstName2 LastName2",
                "mobile": "9999900000",
                "createdAt": "2020-09-15 18:51:11",
                "status": "USER_PROFILE",
                "customerID": "someCustomerID2"
            }
        ]
    }
}
```
Different values of user status can be found in [Appendix](/middleware/appendix.html)

## User Profile
Returns the profile of the user against a `customerID`
::: tip Endpoint
GET **`base_url`/v1/user/profile?customerID=`someCustomerID`**
:::


**Response**
```json
{
    "data": {
        "userProfile": {
            "customerID": "someCustomerID",
            "mobile": "9999999999",
            "createdAt": "2020-09-15 05:09:58",
            "status": "USER_PROFILE_UPDATED",
            "name": "Awesome User",
            "email": "username@email.com",
            "dob": "1992-11-09",
            "gender": "Male",
            "pan": "ABCDN0000P",
            "fisScore": 0.006962299255855537,
            "bureauScore": 830,
            "bureauStatus": "completed",
            "loanApplicationIDs": ["someLongUUID1"]
        }
    },
    "error": "",
    "status": true
}
```
- Different values of `status` (customer status) can be found in [Appendix](/middleware/appendix.html)
- `createdAt` indicates the date time of user creation in `YYYY-MM-DD HH:MM:SS` format (UTC)
- Different values of `bureauStatus` can be found in [Appendix](/middleware/appendix.html#list-of-bureau-status)

## List Loans
Lists all the loan applications created from a given sourcing entity's account. It's a paginated API.
::: tip Endpoint
GET **`base_url`/v1/loans?limit=`totalRecords`&page=`numPages`**
:::


### Query Parameters
Query parameters can be appended at end of the URL like `/?account_id=somevalue`

| Parameter | Optional | Type | Description |
| - | - | - | - |
| limit | Yes | Number | Records Per Page. Default Value is 10 | 
| page | Yes | Number | Page Number. Default Value is 1 | 
| from | Yes | Date | Filter by a given start date (IST). Defaults to beginning of time. Format `yyyy-mm-dd` | 
| to | Yes | Date | Filter by a given end date (IST). Defaults to current date. Format `yyyy-mm-dd` | 
| customerID | Yes | String | Filter all loan applications of a given `%customerID%` pattern.  | 
| mobile | Yes | String | Filter all loan applications of a given `%mobileNumber%` pattern.  | 
| statusText | Yes | String | Filter all loan applications of a given loan status. Status list in [Appendix](/middleware/appendix.html#list-of-loan-status) | 

**Response**
```json
{
    "data": {
        "loans": [
            {
                "loanApplicationID": "someLongUUID",
                "loanApplicationNum": "readableApplicationNumber",
                "createdAt": "2020-09-15 18:56:15",
                "status": "BANK_ADDED",
                "customerID": "someCustomerID"
            },
            {
                "loanApplicationID": "someLongUUIDAgain",
                "loanApplicationNum": "anotherReadableApplicationNumber",
                "createdAt": "2020-09-15 18:10:45",
                "status": "KYC_SUCCESS",
                "customerID": "someAnotherCustomerID"
            }
        ]
    }
}
```
Different values of loan status can be found in [Appendix](/middleware/appendix.html#list-of-loan-status)

`createdAt` indicates the date time of loan creation in `YYYY-MM-DD HH:MM:SS` format (UTC)

## Loan Details
Returns the details of a given loan application.
::: tip Endpoint
GET **`base_url`/v1/loan/details?loanApplicationID=`someLongLoanApplicationUUID`**
:::


**Response**
```json
{
    "data": {
        "loanApplicationID": "2fee9ba7-52e1-4873-8328-e0dff99cdc83",
        "loanApplicationNum": "FB1600196175625806",
        "appliedLoanAmount":15000,
        "status": "BANK_ADDED",
        "createdAt": "2020-09-15 18:56:15",
        "userDetails": {
            "name": "Amazing User",
            "email": "username@email.com",
            "mobile": "9999999999",
            "gender": "Male",
            "dob": "1992-12-09",
            "maritalStatus": "Married",
            "currentAddress": "{\"line1\": \"22, 80 Feet Rd\", \"line2\": \"Koramangala\", \"city\": \"Bengaluru\", \"pincode\": \"560095\", \"state\": \"Karnataka\"}",
            "workExperience": "2 years 0 months",
            "loanPurpose": "Education",
            "residenceType": "Rented",
            "fathersName": "",
            "pan": "ABCDP0000N",
            "customerID": "someCustomerID",
            "ref1name": "Sam Wilson",
            "ref1contactName": "Uncle Sam",
            "ref1phone": "9999988888",
            "ref1relation": "Uncle",
            "ref2name": "Shourya",
            "ref2contactName": "Shourya FinBox",
            "ref2phone": "9999900000",
            "ref2relation": "Coworker",
            "salary": null,
            "income": 12000,
            "dependents": 0,
            "expenses": 5000,
            "fisScore": 0.006962299255855537,
            "bureauScore": 830,
            "bureauStatus": "completed"
        },
        "bankDetails": {
            "accountNumber": "50100100100999",
            "ifscCode": "HDFC0000123",
            "bankName": "HDFC Bank",
            "accountHolderName": "Amazing User"
        }
    },
    "error": "",
    "status": true
}
```
Most of the parameters of the response are self-explainatory. Some key fields are explained below:
| Field | Description |
| - | - |
| loanApplicationNum | A readable loan number format is FBxxx |
| appliedLoanAmount | The amount of loan applied by the user. Note that it might be different from the final loan offer |
| residenceType | Type of residence - Rented or Owned |
| maritalStaus | Unmarried or Married |
| loanPurpose | Purpose of loan application |
| ref1name | Name of First Reference Contact |
| ref1phone | Phone number of First Reference Contact |
| ref1relation | Relationship with First Reference Contact |
| ref1contactName | Name with which reference is saved in contacts |
| dependents | Number of dependents |
| fisScore | User's FinBox Inclusion Score |
| bureauScore | User's bureau score from one of the credit bureaus |
| bureauStatus | Indicates the bureau data fetch status. Possible values can be found in [Appendix](/middleware/appendix.html#list-of-bureau-status) |
| accountHolderName | Verified name as per user's bank account |
| dob | Date of Birth in `YYYY-MM-DD` format |
| createdAt | Date time of loan creation in `YYYY-MM-DD HH:MM:SS` format (UTC) |

## Loan Offers
Returns the loan offers made to a given loan application.
::: tip Endpoint
GET **`base_url`/v1/loan/offers?loanApplicationID=`someLongLoanApplicationUUID`**
:::

```json
{
    "data": [
        {
            "amount": 6500,
            "tenureMonths": 6,
            "annualInterest": 14.4,
            "processingFee": 700,
            "gst": 18,
            "emi": 1161,
            "emiCalculationMethod": "flat_rate",
            "status": "offer_accepted",
            "disbursalAmount": 5674,
            "totalPayableAmount": 6966,
            "emiDates": [
                "2020-11-05",
                "2020-12-07",
                "2021-01-05",
                "2021-02-05",
                "2021-03-05",
                "2021-04-05"
            ]
        }
    ],
    "error": "",
    "status": true
}
```

Response fields are explained below:
| Field | Type | Description |
| - | - | - |
| amount | Float | Loan Amount |
| tenureMonths | Integer | Tenure in Months |
| annualInterest | Float | Annual Interest Rate in Percentage |
| processingFee | Float | Processing Fee |
| gst| Float | GST Percentage |
| emi | Float | EMI Amount |
| emiCalculationMethod | String | Can be `flat_rate` or `reducing_balance` |
| status | String | Can be `offer_accepted` or `offered` |
| disbursalAmount | Float | Final Disbursal Amount |
| totalPayableAmount | Float | Total Payable Amount |
| emiDates | Array of String | EMI Dates in `YYYY-MM-DD` format |

## Repay Loan
Marks the repayment of a given loan EMI
::: tip Endpoint
POST **`base_url`/v1/loan/repay**
:::

**Request Format**
```json
{
    "loanApplicationID": "someLoanApplicationID",
    "emi_id": "loanEMIID",
    "amount": 12500,
    "paid_date": "2020-09-01 12:00:00",
    "payment_mode": "upi",
    "reference_id":"someUTRNumber"
}
```
**Response Format**

```json
{
    "data": {
        "reference_id": "FinBoxReferenceIDforRecon"
    },
    "error": "",
    "status": true
}
```

## User Activity History
Returns the activity 
::: tip Endpoint
GET **`base_url`/v1/user/activity?customerID=`someCustomerID`**
:::


**Response**
```json
{
    "data": {
        "userActivityHistory": [
            {
                "entityType": "sourcing_entity",
                "loggedAt": "2020-09-15 17:52:58",
                "eventType": "user_created",
                "eventDescription": "",
                "loanApplicationID": ""
            },
            {
                "entityType": "system",
                "loggedAt": "2020-09-15 17:52:58",
                "eventType": "loan_approved",
                "eventDescription": "",
                "loanApplicationID": "someLongUUID"
            }
        ]
    }
}
```

A list of all possible activities can be found [Appendix](/middleware/appendix.html#list-of-custom-activities)

A list of all possible entity types can be found [Appendix](/middleware/appendix.html#list-of-entity-types)

## Webhook
A webhook can be configured to receive events on different actions taken throughout the user journey.

To configure webhook URL, you have to share with us a **valid endpoint**.

:::tip A Valid Endpoint:
- receives a POST request
- receives a request body with content-type `application/json`
- returns a 200 status code on successful reception.
:::

We'll be sending JSON encoded body in the following payload format:
```json
{
    "customerID": "some_customer_id",
    "entityType": "sourcing_entity",
    "eventDescription": "",
    "eventType": "eligibility_calculated",
    "loanApplicationID": "",
    "loggedAt": "2020-09-15 21:58:31"
}
```
`loanApplicationID` is available once the loan application is created.

A list of all possible activities can be found [Appendix](/middleware/appendix.html#list-of-customer-activities)

A list of all possible entity types can be found [Appendix](/middleware/appendix.html#list-of-entity-types)
