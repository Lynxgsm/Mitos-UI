<script>
  import { Button, Card, Checkbox, Input, Select, Textarea, toast } from "mitos-ui/svelte";
</script>

<div style="width: 100%; max-width: 32rem">
  <Card title="Contact sales" description="We answer within one business day.">
    <form
      style="display: grid; gap: 1rem"
      onsubmit={(event) => {
        event.preventDefault();
        toast({ title: "Message sent", description: "We will get back to you soon." });
      }}
    >
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem">
        <Input label="Name" name="name" autocomplete="name" required />
        <Input label="Email" type="email" name="email" autocomplete="email" required />
      </div>
      <Select
        label="Topic"
        name="topic"
        placeholder="Choose a topic"
        required
        options={[
          { value: "pricing", label: "Pricing" },
          { value: "demo", label: "Book a demo" },
          { value: "security", label: "Security review" },
        ]}
      />
      <Textarea label="Message" name="message" rows={4} required />
      <Checkbox label="Send me the product newsletter" name="newsletter" />
      <Button type="submit">Send message</Button>
    </form>
  </Card>
</div>
