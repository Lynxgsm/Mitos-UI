import { SegmentedControl } from "mitos-ui/react";

const icon = (path: string) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d={path} />
  </svg>
);

export default function SegmentedControlIcons() {
  // hideLabel keeps the label as the name of each option and shows it as a tooltip
  return (
    <SegmentedControl
      legend="View"
      hideLegend
      name="view"
      defaultValue="grid"
      options={[
        { value: "grid", label: "Grid view", icon: icon("M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"), hideLabel: true },
        { value: "list", label: "List view", icon: icon("M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"), hideLabel: true },
      ]}
    />
  );
}
