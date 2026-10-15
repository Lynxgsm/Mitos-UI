/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import Combobox from "@/combobox/combobox";

afterEach(cleanup);

const FRUITS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry", disabled: true },
  { value: "cherry", label: "Cherry" },
];

const field = (name = "Fruit") => screen.getByRole("combobox", { name }) as HTMLInputElement;
const visibleOptions = () => screen.queryAllByRole("option").map((option) => option.textContent);
const activeOption = () => {
  const id = field().getAttribute("aria-activedescendant");
  return id ? document.getElementById(id)?.textContent : null;
};
const type = (text: string) => fireEvent.input(field(), { target: { value: text } });
const key = (name: string, init: KeyboardEventInit = {}) => fireEvent.keyDown(field(), { key: name, ...init });

describe("Combobox", () => {
  it("has no axe violations, closed and open", async () => {
    const { container } = render(
      <>
        <Combobox id="fruit" label="Fruit" options={FRUITS} placeholder="Search" />
        <Combobox id="snack" label="Snack" options={FRUITS} description="Pick one." required defaultValue="apple" />
        <Combobox id="dessert" label="Dessert" options={FRUITS} error="Pick a dessert." />
      </>,
    );
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const rules = { "color-contrast": { enabled: false } };
    expect((await axe.run(container, { rules })).violations).toEqual([]);
    key("ArrowDown");
    expect((await axe.run(container, { rules })).violations).toEqual([]);
  });

  it("is a text field with the combobox role, wired to its listbox", () => {
    render(<Combobox id="fruit" label="Fruit" options={FRUITS} />);
    expect(field().tagName).toBe("INPUT");
    expect(field().getAttribute("aria-autocomplete")).toBe("list");
    expect(field().getAttribute("aria-expanded")).toBe("false");
    expect(field().getAttribute("aria-controls")).toBe("fruit-listbox");
    expect(document.getElementById("fruit-listbox")!.getAttribute("role")).toBe("listbox");
  });

  it("filters the options while typing and announces the count", () => {
    render(<Combobox id="fruit" label="Fruit" options={FRUITS} />);
    type("err");
    expect(field().getAttribute("aria-expanded")).toBe("true");
    expect(visibleOptions()).toEqual(["Blueberry", "Cherry"]);
    expect(screen.getByText("2 results")).toBeTruthy();
    type("kiwi");
    expect(visibleOptions()).toEqual([]);
    expect(screen.getByText("No results")).toBeTruthy();
  });

  it("moves with the arrows, skipping disabled options and wrapping, and chooses with Enter", () => {
    const onValueChange = vi.fn();
    render(<Combobox id="fruit" label="Fruit" options={FRUITS} onValueChange={onValueChange} />);
    key("ArrowDown");
    expect(field().getAttribute("aria-expanded")).toBe("true");
    expect(activeOption()).toBe("Apple");
    key("ArrowDown");
    key("ArrowDown");
    expect(activeOption()).toBe("Cherry");
    key("ArrowDown");
    expect(activeOption()).toBe("Apple");
    key("ArrowUp");
    expect(activeOption()).toBe("Cherry");
    key("Enter");
    expect(onValueChange).toHaveBeenCalledWith("cherry");
    expect(field().value).toBe("Cherry");
    expect(field().getAttribute("aria-expanded")).toBe("false");
  });

  it("opens on ArrowUp on the last option, and Alt+ArrowDown opens without moving", () => {
    render(<Combobox id="fruit" label="Fruit" options={FRUITS} />);
    key("ArrowUp");
    expect(activeOption()).toBe("Cherry");
    key("Escape");
    key("ArrowDown", { altKey: true });
    expect(field().getAttribute("aria-expanded")).toBe("true");
    expect(field().hasAttribute("aria-activedescendant")).toBe(false);
  });

  it("shows every option when opened on a chosen value, and marks it selected", () => {
    render(<Combobox id="fruit" label="Fruit" options={FRUITS} defaultValue="banana" />);
    expect(field().value).toBe("Banana");
    fireEvent.click(field());
    expect(visibleOptions()).toEqual(["Apple", "Banana", "Blueberry", "Cherry"]);
    expect(screen.getByRole("option", { name: "Banana" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("option", { name: "Apple" }).getAttribute("aria-selected")).toBe("false");
  });

  it("chooses with the pointer, but not a disabled option", () => {
    const onValueChange = vi.fn();
    render(<Combobox id="fruit" label="Fruit" options={FRUITS} onValueChange={onValueChange} />);
    fireEvent.click(field());
    fireEvent.mouseDown(screen.getByRole("option", { name: "Blueberry" }));
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.mouseEnter(screen.getByRole("option", { name: "Banana" }));
    expect(activeOption()).toBe("Banana");
    fireEvent.mouseDown(screen.getByRole("option", { name: "Banana" }));
    expect(onValueChange).toHaveBeenCalledWith("banana");
    expect(field().value).toBe("Banana");
  });

  it("closes on Escape, then clears the field on a second Escape", () => {
    const onValueChange = vi.fn();
    render(<Combobox id="fruit" label="Fruit" options={FRUITS} defaultValue="apple" onValueChange={onValueChange} />);
    key("ArrowDown");
    key("Escape");
    expect(field().getAttribute("aria-expanded")).toBe("false");
    expect(field().value).toBe("Apple");
    key("Escape");
    expect(field().value).toBe("");
    expect(onValueChange).toHaveBeenCalledWith("");
  });

  it("puts back the chosen label when the field loses focus with unmatched text", () => {
    render(<Combobox id="fruit" label="Fruit" options={FRUITS} defaultValue="apple" />);
    type("Ban");
    fireEvent.blur(field());
    expect(field().value).toBe("Apple");
    expect(field().getAttribute("aria-expanded")).toBe("false");
  });

  it("submits the chosen value with the form under its name", () => {
    const { container } = render(
      <form>
        <Combobox id="fruit" label="Fruit" options={FRUITS} name="fruit" defaultValue="cherry" />
      </form>,
    );
    expect(new FormData(container.querySelector("form")!).get("fruit")).toBe("cherry");
  });

  it("is not editable when disabled", () => {
    render(<Combobox id="fruit" label="Fruit" options={FRUITS} disabled />);
    expect(field().disabled).toBe(true);
  });

  it("forwards native attributes, without leaking its own props", () => {
    const { container } = render(
      <Combobox label="Fruit" options={FRUITS} required aria-label="Favorite fruit" data-testing="yes" class="custom" />,
    );
    const input = field("Favorite fruit");
    expect(input.required).toBe(true);
    expect(input.getAttribute("data-testing")).toBe("yes");
    expect(input.hasAttribute("options")).toBe(false);
    expect((container.firstElementChild as HTMLElement).classList.contains("custom")).toBe(true);
  });
});
