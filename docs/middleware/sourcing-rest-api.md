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
Query parameters can be appended at end of the URL like `/?limit=20&page=1`

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
            "fisScore": 640,
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
Query parameters can be appended at end of the URL like `/?limit=20&page=1`

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
            "fisScore": 640,
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
                "disbursalUTR": "",
                "emis": [
                    {
                        "amount": 1200,
                        "installmentNum": 1,
                        "charges": [
                            {
                                "chargeType": "LATE_CHARGE",
                                "charge": 0
                            },
                            {
                                "chargeType": "NACH_BOUNCE_CHARGE",
                                "charge": 0
                            },
                            {
                                "chargeType": "LATE_INTEREST_CHARGE",
                                "charge": 0
                            }
                        ],
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
| processingFee | Float | Processing Fee on this transaction |
| gst | Float | Indicates GST in percentage |
| disbursalAmount | Float | Indicates the final amount that will be disbursed |
| emiCalculationMethod | String | Can be `flat_rate` or `reducing_balance` |
| createdAt | String | Transaction creation time in `YYYY-MM-DD HH:MM:SS` format |
| disbursalUTR | String | UTR number of disbursal made by lender |

objects in `emis` contain:
| Field | Type | Description |
| - | - | - |
| amount | Float | Indicates the EMI Amount |
| installmentNum | Integer | Installment Number |
| charges | Array of objects | Contains array of different charges, possible `chargeType` are `LATE_CHARGE`, `NACH_BOUNCE_CHARGE`, `LATE_INTEREST_CHARGE` |
| status | String | Payment status can be `UNPAID`, `PAID`, `PENDING` |
| dueDate | String | Due date in `YYYY-MM-DD` format | 
| paidDate | String | Payment completion in `YYYY-MM-DD` format, if not paid is blank string `""` |
| totalPayable | Float | Total payable amount for the EMI |

:::warning charges
Different meanings of charges are as follows:
- `LATE_CHARGE`: late fee added because of late in EMI payment
- `LATE_INTEREST_CHARGE`: total day wise interest added due to EMI payment delay
- `NACH_BOUNCE_CHARGE`: this is added if nach was presented, but bounced 
:::

:::warning emis key
Array of objects in `emis` will be empty in case of `CANCELLED` and `PROCESSING` transactions.
:::

### Error Cases
| Case | HTTP Code |
| - | - |
| Missing customerID | 403 |
| user with credit line not found | 404 |

## Confirm Credit Line Transaction
Confirms Credit Line Transaction in processing state

::: warning NOTE
1. This API's request format is specific to e-commerce use case, and is disabled by default for clients with a different use case.
2. For other use cases, FinBox team will share a different API for updating the status.
:::

::: tip Endpoint
POST **`base_url`/v1/creditline/txn/confirm**
:::

**Request Format**
```json
{
    "txnID": "573d04f2-6e25-44ac-8247-0565df5cbd0d",
    "awbNo": "AWB_NO_HERE",
    "invoiceNo": "INVOICE_NO_HERE",
    "podExtension": "jpg",
    "podBase64": "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",
    "invoiceExtension": "pdf",
    "invoiceBase64": "JVBERi0xLjMNCiXi48/TDQoNCjEgMCBvYmoNCjw8DQovVHlwZSAvQ2F0YWxvZw0KL091dGxpbmVzIDIgMCBSDQovUGFnZXMgMyAwIFINCj4+DQplbmRvYmoNCg0KMiAwIG9iag0KPDwNCi9UeXBlIC9PdXRsaW5lcw0KL0NvdW50IDANCj4+DQplbmRvYmoNCg0KMyAwIG9iag0KPDwNCi9UeXBlIC9QYWdlcw0KL0NvdW50IDINCi9LaWRzIFsgNCAwIFIgNiAwIFIgXSANCj4+DQplbmRvYmoNCg0KNCAwIG9iag0KPDwNCi9UeXBlIC9QYWdlDQovUGFyZW50IDMgMCBSDQovUmVzb3VyY2VzIDw8DQovRm9udCA8PA0KL0YxIDkgMCBSIA0KPj4NCi9Qcm9jU2V0IDggMCBSDQo+Pg0KL01lZGlhQm94IFswIDAgNjEyLjAwMDAgNzkyLjAwMDBdDQovQ29udGVudHMgNSAwIFINCj4+DQplbmRvYmoNCg0KNSAwIG9iag0KPDwgL0xlbmd0aCAxMDc0ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBBIFNpbXBsZSBQREYgRmlsZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIFRoaXMgaXMgYSBzbWFsbCBkZW1vbnN0cmF0aW9uIC5wZGYgZmlsZSAtICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjY0LjcwNDAgVGQNCigganVzdCBmb3IgdXNlIGluIHRoZSBWaXJ0dWFsIE1lY2hhbmljcyB0dXRvcmlhbHMuIE1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NTIuNzUyMCBUZA0KKCB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDYyOC44NDgwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjE2Ljg5NjAgVGQNCiggdGV4dC4gQW5kIG1vcmUgdGV4dC4gQm9yaW5nLCB6enp6ei4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjA0Ljk0NDAgVGQNCiggbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDU5Mi45OTIwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNTY5LjA4ODAgVGQNCiggQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA1NTcuMTM2MCBUZA0KKCB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBFdmVuIG1vcmUuIENvbnRpbnVlZCBvbiBwYWdlIDIgLi4uKSBUag0KRVQNCmVuZHN0cmVhbQ0KZW5kb2JqDQoNCjYgMCBvYmoNCjw8DQovVHlwZSAvUGFnZQ0KL1BhcmVudCAzIDAgUg0KL1Jlc291cmNlcyA8PA0KL0ZvbnQgPDwNCi9GMSA5IDAgUiANCj4+DQovUHJvY1NldCA4IDAgUg0KPj4NCi9NZWRpYUJveCBbMCAwIDYxMi4wMDAwIDc5Mi4wMDAwXQ0KL0NvbnRlbnRzIDcgMCBSDQo+Pg0KZW5kb2JqDQoNCjcgMCBvYmoNCjw8IC9MZW5ndGggNjc2ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBTaW1wbGUgUERGIEZpbGUgMiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIC4uLmNvbnRpbnVlZCBmcm9tIHBhZ2UgMS4gWWV0IG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NzYuNjU2MCBUZA0KKCBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY2NC43MDQwIFRkDQooIHRleHQuIE9oLCBob3cgYm9yaW5nIHR5cGluZyB0aGlzIHN0dWZmLiBCdXQgbm90IGFzIGJvcmluZyBhcyB3YXRjaGluZyApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY1Mi43NTIwIFRkDQooIHBhaW50IGRyeS4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NDAuODAwMCBUZA0KKCBCb3JpbmcuICBNb3JlLCBhIGxpdHRsZSBtb3JlIHRleHQuIFRoZSBlbmQsIGFuZCBqdXN0IGFzIHdlbGwuICkgVGoNCkVUDQplbmRzdHJlYW0NCmVuZG9iag0KDQo4IDAgb2JqDQpbL1BERiAvVGV4dF0NCmVuZG9iag0KDQo5IDAgb2JqDQo8PA0KL1R5cGUgL0ZvbnQNCi9TdWJ0eXBlIC9UeXBlMQ0KL05hbWUgL0YxDQovQmFzZUZvbnQgL0hlbHZldGljYQ0KL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcNCj4+DQplbmRvYmoNCg0KMTAgMCBvYmoNCjw8DQovQ3JlYXRvciAoUmF2ZSBcKGh0dHA6Ly93d3cubmV2cm9uYS5jb20vcmF2ZVwpKQ0KL1Byb2R1Y2VyIChOZXZyb25hIERlc2lnbnMpDQovQ3JlYXRpb25EYXRlIChEOjIwMDYwMzAxMDcyODI2KQ0KPj4NCmVuZG9iag0KDQp4cmVmDQowIDExDQowMDAwMDAwMDAwIDY1NTM1IGYNCjAwMDAwMDAwMTkgMDAwMDAgbg0KMDAwMDAwMDA5MyAwMDAwMCBuDQowMDAwMDAwMTQ3IDAwMDAwIG4NCjAwMDAwMDAyMjIgMDAwMDAgbg0KMDAwMDAwMDM5MCAwMDAwMCBuDQowMDAwMDAxNTIyIDAwMDAwIG4NCjAwMDAwMDE2OTAgMDAwMDAgbg0KMDAwMDAwMjQyMyAwMDAwMCBuDQowMDAwMDAyNDU2IDAwMDAwIG4NCjAwMDAwMDI1NzQgMDAwMDAgbg0KDQp0cmFpbGVyDQo8PA0KL1NpemUgMTENCi9Sb290IDEgMCBSDQovSW5mbyAxMCAwIFINCj4+DQoNCnN0YXJ0eHJlZg0KMjcxNA0KJSVFT0YNCg=="
}
```
| Field | Type | Description |
| - | - | - |
| txnID | String | Unique FinBox Transaction ID, this can be fetched using the [Credit Line Transactions API](/middleware/sourcing-rest-api.html#credit-line-transactions) |
| awbNo | String | Air Waybill Number |
| invoiceNo | String | Invoice Number |
| podExtension | String | File extension for proof of delivery, can be `jpg`, `png` or `pdf` |
| podBase64 | String | Base 64 encoded file content of proof of delivery |
| invoiceExtension | String | File extension for invoice, can be `jpg`, `png` or `pdf` |
| invoiceBase64 | String | Base 64 encoded file content of invoice |

On successful updating the status, API will give a response with 200 HTTP status code.

### Error Cases
| Case | HTTP Code |
| - | - |
| Missing txnID | 403 |
| Any other missing field | 400 |
| Invalid extension | 400 |
| Error decoding base 64 string | 400 |
| Error processing file | 400 |
| txnID not found | 404 |
| only transaction with status PROCESSING can be updated | 403 |

## Cancel Credit Line Transaction
Cancels Credit Line Transaction in processing state

::: tip Endpoint
POST **`base_url`/v1/creditline/txn/cancel**
:::

**Request Format**
```json
{
    "txnID": "0e882dbd-3768-4c68-8986-57b68d0669d3"
}
```
| Field | Type | Description |
| - | - | - |
| txnID | String | Unique FinBox Transaction ID, this can be fetched using the [Credit Line Transactions API](/middleware/sourcing-rest-api.html#credit-line-transactions) |

On successful updating the status, API will give a response with 200 HTTP status code.

### Error Cases
| Case | HTTP Code |
| - | - |
| Missing txnID | 403 |
| txnID not found | 404 |
| only transaction with status PROCESSING can be updated | 403 |

## Split Credit Line Transaction
Splits Credit Line Transaction in processing state into different transactions. Useful when same order has different invoices, shipment or deliveries. After splitting, each transaction can further be splitted or moved to cancelled / confirmed state. 

::: warning NOTE
1. This API's request format is specific to e-commerce use case, and is disabled by default for clients with a different use case.
2. For other use cases if this is required, FinBox team will share a different API.
:::

::: tip Endpoint
POST **`base_url`/v1/creditline/txn/split**
:::

**Request Format**
```json
{
    "txnID": "039b0552-31e3-4724-a35c-0d5edd663bcf",
    "invoices": [
        {"invoiceNo": "DEFS123", "amount": 1000},
        {"invoiceNo": "ABNC456", "amount": 500},
        {"invoiceNo": "", "amount": 1500}
    ]
}
```
| Field | Type | Description |
| - | - | - |
| txnID | String | Unique FinBox Transaction ID, this can be fetched using the [Credit Line Transactions API](/middleware/sourcing-rest-api.html#credit-line-transactions)  |
| invoiceNo | String | Invoice Number. This is optional and can be skipped by passing blank string |
| amount | Float | Amount of the sub transaction |

On successful updating the status, API will give a response with 200 HTTP status code.

::: warning NOTE
1. Please make sure sum of amounts add up to the original transaction amount being split
2. API will throw an error if total amount exceeds the original transaction amount being split
3. In case sum of amounts is less than original transaction amount, another transaction with no invoiceNo and left over amount will be created, and split will proceed
4. After split is complete sub transactions will have same `partnerTxnID` but different `txnID` (FinBox Transaction ID). In such cases, `invoiceNo` and `amount` fields in [Credit Line Transactions API](/middleware/sourcing-rest-api.html#credit-line-transactions) can be used to distinguish between the sub transactions.
:::

### Error Cases
| Case | HTTP Code |
| - | - |
| Missing txnID | 403 |
| txnID not found | 404 |
| only transaction with status PROCESSING can be splitted | 403 |
| amount should be greater than 0 | 400 |
| sum of invoice amounts cannot exceed transaction amount | 400 |

## Refund Credit Line Transaction
Marks a Credit Line Transaction in `DISBURSED` state for refund

::: tip Endpoint
POST **`base_url`/v1/creditline/txn/markForRefund**
:::

**Request Format**
```json
{
    "txnID": "0e882dbd-3768-4c68-8986-57b68d0669d3"
}
```
| Field | Type | Description |
| - | - | - |
| txnID | String | Unique FinBox Transaction ID, this can be fetched using the [Credit Line Transactions API](/middleware/sourcing-rest-api.html#credit-line-transactions) |

On successful updating the status, API will give a response with 200 HTTP status code.

### Error Cases
| Case | HTTP Code |
| - | - |
| Missing txnID | 400 |
| txnID not found | 404 |
| only transaction with status DISBURSED can be updated | 403 |

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
                "loanApplicationID": "",
                "source": "",
                "journeyType": "business_loan"
            },
            {
                "entityType": "system",
                "loggedAt": "2020-09-15 17:52:58",
                "eventType": "loan_approved",
                "eventDescription": "",
                "loanApplicationID": "someLongUUID",
                "source": "",
                "journeyType": "business_loan"
            }
        ]
    },
    "error": "",
    "status": true
}
```

- `entityType` indicates who took the action event
- `eventType` indicates the active event or activity
- `source` indicates the **last source** passed in [Generate Token API](/middleware/sourcing-rest-api.html#generate-token) or [Session API](/middleware/web-sdk.html#session-api)
- `journeyType` can be `business_loan`, `personal_loan` or `credit_line`

A list of all possible activities (`eventType`) can be found [Appendix](/middleware/appendix.html#list-of-custom-activities)

A list of all possible entity types (`entityType`) can be found [Appendix](/middleware/appendix.html#list-of-entity-types)

## Webhook
A webhook can be configured to receive events on different actions taken throughout the user journey.

To configure this, you can update the webhook URL in **Settings** page of **FinBox Dashboard**. The webhook URL should be a  **valid endpoint**.

:::tip A Valid Endpoint:
- receives a POST request
- receives a request body with content-type `application/json`
- returns a 2xx status code on successful reception.
:::

We'll be sending JSON encoded body in the following payload format:
```json
{
    "customerID": "some_customer_id",
    "entityType": "sourcing_entity",
    "eventDescription": "",
    "eventType": "eligibility_calculated",
    "loanApplicationID": "",
    "loggedAt": "2020-09-15 21:58:31",
    "journeyType": "business_loan",
    "source": ""
}
```

:::warning Retries and Timeout
1. If the webhook endpoint gives a non 2xx HTTP status code, or if the API call fails, then maximum 3 times retry is attempted (maximum 4 attempts) with exponential backoff.
2. Every webhook endpoint call has a timeout set of maximum 90 seconds.
:::

:::warning IMPORTANT
- `loanApplicationID` is available once the loan application is created, and will not be available for credit line specific activities.
- `eventDescription` is always a **string**, in some cases you might get string encoded JSON as well. These specific cases are mentioned in [Appendix](/middleware/appendix.html#list-of-user-activities) along with activities.
- `source` indicates the **last source** passed in [Generate Token API](/middleware/sourcing-rest-api.html#generate-token) or [Session API](/middleware/web-sdk.html#session-api)
- `journeyType` can be `business_loan`, `personal_loan` or `credit_line`
:::

A list of all possible activities (`eventType`) can be found [Appendix](/middleware/appendix.html#list-of-custom-activities)

A list of all possible entity types (`entityType`) can be found [Appendix](/middleware/appendix.html#list-of-entity-types)
