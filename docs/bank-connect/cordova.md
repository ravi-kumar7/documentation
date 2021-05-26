# BankConnect: Cordova
BankConnect Cordova SDK helps user submits their bank statements via upload or net banking credentials in your Android application.

## See in action
The demo video below shows how a user submit a bank statement using net banking credentials:
<div class="embed-container">
<iframe src="https://www.youtube.com/embed/SvRV5BX1gSo?rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

The video below shows a user submit bank statement by uploading the PDF file:
<div class="embed-container">
<iframe src="https://www.youtube.com/embed/hxG9H9_iX8E?rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Setting up the bridge

1. Install the Cordova SDK from the npm package:
    ```sh
    cordova plugin add cordova-plugin-finbox-bankconnect
    ```

2. Specify the following in `local.properties` file:
    ```
    AWS_KEY=<ACCESS_KEY>
    AWS_SECRET=<SECRET_KEY>
    FINBOX_BC_VERSION=<BANKCONNECT_SDK_VERSION>
    ```

## Start BankConnect journey
Call `openBankConnect` method using the `FinBoxBankConnectPlugin` instance to open BankConnect journey. It takes `LINK_ID` as one of its arguments which is a unique identifier for a user.

::: danger IMPORTANT
1. Please make sure `LINK_ID` is **not more than 64** characters and is **alphanumeric** (with no special characters). Also it should never `null` or a blank string `""`.
2. By default the SDK will request for 6 months data. In order to pass custom date range make use of these params `FROM_DATE` & `TO_DATE`.
3. `FROM_DATE` & `TO_DATE` should be of the format `dd/MM/yyyy`. And `TO_DATE` should *NOT* be todays date
:::

The response to this method (success or failure) can be captured using the callback
```javascript
cordova.plugins.FinBoxBankConnectPlugin.openBankConnect("CLIENT_API_KEY", "CUSTOMER_ID", "FROM_DATE", "TO_DATE", function (response) {
    console.log(response);
}, function (error) {
    console.log(error);
});
```