/** @jsxImportSource react */
// Stories render the compiled React output (`mitosis build` first), like the tests.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import SegmentedControl from "@/segmented-control/segmented-control";

const meta = {
  title: "Components/SegmentedControl",
  component: SegmentedControl,
  args: {
    legend: "Show",
    hideLegend: true,
    name: "kind",
    defaultValue: "all",
    onValueChange: fn(),
    options: [
      { value: "all", label: "All" },
      { value: "library", label: "Libraries" },
      { value: "tool", label: "Tools" },
      { value: "article", label: "Articles" },
    ],
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const VisibleLegend: Story = { args: { hideLegend: false } };
export const IconsOnly: Story = {
  args: {
    legend: "View",
    name: "view",
    defaultValue: "grid",
    options: [
      { value: "grid", label: "Grid view", icon: "▦", hideLabel: true },
      { value: "list", label: "List view", icon: "≡", hideLabel: true },
    ],
  },
};
export const Disabled: Story = { args: { disabled: true } };
