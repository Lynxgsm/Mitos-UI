/** @jsxImportSource react */
// Stories render the compiled React output (`mitosis build` first), like the tests.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import Select from "@/select/select";

const meta = {
  title: "Components/Select",
  component: Select,
  args: {
    label: "Country",
    placeholder: "Choose a country",
    options: [
      { value: "fr", label: "France" },
      { value: "gh", label: "Ghana" },
      { value: "jp", label: "Japan" },
    ],
    onChange: fn(),
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDescription: Story = { args: { description: "Used to compute taxes." } };
export const WithError: Story = { args: { required: true, error: "Choose a country." } };
export const Disabled: Story = { args: { disabled: true } };
