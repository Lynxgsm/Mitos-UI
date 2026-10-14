<script>
  import { Avatar, Badge, Button, Card, Menu, Tooltip, toast } from "@omni/core/svelte";

  const members = [
    { name: "Inès Moreau", email: "ines@northwind.io", role: "Owner" },
    { name: "Kwame Asante", email: "kwame@northwind.io", role: "Editor" },
    { name: "Hana Kobayashi", email: "hana@northwind.io", role: "Viewer" },
    { name: "Lucas Ferreira", email: "lucas@northwind.io", role: "Viewer" },
  ];
  const initials = (name) => name.split(" ").map((part) => part[0]).join("");
  // long names and emails are cut, not pushed out of narrow screens
  const ellipsis = "overflow: hidden; text-overflow: ellipsis; white-space: nowrap";
</script>

<div style="width: 100%; max-width: 36rem">
  <Card title="Team members" description="4 of 10 seats used.">
    <ul style="display: grid; gap: 0.75rem; margin: 0 0 1.5rem; padding: 0; list-style: none">
      {#each members as member (member.email)}
        <li style="display: flex; align-items: center; gap: 0.75rem">
          <!-- the name is written next to it: decorative avatar -->
          <Avatar alt="" fallback={initials(member.name)} size="sm" />
          <span style="display: grid; flex: 1; min-width: 0; font-size: 0.875rem">
            <span style={ellipsis}>{member.name}</span>
            <span style="{ellipsis}; color: var(--omni-muted-foreground)">{member.email}</span>
          </span>
          <Badge variant={member.role === "Owner" ? "default" : "outline"}>{member.role}</Badge>
          <Menu
            label="Manage"
            aria-label={`Manage ${member.name}`}
            align="end"
            items={[
              { label: "Make editor", onSelect: () => toast({ title: `${member.name} is now an editor` }) },
              { label: "Resend invite", onSelect: () => toast({ title: "Invite sent again" }) },
              {
                label: "Remove",
                onSelect: () => toast({ title: `${member.name} removed`, variant: "destructive" }),
                disabled: member.role === "Owner",
              },
            ]}
          />
        </li>
      {/each}
    </ul>
    <Tooltip content="Invites expire after 7 days">
      <Button onclick={() => toast({ title: "Invitation sent" })}>Invite people</Button>
    </Tooltip>
  </Card>
</div>
