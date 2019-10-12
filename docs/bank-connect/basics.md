# Basics
One must be familiar with following terms to use the Bank Connect library:

## Entity
An entity represents your customer. It could be an individual or a company applying financial product in your system.
The `entity_id` is the identifier for the entity in the FinBox system, the `link_id` is an optional field that you can use to map your id to the Entity in the FinBox system.

::: warning
There can be multiple entities associated with same `link_id`.
:::

## Statement
A statement corresponds to a single file uploaded for an entity. There can be multiple statements corresponding to the same or different bank accounts belonging to the same entity (customer). Each statement object has a unique `statement_id` and it also has a `entity_id` mapping with it.

## Account
An account represents a bank account. One entity can have multiple accounts, as one company / individual can have multiple bank accounts. Each account information stores the information pertaining to the bank like account number, bank name, also the month and year for which data is available and a unique `account_id` that can be used to segregate things like transactions, if required.

::: warning
If multiple statements are uploaded against an entity, Bank Connect will automatically pick and store unique bank accounts information.
:::

## Identity
Identity refers to identity information (name, address, etc.) for the given entity.
::: warning
While using client libraries, you get the latest identity information for the given entity, however while using the REST APIs you have identity in form of an array of objects, each object corresponding to identity information of unique bank account for the entity.
:::

## Transactions
Transactions is an array that encapsulates transactions (objects) across multiple accounts of the entity. Transactions are extracted from uploaded statements and associated with accounts. In most cases, FinBox enriches each transaction to provide clean merchants, transaction types etc. Transactions can be segregated based on account by the `account_id` field.

## Bank Identifiers
The table below lists the supported banks with their corresponding identifier. These identifiers will be used throughout the Bank Connect product, whenever a `bank` or `bank_name` field are involved.

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
