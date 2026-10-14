import { Fieldset, Input, Select } from "mitos-ui/react";

export default function FieldsetDemo() {
  return (
    <Fieldset legend="Shipping address" description="Where we send your order." class="docs-example-field">
      <Input label="Street" autoComplete="street-address" />
      <Input label="City" autoComplete="address-level2" />
      <Select label="Country" options={[{ value: "fr", label: "France" }, { value: "jp", label: "Japan" }]} />
    </Fieldset>
  );
}
