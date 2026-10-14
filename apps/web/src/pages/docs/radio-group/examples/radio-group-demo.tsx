import { RadioGroup } from "@lynxgsm/omni-ui/react";

export default function RadioGroupDemo() {
  return (
    <RadioGroup
      legend="Plan"
      name="plan"
      defaultValue="pro"
      description="You can change it anytime."
      options={[
        { value: "free", label: "Free" },
        { value: "pro", label: "Pro" },
        { value: "team", label: "Team (sold out)", disabled: true },
      ]}
    />
  );
}
