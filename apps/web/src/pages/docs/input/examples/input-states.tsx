import { Input } from "mitos-ui/react";

export default function InputStates() {
  return (
    <div style={{ display: "grid", gap: "1.25rem", width: "100%", maxWidth: "22rem" }}>
      <Input label="Username" description="Letters, numbers and dashes." />
      <Input label="Email" type="email" required />
      <Input label="Website" type="url" defaultValue="northwind" error="Enter a full address, like https://northwind.io." />
      <Input label="Plan" defaultValue="Pro" disabled />
    </div>
  );
}
