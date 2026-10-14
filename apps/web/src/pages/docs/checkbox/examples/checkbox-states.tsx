import { Checkbox } from "mitos-ui/react";

export default function CheckboxStates() {
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Select all (some selected)" indeterminate />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Accept the terms" required error="Accept the terms to continue." />
    </div>
  );
}
