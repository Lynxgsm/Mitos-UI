import { Button, toast } from "@omni/core/react";

export default function ToastVariants() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
      <Button
        variant="outline"
        onClick={() => toast({ title: "Upload failed", description: "The file is larger than 10 MB.", variant: "destructive" })}
      >
        Destructive
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({ title: "Message archived", action: { label: "Undo", onClick: () => toast({ title: "Message restored" }) } })
        }
      >
        With action
      </Button>
      <Button variant="outline" onClick={() => toast({ title: "You are offline", duration: Infinity })}>
        Persistent
      </Button>
    </div>
  );
}
