import { FrameworkCode, FrameworkPropsTable } from "@/features/select-framework";
import { InstallCommand } from "@/shared/ui/install-command";
import { ComponentPreview, DocsPage, Section } from "@/widgets/docs-layout";
import CardDemo from "../examples/card-demo";
import cardDemoSource from "../examples/card-demo?raw";

export function CardPage() {
  return (
    <DocsPage
      title="Card"
      description="A bordered container grouping a title, its content and related actions."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={CardDemo} source={cardDemoSource} label="Card demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="@lynxgsm/omni-ui" />
      </Section>

      <Section id="usage" title="Usage">
        <FrameworkCode
          label="Card usage"
          react={`
import { Button, Card } from "@lynxgsm/omni-ui/react";

<Card title="Team plan" description="Billed monthly." footer={<Button>Upgrade</Button>}>
  <p>Up to 10 seats.</p>
</Card>`}
          svelte={`
<script>
  import { Card } from "@lynxgsm/omni-ui/svelte";
</script>

<Card title="Team plan" description="Billed monthly.">
  <p>Up to 10 seats.</p>
</Card>`}
        />
        <p>
          In Svelte, <code>footer</code> takes text: put buttons in the content instead.
        </p>
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul>
          <li>
            The title is a heading (<code>role="heading"</code>), level 3 by default. Set <code>headingLevel</code> so
            it fits the page outline: a card under an <code>&lt;h2&gt;</code> keeps level 3, a card directly under the
            page title uses 2.
          </li>
          <li>
            The card is a plain container, not a landmark: a page of cards does not flood the landmark list. Wrap it in{" "}
            <code>&lt;article&gt;</code> or <code>&lt;li&gt;</code> when the content calls for it.
          </li>
          <li>The description is muted text at 4.5:1 contrast.</li>
        </ul>
      </Section>

      <Section id="api-reference" title="API Reference">
        <FrameworkPropsTable
          component="Card"
          rows={[
            { prop: "title", type: "ReactNode", description: "Heading of the card." },
            { prop: "description", type: "ReactNode", description: "Muted text under the title." },
            { prop: "headingLevel", type: "2 | 3 | 4 | 5 | 6", default: "3", description: "Level of the title in the page outline." },
            { prop: "children", type: "ReactNode", description: "Content." },
            { prop: "footer", type: "ReactNode", description: "Actions, aligned in a row at the bottom." },
            { prop: "class", type: "string", description: "Extra classes, merged after the component's styles." },
            { prop: "aria-* / data-* / native attributes", type: "—", description: "Forwarded to the root <div>." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}
