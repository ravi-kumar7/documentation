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

### Request Format
```json
{
    "customerID": "somecustomerid",
    "mobile": "9999999999"
}
```
### Response
```json
{
    "data": {
        "message": "user created!"
    },
    "error": "",
    "status": true
}
```

### Error Cases
| Case | HTTP Code |
| - | - |
| Missing customerID | 403 |
| Missing mobile number | 403 |
| Invalid mobile number | 403 |
| User already exists | 409 |


## Get Eligibility
This API checks for a user's eligibility and returns the eligible amount. Partner platform data and data from DeviceConnect SDK is used to prequalify the customers. The `customer_id` in DeviceConnect SDK should be same as the `customer_id` of user. 

<img src="https://finbox-cdn.s3.ap-south-1.amazonaws.com/prequalification_illustration.png" alt="Prequalification API Workflow" />

::: tip Endpoint
GET **`base_url`/v1/user/eligibility?customerID=`somecustomerid`**
:::

### Response
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

### Error Cases
| Case | HTTP Code |
| - | - |
| Missing customerID | 403 |
| User not found | 400 |
| User does not have eligibility data | 409 |

## Generate Token
This API can be called multiple times for an eligible user, and is used to get a valid token that can be used by the Android App to initialize the SDK.

::: warning Token Validity
- In case of **production** environment, the token is valid for **24 hours** and in **UAT** it is valid for **1 week**.
- It is recommended to call this API everytime user clicks on the banner on app, so that a fresh token is issued for the user session everytime.
:::

::: tip Endpoint
POST **`base_url`/v1/user/token**
:::

### Request Format
```json
{
    "customerID": "somecustomerid"
}
```
### Response
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

### Error Cases
| Case | HTTP Code |
| - | - |
| Missing customerID | 403 |
| User does not exist | 404 |
| User eligibility not available | 400 |
| User not eligible for loan | 403 |

::: warning Tracking Source
In case you are using same API key across different platforms, and want to track the source of the user, also pass a string field `source` in the request body, indicating a unique source from which the user is accessing the SDK from.
:::
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

### Response
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


### Response
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

### Response
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


### Response
```json
{
    "data": {
        "loanApplicationID": "2fee9ba7-52e1-4873-8328-e0dff99cdc83",
        "loanApplicationNum": "FB1600196175625806",
        "appliedLoanAmount":15000,
        "status": "BANK_ADDED",
        "createdAt": "2020-09-15 18:56:15",
        "userDetails": {
            "customerID": "someCustomerID",
            "name": "Amazing User",
            "email": "username@email.com",
            "mobile": "9999999999",
            "gender": "Male",
            "dob": "1992-12-09",
            "pan": "ABCDP0000N",
            "fisScore": 0.006962299255855537,
            "bureauScore": 830,
            "bureauStatus": "completed",
            "currentAddress": {
                "line1": "22, 80 Feet Rd", 
                "line2": "Koramangala",
                "city": "Bengaluru",
                "pincode": "560095", 
                "state": "Karnataka"
            },
            "loanFormData": {
                "dependents": "0",
                "educationLevel": "MBBS",
                "expenses": "515231",
                "fathersName": "Ram",
                "income": "515241",
                "loanPurpose": "Marriage",
                "maritalStatus": "Unmarried",
                "reference1Contact": "+919999999999",
                "reference1ContactName": "Papa",
                "reference1Name": "Ram Kumar",
                "reference1Relationship": "Father"
            },
            "residenceType": "Rented",
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
| fisScore | User's FinBox Inclusion Score |
| bureauScore | User's bureau score from one of the credit bureaus |
| bureauStatus | Indicates the bureau data fetch status. Possible values can be found in [Appendix](/middleware/appendix.html#list-of-bureau-status) |
| accountHolderName | Verified name as per user's bank account |
| dob | Date of Birth in `YYYY-MM-DD` format |
| createdAt | Date time of loan creation in `YYYY-MM-DD HH:MM:SS` format (UTC) |
| loanFormData | Fields in this key varies for every sourcing entity, exact keys will be shared for this during the integration |

## Loan Offers
Returns the loan offers made to a given loan application.

::: warning NOTE
Loan Offers API works only once loan is **approved**
:::

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
            "advanceEMIAmount": 0,
            "emiCalculationMethod": "flat_rate",
            "status": "offer_accepted",
            "disbursalAmount": 5674,
            "totalPayableAmount": 6966,
            "emis": [
                {
                    "emiDate": "2021-02-03",
                    "emiAmount": 1161
                },
                {
                    "emiDate": "2021-03-03",
                    "emiAmount": 1161
                },
                {
                    "emiDate": "2021-04-05",
                    "emiAmount": 1161
                },
                {
                    "emiDate": "2021-05-03",
                    "emiAmount": 1161
                },
                {
                    "emiDate": "2021-06-03",
                    "emiAmount": 1161
                },
                {
                    "emiDate": "2021-07-05",
                    "emiAmount": 1161
                }
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
| advanceEMIAmount | Float | Advance EMI Amount |
| emiCalculationMethod | String | Can be `flat_rate` or `reducing_balance` |
| status | String | Can be `offer_accepted` or `offered` |
| disbursalAmount | Float | Final Disbursal Amount |
| totalPayableAmount | Float | Total Payable Amount |
| emis | Array of Objects | Contains emi objects containing date and amount sorted in sequence of installments |
| emiAmount | Float | Tells the EMI Amount |
| emiDate | String | Contains `YYYY-MM-DD` format |

## Get Signed Agreement
Returns the presigned url for signed agreement PDF File

::: warning NOTE
- This API works only after `loan_signed_agreement_generated` event has been triggered
- The presigned URL in response is valid for 300 seconds
:::

::: tip Endpoint
GET **`base_url`/v1/loan/agreement?loanApplicationID=`someLongLoanApplicationUUID`**
:::

```json
{
    "data": {
            "signedAgreementURL": "https://somelongurl/somefile.pdf?someparam=somevalue&somemoreparam=somevalue2"
    },
    "error": "",
    "status": true
}
```

## Loan Repayments
Returns the repayments information for a given loan application.

::: warning NOTE
Loan Repayments API works only after loan **disbursal**.
:::

::: tip Endpoint
GET **`base_url`/v1/loan/repayments?loanApplicationID=`someLongLoanApplicationUUID`**
:::

```json
{
    "data": {
        "emiList": [
            {
                "loanPaymentID": "1c9387b3-c1f8-4d81-89e9-eabd06e8536c",
                "amount": 15375,
                "installmentNum": 1,
                "lateCharge": 0,
                "status": "UNPAID",
                "dueDate": "2020-11-10",
                "paidDate": "",
                "totalPayable": 15375
            }
        ]
    },
    "error": "",
    "status": true
}
```

Response fields are explained below:
| Field | Type | Description |
| - | - | - |
| loanPaymentID | String | A UUID identifying an installment |
| amount | Float | EMI amount |
| installmentNum | Integer | Instalment number varies from 1 to `tenureMonths` (from loan offer API) |
| lateCharge | Float | Late charge (if any otherwise 0) |
| status | String | Can be `PAID`, `UNPAID` or `PENDING` |
| dueDate | String | Due date for the installment in `YYYY-MM-DD` format |
| paidDate | String | Date of payment in `YYYY-MM-DD` format, if not paid the value is blank string `""` |
| totalPayable | Float | Total amount (to be) paid by user |

## Repay Loan
Marks the repayment of a given loan EMI

::: warning NOTE
This API is **disabled** by default. If required, request FinBox team to enable this API.
:::

::: tip Endpoint
POST **`base_url`/v1/loan/repay**
:::

### Request Format
```json
{
    "loanApplicationID": "someLoanApplicationID",
    "installmentNum": 2,
    "amountReceived": 12500,
    "paymentDate": "2020-09-01 12:00:00",
    "paymentMode": "upi",
    "transactionID":"someUTRNumber"
}
```
**Response Format**

```json
{
    "data": {
        "referenceID": "FinBoxReferenceIDforRecon"
    },
    "error": "",
    "status": true
}
```

## Credit Line Details
Returns credit line details for a given user using the `customerID`

::: tip Endpoint
GET **`base_url`/v1/creditline/details?customerID=`someCustomerID`**
:::

**Response Format**

```json
{
    "data": {
        "status": "ACTIVE",
        "maxLimit": 100000,
        "availableLimit": 98800,
        "validity": "2022-01-18",
        "inactiveReason": ""
    },
    "error": "",
    "status": true
}
```

Response fields are explained below:
| Field | Type | Description |
| - | - | - |
| status | String | Status of credit line, can be `ACTIVE` or `INACTIVE` |
| maxLimit | Float | Maximum credit limit assigned to the user |
| availableLimit | Float | Currently available limit of the user |
| validity | String | Indicates the expiry date of credit line in `YYYY-MM-DD` |
| inactiveReason | String | Reason for status to be `INACTIVE` |

### Error Cases
| Case | HTTP Code |
| - | - |
| Missing customerID | 403 |
| user with credit line not found | 404 |

## Credit Line Transactions
Returns credit line transactions for a given user using the `customerID`

::: tip Endpoint
GET **`base_url`/v1/creditline/transactions?customerID=`someCustomerID`**
:::

**Response Format**

```json
{
    "data": {
        "transactions": [
            {
                "txnID": "e07a8733-2d7e-46a1-9146-fda547ce8b0d",
                "partnerTxnID": "1234OD123312",
                "invoiceNo": "123",
                "txnStatus": "CONFIRMED",
                "amount": 1200,
                "interest": 0,
                "emiCalculationMethod": "reducing_balance",
                "subventionAmount": 24,
                "processingFee": 0,
                "gst": 18,
                "disbursalAmount": 1171.68,
                "createdAt": "2020-02-12 13:02:12",
                "emis": [
                    {
                        "amount": 1200,
                        "installmentNum": 1,
                        "lateCharge": 0,
                        "status": "PAID",
                        "dueDate": "2020-02-14",
                        "paidDate": "2020-02-13",
                        "totalPayable": 1200,
                    }
                ]
            }
        ]
    },
    "error": "",
    "status": true
}
```

Response fields are explained below:
| Field | Type | Description |
| - | - | - |
| txnID | String | Unique Transaction ID generated by FinBox |
| partnerTxnID | String | Transaction ID passed on Client SDK |
| invoiceNo | String | Invoice No for the transaction |
| txnStatus | String | Status of transaction can be `PROCESSING`, `CONFIRMED`, `DISBURSED`, `PAID`, `CANCELLED`, `OVERDUE`|
| amount | Float | Transaction amount |
| interest | Float | Annual Interest Percentage user is paying for this transaction |
| subventionAmount | Float | Subvention amount on this transaction |
| Processing Fee | Float | Processing Fee on this transaction |
| gst | Float | Indicates GST in percentage |
| disbursalAmount | Float | Indicates the final amount that will be disbursed |
| emiCalculationMethod | String | Can be `flat_rate` or `reducing_balance` |
| createdAt | String | Transaction creation time in `YYYY-MM-DD HH:MM:SS` format |

objects in `emis` contain:
| Field | Type | Description |
| - | - | - |
| amount | Float | Indicates the EMI Amount |
| installmentNum | Integer | Installment Number |
| lateCharge | Float | Total late charge |
| status | String | Payment status can be `UNPAID`, `PAID`, `PENDING` |
| dueDate | String | Due date in `YYYY-MM-DD` format | 
| paidDate | String | Payment completion in `YYYY-MM-DD` format, if not paid is blank string `""` |
| totalPayable | Float | Total payable amount for the EMI |

:::warning emis key
Array of objects in `emis` will be empty in case of `CANCELLED` and `PROCESSING` transactions.
:::

### Error Cases
| Case | HTTP Code |
| - | - |
| Missing customerID | 403 |
| user with credit line not found | 404 |

<!-- ## Credit Line Update Transaction Status
Updates Credit Line Transaction Status

::: tip Endpoint
POST **`base_url`/v1/creditline/status**
:::

**Request Format**
```json
{
    "txnID": "27d71hd87187h",
    "status": "CONFIRMED"
}
```
| Field | Type | Description |
| - | - | - |
| txnID | String | Transaction ID which was passed on Client SDK |
| status | String | Can be `CONFIRMED` or `CANCELLED` |

On successful updating the status, API will give a response with 200 HTTP status code.

### Error Cases
| Case | HTTP Code |
| - | - |
| Missing customerID | 403 |
| Invalid status value | 400 |
| txnID not found | 404 |
| only transaction with status PROCESSING can be updated | 403 | -->

## User Activity History
Returns the activity 
::: tip Endpoint
GET **`base_url`/v1/user/activity?customerID=`someCustomerID`**
:::


### Response
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
    },
    "error": "",
    "status": true
}
```

A list of all possible activities can be found [Appendix](/middleware/appendix.html#list-of-custom-activities)

A list of all possible entity types can be found [Appendix](/middleware/appendix.html#list-of-entity-types)

## Webhook
A webhook can be configured to receive events on different actions taken throughout the user journey.

To configure this, you can update the webhook URL in **Settings** page of **FinBox Dashboard**. The webhook URL should be a  **valid endpoint**.

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

:::warning IMPORTANT
- `loanApplicationID` is available once the loan application is created, and will not be available for credit line activities.
- `eventDescription` is always a **string**, in some cases you might get string encoded JSON as well. These specific cases are mentioned in [Appendix](/middleware/appendix.html#list-of-user-activities) along with activities.
:::

A list of all possible activities can be found [Appendix](/middleware/appendix.html#list-of-user-activities)

A list of all possible entity types with descriptions can be found [Appendix](/middleware/appendix.html#list-of-entity-types)
