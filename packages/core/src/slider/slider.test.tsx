/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import Slider from "@/slider/slider";

afterEach(cleanup);

describe("Slider", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Slider label="Volume" defaultValue={40} />
        <Slider label="Brightness" description="Applies to every screen." min={0} max={10} step={1} />
        <Slider label="Contrast" disabled />
      </>,
    );
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });

  it("is a native range input named by its label, with its bounds and value", () => {
    render(<Slider label="Volume" min={0} max={10} step={2} defaultValue={4} aria-valuetext="4 out of 10" />);
    const slider = screen.getByRole("slider", { name: "Volume" }) as HTMLInputElement;
    expect(slider.type).toBe("range");
    expect([slider.min, slider.max, slider.step, slider.value]).toEqual(["0", "10", "2", "4"]);
    expect(slider.getAttribute("aria-valuetext")).toBe("4 out of 10");
  });

  it("reports changes", () => {
    const onInput = vi.fn();
    render(<Slider label="Volume" onInput={onInput} />);
    fireEvent.input(screen.getByRole("slider"), { target: { value: "70" } });
    expect(onInput).toHaveBeenCalledTimes(1);
  });

  it("fills the track up to the value, uncontrolled or controlled", () => {
    const { rerender } = render(<Slider label="Volume" min={0} max={200} defaultValue={50} />);
    const slider = screen.getByRole("slider") as HTMLInputElement;
    expect(slider.style.getPropertyValue("--omni-slider-fill")).toBe("25%");
    fireEvent.input(slider, { target: { value: "100" } });
    expect(slider.style.getPropertyValue("--omni-slider-fill")).toBe("50%");
    rerender(<Slider label="Volume" min={0} max={200} value={200} onChange={() => {}} />);
    expect(slider.style.getPropertyValue("--omni-slider-fill")).toBe("100%");
  });

  it("starts at the middle like the native input, and calls the onInput of the consumer", () => {
    const onInput = vi.fn();
    render(<Slider label="Volume" onInput={onInput} />);
    const slider = screen.getByRole("slider") as HTMLInputElement;
    expect(slider.style.getPropertyValue("--omni-slider-fill")).toBe("50%");
    fireEvent.input(slider, { target: { value: "10" } });
    expect(onInput).toHaveBeenCalledTimes(1);
  });

  it("links its description, without leaking its own props", () => {
    render(<Slider id="volume" label="Volume" description="Of the speakers." class="custom" />);
    const slider = screen.getByRole("slider");
    expect(slider.getAttribute("aria-describedby")).toBe("volume-description");
    expect(slider.hasAttribute("label")).toBe(false);
    expect(slider.hasAttribute("description")).toBe(false);
  });
});
