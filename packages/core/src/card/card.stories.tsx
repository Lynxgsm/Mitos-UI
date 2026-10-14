/** @jsxImportSource react */
// Stories render the compiled React output (`mitosis build` first), like the tests.
import type { Meta, StoryObj } from "@storybook/react-vite";
import Card from "@/card/card";
import Button from "@/button/button";

const meta = {
  title: "Components/Card",
  component: Card,
  args: {
    title: "Team plan",
    description: "Billed monthly, cancel anytime.",
    children: <p style={{ margin: 0 }}>Up to 10 seats and shared themes.</p>,
    footer: <Button>Upgrade</Button>,
  },
  argTypes: {
    headingLevel: { control: "inline-radio", options: [2, 3, 4, 5, 6] },
  },
  render: (args) => (
    <div style={{ maxWidth: "24rem" }}>
      <Card {...args} />
    </div>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithoutFooter: Story = { args: { footer: undefined } };
export const ContentOnly: Story = { args: { title: undefined, description: undefined, footer: undefined } };
