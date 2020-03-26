---
base_url: https://lending.finbox.in #base URL for the API
version: v1 # version of API
---

# Lender - Rest API

## Workflow
The workflow involves following steps:
- Once loan application is received, **KYC needs to be approved or rejected**
- If required **additional documents can be requested** from customer
- **Loan offers are generated** automatically based on defined templates
- Customer **selects the offer**, and then **submits bank details**
- On successful verification of bank details, user **signs the loan agreement**
- Then **money needs to be dispatched** and middleware needs to be informed on every **repayment received**

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

## Authentication
Most of the APIs requires a `token` in header. This can be obtained by signing in using registered lender account. Lender accounts can be added by contacting FinBox team.

### Step 1: Send OTP
::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/lender/loginOtp**
:::

**Request Format**
```json
{
    "mobile": "XXXXXXXXXX"
}
```
**Response**
```json
{
    "status": true,
    "error": "",
    "data": ""
}
```

### Step 2: Verify OTP
::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/lender/loginOtpVerify**
:::

**Request Format**
```json
{
    "mobile": "XXXXXXXXXX",
    "otp": "XXXX"
}
```
**Response**
```json
{
    "status": true,
    "error": "",
    "data": {
        "userData": {
            "userID": "XXXX",
            "status": 1,
            "name": "Lender User Name",
            "email": "lenderuser@lender.com"
        },
        "token": "TOKEN"
    }
}
```

## Loan Application
### Get Active Loans
This API can be used to fetch all active loans for the lender
::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/lender/getLoanList**
:::

**Request Format**
Requires `token` in header and takes `limit` (records per page) and `offset` (page number) as query strings.

**Response**
```json
{
    "status": true,
    "error": "",
    "data": [
        {
            "loanApplicationID": "Internal ID",
            "loanApplicationNum": "Customer shared ID",
            "status": 1,
            "kyc_status": 0,
            "name": "Customer name in application",
            "createdAt": "YYYY-MM-DD HH:MM:SS",
            "updatedAt": "YYYY-MM-DD HH:MM:SS"
        }
    ]
}
```

### Get Loan Details
This API can be used to fetch details for a given loan application
::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/lender/getLoanDetails**
:::

**Request Format**
Requires `token` in header and takes `loanApplicationID` (page number) as query strings.

**Response**
```json
{
    "status": true,
    "error": "",
    "data": {
                "loanApplicationID": "Internal ID",
                "loanApplicationNum": "Customer shared ID",
                "status": 1,
                "kyc_status": 0,
                "name": "Customer name in application",
                "createdAt": "YYYY-MM-DD HH:MM:SS",
                "updatedAt": "YYYY-MM-DD HH:MM:SS",
                "kycDocs": [],
                "bankDetails": {},
                "ekycDetails": {},
                "partnerData": {}
            }
}
```
Through `status` field in `bankDetails`, `ekycDetails` and `kycDocs` field, status can be tracked individually for modules. Values for these are explained in [Appendix](/middleware/appendix.html).

## KYC
### Approve KYC
Approves KYC for a given loan application
::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/lender/approveLoanKyc**
:::

**Request Format**
Requires FinBox shared `X-API-KEY` in header.
```json
{
    "loanApplicationID": "loan application id"
}
```

### Reject KYC Document
Rejects KYC document for a given loan application
::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/lender/rejectKycDoc**
:::

**Request Format**
Requires FinBox shared `X-API-KEY` in header.
```json
{
    "loanApplicationID": "loan application id",
    "kycDocumentID": "kyc document id"
}
```
`kycDocumentID` is obtained in `getLoanDetails` API.

## Underwriting and Loan Offer

### Get Underwriting
Used to fetch underwriting rules and results
::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/lender/getUnderwriting**
:::

**Request Format**
Requires `token` in header and `loanApplicationID` as query parameter.

**Response**
```json
{
    "status": true,
    "error": "",
    "data": [
        {
            "decision": "PASS",
            "details": "some details",
            "rule": "rule to check",
            "value": "value to check in rule if present"
        },
        ...]
}
```
Here `decision` value can be:
- PASS
- FAIL
- CAN'T DECIDE

### Get Agreement and KYC Zip files
Used to fetch document
::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/lender/getFiles**
:::

**Request Format**
Requires `token` in header and `loanApplicationID` and `document` as a query parameter.

Here `document` can be `unsigned_agreement`, `signed_agreement`, `kyc_zip_file`.

:::warning Zip File
- On successful loan agreement signing, registered lender emails will receive a signed agreement along with KYC zip file.
- KYC Zip file in email as well as the one retrieved from this API are password protected, password for which is shared to the lender by FinBox Team.
:::

**Response**
```json
{
    "status": true,
    "error": "",
    "data": "URL FOR REQUESTED FILE"
}
```

### Approve Loan
Approves Loan for a given loan application
::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/lender/approveLoan**
:::

**Request Format**
Requires FinBox shared `X-API-KEY` in header.
```json
{
    "loanApplicationID": "loan application id"
}
```

### Reject Loan
Rejects Loan for a given loan application
::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/lender/rejectLoan**
:::

**Request Format**
Requires `token` in header.
```json
{
    "loanApplicationID": "loan application id"
}
```

### Update Loan Offer Templates
Add/Updates Loan offer templates
::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/lender/rejectLoan**
:::

**Request Format**
Requires FinBox shared `X-API-KEY` in header.
```json
{
    "templates": [
        {
            "interest": 2.3,
            "processingFee": 12,
            "tenure": 3
        },
        ...
    ]
}
```
Here `tenure` is in months, and `interest` per annum.


## Disbursal and Repayments
### Inform about Loan Disbursal
::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/lender/disburseLoan**
:::

**Request Format**
Requires `token` in header.
```json
{
    "loanApplicationID": "loan application id",
    "transactionID": "NEFT transaction ID"
}
```
### Inform about Repayment
::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/lender/registerLoanRepayment**
:::

**Request Format**
Requires `token` in header.
```json
{
    "loanApplicationID": "loan application id",
    "installmentNum" : 1,
    "source": "string indicating source from which money got deducted example salary or bank account",
    "transactionID": "transaction ID",
    "paymentDate": "YYYY-MM-DD",
    "amountReceived": 2000
}
```

## Configuration
### Update emails
Updates/Adds emails that receive signed agreement

::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/lender/updateEmails**
:::

**Request Format**
Requires FinBox shared `X-API-KEY` in header.
```json
{
    "emails": ["some1@company.com", "some2@company.xyz"]
}
```
## Customer Notifications
### Sending Custom SMS
Sending custom SMS to a customer
::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/lender/sendSMS**
:::

**Request Format**
Requires `token` in header.
```json
{
    "loanApplicationID": "loan application id",
    "smsText": "message here"
}
```
### Sending FCM Notification
Sending custom FCM notification to a customer
::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/lender/sendCustomFCM**
:::

**Request Format**
Requires `token` in header.
```json
{
    "loanApplicationID": "loan application id",
    "title": "title here",
    "description": "message here"
}
```

## Portfolio
On request, FinBox also provides following additional filters over `GetLoanDetails` API:
### Getting loans with payments missed
specify query parameter `missedPayment=true`.
### Get Loan Application in a date range
specify query parameters `from=YYYY-MM-DD&to=YYYY-MM-DD`