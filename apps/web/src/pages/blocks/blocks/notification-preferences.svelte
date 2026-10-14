<script>
  import { Button, Card, Fieldset, RadioGroup, Slider, Switch, toast } from "@lynxgsm/omni-ui/svelte";

  let volume = $state(60);
</script>

<div style="width: 100%; max-width: 30rem">
  <Card title="Notifications" description="Choose what reaches you, and how.">
    <div style="display: grid; gap: 1.5rem">
      <Fieldset legend="Channels">
        <Switch label="Email" checked />
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
        value={volume}
        aria-valuetext={`${volume} percent`}
        oninput={(event) => (volume = Number(event.currentTarget.value))}
      />
      <div>
        <Button onclick={() => toast({ title: "Preferences saved" })}>Save preferences</Button>
      </div>
    </div>
  </Card>
</div>
