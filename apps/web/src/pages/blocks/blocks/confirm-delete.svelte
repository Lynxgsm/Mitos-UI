<script>
  import { Button, Dialog, Input, toast } from "@lynxgsm/omni-ui/svelte";

  let open = $state(false);
  let typed = $state("");

  function close() {
    open = false;
    typed = "";
  }
</script>

<Button variant="destructive" onclick={() => (open = true)}>Delete project</Button>

<Dialog
  alert
  {open}
  onClose={close}
  title="Delete “Northwind website”?"
  description="The project, its themes and every published version are removed. This cannot be undone."
>
  <div style="display: grid; gap: 1.5rem">
    <Input
      label="Type northwind to confirm"
      autocomplete="off"
      value={typed}
      oninput={(event) => (typed = event.currentTarget.value)}
    />
    <div style="display: flex; justify-content: flex-end; gap: 0.5rem">
      <Button variant="outline" onclick={close}>Cancel</Button>
      <Button
        variant="destructive"
        disabled={typed !== "northwind"}
        onclick={() => {
          close();
          toast({ title: "Project deleted", variant: "destructive" });
        }}
      >
        Delete project
      </Button>
    </div>
  </div>
</Dialog>
