<script>
  import { Accordion } from "@omni/core/svelte";
</script>

<div style="width: 100%; max-width: 40rem">
  <h3 style="margin: 0 0 1rem; font-size: 1.25rem">Frequently asked questions</h3>
  <Accordion
    aria-label="Frequently asked questions"
    items={[
      { title: "Can I change my plan later?", content: "Yes, upgrade or downgrade anytime. Changes apply to the next invoice." },
      { title: "Do you offer refunds?", content: "Within 30 days of a payment, no questions asked." },
      { title: "Is my data exported if I leave?", content: "You can export every project as JSON at any time." },
      { title: "Do you support single sign-on?", content: "SAML and OIDC are included in the Enterprise plan." },
    ]}
  />
</div>
