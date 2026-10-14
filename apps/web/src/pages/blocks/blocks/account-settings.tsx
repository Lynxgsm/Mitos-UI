import { useState } from "react";
import { Button, Dialog, Input, Select, Switch, Tabs, Textarea, toast } from "@omni/core/react";

export default function AccountSettings() {
  const [confirming, setConfirming] = useState(false);
  return (
    <div style={{ width: "100%", maxWidth: "40rem" }}>
      <Tabs
        label="Account settings"
        items={[
          {
            value: "profile",
            label: "Profile",
            content: (
              <div style={{ display: "grid", gap: "1rem" }}>
                <Input label="Display name" defaultValue="Inès Moreau" autoComplete="name" />
                <Select
                  label="Language"
                  defaultValue="en"
                  options={[
                    { value: "en", label: "English" },
                    { value: "fr", label: "Français" },
                    { value: "ja", label: "日本語" },
                  ]}
                />
                <Textarea label="Bio" description="Shown on your public profile." rows={3} />
                <div>
                  <Button onClick={() => toast({ title: "Profile saved" })}>Save profile</Button>
                </div>
              </div>
            ),
          },
          {
            value: "notifications",
            label: "Notifications",
            content: (
              <div style={{ display: "grid", gap: "1rem" }}>
                <Switch label="Product updates" description="New features, once a month." defaultChecked />
                <Switch label="Security alerts" description="Sign-ins from a new device." defaultChecked />
                <Switch label="Marketing emails" />
              </div>
            ),
          },
          {
            value: "danger",
            label: "Danger zone",
            content: (
              <div style={{ display: "grid", gap: "0.75rem", justifyItems: "start" }}>
                <p style={{ margin: 0, color: "var(--omni-muted-foreground)" }}>
                  Deleting your account removes every project and cannot be undone.
                </p>
                <Button variant="destructive" onClick={() => setConfirming(true)}>
                  Delete account
                </Button>
              </div>
            ),
          },
        ]}
      />
      <Dialog
        alert
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Delete your account?"
        description="Every project and theme is removed for good."
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirming(false);
                toast({ title: "Account deletion requested", variant: "destructive" });
              }}
            >
              Delete account
            </Button>
          </>
        }
      />
    </div>
  );
}
