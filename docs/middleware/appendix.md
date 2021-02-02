# Appendix

## List of customer status
| Value | Description |
| - | - |
| USER_CREATED | Customer was created via server APIs |
| USER_TOKEN_ISSUED | An access token has been issued to the Customer |
| USER_PROFILE_UPDATED | Customer has updated the profile on app |
| USER_QUALIFIED | Customer is qualified for hook offer |
| USER_DISQUALIFIED | Customer is disqualified for hook offer |


## List of loan status
| Value | 
| - |
| FRESH_LOAN |
| LOAN_DETAILS_SUBMITTED |
| KYC_PROCESSING |
| KYC_SUCCESS |
| KYC_REJECTED |
| LOAN_REJECTED |
| LOAN_APPROVED |
| BANK_FAILED |
| BANK_PROCESSING |
| BANK_ADDED |
| SIGN_AGREEMENT |
| DISBURSED |
| CANCELLED |
| CLOSED |

## List of user activities

:::warning Event Description
Please note that the event description is always a **string**
:::

| Value | Description | Entity | Event Description String Example |
| - | - | - | - |
| user_created | User was created against a customerID |  Sourcing Entity | - |
| eligibility_calculated | Loan Eligibility was calculated |  Sourcing Entity | `25000.00` |
| profile_updated | Customer updated the profile | Customer | - |
| bureau_consent_given | Customer submitted PAN number and gave consent to fetch credit bureau data | Customer |- |
| user_qualified | Customer is qualified to move ahead and is shown hook offer | System | - |
| user_disqualified | The Customer is disqualified from the loan. Same as Loan Rejected | System | `rejected due to some reason` |
| user_does_not_recognize_bureau_phone | Customer denied having any phone number linked with credit report | Customer | - |
| loan_application_created | Customer clicked on Apply for Loan button & a loan application was created | Customer | - |
| form_updated | Customer filled the loan application form | Customer | - |
| kyc_submitted | KYC documents submitted by the Customer | Customer | - |
| kyc_verified | KYC documents verified |  Sourcing Entity Dashboard / System | - |
| kyc_doc_rejected | Any KYC document was rejected |  Sourcing Entity Dashboard / System | - |
| kyc_resubmitted | KYC document re-submitted by Customer | Customer | - |
| lender_assigned | A lender was assigned to finance the loan application | System | - |
| loan_approved | Loan was approved by a lender | System / Lender | - |
| loan_rejected | Loan was rejected by a lender | System / Lender | `rejected due to some reason` |
| loan_offer_accepted | Loan offer was accepted by customer | Customer | - |
| bank_details_added | Customer updated bank details - acc number & IFSC | Customer | - |
| bank_verification_failed | Bank could not be verified | System | - |
| bank_details_verified | Bank verification successful | System | - |
| loan_esigned | Customer esigned the loan agreement | Customer | - |
| loan_disbursed | Loan was disbursed by the lender | Lender | - |
| address_updated | Address was updated by ops team |  Sourcing Entity Dashboard | - |
| emi_paid | EMI Paid by the customer | Customer /  Sourcing Entity / System / Lender | `{"installmentNum": 1}` |
| emi_payment_initiated | EMI Payment initiated by the customer | Customer | `{"installmentNum": 1}` |
| loan_signed_agreement_generated | Signed agreement PDF is generated for the customer | System | - |
| loan_closed | Loan was closed | System / Lender | - |
| loan_cancelled | Loan was cancelled | System / Sourcing Entity | - |
| late_fee_added | Late Fee was added | System | `{"installmentNum": 1, "lateCharge": 250.00}` |
| late_fee_updated | Late Fee was updated | System | `{"installmentNum": 1, "lateCharge": 500.00}` |
| emi_due_in_7_days | EMI is due in 7 days | System | `{"installmentNum": 1}` |
| emi_due_in_3_days | EMI is due in 3 days | System | `{"installmentNum": 1}` |
| emi_due_in_tomorrow | EMI is due tomorrow | System | `{"installmentNum": 1}` |
| emi_overdue | EMI is overdue | System | `{"installmentNum": 1}` |
| credit_line_created | Credit Line Created | System | `{"limit": 100000.00}`
| credit_line_withdrew | Credit Line Transaction Created / Withdrawl Made | Customer | `{"amount": 2323.00, "txnID": "your_txn_id", "refID": "some_reference_id"}` |
| credit_line_withdrew_failed | Credit Line Transaction Withdrawl Failed | Customer | `{"amount": 2323.00, "txnID": "your_txn_id", "refID": "some_reference_id"}` |
| credit_line_limit_updated | Credit Line Limit Updated | System | `{"availableLimit": 50000.00}` |
| credit_line_txn_confirmed | Credit Line Transaction Confirmed | Sourcing Entity | `{"txnID": "your_txn_id"}` |
| credit_line_txn_cancelled | Credit Line Transaction Cancelled | Sourcing Entity | `{"txnID": "your_txn_id"}` |
| credit_line_txn_disbursed | Credit Line Transaction Disbursed | System / Lender | `{"txnID": "your_txn_id"}` |
| credit_line_txn_paid | All EMIs for Credit Line Transaction Paid | System | `{"txnID": "your_txn_id"}` |

:::tip Credit Line Specific Event Description

In case of credit line, event description formats will be as follows:
| Activity | Event Description Example |
| - | - |
| emi_paid | `{"installmentNum": 1, "txnID": "your_txn_id"}` |
| emi_payment_initiated | `{"installmentNum": 1, "txnID": "your_txn_id"}` |
| late_fee_added | `{"installmentNum": 1, "lateCharge": 250, "txnID": "your_txn_id"}` |
| late_fee_updated | `{"installmentNum": 1, "lateCharge": 500, "txnID": "your_txn_id"}` |
| emi_due_in_7_days | `{"installmentNum": 1, "txnID": "your_txn_id"}` |
| emi_due_in_3_days | `{"installmentNum": 1, "txnID": "your_txn_id"}` |
| emi_due_tomorrow | `{"installmentNum": 1, "txnID": "your_txn_id"}` |
| emi_overdue | `{"installmentNum": 1, "txnID": "your_txn_id"}` |
:::

## List of entity types
| Identifier | Description |
| - | - | 
| sourcing_entity | Sourcing Entity API|
| sourcing_entity_agent | An authorized agent of sourcing entity using dashboard. |
| customer | The customer / borrower |
| lender | Lender - NBFC or Bank |
| lender_agent | An authorized agent of the lender |
| system | Automated system |

## List of bureau status
| Identifier | Description |
| - | - |
| not_fetched | Bureau data not fetched yet |
| record_not_found | No bureau data found the user |
| completed_no_score | Bureau data successfully fetch but user had no score |
| completed | Bureau data with score successfully fetched |
| waiting | Bureau data is being fetched (in progress) |
| failed | Bureau data fetching failed |

<!-- ## Servicing Hooks and Actions
| Activity | Action | Examples |
| - | - | - |
| emi_due_in_7_days | Send notification | <a href = "https://finbox-cdn.s3.ap-south-1.amazonaws.com/docs/assets/servicing/Notification-l.png" target="_blank"> Sample Notification </a> |
| emi_due_in_3_days | Send notification and show banner on home screen | <a href = "https://finbox-cdn.s3.ap-south-1.amazonaws.com/docs/assets/servicing/Notification-lll.png" target="_blank"> Sample Notification </a> <a href = "https://finbox-cdn.s3.ap-south-1.amazonaws.com/docs/assets/servicing/Banner-l.png" target="_blank"> Sample Banner </a> |
| emi_due_tomorrow | Send notification and show banner on every screen| <a href = "https://finbox-cdn.s3.ap-south-1.amazonaws.com/docs/assets/servicing/Notification-lV.png" target="_blank"> Sample Notification </a> <a href = "https://finbox-cdn.s3.ap-south-1.amazonaws.com/docs/assets/servicing/Banner-l.png" target="_blank"> Sample Banner </a> |
| emi_overdue | Send notification and show full screen banner on app open | <a href = "https://finbox-cdn.s3.ap-south-1.amazonaws.com/docs/assets/servicing/Notification-ll.png" target="_blank"> Sample Notification </a> <a href = "https://finbox-cdn.s3.ap-south-1.amazonaws.com/docs/assets/servicing/Banner-ll.png" target="_blank"> Sample Banner </a> |
| late_fee_added | Send notification and show banner on every screen | <a href = "https://finbox-cdn.s3.ap-south-1.amazonaws.com/docs/assets/servicing/Notification-ll.png" target="_blank"> Sample Notification </a> <a href = "https://finbox-cdn.s3.ap-south-1.amazonaws.com/docs/assets/servicing/Banner-ll.png" target="_blank"> Sample Banner </a> |
| late_fee_updated | Send notification** and show banner on every screen | <a href = "https://finbox-cdn.s3.ap-south-1.amazonaws.com/docs/assets/servicing/Notification-ll.png" target="_blank"> Sample Notification </a> <a href = "https://finbox-cdn.s3.ap-south-1.amazonaws.com/docs/assets/servicing/Banner-ll.png" target="_blank"> Sample Banner </a> |
| emi_paid | Send notification for payment confirmation | <a href = "https://finbox-cdn.s3.ap-south-1.amazonaws.com/docs/assets/servicing/Notification-ll.png" target="_blank"> Sample Notification </a> <a href = "https://finbox-cdn.s3.ap-south-1.amazonaws.com/docs/assets/servicing/Banner-ll.png" target="_blank"> Sample Banner </a> | -->
