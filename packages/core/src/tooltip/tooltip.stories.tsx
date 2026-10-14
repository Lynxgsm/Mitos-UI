/** @jsxImportSource react */
// Stories render the compiled React output (`mitosis build` first), like the tests.
import type { Meta, StoryObj } from "@storybook/react-vite";
import Tooltip from "@/tooltip/tooltip";
import Button from "@/button/button";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  args: {
    content: "Copy to clipboard",
    children: (
      <Button variant="outline" aria-label="Copy">
        ⧉
      </Button>
    ),
  },
  argTypes: {
    side: { control: "inline-radio", options: ["top", "bottom"] },
  },
  decorators: [(Story) => <div style={{ padding: "4rem" }}>{Story()}</div>],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Top: Story = {};
export const Bottom: Story = { args: { side: "bottom" } };
