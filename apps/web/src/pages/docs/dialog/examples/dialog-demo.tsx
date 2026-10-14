import { useState } from "react";
import { Button, Dialog, Input } from "@lynxgsm/omni-ui/react";

export default function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Edit profile
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Edit profile"
        description="Changes are saved when you click Save."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </>
        }
      >
        <Input label="Display name" defaultValue="Inès Moreau" autoComplete="name" />
      </Dialog>
    </>
  );
}
