import { Button, Card } from "@lynxgsm/omni-ui/react";

export default function CardDemo() {
  return (
    <div style={{ width: "100%", maxWidth: "24rem" }}>
      <Card
        title="Team plan"
        description="Billed monthly, cancel anytime."
        footer={
          <>
            <Button>Upgrade</Button>
            <Button variant="ghost">Compare plans</Button>
          </>
        }
      >
        <p style={{ margin: 0 }}>Up to 10 seats, shared themes and priority support.</p>
      </Card>
    </div>
  );
}
