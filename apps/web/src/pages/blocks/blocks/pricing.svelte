<script>
  import { Badge, Button, ButtonGroup, Card } from "mitos-ui/svelte";

  const plans = [
    { name: "Starter", monthly: 0, description: "For trying things out.", features: ["1 project", "Community support"] },
    { name: "Pro", monthly: 12, description: "For growing teams.", features: ["Unlimited projects", "Shared themes", "Email support"], popular: true },
    { name: "Enterprise", monthly: 49, description: "For large organizations.", features: ["SSO and audit log", "Priority support", "Custom contract"] },
  ];

  let yearly = $state(false);
</script>

<div style="display: grid; gap: 1.5rem; justify-items: center; width: 100%">
  <!-- toggle buttons: aria-pressed tells which billing period is shown -->
  <ButtonGroup aria-label="Billing period">
    <Button variant={yearly ? "outline" : "secondary"} aria-pressed={!yearly} onclick={() => (yearly = false)}>Monthly</Button>
    <Button variant={yearly ? "secondary" : "outline"} aria-pressed={yearly} onclick={() => (yearly = true)}>
      Yearly (2 months free)
    </Button>
  </ButtonGroup>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: 1rem; width: 100%">
    {#each plans as plan (plan.name)}
      <Card title={plan.name} description={plan.description}>
        <p style="margin: 0; display: flex; align-items: baseline; gap: 0.5rem">
          <span style="font-size: 2rem; font-weight: 700">${yearly ? plan.monthly * 10 : plan.monthly}</span>
          <span style="color: var(--mitos-muted-foreground)">/ {yearly ? "year" : "month"}</span>
          {#if plan.popular}<Badge>Popular</Badge>{/if}
        </p>
        <ul style="margin: 1rem 0 1.5rem; padding-inline-start: 1.1rem; display: grid; gap: 0.35rem; font-size: 0.875rem">
          {#each plan.features as feature (feature)}
            <li>{feature}</li>
          {/each}
        </ul>
        <Button variant={plan.popular ? "default" : "outline"}>Choose {plan.name}</Button>
      </Card>
    {/each}
  </div>
</div>
