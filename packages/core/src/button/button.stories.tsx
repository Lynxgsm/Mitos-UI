/** @jsxImportSource react */
// Stories render the compiled React output (`mitosis build` first), like the tests.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import Button from "@/button/button";

const VARIANTS = ["default", "secondary", "outline", "ghost", "link", "destructive", "destructive-ghost"] as const;
const SIZES = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"] as const;

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Button", onClick: fn() },
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    size: { control: "select", options: SIZES },
    type: { control: "inline-radio", options: ["button", "submit", "reset"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Secondary: Story = { args: { variant: "secondary" } };
export const Outline: Story = { args: { variant: "outline" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Link: Story = { args: { variant: "link" } };
export const Destructive: Story = { args: { variant: "destructive" } };
export const DestructiveGhost: Story = { args: { variant: "destructive-ghost", children: "Delete" } };
export const Icon: Story = { args: { icon: true, variant: "outline", children: "⋯", "aria-label": "More actions" } };
export const Disabled: Story = { args: { disabled: true } };

const row = { display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" } as const;

export const AllVariants: Story = {
  render: (args) => (
    <div style={row}>
      {VARIANTS.map((v) => (
        <Button {...args} key={v} variant={v}>
          {v}
        </Button>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={row}>
      {SIZES.map((s) => (
        <Button {...args} key={s} size={s}>
          {s}
        </Button>
      ))}
    </div>
  ),
};
