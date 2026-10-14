import { Tabs } from "mitos-ui/react";

export default function TabsDemo() {
  return (
    <div className="docs-example-field">
      <Tabs
        label="Account settings"
        items={[
          { value: "profile", label: "Profile", content: "Your name, photo and bio." },
          { value: "security", label: "Security", content: "Password and two-factor authentication." },
          { value: "billing", label: "Billing", content: "Plan, invoices and payment method." },
        ]}
      />
    </div>
  );
}
