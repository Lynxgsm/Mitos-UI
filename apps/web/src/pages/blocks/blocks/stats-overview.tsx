import { Badge, Card } from "@omni/core/react";

const STATS = [
  { label: "Revenue", value: "$48,290", change: "+12.4%", up: true },
  { label: "Active users", value: "2,814", change: "+3.1%", up: true },
  { label: "Churn", value: "1.9%", change: "−0.4 pt", up: true },
  { label: "Open tickets", value: "37", change: "+9", up: false },
];

export default function StatsOverview() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))", gap: "1rem", width: "100%" }}>
      {STATS.map((stat) => (
        <Card key={stat.label} title={stat.label}>
          <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>{stat.value}</p>
          <p style={{ margin: "0.5rem 0 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {/* the trend is written out: the badge color is not the only cue */}
            <Badge variant={stat.up ? "secondary" : "destructive"}>{stat.change}</Badge>
            <span style={{ fontSize: "0.8125rem", color: "var(--omni-muted-foreground)" }}>vs last month</span>
          </p>
        </Card>
      ))}
    </div>
  );
}
