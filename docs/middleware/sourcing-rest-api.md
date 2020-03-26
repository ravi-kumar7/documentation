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

## KYC
## Loan Offers
## Bank Details
## Signing the Agreement
## Repayments and User Loans
## Integrations
## Configurations