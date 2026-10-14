/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import Checkbox from "@/checkbox/checkbox";

afterEach(cleanup);

describe("Checkbox", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Checkbox label="Accept the terms" required />
        <Checkbox label="Newsletter" description="One email a month." defaultChecked />
        <Checkbox label="Select all" indeterminate />
        <Checkbox label="Archived" disabled />
        <Checkbox label="Consent" error="Required to continue." />
      </>,
    );
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });

  it("is a native checkbox named by its label, toggled by a click on the label", () => {
    const onChange = vi.fn();
    render(<Checkbox label="Newsletter" onChange={onChange} />);
    const checkbox = screen.getByRole("checkbox", { name: "Newsletter" }) as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    fireEvent.click(screen.getByText("Newsletter"));
    expect(checkbox.checked).toBe(true);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("sets the mixed state as a DOM property and follows the prop", () => {
    const { rerender } = render(<Checkbox label="Select all" indeterminate />);
    const checkbox = screen.getByRole("checkbox", { name: "Select all" }) as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
    rerender(<Checkbox label="Select all" indeterminate={false} />);
    expect(checkbox.indeterminate).toBe(false);
  });

  it("links its description and error, error first", () => {
    render(<Checkbox id="terms" label="Terms" description="Read them first." error="Required." required />);
    const checkbox = screen.getByRole("checkbox", { name: /Terms/ });
    expect(checkbox.getAttribute("aria-describedby")).toBe("terms-error terms-description");
    expect(checkbox.getAttribute("aria-invalid")).toBe("true");
    expect((checkbox as HTMLInputElement).required).toBe(true);
  });

  // natively disabled: browsers ignore clicks on it (jsdom does not, so the property is what we check)
  it("is natively disabled", () => {
    render(<Checkbox label="Archived" disabled />);
    expect((screen.getByRole("checkbox", { name: "Archived" }) as HTMLInputElement).disabled).toBe(true);
  });

  it("forwards native attributes to the input, without leaking its own props", () => {
    const { container } = render(<Checkbox label="Tag" name="tags" value="ui" data-kind="tag" class="custom" indeterminate />);
    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox.name).toBe("tags");
    expect(checkbox.value).toBe("ui");
    expect(checkbox.dataset.kind).toBe("tag");
    expect(checkbox.hasAttribute("indeterminate")).toBe(false);
    expect(checkbox.hasAttribute("label")).toBe(false);
    expect((container.firstElementChild as HTMLElement).classList.contains("custom")).toBe(true);
  });
});
