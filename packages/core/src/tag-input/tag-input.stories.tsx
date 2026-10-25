/** @jsxImportSource react */
// Stories render the compiled React output (`mitosis build` first), like the tests.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import TagInput from "@/tag-input/tag-input";

const meta = {
  title: "Components/TagInput",
  component: TagInput,
  args: {
    label: "Personal tags",
    placeholder: "Add a tag",
    description: "Press Enter to add.",
    defaultValue: ["forms", "api-input"],
    onValueChange: fn(),
  },
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { defaultValue: [] } };
export const WithError: Story = { args: { error: "Use at most 20 tags." } };
export const Disabled: Story = { args: { disabled: true } };
