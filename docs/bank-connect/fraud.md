# BankConnect: Fraud

There are some frauds which are detected at the first step when the statement file is successfully uploaded, these are called **Metadata frauds** and are returned as a response to upload API.

Examples of a metadata `fraud_type` is `author_fraud`, which indicates that author of the document is not a trusted source for this bank statement.

Other fraud checks require analysis over the extracted transactions and are hence available (along with the **Metadata frauds**) in the `fraud_type` array in `fraud` field in all transaction APIs.

There is usually a field `fraud_type` that indicates the fraud type. The list of possible `fraud_type` values can be acquired on request from the FinBox team.

:::tip NOTE
A general rule of thumb would be that the fraud_type is usually in a string format with all lower case and words separated by an underscore (\_). So a fraud type term can be formed by simple string manipulation of replacing underscore with spaces and making the first character capital in each word then. Example: `some_fraud_type` can become `Some Fraud Type`.
:::

`fraud_category` indicates the category of fraud. `metadata` is the category for **Metadata frauds**. Other fraud categories can be acquired on request from the FinBox team.

