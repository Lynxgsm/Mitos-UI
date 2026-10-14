import { useState } from "react";
import { Button, Card, Input } from "@omni/core/react";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  return (
    <div style={{ width: "100%", maxWidth: "24rem" }}>
      <Card
        title="Reset your password"
        description="We will email you a link to choose a new one."
        footer={<a href="#login" style={{ fontSize: "0.875rem", color: "var(--omni-foreground)" }}>Back to sign in</a>}
      >
        <form
          style={{ display: "grid", gap: "1rem" }}
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
        >
          <Input label="Email" type="email" name="email" autoComplete="email" required />
          <Button type="submit">Send the link</Button>
          {/* announced to screen readers when it appears */}
          <p role="status" style={{ margin: 0, fontSize: "0.875rem", color: "var(--omni-muted-foreground)" }}>
            {sent ? "If an account exists for this email, the link is on its way." : ""}
          </p>
        </form>
      </Card>
    </div>
  );
}
