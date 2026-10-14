import { Button, Card, Checkbox, Input } from "@lynxgsm/omni-ui/react";

export default function Login() {
  return (
    <div style={{ width: "100%", maxWidth: "24rem" }}>
      <Card
        title="Sign in"
        description="Welcome back. Enter your email to continue."
        footer={
          <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--omni-muted-foreground)" }}>
            No account yet? <a href="#signup" style={{ color: "var(--omni-foreground)" }}>Create one</a>
          </p>
        }
      >
        <form style={{ display: "grid", gap: "1rem" }} onSubmit={(event) => event.preventDefault()}>
          <Input label="Email" type="email" name="email" autoComplete="email" required />
          <Input label="Password" type="password" name="password" autoComplete="current-password" required />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
            <Checkbox label="Remember me" name="remember" />
            <a href="#forgot" style={{ fontSize: "0.875rem", color: "var(--omni-foreground)" }}>
              Forgot password?
            </a>
          </div>
          <Button type="submit">Sign in</Button>
        </form>
      </Card>
    </div>
  );
}
