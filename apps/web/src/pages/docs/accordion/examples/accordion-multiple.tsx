import { Accordion } from "mitos-ui/react";

export default function AccordionMultiple() {
  return (
    <Accordion
      aria-label="Notification settings"
      class="docs-example-accordion"
      multiple
      defaultOpen={[0, 1]}
      items={[
        { title: "Email notifications", content: "Weekly digest and security alerts." },
        { title: "Push notifications", content: "Mentions and direct messages." },
        { title: "SMS notifications", content: "Two-factor authentication codes only." },
      ]}
    />
  );
}
