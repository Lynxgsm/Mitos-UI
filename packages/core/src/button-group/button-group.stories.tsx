/** @jsxImportSource react */
// Stories render the compiled React output (`mitosis build` first), like the tests.
import type { Meta, StoryObj } from "@storybook/react-vite";
import ButtonGroup from "@/button-group/button-group";
import Button from "@/button/button";

const meta = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  args: { "aria-label": "Text alignment" },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Left</Button>
      <Button variant="outline">Center</Button>
      <Button variant="outline">Right</Button>
    </ButtonGroup>
  ),
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};
export const Vertical: Story = { args: { orientation: "vertical" } };
export const Secondary: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="secondary">Day</Button>
      <Button variant="secondary">Week</Button>
      <Button variant="secondary">Month</Button>
    </ButtonGroup>
  ),
};
