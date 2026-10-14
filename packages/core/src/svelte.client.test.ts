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

  it("shows toasts in the Toaster", async () => {
    await show(`<Toaster /><Button onClick={() => toast({ title: "Saved" })}>Notify</Button>`);
    button("Notify").click();
    flushSync();
    expect(document.querySelector("section ol")!.textContent).toContain("Saved");
  });
});
