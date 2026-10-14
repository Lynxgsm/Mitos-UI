/** @jsxImportSource react */
// Stories render the compiled React output (`mitosis build` first), like the tests.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import Tabs from "@/tabs/tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  args: {
    label: "Settings",
    items: [
      { value: "account", label: "Account", content: "Update your name and email." },
      { value: "billing", label: "Billing", content: "Manage your plan and invoices." },
      { value: "team", label: "Team", content: "Invite people to your workspace.", disabled: true },
    ],
    onValueChange: fn(),
  },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Vertical: Story = { args: { orientation: "vertical" } };
export const SecondSelected: Story = { args: { defaultValue: "billing" } };
