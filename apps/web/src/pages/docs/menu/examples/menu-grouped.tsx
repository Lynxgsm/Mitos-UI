import { Menu, toast } from "mitos-ui/react";

const icon = (path: string) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d={path} />
  </svg>
);

export default function MenuGrouped() {
  // icon-only trigger: aria-label names the button and the menu
  return (
    <Menu
      icon
      variant="ghost"
      aria-label="Actions for Zod"
      label={icon("M5 12h.01M12 12h.01M19 12h.01")}
      align="end"
      items={[
        { label: "Watch major versions", icon: icon("M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"), onSelect: () => toast({ title: "Watching" }) },
        {
          title: "Collections",
          items: [
            { label: "Add to Reading list", onSelect: () => toast({ title: "Added" }) },
            { label: "Remove from API toolkit", onSelect: () => toast({ title: "Removed" }) },
          ],
        },
        { label: "Remove from the knowledge base", destructive: true, onSelect: () => toast({ title: "Removed", variant: "destructive" }) },
      ]}
    />
  );
}
