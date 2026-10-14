<script>
  import { Button, Card, Checkbox, Input } from "mitos-ui/svelte";
</script>

<div style="width: 100%; max-width: 26rem">
  <Card title="Create your account" description="Free for 14 days. No card required.">
    <form style="display: grid; gap: 1rem" onsubmit={(event) => event.preventDefault()}>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem">
        <Input label="First name" name="given-name" autocomplete="given-name" required />
        <Input label="Last name" name="family-name" autocomplete="family-name" required />
      </div>
      <Input label="Work email" type="email" name="email" autocomplete="email" required />
      <Input
        label="Password"
        type="password"
        name="password"
        autocomplete="new-password"
        minlength={12}
        description="At least 12 characters."
        required
      />
      <Checkbox label="I accept the terms of service" name="terms" required />
      <Button type="submit">Create account</Button>
    </form>
  </Card>
</div>
