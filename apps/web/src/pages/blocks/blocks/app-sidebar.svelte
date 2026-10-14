<script>
  import { Avatar, Badge, SideNav } from "mitos-ui/svelte";

  const sections = {
    "#overview": "Overview",
    "#projects": "Projects",
    "#reports": "Reports",
    "#members": "Members",
    "#billing": "Billing",
  };

  let current = $state("#projects");
</script>

<div
  style="display: grid; grid-template-columns: 13rem minmax(0, 1fr); width: 100%; min-height: 20rem; border: 1px solid var(--mitos-border); border-radius: var(--mitos-radius-xl); overflow: hidden; background: var(--mitos-background)"
>
  <div style="display: grid; align-content: space-between; gap: 1.5rem; padding: 1rem; border-inline-end: 1px solid var(--mitos-border)">
    <SideNav
      label="Workspace"
      currentHref={current}
      onNavigate={(href) => (current = href)}
      groups={[
        { items: [{ label: "Overview", href: "#overview" }, { label: "Projects", href: "#projects" }, { label: "Reports", href: "#reports" }] },
        { title: "Settings", items: [{ label: "Members", href: "#members" }, { label: "Billing", href: "#billing" }] },
      ]}
    />
    <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem">
      <!-- the name is written next to it: decorative avatar -->
      <Avatar alt="" fallback="IM" size="sm" />
      <span>Inès Moreau</span>
    </div>
  </div>
  <div style="padding: 1.5rem">
    <h3 style="margin: 0; display: flex; align-items: center; gap: 0.5rem">
      {sections[current]}
      <Badge variant="secondary">Northwind</Badge>
    </h3>
    <p style="margin: 0.5rem 0 0; color: var(--mitos-muted-foreground)">The content of the selected section.</p>
  </div>
</div>
