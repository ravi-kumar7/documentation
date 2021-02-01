# FinBox Lending: Banner

Once the lending SDK is integrated, we need to define UI states in frontend that explains the loan step of the customer. There are following UI states that needs to be communicated clearly for better user retention.

### 1. Apply for loan

This step symbolises the start of the loan journey and should be shown to users eligble for loan. User eligibility must be already calculated from this api [user_eligibility]{}.

<img src="/apply_for_loan.svg" alt="Apply for loan" />

### 2. Complete your loan

Once the loan has been created. If the user has not completed his journey then prompt the user to open the SDK with a banner that symbolises an incomplete loan.

<img src="/incomplete_loan.svg" alt="Incomplete loan" />

### 3. Loan approved

Loan approval is done by the lender and can take sometime. When loan is approved show user a happy state that his loan has been approved and he can proceed to signing agreement.

<img src="/loan_approved.svg" alt="Loan Approved" />

### 4. Loan rejected

In case the loan is rejected you can notify the user that his loan has been rejected

<img src="/loan_rejected.svg" alt="Loan rejected" />

### 5. Check active loan

When the loan is disbursed you can show overview of active loan that a customer has with following banner.

<img src="/active_loan.svg" alt="Active loan" />

### 6. EMI due

When EMI is due you can notify the user with the following banner

<img src="/emi_due.svg" alt="EMI due" />

### 7. EMI overdue

When EMI is overdue then we need to show the User an overdue state so that he can avoid late fee charge

<img src="/emi_overdue.svg" alt="EMI overdue" />