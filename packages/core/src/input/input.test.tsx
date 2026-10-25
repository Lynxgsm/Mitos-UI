/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import axe from "axe-core";
import Input from "@/input/input";

afterEach(cleanup);

const describedText = (field: HTMLElement) =>
  (field.getAttribute("aria-describedby") ?? "")
    .split(" ")
    .filter(Boolean)
    .map((id) => document.getElementById(id)?.textContent);

describe("Input", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Input label="Display name" />
        <Input label="Email" type="email" description="We never share it." required />
        <Input label="Username" error="This username is taken." defaultValue="ines" />
        <Input label="Plan" disabled defaultValue="Pro" />
      </>,
    );
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });

  it("is a textbox named by its label", () => {
    render(<Input label="Display name" />);
    const field = screen.getByRole("textbox", { name: "Display name" });
    expect(field.tagName).toBe("INPUT");
    expect(field.getAttribute("type")).toBe("text");
  });

  it("keeps its name when required, without reading the visual asterisk", () => {
    render(<Input label="Email" required />);
    const field = screen.getByRole("textbox", { name: "Email" }) as HTMLInputElement;
    expect(field.required).toBe(true);
  });

  it("links its description", () => {
    render(<Input label="Email" description="We never share it." />);
    expect(describedText(screen.getByRole("textbox"))).toEqual(["We never share it."]);
  });

  it("marks an error as invalid and reads it before the description", () => {
    render(<Input label="Username" description="Letters only." error="This username is taken." />);
    const field = screen.getByRole("textbox", { name: "Username" });
    expect(field.getAttribute("aria-invalid")).toBe("true");
    expect(describedText(field)).toEqual(["This username is taken.", "Letters only."]);
  });

  it("is valid and undescribed by default", () => {
    render(<Input label="Display name" />);
    const field = screen.getByRole("textbox");
    expect(field.hasAttribute("aria-invalid")).toBe(false);
    expect(field.hasAttribute("aria-describedby")).toBe(false);
  });

  it("forwards the input type", () => {
    render(<Input label="Password" type="password" />);
    expect(screen.getByLabelText("Password").getAttribute("type")).toBe("password");
  });

  it("works controlled", () => {
    function Controlled() {
      const [value, setValue] = useState("Inès");
      return (
        <>
          <Input label="Display name" value={value} onChange={(event) => setValue(event.target.value)} />
          <output>{value}</output>
        </>
      );
    }
    render(<Controlled />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Inès Moreau" } });
    expect(screen.getByRole("status").textContent).toBe("Inès Moreau");
  });

  it("cannot be edited or focused when disabled", () => {
    const onFocus = vi.fn();
    render(<Input label="Plan" disabled onFocus={onFocus} />);
    const field = screen.getByRole("textbox", { name: "Plan" }) as HTMLInputElement;
    field.focus();
    expect(field.disabled).toBe(true);
    expect(document.activeElement).not.toBe(field);
    expect(onFocus).not.toHaveBeenCalled();
  });

  it("derives stable ids from the `id` prop", () => {
    render(<Input id="email" label="Email" description="Work address." error="Required." />);
    const field = screen.getByRole("textbox");
    expect(field.id).toBe("email");
    expect(field.getAttribute("aria-describedby")).toBe("email-error email-description");
  });

  it("forwards native, ARIA and data attributes to the <input>, without leaking its own props", () => {
    const { container } = render(
      <Input
        label="Search"
        name="q"
        placeholder="Components…"
        autoComplete="off"
        aria-keyshortcuts="/"
        data-testid-hint="search"
        class="custom"
        description="Press /"
      />,
    );
    const field = screen.getByRole("textbox", { name: "Search" });
    expect(field.getAttribute("name")).toBe("q");
    expect(field.getAttribute("placeholder")).toBe("Components…");
    expect(field.getAttribute("autocomplete")).toBe("off");
    expect(field.getAttribute("aria-keyshortcuts")).toBe("/");
    expect(field.getAttribute("data-testid-hint")).toBe("search");
    for (const prop of ["label", "description", "error"]) expect(field.hasAttribute(prop)).toBe(false);
    expect((container.firstElementChild as HTMLElement).classList.contains("custom")).toBe(true);
  });

  it("supports date, time, file and color types, with their own styles for file and color", () => {
    render(
      <>
        <Input label="Birthday" type="date" min="1900-01-01" />
        <Input label="Alarm" type="time" step={60} />
        <Input label="Meeting" type="datetime-local" />
        <Input label="Avatar" type="file" accept="image/*" />
        <Input label="Brand color" type="color" />
        <Input label="Name" />
      </>,
    );
    const field = (name: string) => screen.getByLabelText(name) as HTMLInputElement;
    expect(["Birthday", "Alarm", "Meeting", "Avatar", "Brand color"].map((name) => field(name).type)).toEqual([
      "date",
      "time",
      "datetime-local",
      "file",
      "color",
    ]);
    expect(field("Birthday").min).toBe("1900-01-01");
    expect(field("Avatar").accept).toBe("image/*");
    // file and color get extra styles; date keeps the text field ones
    expect(field("Avatar").className).not.toBe(field("Name").className);
    expect(field("Brand color").className).not.toBe(field("Name").className);
    expect(field("Birthday").className).toBe(field("Name").className);
  });

  it("keeps a hidden label as its name, and hides its icon and end hint from assistive technology", async () => {
    const { container } = render(
      <Input
        label="Search"
        hideLabel
        type="search"
        placeholder="Name or tag"
        startIcon={<svg data-testid="icon" />}
        endSlot={<kbd>/</kbd>}
      />,
    );
    const field = screen.getByRole("searchbox", { name: "Search" });
    expect(screen.getByText("Search").className).not.toBe(screen.getByText("/").className);
    expect(screen.getByTestId("icon").closest("[aria-hidden=true]")).not.toBeNull();
    expect(screen.getByText("/").closest("[aria-hidden=true]")).not.toBeNull();
    // the text starts after the icon and stops before the hint
    expect(field.className).not.toBe(render(<Input label="Plain" />).getByRole("textbox").className);
    for (const prop of ["hidelabel", "starticon", "endslot"]) expect(field.hasAttribute(prop)).toBe(false);
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });
});
