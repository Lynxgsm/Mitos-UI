import { SegmentedControl } from "mitos-ui/react";

export default function SegmentedControlDemo() {
  return (
    <SegmentedControl
      legend="Show"
      hideLegend
      name="kind"
      defaultValue="all"
      options={[
        { value: "all", label: "All" },
        { value: "library", label: "Libraries" },
        { value: "tool", label: "Tools" },
        { value: "article", label: "Articles" },
      ]}
    />
  );
}
