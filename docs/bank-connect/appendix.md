# BankConnect: Appendix

## Bank Identifiers
The table below lists the supported banks with their corresponding identifier. These identifiers will be used throughout the BankConnect product, whenever a `bank` or `bank_name` field are involved.

| Identifier | Bank Name |
| - | - |
| allahabad | Allahabad Bank |
| alrajhi | Al Rajhi Bank |
| andhra | Andhra Bank |
| apgvbnk | Andhra Pradesh Grameena Vikas Bank |
| ausfbnk | AU Small Finance Bank |
| axis | Axis Bank |
| bandhan | Bandhan Bank |
| baroda | Bank of Baroda |
| bharatbnk | Bharat Co-Operative Bank |
| boi | Bank of India |
| canara | Canara Bank |
| central | Central Bank of India |
| citi | Citibank |
| city_union | City Union Bank |
| corporation | Corporation Bank |
| dbsbnk | DBS Bank |
| dcbbnk | DCB Bank |
| dnsbnk | Dombivli Nagari Sahakari Bank |
| dena | Dena Bank |
| deutsche | Deutsche Bank |
| esafbnk | ESAF Small Finance Bank |
| federal | Federal Bank |
| fincarebnk | Fincare Small Finance Bank |
| gsmahanagar | GS Mahanagar Co-Op Bank |
| hdfc | HDFC Bank |
| icici | ICICI India |
| idbi | IDBI Bank |
| idfc | IDFC First Bank |
| indbnk | Indian Bank |
| indusind | IndusInd Bank |
| iob | Indian Overseas Bank |
| jnkbnk | Jammu and Kashmir Bank |
| karnataka | Karnataka Bank |
| karur | Karur Vysya Bank |
| kotak | Kotak Mahindra Bank |
| mahabk | Bank of Maharashtra |
| mahagrambnk | Maharashtra Gramin Bank |
| ncb | National Commercial Bank (AlAhli Bank) |
| newindia | New India Co-Operative Bank |
| obc | Oriental Bank of Commerce |
| paytm | Paytm Payments Bank |
| pnbbnk | Punjab National Bank |
| punjab_sind | Punjab & Sind Bank |
| rbl | RBL Bank |
| sbi | State Bank of India |
| shinhan | Shinhan Bank India |
| sib | South Indian Bank |
| suryodaybnk | Suryoday Small Finance Bank |
| svcbnk | SVC Co-Operative Bank |
| syndicate | Syndicate Bank |
| tamil_mercantile | Tamilnad Mercantile Bank |
| ubi | Union Bank of India |
| uco | UCO Bank |
| ujjivan | Ujjivan Small Finance Bank |
| united | United Bank of India |
| vijaya | Vijaya Bank |
| vilas | Lakshmi Vilas Bank |
| yesbnk | Yes Bank |

<!-- | stanchar | Standard Chartered | -->

## Transaction Channel
The list below indicates the possible value for `transaction_channel` field:

| `transaction_channel` | Description |
| - | - |
| upi	| Credit or Debit done through UPI |
| salary | Credits which are marked as salary in the bank statement |
| refund | Credits which are a refund of an earlier debit |
| payment_gateway_purchase | Debits done on a payment gateway |
| outward_cheque_bounce | Debit when a deposited cheque bounce and money is reverted |
| net_banking_transfer | Credit or Debit done through net banking |
| investment | Debit in account when doing an investment like FD or RD |
| inward_cheque_bounce | Credit when the cheque bounces and money is credit back to the account |
| investment_cashin | Credit to account, when you redeem your investment like an FD |
| international_transaction_arbitrage | Arbitrage because of the rate difference in currencies. Can be credit or debit |
| debit_card | Debit when a debit card is swiped at a Point of sale |
| chq | Credit or a Debit done through cheque |
| cash_withdrawl | Debit done when cash is withdrawn either through ATM or at Bank |
| cash_deposit | Credit when cash is deposited in an account |
| bill_payment | Debit marked as payment of any bill like Credit card bill payment or BillDesk |
| bank_interest | Credit in the account for interest received on deposit |
| bank_charge | Debit done by the bank for some service or tax like GST or SMS service |
| auto_debit_payment_bounce | Debit bank charge because of auto-debit payment bounce |
| auto_debit_payment | Debits like NACH or ECS |
| Others | Others |

## Description
The list below indicates the possible values for `description` field of the transaction object:

| `description` | Description |
| - | - |
| penalty_charge | penalty charged by bank. Transaction channel is `bank_charge` |
| ach_bounce_charge | ACH bounce charge. Transaction channel is `bank_charge` |
| chq_bounce_charge | Cheque bounce charge. Transaction channel is `bank_charge` |
| lender_transaction | lender transaction |
| credit_card_bill | credit card bill transaction. Transaction channel is `bill_payment` |
| telco_bill | telecommunications bill transaction. Transaction channel is `bill_payment` |
| electric_bill | electric bill transaction. Transaction channel is `bill_payment` |
| deposit_by_machine | indicates cash deposit was made on an ATM/Kiosk. Transaction channel is `cash_deposit` |
| chq_bounce_insuff_funds | check bounced due to insufficient funds. Transaction channel is `inward_cheque_bounce` or `outward_cheque_bounce` |
| neft_return | NEFT return. Transaction channel is `refund` |

## Merchant Category
The list below indicates the possible value for `merchant_category` field:

| `merchant_category` | Description |
| - | - |
| alcohol | Alcohol |
| gambling | Gambling |
| shopping | Shopping |
| groceries | Groceries | 
| entertainment | Entertainment |
| medical | Medical |
| travel | Includes cabs, hotels and travel tickets |
| food | Food |
| fuel | Fuel |
| investments | Investments |
| trading | Trading |
| bills | Bills |
| ewallet | E-Wallet |
| loans | Lender |

## What is the FinBox Startup Program?
Our mission is to democratize financial services for the next billion Indians. We realized that the infrastructure for distribution and access to financial services in India is broken and we are fixing it one API at a time. Through FinBox Startup Program, we want to support other early-stage FinTech companies who are building financial services and products for the next billion Indians.

### Eligibility
We wish to enable early-stage companies to seamlessly collect financial data, critical to building user-centric FinTech products. The program is open to any early-stage startup that meets the following eligibility requirements:
- Incorporated less than three years ago
- Raised no further than Series A in total funding
- haven’t previously received other FinBox offers or discounts

### Benefit
The FinBox Startup Program includes FinBox’s Startup Deal on BankConnect solution - Participating **startups receive $500*** in credit toward our monthly usage plan for up to 3 months as long as they meet our eligibility requirements.


FinBox’s BankConnect solution parses bank account statements (PDFs) and provides:
1. User Identity data for Account Authentication, 
2. Enriched Transaction data, 
3. Fraud Detection, and 
4. Credit Assessment metrics (Asset Report) for Loan Underwriting.

Developers can use this to build loan application journeys, wealth management apps and personal finance management apps. 

Other than parsing bank account statements it also provides client libraries to accept the statement PDFs manually or via net banking credentials. You can learn about BankConnect solution [here](/bank-connect).

Interested companies can apply [here](https://finbox.in/startup-program/).

_* can vary based on affiliated accelerator and VC partners._


## Frequently Asked Questions
**How are the FB credits applied?** Credits are applied to your monthly bill as per usage bases, covering up to $500 in total usage up to 3 months. Any additional usage costs are not covered by the program.

**How do I redeem the FinBox credits?** Eligible startups can apply directly to the FinBox Startup Program.

**How do I find out if I’ve been accepted to the FinBox Startup Program?** If you’ve been accepted to the program, you’ll receive the status of the application via email with a welcome message and the next steps. If you haven’t received an email, you can also check in your FinBox Dashboard portal and look for a Startup Program icon in the top right corner.

**Where can I view the credits applied to my FinBox account?** The Startup Program credits are reflected in the Dashboard usage and billing page.

**Do I have to be a “new” customer to receive a coupon?** New and current FinBox users who have not previously received any other coupon are eligible to apply. Only current customers with usage less than 500$ till now are eligible.

**What happens if I go over my total credit applied?** When you reach 80% of credits, you will get a reminder to upgrade it, failing which you will lose access once you exhaust your total credit received as part of the Startup Program offer. 

**What happens when my credits expire?** Once you’ve used your total credits, you might be eligible to renew your contract at a discounted rate. Further commercials will include a monthly minimum commitment on monthly billing based on usage needs. Any existing balance will be adjusted in consequent billings.

**How do I know if my accelerator/incubator/VC firm has a relationship with FinBox?** Ask your program manager to see if they participate in the FinBox Startup Program. If they do not, you can request that they apply to become a partner.