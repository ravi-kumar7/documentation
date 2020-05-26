# BankConnect: Fraud

There are some frauds which are detected at the first step when the statement file is successfully uploaded, while there are some which are detected at a later stage when transactions are extracted and analyzed.

There is usually a field `fraud_type` that indicates the fraud type. The list of possible `fraud_type` values can be acquired on request from the FinBox team.

:::tip NOTE
A general rule of thumb would be that the fraud_type is usually in a string format with all lower case and words separated by an underscore (\_). So a fraud type term can be formed by simple string manipulation of replacing underscore with spaces and making the first character capital in each word then. Example: `some_fraud_type` can become `Some Fraud Type`.
:::

In the case of transaction-level fraud, `transaction_hash` (a unique identifier for a transaction) is also present to know the transaction that has fraud.

Also since fraud is identified for a statement, `statement_id` is also present to know the fraud came for which statement.
