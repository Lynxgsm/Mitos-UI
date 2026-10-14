/** @jsxImportSource react */
// Elements hidden with the hidden attribute must stay hidden: a class that sets display would override the
// browser rule [hidden] { display: none } and keep them on screen (a closed Menu stayed visible that way).
// jsdom does not load the stylesheet, so this reads the compiled CSS (`bun run build` first).
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import Menu from "@/menu/menu";
import Tabs from "@/tabs/tabs";
import Tooltip from "@/tooltip/tooltip";
import Button from "@/button/button";

afterEach(cleanup);

const css = readFileSync("dist/react/assets/stylex.css", "utf8");
// classes with a display declaration, whatever their pseudo-class or media query
const DISPLAY_CLASSES = new Set(
  [...css.matchAll(/\.([\w-]+)(?:[^{]*)\{[^}]*\bdisplay\s*:/g)].map(([, name]) => name),
);

function displayClasses(container: HTMLElement) {
  return [...container.querySelectorAll<HTMLElement>("[hidden]")].flatMap((element) =>
    [...element.classList].filter((name) => DISPLAY_CLASSES.has(name)).map((name) => `${element.getAttribute("role")}: .${name}`),
  );
}

describe("hidden elements", () => {
  it("finds display rules in the compiled CSS", () => {
    expect(DISPLAY_CLASSES.size).toBeGreaterThan(0);
  });

  it.each([
    ["a closed Menu", <Menu label="Actions" items={[{ label: "Edit", onSelect: () => {} }]} />],
    [
      "the unselected Tabs panels",
      <Tabs label="Settings" items={[{ value: "a", label: "A", content: "A" }, { value: "b", label: "B", content: "B" }]} />,
    ],
    [
      "a closed Tooltip",
      <Tooltip content="Copy">
        <Button>Copy</Button>
      </Tooltip>,
    ],
  ])("%s has no class that sets display", (_, element) => {
    const { container } = render(element);
    expect(container.querySelectorAll("[hidden]").length).toBeGreaterThan(0);
    expect(displayClasses(container)).toEqual([]);
  });
});
