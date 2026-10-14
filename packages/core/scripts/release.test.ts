// @vitest-environment node
import { describe, expect, it } from "vitest";
import { changelogSection, release } from "./release";

const CHANGELOG = `# Changelog

## [Unreleased]

- Work in progress.

## [0.2.0-beta.1] - 2026-11-02

### Added

- \`Combobox\`.

## [0.1.0] - 2026-10-20

### Added

- First components.
`;

const never = () => false;

describe("release", () => {
  it("takes the section of a version, up to the next one", () => {
    expect(changelogSection(CHANGELOG, "0.1.0")).toBe("### Added\n\n- First components.");
    expect(changelogSection(CHANGELOG, "0.2.0-beta.1")).toBe("### Added\n\n- `Combobox`.");
    expect(changelogSection(CHANGELOG, "0.3.0")).toBeNull();
  });

  it("publishes a new version, once", () => {
    const pkg = { name: "mitos-ui", version: "0.1.0" };
    expect(release(pkg, CHANGELOG, never)).toMatchObject({ publish: true, prerelease: false });
    expect(release(pkg, CHANGELOG, (spec) => spec === "mitos-ui@0.1.0").publish).toBe(false);
  });

  it("never publishes 0.0.0, which means nothing released yet", () => {
    expect(release({ name: "mitos-ui", version: "0.0.0" }, CHANGELOG, never).publish).toBe(false);
  });

  it("flags prereleases, published under the next tag", () => {
    expect(release({ name: "mitos-ui", version: "0.2.0-beta.1" }, CHANGELOG, never).prerelease).toBe(true);
  });

  it("reports a missing CHANGELOG section as missing notes", () => {
    expect(release({ name: "mitos-ui", version: "0.3.0" }, CHANGELOG, never).notes).toBeNull();
  });
});
