import { createFileRoute } from "@tanstack/react-router";
import { SkeletonPage } from "@/pages/docs/skeleton";

export const Route = createFileRoute("/docs/components/skeleton")({
  head: () => ({ meta: [{ title: "Skeleton · Mitos UI" }] }),
  component: SkeletonPage,
});
