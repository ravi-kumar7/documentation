---
base_url: https://middleware.finbox.in #base URL for the API
version: v1 # version of API
---

## Create User
Every customer to the sourcing entity is referred to as "User" for FinBox Middleware. Customer can be a business or the person. To create a new user use the API endpoint below:

::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/user/**
:::

### Request Body

**Sample Request Body:**
```json
{
    "legal_names": ["FULL NAME"],
    "phone_numbers": ["PHONE NUMBER 1", "PHONE NUMBER 2"],
    "emails": ["EMAIL 1", "EMAIL 2"],
    "is_business": false,
    "sourcing_id": "YOUR_UNIQUE_IDENTIFIER",
    "note": "Message for FinBox",
    "public_note": "Public Note"
}
```

| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| legal_names | array of strings | List of All the Full Legal Name for the User | Yes | - |
| phone_numbers | array of strings | List of All the Phone Numbers to be registered for the User | Yes | - |
| emails | array of strings | List of All the Emails to be registered for the User | No | [] |
| is_business | boolean | Indicates whether the user is a business | No | false |
| sourcing_id | string | **(Max 250 characters)** Indicates an additional unique identifier for the user | No | null |
| note | string | Any note you wish to supply to FinBox about the user (Not returned while fetching User information) | No | - |
| public_note | string | Any note to attach to the user (Returned while fetching User information) | No | null |

### Response
On successful creation, the API gives a **201 HTTP code** with a response in following format:
```json
{
    "user_id": "FINBOX_ISSUED_ID"
}
```
In case user creation fails, it gives an error response with **400 HTTP Code** with error message in `error` key in response.

## Update User
To update the user information use the API endpoint below:
::: tip Endpoint
PATCH **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/user/{user_id}**
:::

### Request Body

**Sample Request Body:**
```json
{
    "legal_names": ["FULL NAME"],
    "phone_numbers": ["PHONE NUMBER 1", "PHONE NUMBER 2"],
    "emails": ["EMAIL 1", "EMAIL 2"],
    "is_business": false,
    "sourcing_id": "YOUR_UNIQUE_IDENTIFIER",
    "note": "Message for FinBox",
    "public_note": "Public Note"
}
```

| Name | Type | Description | Required  |
| - | - | - | - |
| legal_names | array of strings | List of All the Full Legal Name for the User | No |
| phone_numbers | array of strings | List of All the Phone Numbers to be registered for the User | No |
| emails | array of strings | List of All the Emails to be registered for the User | No |
| is_business | boolean | Indicates whether the user is a business | No |
| sourcing_id | string | **(Max 250 characters)** Indicates an additional unique identifier for the user | No |
| note | string | Any note you wish to supply to FinBox about the user (Not returned while fetching User information) | No |
| public_note | string | Any note to attach to the user (Returned while fetching User information) | No |

### Response
On successful update, the API gives a **204 HTTP code**. In case user update fails, it gives an error response with **400 HTTP Code** with error message in `error` key in response.

## Add/Update Identity Information
To add/update **"claimed"** identity information for the User with `user_id`, use the API endpoint below:

::: tip Endpoint
PUT **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/user_identity/{user_id}**
:::

### Request Body

**Sample Request Body:**
```json
{
    "user_type": "M",
    "dob": "1985-10-02",
    "address": "address of user",
    "address_city": "city",
    "address_postal_code": "postal code",
    "address_country_code": "IND"
}
```

| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| user_type | string | One of the user types specified in [User Types](/middleware/user.html#user-types) section. | Yes | - |
| dob | string | Date of Birth in `YYYY-MM-DD` format | Yes | - |
| address | string | Address for the User | Yes | - |
| address_city | string | City associated with User's address | Yes | - |
| address_country_code | string | Country Code in ISO Alpha-3 for the User's address | Yes | - |

### Updating User
All the fields needs to be specified while updating the identity information for the User, on recalling this API the values will get overwritten.

### Response
On successful addition the first time, API gives a **201 HTTP code**, on overwriting gives **204 HTTP code**.
In case user creation fails, it gives an error response with **400 HTTP Code** with error message in `error` key in response.

## Get User Details
To fetch user details, use the following API endpoint specifying the `user_id`: 

::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/user/{user_id}**
:::

### Response
If user with given `user_id` exists, the API will give a **200 HTTP code** with response in following format:
```json
{
    "legal_names": ["FULL NAME"],
    "phone_numbers": ["PHONE NUMBER 1", "PHONE NUMBER 2"],
    "emails": ["EMAIL 1", "EMAIL 2"],
    "is_business": false,
    "sourcing_id": "YOUR_UNIQUE_IDENTIFIER",
    "public_note": null,
    "identity": {
        "user_type": "M",
        "dob": "1985-10-02",
        "address": "address of user",
        "address_city": "city",
        "address_postal_code": "postal code",
        "address_country_code": "IND"
    }
}
```
Meaning of fields in `identity` are explained in [Identity - Request Body](/middleware/user.html#request-body-3) section. All other fields are explained in [Create/Update User - Request Body](/middleware/user.html#request-body) section. In case identify information wasn't uploaded for the user, `identity` key will be `null`.

## Add Bank Account
For a given user, multiple bank accounts can be added using the following API:
::: tip Endpoint
POST **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/user_bank/**
:::

### Request Body

**Sample Request Body:**
```json
{
    "user_id": "FINBOX_ISSUED_ID",
    "bank_name": "sbi",
    "account_number": "XXXXX_ACCCOUNT_NUMBER_XXXXXX",
    "ifsc_code": "SBIABCDEF"
}
```

| Name | Type | Description | Required  | Default |
| - | - | - | - | - |
| bank_name | string | One of the bank name identifiers specified in [Bank Identifiers](/middleware/user.html#bank-identifiers) section. | Yes | - |
| account_number | string | String indicating the bank account number | Yes | - |
| ifsc_code | string | Address for the User | Yes | - |

### Response
On successful creation, the API gives a **201 HTTP code** with a response in following format:
```json
{
    "user_id": "FINBOX_ISSUED_ID",
    "bank_account_id": "FINBOX_ISSUED_ACCOUNT_ID"
}
```
Here `bank_account_id` indicates a unique identifier for the bank account added for given User.
In case user creation fails, it gives an error response with **400 HTTP Code** with error message in `error` key in response.

## Get Bank Accounts
Get all bank accounts for a given user with `user_id`:
::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/user_bank/{{user_id}}**
:::

### Response
If user with given `user_id` exists, the API will give a **200 HTTP code** with response in following format:
```json
{
    "banks": [
        {
            "bank_account_id": "FINBOX_ISSUED_ACCOUNT_ID_1",
            "verified": false,
            "bank_name": "sbi",
            "account_number": "XXXXX_ACCCOUNT_NUMBER_1_XXXXXX",
            "ifsc_code": "SBIABCDEF"
        },
        {
            "bank_account_id": "FINBOX_ISSUED_ACCOUNT_ID_2",
            "verified": true,
            "bank_name": "axis",
            "account_number": "XXXXX_ACCCOUNT_NUMBER_2_XXXXXX",
            "ifsc_code": "AXISABCDEF"
        }
    ]
}
```
In case there are no banks added, `banks` key gives `[]` as its value.

`verified` key here indicates whether bank details have been verified or not. This can be set manually (if you are using external verification service) or can be set automatically using [Verify Bank Account](/middleware/user.html#verify-bank-account) service.

The fields for objects residing in array value of `banks` key are explained in [Add Bank Account - Request Body](/middleware/user.html#request-body-4) section.

## Update Bank Account
For a given bank account associated with a User, fields can be updated using the following API:
::: tip Endpoint
PATCH **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/user_bank/{bank_account_id}**
:::

### Request Body

**Sample Request Body:**
```json
{
    "bank_name": "sbi",
    "account_number": "XXXXX_ACCCOUNT_NUMBER_XXXXXX",
    "ifsc_code": "SBIABCDEF",
    "verified": true
}
```

| Name | Type | Description | Required  |
| - | - | - | - | - |
| bank_name | string | One of the bank name identifiers specified in [Bank Identifiers](/middleware/user.html#bank-identifiers) section. | No |
| account_number | string | String indicating the bank account number | No |
| ifsc_code | string | Address for the User | No |
| verified | boolean | Indicating whether the bank account details have been verified | No |

::: warning verified key
In case you are using an external bank verification service, you can update the verified status of bank account details using this API and specifying the `verified` key.
:::

### Response
On successful update, the API gives a **204 HTTP code**. In case update fails, it gives an error response with **400 HTTP Code** with error message in `error` key in response.

## Delete Bank Account
A bank account associated with a User can be deleted using following API:
::: tip Endpoint
DELETE **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/user_bank/{bank_account_id}**
:::

### Response
On successful delete operation, the API gives a **204 HTTP code**. In case delete fails, it gives an error response with **400 HTTP Code** with error message in `error` key in response.

## Verify Bank Account
In case you want us to verify the bank details, you can use this API:
::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/verify_bank/{bank_account_id}**
:::

### Response
The API call will initiate the bank account details verification process, and will return the response in following format with **200 HTTP Code**:
```json
{
    "status": "completed",
    "verified": true
}
```
The value of `status` key can be `initiated`, `failed` or `completed`, and indicates the check process status.

The `verified` key will indicate the current/new verification status of bank account.

Different cases:
- On successful completion of check process, if the verification was successful `status` will be `completed` and `verified` will be `true`.
- On successful completion of check process, if the verification was unsuccessful `status` will be `completed` and `verified` will be `false`.
- In case check service is taking too long to do the check, the `status` will be returned as `initiated` and asynchronously as soon as the check is over the `verified` key will be updated for bank account.
- In case, our check service is down and the check process cannot be initiated, the `status` will be `failed`.

## Check Fraud
You can check fraud status for a given user based on different parameters, like identity etc. as reported by some lender previously or by us.
::: tip Endpoint
GET **{{$page.frontmatter.base_url}}/{{$page.frontmatter.version}}/check_fraud/{user_id}**
:::

### Response
```json
{
    "frauds": [
        {
            "parameter": "identity",
            "score": 700
        }
    ]
}
```

## User Types
| User Type | Description |
| - | - |
| M | Male |
| F | Female |
| O | Other |
| MINOR | Individual under 18 years of age (minors may only open an account that is co-owned by their parent/legal guardian. This must be part of your software agreement) |
| NOT_KNOWN | Do not wish to specify (acceptable in cases of individuals only) |
| CORP | Corporation |
| ESTATE | Estate |
| IRA | Individual Retirement Account |
| LLC | Limited Liability Company |
| PARTNERSHIP | Any type of partnership |
| SOLE_PROPRIETORSHIP | Sole Proprietorship |
| TRUST | Trust |

## Bank Identifiers

| Identifier | Bank Name |
| - | - |
| allahabad | Allahabad Bank |
| andhra | Andhra Bank |
| axis | Axis India |
| baroda | Bank of Baroda |
| boi | Bank of India |
| canara | Canara Bank |
| central | Central Bank of India |
| citi | Citibank |
| citi_union | City Union Bank |
| corporation | Corporation Bank |
| dcbbnk | DCB Bank |
| dena | Dena Bank |
| deutsche | Deutsche Bank |
| hdfc | HDFC Bank |
| icici | ICICI India |
| idbi | IDBI Bank |
| idfc | IDFC First Bank |
| indbnk | Indian Bank |
| indusind | IndusInd Bank |
| iob | Indian Overseas Bank |
| karnataka | Karnataka Bank |
| karur | Karur Vysya Bank |
| kotak | Kotak Mahindra Bank |
| mahabk | Bank of Maharashtra |
| obc | Oriental Bank of Commerce |
| pnbbnk | Punjab National Bank |
| punjab_sind | Punjab & Sind Bank |
| rbl | RBL Bank |
| sbi | State Bank of India |
| sib | South Indian Bank |
| stanchar | Standard Chartered |
| syndicate | Syndicate Bank |
| tamil_mercantile | Tamilnad Mercantile Bank |
| ubi | Union Bank of India |
| uco | UCO Bank |
| united | United Bank of India |
| vijaya | Vijaya Bank |
| vilas | Lakshmi Vilas Bank |
| yesbnk | Yes Bank |
