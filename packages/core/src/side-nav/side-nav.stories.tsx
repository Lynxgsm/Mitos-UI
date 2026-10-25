/** @jsxImportSource react */
// Stories render the compiled React output (`mitosis build` first), like the tests.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import SideNav from "@/side-nav/side-nav";

const meta = {
  title: "Components/SideNav",
  component: SideNav,
  args: {
    label: "Settings",
    currentHref: "#profile",
    groups: [
      { title: "Account", items: [{ label: "Profile", href: "#profile" }, { label: "Security", href: "#security" }] },
      { title: "Workspace", items: [{ label: "Members", href: "#members" }, { label: "Billing", href: "#billing" }] },
    ],
    onNavigate: fn(),
  },
  decorators: [(Story) => <div style={{ width: "14rem" }}>{Story()}</div>],
} satisfies Meta<typeof SideNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithoutTitles: Story = {
  args: { groups: [{ items: [{ label: "Inbox", href: "#inbox" }, { label: "Archive", href: "#archive" }] }], currentHref: "#inbox" },
};
export const WithIconsAndCounts: Story = {
  args: {
    groups: [
      {
        title: "Library",
        items: [
          { label: "Knowledge base", href: "#kb", icon: "▤", count: 9 },
          { label: "Alerts", href: "#alerts", icon: "◔", count: 2, countLabel: "unread", highlightCount: true },
        ],
      },
    ],
    currentHref: "#kb",
  },
};
