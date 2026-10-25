import { createFileRoute } from "@tanstack/react-router";
import { TagInputPage } from "@/pages/docs/tag-input";

export const Route = createFileRoute("/docs/components/tag-input")({
  head: () => ({ meta: [{ title: "Tag Input · Mitos UI" }] }),
  component: TagInputPage,
});
