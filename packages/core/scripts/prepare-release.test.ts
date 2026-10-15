// @vitest-environment node
import { describe, expect, it } from "vitest";
import { bumpOf, datedChangelog, nextVersion } from "./prepare-release";

describe("prepare-release", () => {
  it("reads the bump from the Keep a Changelog headings", () => {
    expect(bumpOf("### Fixed\n\n- A fix.")).toBe("patch");
    expect(bumpOf("### Fixed\n\n- A fix.\n\n### Security\n\n- A patch.")).toBe("patch");
    expect(bumpOf("### Added\n\n- `Combobox`.\n\n### Fixed\n\n- A fix.")).toBe("minor");
    expect(bumpOf("### Removed\n\n- `Skeleton`.")).toBe("major");
    expect(bumpOf("### Changed\n\n- **Breaking:** `size` defaults to `sm`.")).toBe("major");
  });

  it("refuses entries outside the known headings", () => {
    expect(() => bumpOf("- An entry without heading.")).toThrow(/Added, Changed/);
    expect(() => bumpOf("### New\n\n- Something.")).toThrow(/found: New/);
  });

  it("computes the next version, breaking changes being minor while 0.x", () => {
    expect(nextVersion("0.1.0", "patch")).toBe("0.1.1");
    expect(nextVersion("0.1.3", "minor")).toBe("0.2.0");
    expect(nextVersion("0.1.3", "major")).toBe("0.2.0");
    expect(nextVersion("1.4.2", "major")).toBe("2.0.0");
    expect(nextVersion("1.4.2", "minor")).toBe("1.5.0");
  });

  it("dates the unreleased entries below a new empty [Unreleased]", () => {
    const changelog = "# Changelog\n\n## [Unreleased]\n\n### Added\n\n- `Combobox`.\n\n## [0.1.0] - 2026-10-15\n";
    expect(datedChangelog(changelog, "0.2.0", "2026-11-02")).toBe(
      "# Changelog\n\n## [Unreleased]\n\n## [0.2.0] - 2026-11-02\n\n### Added\n\n- `Combobox`.\n\n## [0.1.0] - 2026-10-15\n",
    );
  });
});
