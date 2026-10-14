<script>
  import { Badge, Button, ButtonGroup, Card, Select, toast } from "mitos-ui/svelte";
</script>

<div style="width: 100%; max-width: 20rem">
  <Card title="Linen overshirt" description="Relaxed fit, washed linen.">
    <div
      role="img"
      aria-label="Linen overshirt in sand color"
      style="aspect-ratio: 4 / 3; margin-bottom: 1rem; border-radius: var(--mitos-radius-lg); background: linear-gradient(135deg, #e8d9c4, #c9b291)"
    ></div>
    <p style="margin: 0 0 1rem; display: flex; align-items: center; gap: 0.5rem">
      <span style="font-size: 1.25rem; font-weight: 700">$89</span>
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
    <div style="margin-top: 1.5rem">
      <!-- buttons stay direct children of the group so their borders join -->
      <ButtonGroup aria-label="Purchase">
        <Button onclick={() => toast({ title: "Added to cart" })}>Add to cart</Button>
        <Button variant="outline" aria-label="Save for later" onclick={() => toast({ title: "Saved for later" })}>♡</Button>
      </ButtonGroup>
    </div>
  </Card>
</div>
