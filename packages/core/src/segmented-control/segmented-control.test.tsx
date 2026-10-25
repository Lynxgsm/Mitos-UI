/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import axe from "axe-core";
import SegmentedControl from "@/segmented-control/segmented-control";

afterEach(cleanup);

const kinds = [
  { value: "all", label: "All" },
  { value: "library", label: "Libraries" },
  { value: "tool", label: "Tools", disabled: true },
];
const views = [
  { value: "grid", label: "Grid view", icon: <svg data-testid="grid" />, hideLabel: true },
  { value: "list", label: "List view", icon: <svg data-testid="list" />, hideLabel: true },
];

describe("SegmentedControl", () => {
  it("has no axe violations, with text and icon-only options", async () => {
    const { container } = render(
      <>
        <SegmentedControl legend="Show" hideLegend name="kind" defaultValue="all" options={kinds} />
        <SegmentedControl legend="View" hideLegend name="view" defaultValue="grid" options={views} />
      </>,
    );
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });

  it("is a radio group named by its legend, even when the legend is hidden", () => {
    render(<SegmentedControl legend="Show" hideLegend name="kind" defaultValue="library" options={kinds} />);
    const group = screen.getByRole("radiogroup", { name: "Show" });
    expect(group.tagName).toBe("FIELDSET");
    expect((screen.getByRole("radio", { name: "Libraries" }) as HTMLInputElement).checked).toBe(true);
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("names icon-only options by their label, hides the icon and shows the label as a tooltip", () => {
    render(<SegmentedControl legend="View" name="view" defaultValue="grid" options={views} />);
    const list = screen.getByRole("radio", { name: "List view" });
    expect(screen.getByTestId("list").closest("[aria-hidden=true]")).not.toBeNull();
    expect(list.closest("label")?.getAttribute("title")).toBe("List view");
  });

  it("reports the chosen value and keeps its own state without value", () => {
    const onValueChange = vi.fn();
    render(<SegmentedControl legend="Show" name="kind" defaultValue="all" options={kinds} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("radio", { name: "Libraries" }));
    expect(onValueChange).toHaveBeenCalledWith("library");
    expect((screen.getByRole("radio", { name: "Libraries" }) as HTMLInputElement).checked).toBe(true);
  });

  it("follows value when controlled", () => {
    function Controlled() {
      const [value, setValue] = useState("all");
      return <SegmentedControl legend="Show" name="kind" value={value} onValueChange={setValue} options={kinds} />;
    }
    render(<Controlled />);
    fireEvent.click(screen.getByRole("radio", { name: "Libraries" }));
    expect((screen.getByRole("radio", { name: "Libraries" }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByRole("radio", { name: "All" }) as HTMLInputElement).checked).toBe(false);
  });

  it("refuses a change the parent does not accept", () => {
    render(<SegmentedControl legend="Show" name="kind" value="all" onValueChange={() => {}} options={kinds} />);
    fireEvent.click(screen.getByRole("radio", { name: "Libraries" }));
    expect((screen.getByRole("radio", { name: "All" }) as HTMLInputElement).checked).toBe(true);
  });

  it("disables an option, or the whole control", () => {
    const { rerender } = render(<SegmentedControl legend="Show" name="kind" options={kinds} />);
    expect((screen.getByRole("radio", { name: "Tools" }) as HTMLInputElement).disabled).toBe(true);
    rerender(<SegmentedControl legend="Show" name="kind" options={kinds} disabled />);
    expect((screen.getByRole("radiogroup") as HTMLFieldSetElement).disabled).toBe(true);
  });

  it("forwards attributes to the fieldset, without leaking its own props", () => {
    render(<SegmentedControl legend="Show" name="kind" options={kinds} data-testid="kinds" class="custom" hideLegend />);
    const group = screen.getByTestId("kinds");
    expect(group.classList.contains("custom")).toBe(true);
    for (const prop of ["legend", "options", "hidelegend", "onvaluechange", "defaultvalue"]) expect(group.hasAttribute(prop)).toBe(false);
  });
});
