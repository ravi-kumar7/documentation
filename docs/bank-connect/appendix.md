## Bank Identifiers
The table below lists the supported banks with their corresponding identifier. These identifiers will be used throughout the Bank Connect product, whenever a `bank` or `bank_name` field are involved.

| Identifier | Bank Name |
| - | - |
| allahabad | Allahabad Bank |
| andhra | Andhra Bank |
| axis | Axis India |
| baroda | Bank of Baroda |
| boi | Bank of India |
| canara | Canara Bank |
| central | Central Bank of India |
| citi | Citibank |
| citi_union | City Union Bank |
| corporation | Corporation Bank |
| dcbbnk | DCB Bank |
| dena | Dena Bank |
| deutsche | Deutsche Bank |
| hdfc | HDFC Bank |
| icici | ICICI India |
| idbi | IDBI Bank |
| idfc | IDFC First Bank |
| indbnk | Indian Bank |
| indusind | IndusInd Bank |
| iob | Indian Overseas Bank |
| karnataka | Karnataka Bank |
| karur | Karur Vysya Bank |
| kotak | Kotak Mahindra Bank |
| mahabk | Bank of Maharashtra |
| obc | Oriental Bank of Commerce |
| pnbbnk | Punjab National Bank |
| punjab_sind | Punjab & Sind Bank |
| rbl | RBL Bank |
| sbi | State Bank of India |
| sib | South Indian Bank |
| stanchar | Standard Chartered |
| syndicate | Syndicate Bank |
| tamil_mercantile | Tamilnad Mercantile Bank |
| ubi | Union Bank of India |
| uco | UCO Bank |
| united | United Bank of India |
| vijaya | Vijaya Bank |
| vilas | Lakshmi Vilas Bank |
| yesbnk | Yes Bank |

## Transaction Channel
The list below indicates the possible value for `transaction_channel` field:

| `transaction_channel` | Description |
| - | - |
| upi	| Credit or Debit done through UPI
| salary | Credits which are marked as salary in the bank statement
| refund | Credits which are refund of an earlier debit
| payment_gateway_purchase | Debits done on a payment gateway
| outward_cheque_bounce | Debit when a deposited cheque bounce and money is reverted
| net_banking_transfer | Credit or Debit done through net banking
| investment | Debit in account when doing an investment like FD or RD
| inward_cheque_bounce | Credit when the cheque bounces and money is credit back to account
| investment_cashin | Credit to account, when you redeem your investment like an FD
| international_transaction_arbitrage | Arbitrage because of the rate difference in currencies. Can be credit or debit
| debit_card | Debit when a debit card is swiped at a Point of sale
| chq | Credit or a Debit done through cheque
| cash_withdrawl | Debit done when cash is withdrawn either through ATM or at Bank
| cash_deposit | Credit when cash is deposited in an account
| bill_payment | Debit marked as payment of any bill like Credit card bill payment or BillDesk
| bank_interest | Credit in account for interest received on deposit
| bank_charge | Debit done by bank for some service or tax like GST or SMS service
| auto_debit_payment_bounce | Debit bank charge because of auto debit payment bounce
| auto_debit_payment | Debit like NACH or ECS