// Stories render the compiled React output (`mitosis build` first), like the tests.
import type { Meta, StoryObj } from "@storybook/react-vite";
import Accordion from "@/accordion/accordion";

const ITEMS = [
  {
    title: "Is it accessible?",
    content: "Yes. Headers are native buttons with aria-expanded, and collapsed panels are inert.",
  },
  {
    title: "Is it animated?",
    content: "Yes. Panels open smoothly to their natural height; motion is disabled under prefers-reduced-motion.",
  },
  {
    title: "Can I use the keyboard?",
    content: "Tab to a header, Enter or Space to toggle, arrow keys, Home and End to move between headers.",
  },
];

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  args: { items: ITEMS, "aria-label": "Frequently asked questions" },
  argTypes: {
    multiple: { control: "boolean" },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Multiple: Story = { args: { multiple: true, defaultOpen: [0, 1] } };
export const DefaultOpen: Story = { args: { defaultOpen: [1] } };
export const Disabled: Story = {
  args: { items: ITEMS.map((item, index) => (index === 1 ? { ...item, disabled: true } : item)) },
};
