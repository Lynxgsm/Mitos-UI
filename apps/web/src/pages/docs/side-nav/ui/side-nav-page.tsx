import { FrameworkCode, FrameworkPropsTable } from "@/features/select-framework";
import { InstallCommand } from "@/shared/ui/install-command";
import { ComponentPreview, DocsPage, Section } from "@/widgets/docs-layout";
import SideNavDemo from "../examples/side-nav-demo";
import sideNavDemoSource from "../examples/side-nav-demo?raw";

export function SideNavPage() {
  return (
    <DocsPage
      title="Side Nav"
      description="Grouped links to the sections of an app or a site, with the current page marked."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "routing", title: "Client-side routing" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={SideNavDemo} source={sideNavDemoSource} label="Side nav demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="@lynxgsm/omni-ui" />
      </Section>

      <Section id="usage" title="Usage">
        <FrameworkCode
          label="Side nav usage"
          react={`
import { SideNav } from "@lynxgsm/omni-ui/react";

<SideNav
  label="Docs"
  currentHref={location.pathname}
  groups={[
    { title: "Guides", items: [{ label: "Installation", href: "/docs/installation" }] },
    { title: "Components", items: [{ label: "Button", href: "/docs/button" }] },
  ]}
/>`}
          svelte={`
<script>
  import { page } from "$app/state";
  import { SideNav } from "@lynxgsm/omni-ui/svelte";
</script>

<SideNav
  label="Docs"
  currentHref={page.url.pathname}
  groups={[
    { title: "Guides", items: [{ label: "Installation", href: "/docs/installation" }] },
    { title: "Components", items: [{ label: "Button", href: "/docs/button" }] },
  ]}
/>`}
        />
      </Section>

      <Section id="routing" title="Client-side routing">
        <p>
          Links are plain <code>&lt;a href&gt;</code>. With a client-side router, pass <code>onNavigate</code>: plain
          clicks call it instead of loading the page, while <kbd>Cmd</kbd>/<kbd>Ctrl</kbd>-click and middle click
          still open a new tab. SvelteKit intercepts links on its own, so Svelte apps usually need nothing.
        </p>
        <FrameworkCode
          label="Side nav with a router"
          react={`
import { useLocation, useNavigate } from "@tanstack/react-router";

const { pathname } = useLocation();
const navigate = useNavigate();

<SideNav label="Docs" groups={groups} currentHref={pathname} onNavigate={(href) => navigate({ to: href })} />`}
          svelte={`
<script>
  import { goto } from "$app/navigation";
</script>

<SideNav label="Docs" {groups} onNavigate={(href) => goto(href)} />`}
        />
        <p>This documentation uses it: the sidebar of this page is a SideNav.</p>
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul>
          <li>
            A <code>&lt;nav&gt;</code> landmark named by <code>label</code>: screen reader users jump to it and hear its
            name. Give each navigation of a page a different name.
          </li>
          <li>Each group is a list named by its title, announced with its number of links.</li>
          <li>
            The link of the current page gets <code>aria-current="page"</code>, and is marked by a bar and a heavier
            weight as well as by its colors.
          </li>
          <li>Real links: <kbd>Tab</kbd> moves through them, <kbd>Enter</kbd> follows them, and they can open in a new tab.</li>
        </ul>
      </Section>

      <Section id="api-reference" title="API Reference">
        <FrameworkPropsTable
          component="SideNav"
          rows={[
            { prop: "label", type: "string", description: "Names the navigation landmark." },
            { prop: "groups", type: "{ title?, items: { label, href }[] }[]", description: "Groups of links, in order." },
            { prop: "currentHref", type: "string", description: "Href of the current page; its link gets aria-current." },
            {
              prop: "onNavigate",
              type: "(href, event) => void",
              description: "Called instead of following a link on a plain click, for client-side routers.",
            },
            { prop: "class", type: "string", description: "Extra classes, merged after the component's styles." },
            { prop: "aria-* / data-* / native attributes", type: "—", description: "Forwarded to the <nav>." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}
