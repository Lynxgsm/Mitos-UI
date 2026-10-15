/** @jsxImportSource react */
// Stories render the compiled React output (`mitosis build` first), like the tests.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import Combobox from "@/combobox/combobox";

const meta = {
  title: "Components/Combobox",
  component: Combobox,
  args: {
    label: "Framework",
    placeholder: "Search a framework",
    options: [
      { value: "react", label: "React" },
      { value: "svelte", label: "Svelte" },
      { value: "vue", label: "Vue" },
      { value: "solid", label: "Solid" },
      { value: "angular", label: "Angular", disabled: true },
    ],
    onValueChange: fn(),
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithValue: Story = { args: { defaultValue: "svelte" } };
export const WithDescription: Story = { args: { description: "Type to filter the list." } };
export const WithError: Story = { args: { required: true, error: "Choose a framework." } };
export const Disabled: Story = { args: { disabled: true, defaultValue: "react" } };
