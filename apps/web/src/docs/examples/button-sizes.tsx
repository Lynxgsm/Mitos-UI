import { Button } from "@omni/core/react";

const SIZES = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"] as const;

export default function ButtonSizes() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem" }}>
      {SIZES.map((size) => (
        <Button key={size} size={size} variant="outline">
          {size}
        </Button>
      ))}
    </div>
  );
}
