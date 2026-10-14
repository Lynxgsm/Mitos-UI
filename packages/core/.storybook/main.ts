import type { StorybookConfig } from "@storybook/react-vite";
import stylex from "@stylexjs/unplugin";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  viteFinal: (config) => ({
    ...config,
    plugins: [...(config.plugins ?? []), stylex.vite({ useCSSLayers: true })],
  }),
};

export default config;
