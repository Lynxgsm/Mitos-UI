<script>
  import { Button, Card, Checkbox, Input } from "@omni/core/svelte";
</script>

<div style="width: 100%; max-width: 24rem">
  <Card title="Sign in" description="Welcome back. Enter your email to continue.">
    <form style="display: grid; gap: 1rem" onsubmit={(event) => event.preventDefault()}>
      <Input label="Email" type="email" name="email" autocomplete="email" required />
      <Input label="Password" type="password" name="password" autocomplete="current-password" required />
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem">
        <Checkbox label="Remember me" name="remember" />
        <a href="#forgot" style="font-size: 0.875rem; color: var(--omni-foreground)">Forgot password?</a>
      </div>
      <Button type="submit">Sign in</Button>
      <p style="margin: 0; font-size: 0.875rem; color: var(--omni-muted-foreground)">
        No account yet? <a href="#signup" style="color: var(--omni-foreground)">Create one</a>
      </p>
    </form>
  </Card>
</div>
