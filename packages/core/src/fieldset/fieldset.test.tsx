/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import Fieldset from "@/fieldset/fieldset";
import Input from "@/input/input";

afterEach(cleanup);

describe("Fieldset", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <Fieldset legend="Shipping address" description="Where we send your order.">
        <Input label="Street" />
        <Input label="City" />
      </Fieldset>,
    );
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });

  it("is a group named by its legend, containing its fields", () => {
    render(
      <Fieldset legend="Shipping address">
        <Input label="City" />
      </Fieldset>,
    );
    const group = screen.getByRole("group", { name: "Shipping address" });
    expect(group.tagName).toBe("FIELDSET");
    expect(group.contains(screen.getByRole("textbox", { name: "City" }))).toBe(true);
  });

  it("links its description", () => {
    render(<Fieldset id="address" legend="Address" description="Where we send it." />);
    expect(screen.getByRole("group").getAttribute("aria-describedby")).toBe("address-description");
  });

  it("disables every field inside", () => {
    render(
      <Fieldset legend="Address" disabled>
        <Input label="City" />
      </Fieldset>,
    );
    expect((screen.getByRole("textbox", { name: "City" }) as HTMLInputElement).matches(":disabled")).toBe(true);
  });

  it("forwards attributes, without leaking its own props", () => {
    render(<Fieldset legend="Address" class="custom" data-step="1" />);
    const group = screen.getByRole("group");
    expect(group.dataset.step).toBe("1");
    expect(group.classList.contains("custom")).toBe(true);
    expect(group.hasAttribute("legend")).toBe(false);
  });
});
