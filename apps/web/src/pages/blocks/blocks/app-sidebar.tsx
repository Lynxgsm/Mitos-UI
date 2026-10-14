import { useState } from "react";
import { Avatar, Badge, SideNav } from "@omni/core/react";

const SECTIONS = {
  "#overview": "Overview",
  "#projects": "Projects",
  "#reports": "Reports",
  "#members": "Members",
  "#billing": "Billing",
};

export default function AppSidebar() {
  const [current, setCurrent] = useState("#projects");
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "13rem minmax(0, 1fr)",
        width: "100%",
        minHeight: "20rem",
        border: "1px solid var(--omni-border)",
        borderRadius: "var(--omni-radius-xl)",
        overflow: "hidden",
        background: "var(--omni-background)",
      }}
    >
      <div style={{ display: "grid", alignContent: "space-between", gap: "1.5rem", padding: "1rem", borderInlineEnd: "1px solid var(--omni-border)" }}>
        <SideNav
          label="Workspace"
          currentHref={current}
          onNavigate={(href) => setCurrent(href)}
          groups={[
            { items: [{ label: "Overview", href: "#overview" }, { label: "Projects", href: "#projects" }, { label: "Reports", href: "#reports" }] },
            { title: "Settings", items: [{ label: "Members", href: "#members" }, { label: "Billing", href: "#billing" }] },
          ]}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
          {/* the name is written next to it: decorative avatar */}
          <Avatar alt="" fallback="IM" size="sm" />
          <span>Inès Moreau</span>
        </div>
      </div>
      <div style={{ padding: "1.5rem" }}>
        <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {SECTIONS[current as keyof typeof SECTIONS]}
          <Badge variant="secondary">Northwind</Badge>
        </h3>
        <p style={{ margin: "0.5rem 0 0", color: "var(--omni-muted-foreground)" }}>The content of the selected section.</p>
      </div>
    </div>
  );
}
