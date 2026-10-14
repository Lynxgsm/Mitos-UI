import { Accordion } from "mitos-ui/react";

export default function Faq() {
  return (
    <div style={{ width: "100%", maxWidth: "40rem" }}>
      <h3 style={{ margin: "0 0 1rem", fontSize: "1.25rem" }}>Frequently asked questions</h3>
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
  );
}
