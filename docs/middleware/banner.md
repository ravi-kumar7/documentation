# FinBox Lending: Banner

Once the lending SDK is integrated, we need to show a banner in the app that explains the loan step to the customer. The SDK is to be opened after clicking on the banner.

<div style="text-align:center;">
<img src="https://finbox-cdn.s3.ap-south-1.amazonaws.com/docs/assets/servicing/Banner-ll.png" alt="Sample app" style="width:30%" />
</div>

:::tip User Activities
Each of the states below are to be shown after an **activity is logged for the user**. User activities can be tracked via [Webhook](/middleware/webhook.html) or by pulling data via [User Activity History API](/middleware/sourcing-rest-api.html#user-activity-history)

Some of these activities also come with additional information, these are mentioned on [Appendix](/middleware/appendix.html#list-of-user-activities).
:::

## Loan Journey

The list below indicates the **recommeded banner states** and **sample banner design** for a loan application:

### 1. Apply for loan

This step symbolises the start of the loan journey and should be shown to eligible users. User eligibility must be already calculated and fetched using the [Get Eligibility](/middleware/sourcing-rest-api.html#get-eligibility) API.

**Show when:** until `profile_updated` activity is not logged

<img src="/apply_for_loan.svg" alt="Apply for loan" />

<a href="/apply_for_loan.svg" download>Download SVG</a>

### 2. Complete your application

This step implies that the application was started, but was left in the middle. In this case, prompt the user to complete the application.

**Show when:** after `profile_updated` activity is logged

<img src="/incomplete_loan.svg" alt="Incomplete loan" />

<a href="/incomplete_loan.svg" download>Download SVG</a>

### 3. Loan approved

After loan is approved from lender, show user a state informing them that the application has been approved and they can proceed to the next step (like signing the agreement).

**Show when:** after `loan_approved` activity is logged

<img src="/loan_approved.svg" alt="Loan Approved" />

<a href="/loan_approved.svg" download>Download SVG</a>

### 4. Loan rejected

In case the loan is rejected you can notify the user that his loan has been rejected

**Show when:** after `loan_rejected` or `user_disqualified` activity is logged

<img src="/loan_rejected.svg" alt="Loan rejected" />

<a href="/loan_rejected.svg" download>Download SVG</a>

### 5. Check active loan

When the loan is disbursed you can show overview of active loans that a customer has with following banner.

**Show when:** after `loan_disbursed` activity is logged

**Showing active loans count:** use [List Loans](/middleware/sourcing-rest-api.html#list-loans) API to get active loans for a given `customer_id`

<img src="/active_loan.svg" alt="Active loan" />

<a href="/active_loan.svg" download>Download SVG</a>

### 6. EMI due

When EMI is due you can notify the user with the following banner

**Show when:** after `emi_due_in_7_days`, `emi_due_in_3_days` or `emi_due_tomorrow` is logged

<img src="/emi_due.svg" alt="EMI due" />

<a href="/emi_due.svg" download>Download SVG</a>

### 7. EMI overdue

When EMI is overdue then we need to show the User an overdue state so that he can avoid late fee charge

**Show when:** after `emi_overdue` is logged

<img src="/emi_overdue.svg" alt="EMI overdue" />

<a href="/emi_overdue.svg" download>Download SVG</a>