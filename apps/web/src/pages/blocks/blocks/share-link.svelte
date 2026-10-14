<script>
  import { Button, Card, Input, Switch, Tooltip, toast } from "@omni/core/svelte";

  const link = "https://omni.example/p/northwind-q3";
</script>

<div style="width: 100%; max-width: 28rem">
  <Card title="Share this document" description="Anyone with the link can view it.">
    <div style="display: grid; gap: 1rem">
      <div style="display: flex; align-items: flex-end; gap: 0.5rem">
        <div style="flex: 1">
          <Input label="Link" value={link} readonly />
        </div>
        <Tooltip content="Copy the link">
          <Button
            variant="outline"
            aria-label="Copy the link"
            onclick={() => navigator.clipboard.writeText(link).then(() => toast({ title: "Link copied" }))}
          >
            ⧉
          </Button>
        </Tooltip>
      </div>
      <Switch label="Allow comments" checked />
      <Switch label="Allow downloads" />
    </div>
  </Card>
</div>
