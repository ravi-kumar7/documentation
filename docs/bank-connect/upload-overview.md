# Bank Connect: Uploading Bank Statements

Uploading bank statements is the first step involved in Bank Connect Integration flow.

<img src="/upload_statements.jpg" alt="Upload Statements" />

As shown in the diagram there are two ways you can go ahead with this step:

## Directly from your server
As visible in the upper part of the diagram, User submits a PDF statement which through some journey reaches your server. From there you can make use of [Bank Connect REST APIs](/bank-connect/upload-rest-api.html) to submit the statement. Alternatively you can also make use of server side libraries like our [Python Library](/bank-connect/upload-python.html) to do this step.

After uploading the statement, you'll get the identity information and an `entity_id` as response. Identity information includes things like account holder name, account number, time period etc. which can be used for verifying the user or checking if the statement was of the time period you required.

## Using the Client SDK
As in the lower part of the diagram, User can also submit a PDF statement or enter **Net Banking** credentials in the Client SDK that resides in your Web / Android Application. While initializing this SDK you have to pass `link_id`, and the Client SDK will talk with the Bank Connect Backend. On successful uploading of statement, your application will get a callback / redirect with an `entity_id`. Client SDK is available for following:
- [React](/bank-connect/react.html)
- [JavaScript](/bank-connect/javascript-client.html)
- [Android](/bank-connect/android-client.html)
