import { Badge, Button, ButtonGroup, Card, Select, toast } from "@lynxgsm/omni-ui/react";

export default function ProductCard() {
  return (
    <div style={{ width: "100%", maxWidth: "20rem" }}>
      <Card
        title="Linen overshirt"
        description="Relaxed fit, washed linen."
        footer={
          <ButtonGroup aria-label="Purchase">
            <Button onClick={() => toast({ title: "Added to cart" })}>Add to cart</Button>
            {/* buttons stay direct children of the group so their borders join */}
            <Button variant="outline" aria-label="Save for later" onClick={() => toast({ title: "Saved for later" })}>
              ♡
            </Button>
          </ButtonGroup>
        }
      >
        <div
          role="img"
          aria-label="Linen overshirt in sand color"
          style={{
            aspectRatio: "4 / 3",
            marginBottom: "1rem",
            borderRadius: "var(--omni-radius-lg)",
            background: "linear-gradient(135deg, #e8d9c4, #c9b291)",
          }}
        />
        <p style={{ margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.25rem", fontWeight: 700 }}>$89</span>
          <Badge variant="secondary">New</Badge>
        </p>
        <Select
          label="Size"
          placeholder="Choose a size"
          options={[
            { value: "s", label: "S" },
            { value: "m", label: "M" },
            { value: "l", label: "L" },
            { value: "xl", label: "XL", disabled: true },
          ]}
        />
      </Card>
    </div>
  );
}
