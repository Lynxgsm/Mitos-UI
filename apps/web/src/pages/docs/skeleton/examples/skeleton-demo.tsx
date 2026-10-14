import { Skeleton } from "@lynxgsm/omni-ui/react";

export default function SkeletonDemo() {
  // the container announces the loading state; the skeletons themselves are hidden from screen readers
  return (
    <section aria-busy="true" aria-label="Profile" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Skeleton style={{ width: "3rem", height: "3rem", borderRadius: "9999px" }} />
      <div style={{ display: "grid", gap: "0.5rem" }}>
        <Skeleton style={{ width: "12rem", height: "1rem" }} />
        <Skeleton style={{ width: "8rem", height: "1rem" }} />
      </div>
    </section>
  );
}
