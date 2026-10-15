import { Combobox } from "mitos-ui/react";

export default function ComboboxDemo() {
  return (
    <Combobox
      label="Framework"
      placeholder="Search a framework"
      options={[
        { value: "react", label: "React" },
        { value: "svelte", label: "Svelte" },
        { value: "vue", label: "Vue" },
        { value: "solid", label: "Solid" },
        { value: "angular", label: "Angular" },
        { value: "qwik", label: "Qwik" },
      ]}
      class="docs-example-field"
    />
  );
}
