/** @jsxImportSource react */
// Stories render the compiled React output (`mitosis build` first), like the tests.
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import Slider from "@/slider/slider";

const meta = {
  title: "Components/Slider",
  component: Slider,
  args: { label: "Volume", defaultValue: 40, onInput: fn() },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Steps: Story = { args: { label: "Rating", min: 1, max: 5, step: 1, defaultValue: 3 } };
export const WithDescription: Story = { args: { description: "Applies to every speaker." } };
export const Disabled: Story = { args: { disabled: true } };
