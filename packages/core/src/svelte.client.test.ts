// @vitest-environment jsdom
// The Svelte build behaves in the browser: events, effects and state after the runes rewrite.
import { flushSync, mount, unmount } from "svelte";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { fixture } from "./svelte.test.helpers";

describe("Svelte build: client", () => {
  // jsdom does not implement the modal dialog API: emulate its observable effects
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    };
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    };
  });

  let app: Record<string, any> | undefined;
  afterEach(() => {
    if (app) unmount(app);
    app = undefined;
    document.body.innerHTML = "";
  });

  async function show(markup: string, props: Record<string, unknown> = {}) {
    app = mount(await fixture("client", markup), { target: document.body, props });
    flushSync();
  }
  const button = (name: string) =>
    [...document.querySelectorAll("button")].find((element) => element.textContent?.trim() === name)!;

  it("calls both a native onclick and the onClick prop on Button", async () => {
    const [spy, spy2] = [vi.fn(), vi.fn()];
    await show(`<Button onclick={spy} onClick={spy2}>Save</Button>`, { spy, spy2 });
    button("Save").click();
    expect(spy).toHaveBeenCalledOnce();
    expect(spy2).toHaveBeenCalledOnce();
  });

  it("toggles Accordion items", async () => {
    await show(`<Accordion items={[{ title: "Question", content: "Answer" }]} />`);
    expect(button("Question").getAttribute("aria-expanded")).toBe("false");
    button("Question").click();
    flushSync();
    expect(button("Question").getAttribute("aria-expanded")).toBe("true");
  });

  it("opens Dialog from its open prop and closes it through onClose", async () => {
    await show(`
<Button onClick={() => (open = true)}>Open</Button>
<Dialog {open} onClose={() => (open = false)} title="Edit profile">Body</Dialog>`);
    const dialog = document.querySelector("dialog")!;
    expect(dialog.open).toBe(false);
    button("Open").click();
    flushSync();
    expect(dialog.open).toBe(true);
    dialog.querySelector<HTMLButtonElement>('button[aria-label="Close"]')!.click();
    flushSync();
    expect(dialog.open).toBe(false);
  });

  it("forwards native events to the Input field", async () => {
    const spy = vi.fn();
    await show(`<Input label="Name" oninput={spy} />`, { spy });
    document.querySelector("input")!.dispatchEvent(new Event("input", { bubbles: true }));
    expect(spy).toHaveBeenCalledOnce();
  });

  it("falls back to initials when the Avatar image fails", async () => {
    await show(`<Avatar src="https://example.com/ada.png" alt="Ada Lovelace" />`);
    document.querySelector("img")!.dispatchEvent(new Event("error"));
    flushSync();
    const fallback = document.querySelector('[role="img"]')!;
    expect(fallback.tagName).toBe("SPAN");
    expect(fallback.textContent).toBe("AL");
  });

  it("keeps the buttons of a ButtonGroup working", async () => {
    const spy = vi.fn();
    await show(`<ButtonGroup aria-label="Alignment"><Button onClick={spy}>Left</Button><Button>Right</Button></ButtonGroup>`, { spy });
    button("Left").click();
    expect(spy).toHaveBeenCalledOnce();
  });

  it("sets the mixed state of Checkbox and toggles it", async () => {
    await show(`<Checkbox label="Select all" indeterminate />`);
    const checkbox = document.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    expect(checkbox.indeterminate).toBe(true);
    checkbox.click();
    expect(checkbox.checked).toBe(true);
  });

  it("selects the default option of RadioGroup, then the clicked one", async () => {
    await show(`<RadioGroup legend="Plan" name="plan" defaultValue="pro" options={[{ value: "free", label: "Free" }, { value: "pro", label: "Pro" }]} />`);
    const [free, pro] = Array.from(document.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
    expect(pro!.checked).toBe(true);
    free!.click();
    flushSync();
    expect([free!.checked, pro!.checked]).toEqual([true, false]);
  });

  it("reports the chosen SegmentedControl option", async () => {
    const spy = vi.fn();
    await show(`<SegmentedControl legend="Show" name="kind" defaultValue="all" onValueChange={spy} options={[{ value: "all", label: "All" }, { value: "tool", label: "Tools" }]} />`, { spy });
    const [, tools] = Array.from(document.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
    tools!.click();
    flushSync();
    expect(spy).toHaveBeenCalledWith("tool");
    expect(tools!.checked).toBe(true);
  });

  it("adds a TagInput tag on Enter and removes one with its button", async () => {
    const spy = vi.fn();
    await show(`<TagInput id="tags" label="Tags" defaultValue={["forms"]} onValueChange={spy} />`, { spy });
    const input = document.querySelector<HTMLInputElement>('input[type="text"]')!;
    input.value = "to-try";
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    flushSync();
    expect(spy).toHaveBeenLastCalledWith(["forms", "to-try"]);
    document.querySelector<HTMLButtonElement>('button[aria-label="Remove forms"]')!.click();
    flushSync();
    expect(spy).toHaveBeenLastCalledWith(["to-try"]);
    expect(Array.from(document.querySelectorAll("li")).map((li) => li.textContent?.trim())).toEqual(["to-try"]);
  });

  it("moves between Tabs with the arrows", async () => {
    await show(`<Tabs id="t" label="Settings" items={[{ value: "a", label: "Account", content: "A" }, { value: "b", label: "Billing", content: "B" }]} />`);
    const [account, billing] = Array.from(document.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    account!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    flushSync();
    expect(document.activeElement).toBe(billing);
    expect(billing!.getAttribute("aria-selected")).toBe("true");
    expect(document.querySelector('[role="tabpanel"]:not([hidden])')!.textContent).toBe("B");
  });

  it("describes the Tooltip trigger and shows the tooltip on focus", async () => {
    await show(`<Tooltip id="tip" content="Copy to clipboard"><Button>Copy</Button></Tooltip>`);
    const trigger = button("Copy");
    expect(trigger.getAttribute("aria-describedby")).toBe("tip");
    trigger.focus();
    await new Promise((resolve) => setTimeout(resolve, 10));
    flushSync();
    expect(document.getElementById("tip")!.hidden).toBe(false);
  });

  it("opens the Menu and runs an item", async () => {
    const spy = vi.fn();
    await show(`<Menu label="Actions" items={[{ label: "Edit", onSelect: spy }]} />`, { spy });
    button("Actions").click();
    flushSync();
    expect(button("Actions").getAttribute("aria-expanded")).toBe("true");
    button("Edit").click();
    flushSync();
    expect(spy).toHaveBeenCalledOnce();
    expect(button("Actions").getAttribute("aria-expanded")).toBe("false");
  });

  it("filters the Combobox and chooses an option with the keyboard", async () => {
    const spy = vi.fn();
    await show(
      `<Combobox id="fruit" label="Fruit" onValueChange={spy} options={[{ value: "apple", label: "Apple" }, { value: "pear", label: "Pear" }, { value: "plum", label: "Plum" }]} />`,
      { spy },
    );
    const input = document.querySelector<HTMLInputElement>('input[role="combobox"]')!;
    input.value = "p";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    flushSync();
    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect([...document.querySelectorAll('[role="option"]')].map((option) => option.textContent?.trim())).toEqual(["Apple", "Pear", "Plum"]);
    input.value = "plu";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    flushSync();
    expect([...document.querySelectorAll('[role="option"]')].map((option) => option.textContent?.trim())).toEqual(["Plum"]);
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    flushSync();
    expect(input.getAttribute("aria-activedescendant")).toBe("fruit-option-2");
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    flushSync();
    expect(spy).toHaveBeenCalledWith("plum");
    expect(input.value).toBe("Plum");
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("hands SideNav clicks to onNavigate", async () => {
    const spy = vi.fn();
    await show(`<SideNav label="Docs" onNavigate={spy} groups={[{ items: [{ label: "Guide", href: "/guide" }] }]} />`, { spy });
    const link = document.querySelector("a")!;
    const followed = link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));
    expect(followed).toBe(false);
    expect(spy.mock.calls[0]![0]).toBe("/guide");
  });

  it("shows toasts in the Toaster", async () => {
    await show(`<Toaster /><Button onClick={() => toast({ title: "Saved" })}>Notify</Button>`);
    button("Notify").click();
    flushSync();
    expect(document.querySelector("section ol")!.textContent).toContain("Saved");
  });
});
