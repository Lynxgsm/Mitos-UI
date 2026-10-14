import { Button, Card, RadioGroup, Select, toast } from "mitos-ui/react";

export default function Checkout() {
  return (
    <div style={{ width: "100%", maxWidth: "28rem" }}>
      <Card
        title="Order summary"
        description="Mitos UI Pro license"
        footer={
          <Button onClick={() => toast({ title: "Payment confirmed" })}>
            Pay $96.00
          </Button>
        }
      >
        <div style={{ display: "grid", gap: "1.25rem" }}>
          <Select
            label="Seats"
            defaultValue="8"
            options={[
              { value: "4", label: "4 seats" },
              { value: "8", label: "8 seats" },
              { value: "16", label: "16 seats" },
            ]}
          />
          <RadioGroup
            legend="Billing"
            name="checkout-billing"
            defaultValue="yearly"
            options={[
              { value: "monthly", label: "Monthly, $12 per seat" },
              { value: "yearly", label: "Yearly, $10 per seat (save 17%)" },
            ]}
          />
          <dl style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.5rem", margin: 0, fontSize: "0.875rem" }}>
            <dt style={{ color: "var(--mitos-muted-foreground)" }}>Subtotal</dt>
            <dd style={{ margin: 0 }}>$80.00</dd>
            <dt style={{ color: "var(--mitos-muted-foreground)" }}>Tax</dt>
            <dd style={{ margin: 0 }}>$16.00</dd>
            <dt style={{ fontWeight: 600 }}>Total</dt>
            <dd style={{ margin: 0, fontWeight: 600 }}>$96.00</dd>
          </dl>
        </div>
      </Card>
    </div>
  );
}
