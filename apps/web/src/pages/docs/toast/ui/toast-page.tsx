import { FrameworkCode, FrameworkPropsTable } from "@/features/select-framework";
import { InstallCommand } from "@/shared/ui/install-command";
import { ComponentPreview, DocsPage, Section } from "@/widgets/docs-layout";
import ToastDemo from "../examples/toast-demo";
import toastDemoSource from "../examples/toast-demo?raw";
import ToastVariants from "../examples/toast-variants";
import toastVariantsSource from "../examples/toast-variants?raw";

export function ToastPage() {
  return (
    <DocsPage
      title="Toast"
      description="A short, temporary message about something that just happened."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "examples", title: "Examples" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={ToastDemo} source={toastDemoSource} label="Toast demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="@omni/core" />
      </Section>

      <Section id="usage" title="Usage">
        <p>
          Render one <code>Toaster</code> at the root of your app, then call <code>toast()</code> from anywhere.
        </p>
        <FrameworkCode
          label="Toaster setup"
          react={`
import { Toaster } from "@omni/core/react";

export function App() {
  return (
    <>
      <Routes />
      <Toaster />
    </>
  );
}`}
          svelte={`
<!-- +layout.svelte -->
<script>
  import { Toaster } from "@omni/core/svelte";

  let { children } = $props();
</script>

{@render children()}
<Toaster />`}
        />
        <FrameworkCode
          label="Toast call"
          react={`
import { toast } from "@omni/core/react";

toast({ title: "Changes saved", description: "Your profile is up to date." });`}
          svelte={`
import { toast } from "@omni/core/svelte";

toast({ title: "Changes saved", description: "Your profile is up to date." });`}
        />
      </Section>

      <Section id="examples" title="Examples">
        <h3>Variants, actions and duration</h3>
        <ComponentPreview example={ToastVariants} source={toastVariantsSource} label="Toast variants" />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul>
          <li>
            Messages are announced through live regions that exist before any toast: <code>role="status"</code>, or{" "}
            <code>role="alert"</code> for the destructive variant.
          </li>
          <li>Toasts never take focus; they sit in a labelled region you can reach with Tab.</li>
          <li>Countdowns pause while the pointer or keyboard focus is on a toast (WCAG 2.2.1).</li>
          <li>A toast with an action never disappears on its own: the user gets time to act.</li>
          <li>Each toast has a dismiss button with an accessible name.</li>
        </ul>
      </Section>

      <Section id="api-reference" title="API Reference">
        <h3>toast(options)</h3>
        <FrameworkPropsTable
          component="toast options"
          rows={[
            { prop: "title", type: "string", description: "Main message." },
            { prop: "description", type: "string", description: "Supporting text." },
            { prop: "variant", type: '"default" | "destructive"', default: '"default"', description: "Destructive is announced assertively." },
            { prop: "duration", type: "number", default: "5000", description: "Milliseconds before dismissal; Infinity keeps it." },
            { prop: "action", type: "{ label: string; onClick: () => void }", description: "One action; disables auto-dismiss." },
            { prop: "toaster", type: "string", description: "Name of the Toaster that shows it; the unnamed Toaster by default." },
          ]}
        />
        <p>
          <code>toast()</code> returns an id for <code>dismissToast(id)</code>; <code>dismissAllToasts()</code> clears the
          queue.
        </p>
        <p>
          One unnamed Toaster usually shows every toast. Add a named one when part of the page needs its own, for example
          a themed preview: <code>toast({"{"} title, toaster: "preview" {"}"})</code> reaches only{" "}
          <code>&lt;Toaster name="preview" /&gt;</code>. The Create page does exactly that.
        </p>
        <h3>Toaster</h3>
        <FrameworkPropsTable
          component="Toaster"
          rows={[
            { prop: "label", type: "string", default: '"Notifications"', description: "Name of the region." },
            {
              prop: "name",
              type: "string",
              description: "Shows only the toasts sent with this toaster name, e.g. a Toaster inside a preview or a panel.",
            },
            { prop: "class", type: "string", description: "Extra classes for the region." },
            { prop: "aria-* / data-*", type: "—", description: "Forwarded to the region." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}
