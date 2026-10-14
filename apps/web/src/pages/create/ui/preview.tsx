import {
  Accordion,
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  Input,
  RadioGroup,
  Select,
  Skeleton,
  Slider,
  Switch,
  Textarea,
} from "@omni/core/react";

const VARIANTS = ["default", "secondary", "outline", "ghost", "link", "destructive"] as const;
const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

const MEMBERS = [
  { name: "Inès Moreau", email: "ines@northwind.io", role: "Owner" },
  { name: "Kwame Asante", email: "kwame@northwind.io", role: "Editor" },
  { name: "Hana Kobayashi", email: "hana@northwind.io", role: "Viewer" },
];

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

      <Card
        class="create-card-component"
        title="Upgrade to Pro"
        description="Unlimited projects, shared themes and priority support."
        footer={
          <>
            <Button>Upgrade</Button>
            <Button variant="outline">Compare plans</Button>
          </>
        }
      >
        <div className="create-row create-row-center">
          <p className="create-price">
            $12<span> / month</span>
          </p>
          <Badge>Popular</Badge>
        </div>
      </Card>

      <section className="create-card" aria-labelledby="preview-toolbar">
        <h3 id="preview-toolbar">Editor toolbar</h3>
        <div className="create-row">
          <ButtonGroup aria-label="Text alignment">
            <Button variant="outline">Left</Button>
            <Button variant="outline">Center</Button>
            <Button variant="outline">Right</Button>
          </ButtonGroup>
          <ButtonGroup aria-label="Date range">
            <Button variant="secondary">Day</Button>
            <Button variant="secondary">Week</Button>
            <Button variant="secondary">Month</Button>
          </ButtonGroup>
        </div>
      </section>

      <section className="create-card" aria-labelledby="preview-profile">
        <h3 id="preview-profile">Profile</h3>
        <Input label="Display name" defaultValue="Inès Moreau" />
        <Input label="Email" type="email" defaultValue="ines@northwind" error="Enter a complete email address." />
        <Select
          label="Language"
          defaultValue="en"
          options={[
            { value: "en", label: "English" },
            { value: "fr", label: "Français" },
            { value: "ja", label: "日本語" },
          ]}
        />
        <Textarea label="Bio" description="Shown on your public profile." rows={2} />
        <div className="create-row">
          <Button>Save</Button>
        </div>
      </section>

      <section className="create-card" aria-labelledby="preview-preferences">
        <h3 id="preview-preferences">Preferences</h3>
        <Switch label="Email notifications" defaultChecked />
        <Switch label="Push notifications" description="Mentions and direct messages only." />
        <RadioGroup
          legend="Weekly digest"
          name="preview-digest"
          defaultValue="weekly"
          options={[
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
            { value: "never", label: "Never" },
          ]}
        />
        <Slider label="Notification volume" defaultValue={60} />
        <Checkbox label="Share anonymous usage data" defaultChecked />
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
              {/* the name is written next to it: a decorative avatar, not read twice */}
              <Avatar alt="" fallback={member.name.split(" ").map((part) => part[0]).join("")} size="sm" />
              <span className="create-member">
                <span>{member.name}</span>
                <span className="create-muted">{member.email}</span>
              </span>
              <Badge variant={member.role === "Owner" ? "default" : "outline"}>{member.role}</Badge>
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

      <section className="create-card" aria-labelledby="preview-loading" aria-busy="true">
        <h3 id="preview-loading">Loading activity</h3>
        {[0, 1, 2].map((row) => (
          <div key={row} className="create-row create-row-center">
            <Skeleton class="create-skeleton-avatar" />
            <div className="create-skeleton-lines">
              <Skeleton class="create-skeleton-line" />
              <Skeleton class="create-skeleton-line create-skeleton-short" />
            </div>
          </div>
        ))}
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
