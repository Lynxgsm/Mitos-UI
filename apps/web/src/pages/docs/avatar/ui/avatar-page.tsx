import { FrameworkCode, FrameworkPropsTable } from "@/features/select-framework";
import { InstallCommand } from "@/shared/ui/install-command";
import { ComponentPreview, DocsPage, Section } from "@/widgets/docs-layout";
import AvatarDemo from "../examples/avatar-demo";
import avatarDemoSource from "../examples/avatar-demo?raw";
import AvatarSizes from "../examples/avatar-sizes";
import avatarSizesSource from "../examples/avatar-sizes?raw";
import AvatarWithName from "../examples/avatar-with-name";
import avatarWithNameSource from "../examples/avatar-with-name?raw";
import AvatarBroken from "../examples/avatar-broken";
import avatarBrokenSource from "../examples/avatar-broken?raw";

export function AvatarPage() {
  return (
    <DocsPage
      title="Avatar"
      description="An image representing a person, with initials when the image is missing or fails to load."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "examples", title: "Examples" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={AvatarDemo} source={avatarDemoSource} label="Avatar demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="@lynxgsm/omni-ui" />
      </Section>

      <Section id="usage" title="Usage">
        <FrameworkCode
          label="Avatar usage"
          react={`
import { Avatar } from "@lynxgsm/omni-ui/react";

<Avatar src={user.avatarUrl} alt={user.name} />`}
          svelte={`
<script>
  import { Avatar } from "@lynxgsm/omni-ui/svelte";

  let { user } = $props();
</script>

<Avatar src={user.avatarUrl} alt={user.name} />`}
        />
      </Section>

      <Section id="examples" title="Examples">
        <h3>Sizes</h3>
        <ComponentPreview example={AvatarSizes} source={avatarSizesSource} label="Avatar sizes" />
        <h3>Next to a visible name</h3>
        <ComponentPreview example={AvatarWithName} source={avatarWithNameSource} label="Avatar next to a name" />
        <h3>Image that fails to load</h3>
        <ComponentPreview example={AvatarBroken} source={avatarBrokenSource} label="Avatar with a broken image" />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul>
          <li>
            <code>alt</code> is required: it names the image, usually with the person's name.
          </li>
          <li>
            The initials fallback keeps that name (<code>role="img"</code> + <code>aria-label</code>), so assistive
            technologies hear the same thing with or without the image.
          </li>
          <li>
            When the name is already written next to the avatar, pass <code>alt=""</code>: the avatar becomes
            decorative and the name is not read twice.
          </li>
          <li>
            Initials use the foreground color on the muted background (4.5:1). A failed image is detected even when
            it failed before the page became interactive.
          </li>
        </ul>
      </Section>

      <Section id="api-reference" title="API Reference">
        <FrameworkPropsTable
          component="Avatar"
          rows={[
            { prop: "alt", type: "string", description: 'Accessible name, usually the person\'s name; "" when it is decorative.' },
            { prop: "src", type: "string", description: "Image URL. Without it, or when it fails, the fallback is shown." },
            { prop: "fallback", type: "string", default: "initials of alt", description: "Text shown instead of the image." },
            { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "32, 40 or 48 px." },
            { prop: "class", type: "string", description: "Extra classes, merged after the component's styles." },
            { prop: "aria-* / data-* / native attributes", type: "—", description: "Forwarded to the root <span>." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}
