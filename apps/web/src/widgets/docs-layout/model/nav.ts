// Single source for the sidebar and the previous/next links.
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
    title: "Components",
    items: [
      { title: "Accordion", href: "/docs/components/accordion" },
      { title: "Avatar", href: "/docs/components/avatar" },
      { title: "Badge", href: "/docs/components/badge" },
      { title: "Button", href: "/docs/components/button" },
      { title: "Button Group", href: "/docs/components/button-group" },
      { title: "Card", href: "/docs/components/card" },
      { title: "Checkbox", href: "/docs/components/checkbox" },
      { title: "Dialog", href: "/docs/components/dialog" },
      { title: "Fieldset", href: "/docs/components/fieldset" },
      { title: "Input", href: "/docs/components/input" },
      { title: "Radio Group", href: "/docs/components/radio-group" },
      { title: "Select", href: "/docs/components/select" },
      { title: "Skeleton", href: "/docs/components/skeleton" },
      { title: "Slider", href: "/docs/components/slider" },
      { title: "Switch", href: "/docs/components/switch" },
      { title: "Textarea", href: "/docs/components/textarea" },
      { title: "Toast", href: "/docs/components/toast" },
    ],
  },
] as const;

export type DocsHref = (typeof DOCS_NAV)[number]["items"][number]["href"];

const PAGES = DOCS_NAV.flatMap<{ title: string; href: DocsHref }>((group) => group.items);

export function neighbours(href: string) {
  const index = PAGES.findIndex((page) => page.href === href);
  return { previous: PAGES[index - 1], next: PAGES[index + 1] };
}
