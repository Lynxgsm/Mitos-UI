import { Button } from "@lynxgsm/omni-ui/react";

export default function EmptyState() {
  return (
    <div
      style={{
        display: "grid",
        justifyItems: "center",
        gap: "0.75rem",
        width: "100%",
        maxWidth: "28rem",
        padding: "2.5rem 1.5rem",
        border: "1px dashed var(--omni-border)",
        borderRadius: "var(--omni-radius-xl)",
        textAlign: "center",
      }}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--omni-muted-foreground)" }}>
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
      <h3 style={{ margin: 0, fontSize: "1.125rem" }}>No projects yet</h3>
      <p style={{ margin: 0, color: "var(--omni-muted-foreground)" }}>Create a project to start building your design system.</p>
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
        <Button>Create project</Button>
        <Button variant="outline">Import</Button>
      </div>
    </div>
  );
}
