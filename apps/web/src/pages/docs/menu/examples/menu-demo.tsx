import { Menu, toast } from "mitos-ui/react";

export default function MenuDemo() {
  return (
    <Menu
      label="Actions"
      items={[
        { label: "Edit", onSelect: () => toast({ title: "Edit" }) },
        { label: "Duplicate", onSelect: () => toast({ title: "Duplicated" }) },
        { label: "Archive", onSelect: () => toast({ title: "Archived" }), disabled: true },
        { label: "Delete", onSelect: () => toast({ title: "Deleted", variant: "destructive" }) },
      ]}
    />
  );
}
