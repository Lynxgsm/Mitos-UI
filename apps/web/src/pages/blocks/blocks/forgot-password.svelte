<script>
  import { Button, Card, Input } from "@lynxgsm/omni-ui/svelte";

  let sent = $state(false);
</script>

<div style="width: 100%; max-width: 24rem">
  <Card title="Reset your password" description="We will email you a link to choose a new one.">
    <form
      style="display: grid; gap: 1rem"
      onsubmit={(event) => {
        event.preventDefault();
        sent = true;
      }}
    >
      <Input label="Email" type="email" name="email" autocomplete="email" required />
      <Button type="submit">Send the link</Button>
      <!-- announced to screen readers when it appears -->
      <p role="status" style="margin: 0; font-size: 0.875rem; color: var(--omni-muted-foreground)">
        {sent ? "If an account exists for this email, the link is on its way." : ""}
      </p>
      <a href="#login" style="font-size: 0.875rem; color: var(--omni-foreground)">Back to sign in</a>
    </form>
  </Card>
</div>
