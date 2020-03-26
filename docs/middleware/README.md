# Lending Middleware

FinBox provides a lending middleware that connects the sourcing entity to lenders. It provides ease to both **sourcing entity** to include a loan journey on their apps or websites, as well as **lenders** on their dashboard to manage loan applications coming from different sources.

Here, **"sourcing entity"** is referred to as the entity that acquires and bring the customer to initiate the loan journey, while **"lender"** is the entity that gives the loan.

## Loan Journey
A loan journey with the middleware involves following steps:
- First sourcing entity **acquires the customer**
- Through sourcing entity, customer registers with the middleware and **fills the loan application**
- **Basic KYC** is then submitted at sourcing entity side
- **KYC is approved** automatically or manually, depending on the lenders who receive the application
- In specific cases, lenders can also **request additional documents** from customer
- After all documents are approved, lender **approves the loan application**
- Lender **offers are generated** automatically based on lender defined templates
- Customer **selects the offer**, and then **submits bank details**
- On successful verification of bank details, user **signs the loan agreement**
- Lender then **dispatches the money** and informs the middleware on every **repayment received**
- Repayment timeline with EMI **status is visible** to both sourcing entity and lenders.

## Sourcing Entity
At sourcing entity side, integration can be done via one of the following:
- [REST API](/middleware/sourcing-rest-api.html)
- [Android SDK](/middleware/android-sdk.html) (UI as a service)

## Lender
At lender side, FinBox provides its own **dashboard** which is easy to use and provides a one stop solution for all the lender-related actions. In case lenders have an existing dashboard or workflow, they can make use of provided [REST API](/middleware/lender-rest-api.html)s.

