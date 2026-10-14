/** @jsxImportSource react */
// Stories render the compiled React output (`mitosis build` first), like the tests.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import RadioGroup from "@/radio-group/radio-group";

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  args: {
    legend: "Plan",
    name: "plan",
    defaultValue: "pro",
    options: [
      { value: "free", label: "Free" },
      { value: "pro", label: "Pro" },
      { value: "team", label: "Team" },
    ],
    onChange: fn(),
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDescription: Story = { args: { description: "You can change it anytime." } };
export const WithError: Story = { args: { defaultValue: undefined, required: true, error: "Choose a plan." } };
export const DisabledOption: Story = {
  args: {
    options: [
      { value: "free", label: "Free" },
      { value: "pro", label: "Pro" },
      { value: "team", label: "Team (sold out)", disabled: true },
    ],
  },
};
export const Disabled: Story = { args: { disabled: true } };
