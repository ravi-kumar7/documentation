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

## List of customer activities
| Value | Description | Entity |
| - | - | - |
| user_created | User was created against a customerID |  Sourcing Entity Server |
| eligibility_calculated | Loan Eligibility was calculated |  Sourcing Entity Server |
| profile_updated | Customer updated the profile | Customer |
| bureau_consent_given | Customer submitted PAN number and gave consent to fetch credit bureau data | Customer |
| user_qualified | Customer is qualified to move ahead and is shown hook offer | System |
| user_disqualified | The Customer is disqualified from the loan. Same as Loan Rejected | System |
| user_does_not_recognize_bureau_phone | Customer denied having any phone number linked with credit report | Customer |
| loan_application_created | Customer clicked on Apply for Loan button & a loan application was created | Customer |
| form_updated | Customer filled the loan application form | Customer |
| kyc_submitted | KYC documents submitted by the Customer | Customer |
| kyc_verified | KYC documents verified |  Sourcing Entity Dashboard or System |
| kyc_doc_rejected | Any KYC document was rejected |  Sourcing Entity Dashboard or System |
| kyc_resubmitted | KYC document re-submitted by Customer | Customer |
| lender_assigned | A lender was assigned to finance the loan application | System |
| loan_approved | Loan was approved by a lender | System / Lender |
| loan_rejected | Loan was rejected by a lender | System / Lender |
| loan_offer_accepted | Loan offer was accepted by customer | Customer |
| bank_details_added | Customer updated bank details - acc number & IFSC | Customer |
| bank_verification_failed | Bank could not be verified | System |
| bank_details_verified | Bank verification successful | System |
| loan_esigned | Customer esigned the loan agreement | Customer |
| loan_disbursed | Loan was disbursed by the lender | System |
| address_updated | Address was updated by ops team |  Sourcing Entity Dashboard |
| emi_paid | EMI Paid by the customer | Customer /  Sourcing Entity |
| emi_payment_initiated | EMI Payment initiated by the customer | Customer |

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