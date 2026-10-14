import { FrameworkCode, FrameworkPropsTable } from "@/features/select-framework";
import { InstallCommand } from "@/shared/ui/install-command";
import { ComponentPreview, DocsPage, Section } from "@/widgets/docs-layout";
import SkeletonDemo from "../examples/skeleton-demo";
import skeletonDemoSource from "../examples/skeleton-demo?raw";

export function SkeletonPage() {
  return (
    <DocsPage
      title="Skeleton"
      description="A placeholder that shows the shape of content while it loads."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={SkeletonDemo} source={skeletonDemoSource} label="Skeleton demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="@omni/core" />
      </Section>

      <Section id="usage" title="Usage">
        <FrameworkCode
          label="Skeleton usage"
          react={`
import { Skeleton } from "@omni/core/react";

<section aria-busy="true" aria-label="Profile">
  <Skeleton style={{ width: "12rem", height: "1rem" }} />
</section>`}
          svelte={`
<script>
  import { Skeleton } from "@omni/core/svelte";
</script>

<section aria-busy="true" aria-label="Profile">
  <Skeleton style="width: 12rem; height: 1rem" />
</section>`}
        />
        <p>
          Size and shape come from you, with <code>class</code> or <code>style</code>: match the content it stands
          for.
        </p>
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul>
          <li>
            Skeletons are decorative and hidden from assistive technologies (<code>aria-hidden="true"</code>).
          </li>
          <li>
            Announce the loading state on the container: <code>aria-busy="true"</code> while loading, removed when the
            real content is in place.
          </li>
          <li>The pulse stops when the system asks for reduced motion.</li>
        </ul>
      </Section>

      <Section id="api-reference" title="API Reference">
        <FrameworkPropsTable
          component="Skeleton"
          rows={[
            { prop: "class", type: "string", description: "Size and shape (width, height, border-radius)." },
            { prop: "style", type: "object", description: "Inline size and shape.", svelte: { type: "string" } },
            { prop: "data-* / native attributes", type: "—", description: "Forwarded to the <div>." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}
