import { Accordion } from "@lynxgsm/omni-ui/react";

export default function AccordionDemo() {
  return (
    <Accordion
      aria-label="Shipping FAQ"
      class="docs-example-accordion"
      items={[
        { title: "What are your shipping options?", content: "Standard (3–5 days) and express (1–2 days) delivery." },
        { title: "What is your return policy?", content: "Return any item within 30 days for a full refund." },
        { title: "How can I contact support?", content: "Email us any time; we answer within one business day." },
      ]}
    />
  );
}
