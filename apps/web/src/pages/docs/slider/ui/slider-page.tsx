import { FrameworkCode } from "@/features/select-framework";
import { InstallCommand } from "@/shared/ui/install-command";
import { PropsTable } from "@/shared/ui/props-table";
import { ComponentPreview, DocsPage, Section } from "@/widgets/docs-layout";
import SliderDemo from "../examples/slider-demo";
import sliderDemoSource from "../examples/slider-demo?raw";

export function SliderPage() {
  return (
    <DocsPage
      title="Slider"
      description="A control to pick a value within a range."
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "accessibility", title: "Accessibility" },
        { id: "api-reference", title: "API Reference" },
      ]}
    >
      <ComponentPreview example={SliderDemo} source={sliderDemoSource} label="Slider demo" />

      <Section id="installation" title="Installation">
        <InstallCommand packages="@omni/core" />
      </Section>

      <Section id="usage" title="Usage">
        <FrameworkCode
          label="Slider usage"
          react={`
import { Slider } from "@omni/core/react";

<Slider label="Brightness" min={0} max={100} step={10} defaultValue={50} />`}
          svelte={`
<script>
  import { Slider } from "@omni/core/svelte";
</script>

<Slider label="Brightness" min={0} max={100} step={10} value={50} />`}
        />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul>
          <li>A native <code>&lt;input type="range"&gt;</code>: arrow keys, <kbd>Page Up</kbd>, <kbd>Page Down</kbd>, <kbd>Home</kbd> and <kbd>End</kbd> work out of the box.</li>
          <li>Pass <code>aria-valuetext</code> when the raw number is not meaningful ("40 percent", "Medium").</li>
          <li>The track is 24 px tall, the minimum target size. Its filled part follows the value; both parts reach 3:1 against the page.</li>
          <li>Track and thumb are drawn the same in every browser; in forced colors mode the native slider comes back.</li>
        </ul>
      </Section>

      <Section id="api-reference" title="API Reference">
        <PropsTable
          component="Slider"
          rows={[
            { prop: "label", type: "ReactNode", description: "Visible label; names the slider." },
            { prop: "description", type: "ReactNode", description: "Help text (aria-describedby)." },
            { prop: "min / max / step", type: "number", default: "0 / 100 / 1", description: "Range and increment (native defaults)." },
            { prop: "value / defaultValue", type: "number", description: "Controlled or initial value (React); use value in Svelte." },
            { prop: "aria-valuetext", type: "string", description: "Spoken instead of the number." },
            { prop: "aria-* / data-* / native attributes", type: "\u2014", description: "Forwarded to the <input>." },
          ]}
        />
      </Section>
    </DocsPage>
  );
}
