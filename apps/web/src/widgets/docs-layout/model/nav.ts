// Single source for the sidebar and the previous/next links. Components are grouped by purpose; the order of the
// groups is also the reading order of the pager.
export const DOCS_NAV = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Theming", href: "/docs/theming" },
    ],
  },
  {
    title: "Actions",
    items: [
      { title: "Button", href: "/docs/components/button" },
      { title: "Button Group", href: "/docs/components/button-group" },
      { title: "Menu", href: "/docs/components/menu" },
    ],
  },
  {
    title: "Forms",
    items: [
      { title: "Checkbox", href: "/docs/components/checkbox" },
      { title: "Fieldset", href: "/docs/components/fieldset" },
      { title: "Input", href: "/docs/components/input" },
      { title: "Radio Group", href: "/docs/components/radio-group" },
      { title: "Select", href: "/docs/components/select" },
      { title: "Slider", href: "/docs/components/slider" },
      { title: "Switch", href: "/docs/components/switch" },
      { title: "Textarea", href: "/docs/components/textarea" },
    ],
  },
  {
    title: "Data Display",
    items: [
      { title: "Avatar", href: "/docs/components/avatar" },
      { title: "Badge", href: "/docs/components/badge" },
      { title: "Card", href: "/docs/components/card" },
    ],
  },
  {
    title: "Feedback",
    items: [
      { title: "Skeleton", href: "/docs/components/skeleton" },
      { title: "Toast", href: "/docs/components/toast" },
    ],
  },
  {
    title: "Navigation",
    items: [{ title: "Side Nav", href: "/docs/components/side-nav" }],
  },
  {
    title: "Disclosure",
    items: [
      { title: "Accordion", href: "/docs/components/accordion" },
      { title: "Tabs", href: "/docs/components/tabs" },
    ],
  },
  {
    title: "Overlays",
    items: [
      { title: "Dialog", href: "/docs/components/dialog" },
      { title: "Tooltip", href: "/docs/components/tooltip" },
    ],
  },
] as const;

export type DocsHref = (typeof DOCS_NAV)[number]["items"][number]["href"];

const PAGES = DOCS_NAV.flatMap<{ title: string; href: DocsHref }>((group) => group.items);

export function neighbours(href: string) {
  const index = PAGES.findIndex((page) => page.href === href);
  return { previous: PAGES[index - 1], next: PAGES[index + 1] };
}
