import { useState } from "react";
import { SideNav } from "@omni/core/react";

export default function SideNavDemo() {
  const [current, setCurrent] = useState("#profile");
  return (
    <div style={{ width: "14rem" }}>
      <SideNav
        label="Settings"
        currentHref={current}
        onNavigate={(href) => setCurrent(href)}
        groups={[
          { title: "Account", items: [{ label: "Profile", href: "#profile" }, { label: "Security", href: "#security" }] },
          { title: "Workspace", items: [{ label: "Members", href: "#members" }, { label: "Billing", href: "#billing" }] },
        ]}
      />
    </div>
  );
}
