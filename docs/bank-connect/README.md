<style>
.button_holder{
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
}
.download_button{
    background-color: white;
    color: rgb(36, 202, 122);
    width: 300px;
    text-align: center;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    font-size: 16px;
    cursor: pointer;
    border-width: 0.07em;
    border-style: solid;
    border-color: rgb(36, 202, 122);
    border-image: initial;
    padding: 10px 0px;
    text-decoration: none;
    border-radius: 2px;
    margin: 4px 2px;
    text-decoration:none;
}
.download_button:hover{
    background-color: rgb(36, 202, 122);
    color: white;
    text-decoration: none !important;
}
</style>

# Bank Connect: Overview
The FinBox Bank Connect allows users to submit their bank account statements in your app, then processes them and shares the enriched data with you.

This guide will help you integrate bank connect in your application flow.

Head towards the [Basics](/bank-connect/basics.html) section to understand the basic terms associated with Bank Connect.

## Postman Collection
Postman **collection** and **environment** for Bank Connect REST APIs can be downloaded using the buttons below:

<div class="button_holder">
<a class="download_button" download href="/finbox_bankconnect.postman_collection.json">Download Collection</a>
<a class="download_button" download href="/finbox_bankconnect.postman_environment.json">Download Environment</a>
</div>

Please replace `x-api-key` in the Postman environment with the **API Key** provided by FinBox Team.

First call any of the upload statement APIs, and then call APIs to fetch details like transactions, identity, etc.