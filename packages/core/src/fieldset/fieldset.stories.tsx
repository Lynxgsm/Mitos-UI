/** @jsxImportSource react */
// Stories render the compiled React output (`mitosis build` first), like the tests.
import type { Meta, StoryObj } from "@storybook/react-vite";
import Fieldset from "@/fieldset/fieldset";
import Input from "@/input/input";

const meta = {
  title: "Components/Fieldset",
  component: Fieldset,
  args: {
    legend: "Shipping address",
    description: "Where we send your order.",
    children: (
      <>
        <Input label="Street" autoComplete="street-address" />
        <Input label="City" autoComplete="address-level2" />
      </>
    ),
  },
} satisfies Meta<typeof Fieldset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
