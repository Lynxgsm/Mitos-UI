import { createFileRoute } from "@tanstack/react-router";
import { SegmentedControlPage } from "@/pages/docs/segmented-control";

export const Route = createFileRoute("/docs/components/segmented-control")({
  head: () => ({ meta: [{ title: "Segmented Control · Mitos UI" }] }),
  component: SegmentedControlPage,
});
