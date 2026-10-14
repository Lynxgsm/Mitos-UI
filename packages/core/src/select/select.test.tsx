/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import Select from "@/select/select";

afterEach(cleanup);

const COUNTRIES = [
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "gh", label: "Ghana", disabled: true },
];

describe("Select", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Select label="Country" options={COUNTRIES} placeholder="Choose a country" />
        <Select label="Region" options={COUNTRIES} description="Used for taxes." required />
        <Select label="Language" options={COUNTRIES} error="Pick a language." />
      </>,
    );
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });

  it("is a native select named by its label, with its options and placeholder", () => {
    render(<Select label="Country" options={COUNTRIES} placeholder="Choose a country" />);
    const select = screen.getByRole("combobox", { name: "Country" }) as HTMLSelectElement;
    expect(select.tagName).toBe("SELECT");
    expect(Array.from(select.options).map((option) => option.value)).toEqual(["", "fr", "jp", "gh"]);
    expect(select.value).toBe("");
    expect(screen.getByRole("option", { name: "Ghana" })).toHaveProperty("disabled", true);
  });

  it("reports changes", () => {
    const onChange = vi.fn();
    render(<Select label="Country" options={COUNTRIES} onChange={onChange} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "jp" } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("jp");
  });

  it("links its description and error, error first", () => {
    render(<Select id="country" label="Country" options={COUNTRIES} description="For taxes." error="Required." required />);
    const select = screen.getByRole("combobox", { name: /Country/ }) as HTMLSelectElement;
    expect(select.getAttribute("aria-describedby")).toBe("country-error country-description");
    expect(select.getAttribute("aria-invalid")).toBe("true");
    expect(select.required).toBe(true);
  });

  it("forwards native attributes, without leaking its own props", () => {
    const { container } = render(
      <Select label="Country" options={COUNTRIES} name="country" defaultValue="jp" disabled class="custom" />,
    );
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.name).toBe("country");
    expect(select.value).toBe("jp");
    expect(select.disabled).toBe(true);
    expect(select.hasAttribute("options")).toBe(false);
    expect((container.firstElementChild as HTMLElement).classList.contains("custom")).toBe(true);
  });
});
