<script>
  import { Badge, Card } from "@lynxgsm/omni-ui/svelte";

  const stats = [
    { label: "Revenue", value: "$48,290", change: "+12.4%", up: true },
    { label: "Active users", value: "2,814", change: "+3.1%", up: true },
    { label: "Churn", value: "1.9%", change: "−0.4 pt", up: true },
    { label: "Open tickets", value: "37", change: "+9", up: false },
  ];
</script>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr)); gap: 1rem; width: 100%">
  {#each stats as stat (stat.label)}
    <Card title={stat.label}>
      <p style="margin: 0; font-size: 1.75rem; font-weight: 700; letter-spacing: -0.02em">{stat.value}</p>
      <p style="margin: 0.5rem 0 0; display: flex; align-items: center; gap: 0.5rem">
        <!-- the trend is written out: the badge color is not the only cue -->
        <Badge variant={stat.up ? "secondary" : "destructive"}>{stat.change}</Badge>
        <span style="font-size: 0.8125rem; color: var(--omni-muted-foreground)">vs last month</span>
      </p>
    </Card>
  {/each}
</div>
