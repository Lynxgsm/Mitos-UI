import { Avatar, Badge, Button, Card, Menu, Tooltip, toast } from "mitos-ui/react";

const MEMBERS = [
  { name: "Inès Moreau", email: "ines@northwind.io", role: "Owner" },
  { name: "Kwame Asante", email: "kwame@northwind.io", role: "Editor" },
  { name: "Hana Kobayashi", email: "hana@northwind.io", role: "Viewer" },
  { name: "Lucas Ferreira", email: "lucas@northwind.io", role: "Viewer" },
];

const ELLIPSIS = { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } as const;

export default function TeamMembers() {
  return (
    <div style={{ width: "100%", maxWidth: "36rem" }}>
      <Card
        title="Team members"
        description="4 of 10 seats used."
        footer={
          <Tooltip content="Invites expire after 7 days">
            <Button onClick={() => toast({ title: "Invitation sent" })}>Invite people</Button>
          </Tooltip>
        }
      >
        <ul style={{ display: "grid", gap: "0.75rem", margin: 0, padding: 0, listStyle: "none" }}>
          {MEMBERS.map((member) => (
            <li key={member.email} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {/* the name is written next to it: decorative avatar */}
              <Avatar alt="" fallback={member.name.split(" ").map((part) => part[0]).join("")} size="sm" />
              <span style={{ display: "grid", flex: 1, minWidth: 0, fontSize: "0.875rem" }}>
                {/* long names and emails are cut, not pushed out of narrow screens */}
                <span style={ELLIPSIS}>{member.name}</span>
                <span style={{ ...ELLIPSIS, color: "var(--mitos-muted-foreground)" }}>{member.email}</span>
              </span>
              <Badge variant={member.role === "Owner" ? "default" : "outline"}>{member.role}</Badge>
              <Menu
                label="Manage"
                aria-label={`Manage ${member.name}`}
                align="end"
                items={[
                  { label: "Make editor", onSelect: () => toast({ title: `${member.name} is now an editor` }) },
                  { label: "Resend invite", onSelect: () => toast({ title: "Invite sent again" }) },
                  { label: "Remove", onSelect: () => toast({ title: `${member.name} removed`, variant: "destructive" }), disabled: member.role === "Owner" },
                ]}
              />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
