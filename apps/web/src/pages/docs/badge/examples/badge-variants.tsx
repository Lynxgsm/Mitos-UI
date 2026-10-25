import { Badge } from "mitos-ui/react";

export default function BadgeVariants() {
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="accent">Accent</Badge>
      <Badge variant="destructive-outline">Destructive outline</Badge>
    </div>
  );
}
