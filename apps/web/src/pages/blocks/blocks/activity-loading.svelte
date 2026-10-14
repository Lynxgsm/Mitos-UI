<script>
  import { Card, Skeleton } from "@omni/core/svelte";
</script>

<div style="width: 100%; max-width: 30rem">
  <Card title="Recent activity" description="Loading the last events…">
    <!-- the region announces the loading state; the skeletons are hidden from screen readers -->
    <section aria-busy="true" aria-label="Recent activity" style="display: grid; gap: 1rem">
      {#each [0, 1, 2, 3] as row (row)}
        <div style="display: flex; align-items: center; gap: 0.75rem">
          <Skeleton style="width: 2.25rem; height: 2.25rem; border-radius: 9999px; flex-shrink: 0" />
          <div style="display: grid; gap: 0.4rem; flex: 1">
            <Skeleton style="height: 0.75rem; width: 80%" />
            <Skeleton style="height: 0.75rem; width: 45%" />
          </div>
        </div>
      {/each}
    </section>
  </Card>
</div>
