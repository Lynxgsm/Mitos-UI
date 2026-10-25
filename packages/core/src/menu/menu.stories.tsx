/** @jsxImportSource react */
// Stories render the compiled React output (`mitosis build` first), like the tests.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import Menu from "@/menu/menu";

const meta = {
  title: "Components/Menu",
  component: Menu,
  args: {
    label: "Actions",
    items: [
      { label: "Edit", onSelect: fn() },
      { label: "Duplicate", onSelect: fn() },
      { label: "Archive", onSelect: fn(), disabled: true },
      { label: "Delete", onSelect: fn() },
    ],
  },
  argTypes: {
    align: { control: "inline-radio", options: ["start", "end"] },
  },
  decorators: [(Story) => <div style={{ minHeight: "14rem" }}>{Story()}</div>],
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const AlignEnd: Story = { args: { align: "end" } };
export const Disabled: Story = { args: { disabled: true } };
export const GroupedWithIconTrigger: Story = {
  args: {
    icon: true,
    variant: "ghost",
    label: "⋯",
    "aria-label": "Actions for Zod",
    items: [
      { label: "Watch major versions", icon: "◉", onSelect: fn() },
      { title: "Collections", items: [{ label: "Add to Reading list", onSelect: fn() }] },
      { label: "Remove", destructive: true, onSelect: fn() },
    ],
  },
};
