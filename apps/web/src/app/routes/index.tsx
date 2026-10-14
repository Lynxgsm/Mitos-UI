import { createFileRoute } from "@tanstack/react-router";
import { LandingPage, landingStylesHref } from "@/pages/landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mitos UI: accessible components, written once" },
      {
        name: "description",
        content: "An accessible design system authored with Mitosis and styled with StyleX. React and Svelte today, Vue next.",
      },
    ],
    links: [{ rel: "stylesheet", href: landingStylesHref }],
  }),
  component: LandingPage,
});
