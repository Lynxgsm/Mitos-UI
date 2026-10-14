import { Input } from "@omni/core/react";

export default function InputTypes() {
  return (
    <div className="docs-example-field" style={{ display: "grid", gap: "1rem" }}>
      <Input label="Start date" type="date" />
      <Input label="Profile picture" type="file" accept="image/*" />
      <Input label="Brand color" type="color" defaultValue="#c45c26" />
    </div>
  );
}
