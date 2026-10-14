import { Button } from "@lynxgsm/omni-ui/react";

export default function ButtonVariants() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  );
}
