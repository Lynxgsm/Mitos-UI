import { useState } from "react";
import { Button, Dialog } from "mitos-ui/react";

export default function DialogAlert() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      {/* alert: role="alertdialog", no close button; put the least destructive action first */}
      <Dialog
        alert
        open={open}
        onClose={() => setOpen(false)}
        title="Delete project?"
        description="This permanently removes the project and its themes. You cannot undo it."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setOpen(false)}>
              Delete project
            </Button>
          </>
        }
      />
    </>
  );
}
