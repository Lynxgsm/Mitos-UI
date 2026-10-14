<script>
  import { Button, Dialog, Fieldset, Input, Select, Switch, Textarea, toast } from "mitos-ui/svelte";

  let confirming = $state(false);
</script>

<!-- In Svelte, tab panels take text: the three sections are fieldsets on one page instead of tabs -->
<div style="display: grid; gap: 2rem; width: 100%; max-width: 40rem">
  <Fieldset legend="Profile">
    <Input label="Display name" value="Inès Moreau" autocomplete="name" />
    <Select
      label="Language"
      value="en"
      options={[
        { value: "en", label: "English" },
        { value: "fr", label: "Français" },
        { value: "ja", label: "日本語" },
      ]}
    />
    <Textarea label="Bio" description="Shown on your public profile." rows={3} />
    <div>
      <Button onclick={() => toast({ title: "Profile saved" })}>Save profile</Button>
    </div>
  </Fieldset>

  <Fieldset legend="Notifications">
    <Switch label="Product updates" description="New features, once a month." checked />
    <Switch label="Security alerts" description="Sign-ins from a new device." checked />
    <Switch label="Marketing emails" />
  </Fieldset>

  <Fieldset legend="Danger zone" description="Deleting your account removes every project and cannot be undone.">
    <div>
      <Button variant="destructive" onclick={() => (confirming = true)}>Delete account</Button>
    </div>
  </Fieldset>
</div>

<Dialog
  alert
  open={confirming}
  onClose={() => (confirming = false)}
  title="Delete your account?"
  description="Every project and theme is removed for good."
>
  <div style="display: flex; justify-content: flex-end; gap: 0.5rem">
    <Button variant="outline" onclick={() => (confirming = false)}>Cancel</Button>
    <Button
      variant="destructive"
      onclick={() => {
        confirming = false;
        toast({ title: "Account deletion requested", variant: "destructive" });
      }}
    >
      Delete account
    </Button>
  </div>
</Dialog>
