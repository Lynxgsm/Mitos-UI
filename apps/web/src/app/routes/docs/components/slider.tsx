import { createFileRoute } from "@tanstack/react-router";
import { SliderPage } from "@/pages/docs/slider";

export const Route = createFileRoute("/docs/components/slider")({
  head: () => ({ meta: [{ title: "Slider · Mitos UI" }] }),
  component: SliderPage,
});
