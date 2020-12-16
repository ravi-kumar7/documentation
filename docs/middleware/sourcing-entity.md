# Sourcing Entity
FinBox Embedded Lending SDK lets partners (sourcing entities) embed a fully digital loan journey within their app.

Partners place the lending CTA in context to their existing workflows. When user clicks the CTA, they initialize our SDK. The SDK encapsulates all necessary integrations such as eKYC, credit bureau, NBFC-AA and FinBox custom credit score.

## Workflow
The diagram below shows the integration workflow for partner app:
<img src="https://finbox-cdn.s3.ap-south-1.amazonaws.com/docs/assets/ill_sourcing_entity_flow.png" alt="Sourcing Entity Integration Workflow" />

:::tip Web SDK
In case of [Web SDK](/middleware/web-sdk.html), instead of **Get Token API**, you will have to call the **Session API**, which will return you a web URL to be redirected or rendered in a web view. You can read more about the Web SDK [here](/middleware/web-sdk.html).
:::

## Integration Guides
On the sourcing entity side, integration is required on the server side (REST APIs) and in the android app side (SDK). The guides below explain these:
- [Android SDK](/middleware/android-sdk.html) (UI as a service)
- [REST API](/middleware/sourcing-rest-api.html)

You can also integrate our UI SDK using our [Web SDK](/middleware/web-sdk.html).