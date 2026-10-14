import { Button, Tooltip } from "@omni/core/react";

export default function TooltipDemo() {
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Tooltip content="Copy to clipboard">
        <Button variant="outline" aria-label="Copy">
          ⧉
        </Button>
      </Tooltip>
      <Tooltip content="Visible to everyone with the link" side="bottom">
        <Button variant="outline">Share</Button>
      </Tooltip>
    </div>
  );
}
