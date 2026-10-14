import { Textarea } from "@lynxgsm/omni-ui/react";

export default function TextareaDemo() {
  return (
    <Textarea
      label="Bio"
      description="Shown on your public profile. 160 characters max."
      maxLength={160}
      class="docs-example-field"
    />
  );
}
