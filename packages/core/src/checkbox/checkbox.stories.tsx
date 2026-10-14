/** @jsxImportSource react */
// Stories render the compiled React output (`mitosis build` first), like the tests.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import Checkbox from "@/checkbox/checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: { label: "Accept the terms", onChange: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Indeterminate: Story = { args: { label: "Select all", indeterminate: true } };
export const WithDescription: Story = { args: { description: "We only email about your account." } };
export const WithError: Story = { args: { required: true, error: "Accept the terms to continue." } };
export const Disabled: Story = { args: { disabled: true } };
