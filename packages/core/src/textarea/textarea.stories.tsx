// Stories render the compiled React output (`mitosis build` first), like the tests.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import Textarea from "@/textarea/textarea";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  args: { label: "Bio", placeholder: "A few words about you", onChange: fn() },
  argTypes: { rows: { control: { type: "number", min: 2, max: 12 } } },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDescription: Story = { args: { description: "Shown on your public profile. 160 characters max.", maxLength: 160 } };
export const Required: Story = { args: { required: true } };
export const Invalid: Story = { args: { error: "Please write at least 20 characters.", defaultValue: "Designer" } };
export const Disabled: Story = { args: { disabled: true, defaultValue: "Bio editing is locked by your admin." } };
