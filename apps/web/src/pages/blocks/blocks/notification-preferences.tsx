import { useState } from "react";
import { Button, Card, Fieldset, RadioGroup, Slider, Switch, toast } from "@lynxgsm/omni-ui/react";

export default function NotificationPreferences() {
  const [volume, setVolume] = useState(60);
  return (
    <div style={{ width: "100%", maxWidth: "30rem" }}>
      <Card
        title="Notifications"
        description="Choose what reaches you, and how."
        footer={<Button onClick={() => toast({ title: "Preferences saved" })}>Save preferences</Button>}
      >
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <Fieldset legend="Channels">
            <Switch label="Email" defaultChecked />
            <Switch label="Push" description="Mentions and direct messages only." />
            <Switch label="SMS" />
          </Fieldset>
          <RadioGroup
            legend="Weekly digest"
            name="digest"
            defaultValue="monday"
            options={[
              { value: "monday", label: "Monday morning" },
              { value: "friday", label: "Friday afternoon" },
              { value: "never", label: "Never" },
            ]}
          />
          <Slider
            label={`Sound volume: ${volume}%`}
            defaultValue={volume}
            aria-valuetext={`${volume} percent`}
            onInput={(event) => setVolume(Number(event.currentTarget.value))}
          />
        </div>
      </Card>
    </div>
  );
}
