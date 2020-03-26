---
base_url: https://lending.finbox.in #base URL for the API
version: v1 # version of API
---

# Sourcing Entity - Rest API

## Workflow
The workflow involves following steps:
- First customer registers with the middleware and **fills the loan application**
- **Basic KYC** is then submitted
- In specific cases, lenders can also **request additional documents** from customer
- After all documents are approved, lender **approves the loan application**
- Post approval, Customer **selects the lender offer**, and then **submits bank details**
- On successful verification of bank details, user **signs the loan agreement**
- After disbursal, Repayment timeline with EMI **status is visible**.

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

## Onboarding
### Sign Up
This step is the first step for a new customer to the loan journey.

**Step 1: Send OTP**
::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/user/signupOtp**
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

**Step 2: Verify OTP**
::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/user/signupOtpVerify**
:::

**Request Format**
```json
{
    "mobile": "XXXXXXXXXX",
    "otp": "XXXX",
    "sourceEntityID": "XXXXX"
}
```
Here `sourceEntityID` is a unique identifier for the entity shared by FinBox team.
**Response**
```json
{
    "status": true,
    "error": "",
    "data": {
        "userData": {
            "userID": "XXXX",
            "status": 1
        },
        "token": "TOKEN"
    }
}
```
`userID` indicates a unique identifier for the user and `status` indicates the user status. List of possible values are listed [here](/middleware/appendix.html#list-of-user-status).
:::warning Token
All further APIs require this `token` value to be passed in header under an attribute called `token`.
:::

### Mark Verified
Some use cases require additional step of verification, once that additional verification is complete, this API can be called to mark the verification as done.
::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/user/markVerified**
:::
**Request Format**

Requires `token` in header
```json
{
    "verified": true
}
```

### Submit User Profile
This step is used to submit/update user profile

::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/user/userProfile**
:::

**Request Format**

Requires `token` in header
```json
{
    "name": "Some Full Name",
    "email": "someone@company.com",
    "dob": "YYYY-MM-DD",
    "gender": 0,
    "pan": "XXX",
    "pincode": "XXX"
}
```
Here `dob` indicates Date of Birth, `pan` indicates PAN Number and `gender` value can be:
- 0 for Female
- 1 for Male
- 2 for Others

### Submit FCM Token
This step is used to submit FCM token.

::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/user/submitFcmToken**
:::

**Request Format**

Requires `token` in header
```json
{
    "fcmToken": "XXX"
}
```

### Submit Partner Information
This step is used to submit additional partner information to be shared with Lender.

::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/user/submitPartnerInfo**
:::

**Request Format**

Requires `token` in header
```json
{
    "partnerInfo": {
        "key1": "value1",
        "key2": "value2",
        ....
    }
}
```

### Fetch User Details
This API is used to fetch user profile data

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/user/getUserData**
:::

**Request Format**
Requires `token` in header

**Response**
```json
{
    "status": true,
    "error": "",
    "data": {
        "name": "Some Full Name",
        "email": "someone@company.com",
        "dob": "YYYY-MM-DD",
        "gender": 0,
        "pan": "XXX",
        "pincode": "XXX"
    }
}
```
Here `dob` indicates Date of Birth, `pan` indicates PAN Number and `gender` value can be:
- 0 for Female
- 1 for Male
- 2 for Others

### Get Eligible Amount
This API gives a tentative eligible amount for the customer.

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/loan/getEligibleAmount**
:::

**Request Format**
Requires `token` in header

**Response**
```json
{
    "status": true,
    "error": "",
    "data": 40000
}
```
Here, the user has an eligible amount of Rs.40,000.

### Sign In
In case user is already registered with middleware and has signed out or token is expired, this API can be used to fetch the token.

**Step 1: Send OTP**
::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/user/loginOtp**
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

**Step 2: Verify OTP**
::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/user/loginOtpVerify**
:::

**Request Format**
```json
{
    "mobile": "XXXXXXXXXX",
    "otp": "XXXX",
    "sourceEntityID": "XXXXX"
}
```
Here `sourceEntityID` is a unique identifier for the entity shared by FinBox team.
**Response**
```json
{
    "status": true,
    "error": "",
    "data": {
        "userData": {
            "userID": "XXXX",
            "status": 1
        },
        "token": "TOKEN"
    }
}
```
`userID` indicates a unique identifier for the user and `status` indicates the user status. List of possible values are listed [here](/middleware/appendix.html#list-of-user-status).
:::warning Token
All further APIs require this `token` value to be passed in header under an attribute called `token`.
:::

## Loan Application

### Start Loan Application
This API initiates the loan application and generates a loan application number.
::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/loan/applyLoanFirst**
:::

**Request Format**
Requires `token` in header

**Response**
```json
{
    "status": true,
    "error": "",
    "data": {
        "loanApplicationID": "INTERNAL ID",
        "loanApplicationNum": "CUSTOMER SHARED ID",
        "status": 1
    }
}
```
Here, loan status value is indicated in `status` field, whose possible values are listed [here](/middleware/appendix.html#list-of-loan-status).


### Submit Loan Application
This API submits the loan application.

::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/loan/addLoanDetails**
:::

**Request Format**
Requires `token` in header
```json
{
    "loanApplicationID": "Internal ID",
    "currentAddress": "Full address",
    "salary": 40000,
    "workExperience": "Work Experience in years",
    "loanPurpose": "string indicating the value",
    "fathersName": "full fathers name",
    "maritalStatus": 0,
    "residenceType": 0
}
```
Here, `salary` indicates net income per month.

`maritalStatus` value can be:
- 1 indicating Married
- 2 indicating Unmarried

`residenceType` value can be:
- 1 indicating Owned
- 2 indicating Rented

### Get User Loans
This API can be used to fetch all active loans for the user
::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/loan/getUserLoan**
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

### Get Single Loan Details
This API can be used to fetch details for a given loan application
::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/loan/fetchSingleLoan**
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
                "ekycDetails": {}
            }
}
```

## KYC
### Get KYC Rules
This returns the basic set of KYC documents required and later includes additional documents to upload in case lender requested.
::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/kyc/getKycRule**
:::

**Request Format**
Requires `token` in header and `loanApplicationID` in query parameter.

**Response**
```json
{
    "status": true,
    "error": "",
    "data": [
    {
      "type": "Photo",
      "maxDoc": 1,
      "minDoc": 1,
      "docData": [
        {
          "documentID": "8dbdcaf9-5570-4385-ac5e-77dd33c3b2cd",
          "isMandatory": true,
          "documentName": "Photo",
          "bothSides": false
        }
      ]
    },
    {
      "type": "Pan_Card",
      "maxDoc": 1,
      "minDoc": 1,
      "docData": [
        {
          "documentID": "480dcfbb-b090-44f5-937c-8dc52ed3a4d2",
          "isMandatory": true,
          "documentName": "Pan Card",
          "bothSides": false
        }
      ]
    },
    {
      "type": "Address_Proof",
      "maxDoc": 1,
      "minDoc": 1,
      "docData": [
        {
          "documentID": "907fd5c5-4a13-4dca-9005-0bfb5e6face0",
          "isMandatory": false,
          "documentName": "Aadhaar",
          "bothSides": true
        },
        {
          "documentID": "2216f613-7f18-4f24-80f6-edcb15d03e25",
          "isMandatory": false,
          "documentName": "Driving License",
          "bothSides": true
        },
        {
          "documentID": "a4e7b6f9-5a94-43b5-a0aa-8dd1e00b9191",
          "isMandatory": false,
          "documentName": "Passport",
          "bothSides": true
        },
        {
          "documentID": "b00f3562-5030-4dc9-a256-c4ac589ceaeb",
          "isMandatory": false,
          "documentName": "Voter ID",
          "bothSides": true
        }
      ]
    }
  ]
}
```

### Upload Media
Used to upload an image file to server
::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/services/uploadMedia**
:::

**Request Format**
Requires `token` in header and file in the body with form field `file`.

**Response**
```json
{
    "status": true,
    "error": "",
    "data": "MEDIA ID"
}
```

### Fetch Media
Used to fetch an image file from server
::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/services/fetchMedia**
:::

**Request Format**
Requires `token` in header and `mediaID` as a query parameter.

**Response**
```json
{
    "status": true,
    "error": "",
    "data": "URL FOR MEDIA IMAGE"
}
```

### Submit KYC Documents
Maps uploaded media to different kyc documents. Can also be used while re-uploading the documents or uploading additional documents requested by lender.
::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/services/fetchMedia**
:::

**Request Format**
Requires `token` in header and `mediaID` as a query parameter.
```json
{
    "loanApplicationID": "Internal loan application ID",
    "documents": [
        {
            "documentID": "document id as in kyc rule",
            "frontMediaID": "media id",
            "backMediaID": "",
        },
        ...
    ]
}
```
In case `backMediaID` is not required, blank string `""` can be sent as a value.

### E-KYC


## Loan Offers
### Get Loan Offers
### Accept Loan Offer

## Bank Details
### List Banks
### Submit Bank Details
### Fetch User Bank Details

## Signing the Agreement
### Fetch Unsigned Agreement
### E-Sign the Agreement

## Repayments
### Get Payment Timeline
### Fetch User Loan

## Integrations
### Get FinBox Inclusion Score (FIS)
### Get Bureau Score

## Configurations
### Configure Loan Application Form
### Update emails
### Update KYC Rule