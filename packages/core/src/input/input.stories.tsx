// Stories render the compiled React output (`mitosis build` first), like the tests.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import Input from "@/input/input";

const meta = {
  title: "Components/Input",
  component: Input,
  args: { label: "Email", placeholder: "ines@northwind.io", onChange: fn() },
  argTypes: {
    type: { control: "select", options: ["text", "email", "password", "search", "tel", "url", "number"] },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDescription: Story = { args: { description: "We only use it to send receipts." } };
export const Required: Story = { args: { required: true } };
export const Invalid: Story = { args: { error: "Enter an email address like name@company.com.", defaultValue: "ines@" } };
export const WithIconAndHint: Story = {
  args: { label: "Search", hideLabel: true, type: "search", placeholder: "Search", startIcon: "⌕", endSlot: "/" },
};
export const Disabled: Story = { args: { disabled: true, defaultValue: "ines@northwind.io" } };
export const Password: Story = { args: { label: "Password", type: "password", placeholder: undefined } };
