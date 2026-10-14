import { createFileRoute } from "@tanstack/react-router";
import { Introduction } from "@/pages/docs/introduction";

export const Route = createFileRoute("/docs/")({
  head: () => ({ meta: [{ title: "Introduction · Omni UI" }] }),
  component: Introduction,
});
