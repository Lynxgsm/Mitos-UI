import { useState } from "react";
import { Badge, Button, ButtonGroup, Card } from "@omni/core/react";

const PLANS = [
  { name: "Starter", monthly: 0, description: "For trying things out.", features: ["1 project", "Community support"] },
  { name: "Pro", monthly: 12, description: "For growing teams.", features: ["Unlimited projects", "Shared themes", "Email support"], popular: true },
  { name: "Enterprise", monthly: 49, description: "For large organizations.", features: ["SSO and audit log", "Priority support", "Custom contract"] },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  return (
    <div style={{ display: "grid", gap: "1.5rem", justifyItems: "center", width: "100%" }}>
      {/* toggle buttons: aria-pressed tells which billing period is shown */}
      <ButtonGroup aria-label="Billing period">
        <Button variant={yearly ? "outline" : "secondary"} aria-pressed={!yearly} onClick={() => setYearly(false)}>
          Monthly
        </Button>
        <Button variant={yearly ? "secondary" : "outline"} aria-pressed={yearly} onClick={() => setYearly(true)}>
          Yearly (2 months free)
        </Button>
      </ButtonGroup>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: "1rem", width: "100%" }}>
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            title={plan.name}
            description={plan.description}
            footer={<Button variant={plan.popular ? "default" : "outline"}>Choose {plan.name}</Button>}
          >
            <p style={{ margin: 0, display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
              <span style={{ fontSize: "2rem", fontWeight: 700 }}>${yearly ? plan.monthly * 10 : plan.monthly}</span>
              <span style={{ color: "var(--omni-muted-foreground)" }}>/ {yearly ? "year" : "month"}</span>
              {plan.popular && <Badge>Popular</Badge>}
            </p>
            <ul style={{ margin: "1rem 0 0", paddingInlineStart: "1.1rem", display: "grid", gap: "0.35rem", fontSize: "0.875rem" }}>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
