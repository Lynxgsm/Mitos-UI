import { Switch } from "@omni/core/react";

export default function SwitchDemo() {
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <Switch label="Airplane mode" />
      <Switch label="Wi-Fi" description="Join known networks automatically." defaultChecked />
      <Switch label="Bluetooth" disabled />
    </div>
  );
}
