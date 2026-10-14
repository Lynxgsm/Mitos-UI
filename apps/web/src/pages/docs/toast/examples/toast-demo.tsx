import { Button, toast } from "mitos-ui/react";

export default function ToastDemo() {
  return (
    <Button variant="outline" onClick={() => toast({ title: "Changes saved", description: "Your profile is up to date." })}>
      Show toast
    </Button>
  );
}
