import { Card, Skeleton } from "@omni/core/react";

export default function ActivityLoading() {
  return (
    <div style={{ width: "100%", maxWidth: "30rem" }}>
      <Card title="Recent activity" description="Loading the last events…">
        {/* the region announces the loading state; the skeletons are hidden from screen readers */}
        <section aria-busy="true" aria-label="Recent activity" style={{ display: "grid", gap: "1rem" }}>
          {[0, 1, 2, 3].map((row) => (
            <div key={row} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Skeleton style={{ width: "2.25rem", height: "2.25rem", borderRadius: "9999px", flexShrink: 0 }} />
              <div style={{ display: "grid", gap: "0.4rem", flex: 1 }}>
                <Skeleton style={{ height: "0.75rem", width: "80%" }} />
                <Skeleton style={{ height: "0.75rem", width: "45%" }} />
              </div>
            </div>
          ))}
        </section>
      </Card>
    </div>
  );
}
