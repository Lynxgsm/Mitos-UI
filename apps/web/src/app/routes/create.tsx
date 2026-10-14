import { createFileRoute } from "@tanstack/react-router";
import { parsePreset, type Preset } from "@/entities/theme";
import { CreatePage, createStylesHref } from "@/pages/create";

export const Route = createFileRoute("/create")({
  // the preset lives in the URL so a theme can be shared as a link
  validateSearch: (search: Record<string, unknown>): Preset => parsePreset(search),
  head: () => ({
    meta: [{ title: "Create a theme · Omni UI" }],
    links: [{ rel: "stylesheet", href: createStylesHref }],
  }),
  component: CreatePage,
});
