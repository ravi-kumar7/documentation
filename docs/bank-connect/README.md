# BankConnect: Overview
FinBox BankConnect allows users to submit their bank account statements in your app, then processes them and shares the enriched data with you.

This guide will help you integrate BankConnect in your application flow.

Watch the video below then head towards the [Basics](/bank-connect/basics.html) section to understand the basic terms associated with BankConnect.

## Understanding the Integration Flow
The video below gives a brief overview of the BankConnect Integration flow:

<div class="embed-container">
<iframe src="https://www.youtube.com/embed/OC2eBqeCKrs?rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Getting API Keys
BankConnect requires API Keys to initialize the SDK and/or access the REST APIs. There will be separate keys for **DEV** and **PROD** environments.

You can get your keys on [FinBox Dashboard](https://dashboard.finbox.in)

## Sample Projects
We have hosted some sample projects on GitHub. You can find them on the links below:
- [Android Client SDK](https://github.com/finbox-in/bankconnect-android)
- [React Client SDK](https://github.com/finbox-in/bankconnect-react)

## Postman Collection
Postman **collection** and **environment** for BankConnect REST APIs can be downloaded using the buttons below:

<div class="button_holder">
<a class="download_button" download href="/finbox_bankconnect.postman_collection.json">Download Collection</a>
<a class="download_button" download href="/finbox_bankconnect.postman_environment.json">Download Environment</a>
</div>

Please replace `x-api-key` in the Postman environment with the **API Key** provided by FinBox Team.

First call any of the upload statement APIs, and then call APIs to fetch details like transactions, identity, etc.