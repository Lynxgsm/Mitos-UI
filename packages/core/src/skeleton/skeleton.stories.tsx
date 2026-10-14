/** @jsxImportSource react */
// Stories render the compiled React output (`mitosis build` first), like the tests.
import type { Meta, StoryObj } from "@storybook/react-vite";
import Skeleton from "@/skeleton/skeleton";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

// size and shape come from the consumer; inline styles keep the story self-contained
export const Profile: Story = {
  render: () => (
    <section aria-busy="true" aria-label="Profile" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Skeleton style={{ width: "3rem", height: "3rem", borderRadius: "9999px" }} />
      <div style={{ display: "grid", gap: "0.5rem" }}>
        <Skeleton style={{ width: "12rem", height: "1rem" }} />
        <Skeleton style={{ width: "8rem", height: "1rem" }} />
      </div>
    </section>
  ),
};
