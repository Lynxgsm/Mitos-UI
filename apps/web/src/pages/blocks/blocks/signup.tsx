import { Button, Card, Checkbox, Input } from "@lynxgsm/omni-ui/react";

export default function Signup() {
  return (
    <div style={{ width: "100%", maxWidth: "26rem" }}>
      <Card title="Create your account" description="Free for 14 days. No card required.">
        <form style={{ display: "grid", gap: "1rem" }} onSubmit={(event) => event.preventDefault()}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <Input label="First name" name="given-name" autoComplete="given-name" required />
            <Input label="Last name" name="family-name" autoComplete="family-name" required />
          </div>
          <Input label="Work email" type="email" name="email" autoComplete="email" required />
          <Input
            label="Password"
            type="password"
            name="password"
            autoComplete="new-password"
            minLength={12}
            description="At least 12 characters."
            required
          />
          <Checkbox label="I accept the terms of service" name="terms" required />
          <Button type="submit">Create account</Button>
        </form>
      </Card>
    </div>
  );
}
