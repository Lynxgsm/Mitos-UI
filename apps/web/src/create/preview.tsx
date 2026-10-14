import { Accordion, Button } from "@omni/core/react";

const VARIANTS = ["default", "secondary", "outline", "ghost", "link", "destructive"] as const;
const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

const MEMBERS = [
  { name: "Inès Moreau", email: "ines@northwind.io", role: "Owner" },
  { name: "Kwame Asante", email: "kwame@northwind.io", role: "Editor" },
  { name: "Hana Kobayashi", email: "hana@northwind.io", role: "Viewer" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

// Realistic compositions built only from library components and --omni-* tokens.
export function Preview() {
  return (
    <div className="create-canvas">
      <section className="create-card" aria-labelledby="preview-buttons">
        <h3 id="preview-buttons">Buttons</h3>
        <div className="create-row">
          {VARIANTS.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant[0]!.toUpperCase() + variant.slice(1)}
            </Button>
          ))}
        </div>
        <div className="create-row create-row-center">
          {SIZES.map((size) => (
            <Button key={size} size={size} variant="outline">
              {size}
            </Button>
          ))}
        </div>
      </section>

      <section className="create-card" aria-labelledby="preview-plan">
        <h3 id="preview-plan">Upgrade to Pro</h3>
        <p className="create-muted">Unlimited projects, shared themes and priority support.</p>
        <p className="create-price">
          $12<span> / month</span>
        </p>
        <div className="create-row">
          <Button>Upgrade</Button>
          <Button variant="outline">Compare plans</Button>
        </div>
      </section>

      <section className="create-card" aria-labelledby="preview-notifications">
        <h3 id="preview-notifications">Notification settings</h3>
        <Accordion
          aria-labelledby="preview-notifications"
          multiple
          defaultOpen={[0]}
          items={[
            { title: "Email", content: "A weekly digest and security alerts." },
            { title: "Push", content: "Mentions and direct messages only." },
            { title: "SMS", content: "Two-factor codes. Cannot be disabled.", disabled: true },
          ]}
        />
      </section>

      <section className="create-card" aria-labelledby="preview-team">
        <h3 id="preview-team">Team members</h3>
        <ul className="create-members">
          {MEMBERS.map((member) => (
            <li key={member.email}>
              <span aria-hidden="true" className="create-avatar">
                {initials(member.name)}
              </span>
              <span className="create-member">
                <span>{member.name}</span>
                <span className="create-muted">{member.email}</span>
              </span>
              <span className="create-muted">{member.role}</span>
            </li>
          ))}
        </ul>
        <Button variant="secondary" size="sm">
          Invite people
        </Button>
      </section>

      <section className="create-card" aria-labelledby="preview-danger">
        <h3 id="preview-danger">Delete project</h3>
        <p className="create-muted">
          This removes the project, its themes and every published version. You cannot undo it.
        </p>
        <div className="create-row">
          <Button variant="destructive">Delete project</Button>
          <Button variant="ghost">Cancel</Button>
        </div>
      </section>

      <section className="create-card" aria-labelledby="preview-type">
        <h3 id="preview-type">Typography</h3>
        <p className="create-display">The quick brown fox</p>
        <p className="create-muted">
          Body text uses the foreground token; secondary text uses muted-foreground and still reaches 4.5:1.
        </p>
        <Button variant="link">Read the theming guide</Button>
      </section>
    </div>
  );
}
