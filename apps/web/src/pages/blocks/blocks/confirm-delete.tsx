import { useState } from "react";
import { Button, Dialog, Input, toast } from "@omni/core/react";

export default function ConfirmDelete() {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const close = () => {
    setOpen(false);
    setTyped("");
  };
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      <Dialog
        alert
        open={open}
        onClose={close}
        title="Delete “Northwind website”?"
        description="The project, its themes and every published version are removed. This cannot be undone."
        footer={
          <>
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={typed !== "northwind"}
              onClick={() => {
                close();
                toast({ title: "Project deleted", variant: "destructive" });
              }}
            >
              Delete project
            </Button>
          </>
        }
      >
        <Input
          label="Type northwind to confirm"
          autoComplete="off"
          value={typed}
          onChange={(event) => setTyped(event.currentTarget.value)}
        />
      </Dialog>
    </>
  );
}
