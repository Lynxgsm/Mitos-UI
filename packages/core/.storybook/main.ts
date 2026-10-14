import type { StorybookConfig } from "@storybook/react-vite";
import { fileURLToPath } from "node:url";
import { mergeConfig } from "vite";
import stylex from "@stylexjs/unplugin";

// "@/…" in the compiled output (and in stories importing it); StyleX resolves .stylex imports on its own
const reactOutput = fileURLToPath(new URL("../output/react/src", import.meta.url));

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  viteFinal: (config) =>
    mergeConfig(config, {
      resolve: { alias: { "@": reactOutput } },
      plugins: [stylex.vite({ useCSSLayers: true, aliases: { "@/*": [`${reactOutput}/*`] } })],
    }),
};

export default config;
