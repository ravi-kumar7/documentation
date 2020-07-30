# Sourcing Entity
FinBox Embedded Lending SDK lets partners (sourcing entities) embed a fully digital loan journey within their app.

Partners place the lending CTA in context to their existing workflows. When user clicks the CTA, they initialize our SDK. The SDK encapsulates all necessary integrations such as eKYC, credit bureau, NBFC-AA and FinBox custom credit score.

## Journey
The presentation below shows the journey for a partner app:
- Slide 1: Creating the user on partner server side
- Slide 2: Loan journey in partner app

<div class="embed-container">
<iframe width="640" height="360" src="https://miro.com/app/embed/o9J_kqVBawI=/?&pres=1&animate=1" frameborder="0" scrolling="no" allowfullscreen></iframe>
</div>

## Integration
On the sourcing entity side, integration is required on the server side (REST APIs) and in the android app side (SDK). The guides below explain these:
- [Android SDK](/middleware/android-sdk.html) (UI as a service)
- [REST API](/middleware/sourcing-rest-api.html)