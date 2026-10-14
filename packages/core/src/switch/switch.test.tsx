/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import Switch from "@/switch/switch";

afterEach(cleanup);

describe("Switch", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Switch label="Airplane mode" />
        <Switch label="Wi-Fi" description="Join known networks automatically." defaultChecked />
        <Switch label="Bluetooth" disabled />
      </>,
    );
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });

  it("is a switch named by its label, whose name does not change with its state", () => {
    const onChange = vi.fn();
    render(<Switch label="Airplane mode" onChange={onChange} />);
    expect(screen.getByRole("switch", { name: "Airplane mode", checked: false })).toBeTruthy();
    fireEvent.click(screen.getByRole("switch"));
    expect(screen.getByRole("switch", { name: "Airplane mode", checked: true })).toBeTruthy();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("links its description", () => {
    render(<Switch id="wifi" label="Wi-Fi" description="Join known networks." />);
    expect(screen.getByRole("switch").getAttribute("aria-describedby")).toBe("wifi-description");
    expect(document.getElementById("wifi-description")!.textContent).toBe("Join known networks.");
  });

  // natively disabled: browsers ignore clicks on it (jsdom does not, so the property is what we check)
  it("is natively disabled", () => {
    render(<Switch label="Bluetooth" disabled />);
    expect((screen.getByRole("switch", { name: "Bluetooth" }) as HTMLInputElement).disabled).toBe(true);
  });

  it("forwards native attributes, without leaking its own props", () => {
    render(<Switch label="Sync" name="sync" data-setting="sync" class="custom" />);
    const toggle = screen.getByRole("switch") as HTMLInputElement;
    expect(toggle.name).toBe("sync");
    expect(toggle.dataset.setting).toBe("sync");
    expect(toggle.hasAttribute("label")).toBe(false);
    expect(toggle.classList.contains("custom")).toBe(false);
  });
});
