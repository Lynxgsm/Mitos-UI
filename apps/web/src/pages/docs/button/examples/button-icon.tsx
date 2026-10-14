import { Button } from "mitos-ui/react";

export default function ButtonIcon() {
  // icon-only buttons have no visible text: aria-label gives them an accessible name
  return (
    <Button variant="outline" size="sm" aria-label="Add item">
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </Button>
  );
}
