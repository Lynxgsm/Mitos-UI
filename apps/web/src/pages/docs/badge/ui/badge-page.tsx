import { FrameworkCode, FrameworkPropsTable } from "@/features/select-framework";
import { InstallCommand } from "@/shared/ui/install-command";
import { ComponentPreview, DocsPage, Section } from "@/widgets/docs-layout";
import BadgeDemo from "../examples/badge-demo";
import badgeDemoSource from "../examples/badge-demo?raw";
import BadgeVariants from "../examples/badge-variants";
import badgeVariantsSource from "../examples/badge-variants?raw";

export function BadgePage() {
  return (
    <DocsPage
      title="Badge"
      description="A short label that tags or describes an element: a status, a category, a count."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "examples", title: "Examples" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={BadgeDemo} source={badgeDemoSource} label="Badge demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="@lynxgsm/omni-ui" />
      </Section>

      <Section id="usage" title="Usage">
        <FrameworkCode
          label="Badge usage"
          react={`
import { Badge } from "@lynxgsm/omni-ui/react";

<Badge variant="secondary">Beta</Badge>`}
          svelte={`
<script>
  import { Badge } from "@lynxgsm/omni-ui/svelte";
</script>

<Badge variant="secondary">Beta</Badge>`}
        />
      </Section>

      <Section id="examples" title="Examples">
        <h3>Variants</h3>
        <ComponentPreview example={BadgeVariants} source={badgeVariantsSource} label="Badge variants" />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul>
          <li>
            Renders a plain <code>&lt;span&gt;</code>: a badge is text, not a control, so it has no role and is read
            with the content around it.
          </li>
          <li>
            The text carries the meaning, never the color alone: write <code>Failed</code>, not a red dot.
          </li>
          <li>
            Give numbers their context: <code>3 unread</code> rather than <code>3</code>, or an{" "}
            <code>aria-label</code> when space is short.
          </li>
          <li>Every variant meets 4.5:1 text contrast, in light and dark mode.</li>
        </ul>
      </Section>

      <Section id="api-reference" title="API Reference">
        <FrameworkPropsTable
          component="Badge"
          rows={[
            {
              prop: "variant",
              type: '"default" | "secondary" | "outline" | "destructive"',
              default: '"default"',
              description: "Visual style.",
            },
            { prop: "class", type: "string", description: "Extra classes, merged after the component's styles." },
            { prop: "aria-* / data-* / native attributes", type: "—", description: "Forwarded to the <span>." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}
