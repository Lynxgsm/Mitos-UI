import { Button, Card, Input, Switch, Tooltip, toast } from "@omni/core/react";

const LINK = "https://omni.example/p/northwind-q3";

export default function ShareLink() {
  return (
    <div style={{ width: "100%", maxWidth: "28rem" }}>
      <Card title="Share this document" description="Anyone with the link can view it.">
        <div style={{ display: "grid", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
            <div style={{ flex: 1 }}>
              <Input label="Link" defaultValue={LINK} readOnly />
            </div>
            <Tooltip content="Copy the link">
              <Button
                variant="outline"
                aria-label="Copy the link"
                onClick={() => navigator.clipboard.writeText(LINK).then(() => toast({ title: "Link copied" }))}
              >
                ⧉
              </Button>
            </Tooltip>
          </div>
          <Switch label="Allow comments" defaultChecked />
          <Switch label="Allow downloads" />
        </div>
      </Card>
    </div>
  );
}
