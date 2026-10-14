import { Accordion } from "@omni/core/react";

export default function AccordionDisabled() {
  return (
    <Accordion
      aria-label="Account"
      class="docs-example-accordion"
      items={[
        { title: "Profile", content: "Name, avatar and bio." },
        { title: "Billing (admins only)", content: "Invoices and payment methods.", disabled: true },
        { title: "Security", content: "Password and two-factor authentication." },
      ]}
    />
  );
}
