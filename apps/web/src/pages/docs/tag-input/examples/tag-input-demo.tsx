import { TagInput } from "mitos-ui/react";

export default function TagInputDemo() {
  return (
    <div style={{ maxWidth: "28rem" }}>
      <TagInput
        label="Personal tags"
        name="tags"
        placeholder="Add a tag"
        description="Press Enter or type a comma to add."
        defaultValue={["forms", "api-input"]}
      />
    </div>
  );
}
