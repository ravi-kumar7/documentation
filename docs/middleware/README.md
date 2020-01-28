# Lending Middleware

FinBox provides a lending middleware that connects the sourcing entity to lenders. The middleware provides APIs to manage KYC, loan application and repayments; underwriting decisions and user engagement in sourcing apps.

## Basic Flow
The integration for the middleware involves **REST API integration** at both sourcing entity and lender side. The overall process involves following steps:
1) Creation of User and initiating the KYC
2) Creating a loan application
3) Approve Loans based on external / FinBox or custom credit model
4) Record Repayments, send payment reminders and engage users in apps.

## API Authentication
FinBox Lending Middleware uses API keys to authenticate requests made to REST APIs. Please keep the API keys secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth. All API requests must be made over HTTPS. Calls made over plain HTTP will fail. API requests without authentication will also fail.

To provide API key while making a request, `X-API-KEY` must be present in the request header with API key value.

## Request Format
FinBox middleware receives all requests in JSON format so please make sure that all requests must be made with content type `application/json`.