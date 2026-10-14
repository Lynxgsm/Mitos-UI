/** @jsxImportSource react */
// Stories render the compiled React output (`mitosis build` first), like the tests.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import Switch from "@/switch/switch";

const meta = {
  title: "Components/Switch",
  component: Switch,
  args: { label: "Airplane mode", onChange: fn() },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const WithDescription: Story = { args: { description: "Turns off every wireless connection." } };
export const Disabled: Story = { args: { disabled: true } };
