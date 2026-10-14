import { Select } from "mitos-ui/react";

export default function SelectDemo() {
  return (
    <Select
      label="Country"
      placeholder="Choose a country"
      options={[
        { value: "fr", label: "France" },
        { value: "gh", label: "Ghana" },
        { value: "jp", label: "Japan" },
      ]}
      class="docs-example-field"
    />
  );
}
