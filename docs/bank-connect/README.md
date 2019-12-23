# Bank Connect: Introduction
The FinBox Bank Connect parses bank account statements (PDFs) and provides:

- User Identity data
- Enriched Transaction data
- Fraud Detection
- Credit Assessment metrics (Asset Report)

Developers can use this to build loan application journeys, wealth management apps and personal finance management apps.

Other than parsing bank account statements it also provides client libraries to accept the statement PDFs manually or via net banking credentials.

::: tip Try Bank Connect
Click [here](https://finbox.in/contact-us) to contact us and request for an API key
:::

## Getting started
Head towards [Basics](/bank-connect/basics.html) to understand the standard terms, then proceed to your preferred language for SDK. The SDK is available in two modes:

### Direct PDF Mode
Here the statement PDF is directly provided to the SDK
- [REST API](/bank-connect/rest-api.html)
- [Python](/bank-connect/python.html)

### Net Banking Mode <Badge text="New" type="tip"/>
In the **Net Banking mode**, users just have to enter net banking credentials, and the statements will be directly/automatically fetched from their net banking accounts, saving them a lot of time and effort to download/obtain the PDF File.

You can look at your preferred client library for this:
- [Android Client](/bank-connect/android-client.html)
- [JavaScript Client](/bank-connect/javascript-client.html)

:::warning NOTE
**Net Banking Mode** will only help in fetching the statement for the user and uploading it to the FinBox server for processing. However, to get extracted and enriched identity / transactions, the use of **REST API** will be required.
:::