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
      { title: "Button", href: "/docs/components/button" },
      { title: "Dialog", href: "/docs/components/dialog" },
      { title: "Input", href: "/docs/components/input" },
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
