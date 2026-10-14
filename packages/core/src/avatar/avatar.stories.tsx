/** @jsxImportSource react */
// Stories render the compiled React output (`mitosis build` first), like the tests.
import type { Meta, StoryObj } from "@storybook/react-vite";
import Avatar from "@/avatar/avatar";

const SIZES = ["sm", "md", "lg"] as const;
// a data URL keeps the stories offline: a 2×2 gradient stands in for a photo
const IMAGE =
  "data:image/svg+xml," +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><rect width="2" height="2" fill="#c45c26"/><rect width="1" height="1" fill="#e8a27c"/></svg>');

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  args: { alt: "Ada Lovelace", src: IMAGE },
  argTypes: {
    size: { control: "inline-radio", options: SIZES },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Fallback: Story = { args: { src: undefined } };
export const BrokenImage: Story = { args: { src: "/missing.png" } };
export const CustomFallback: Story = { args: { src: undefined, fallback: "A" } };

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      {SIZES.map((s) => (
        <Avatar {...args} key={s} size={s} />
      ))}
    </div>
  ),
};
