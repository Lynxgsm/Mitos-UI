// Release PR helper for CI (.github/workflows/release-pr.yml): computes the next version from the [Unreleased]
// section of the CHANGELOG, then sets it in package.json and dates that section. Merged into develop, then into
// main, the version is published by release.yml.
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { changelogSection } from "./release";

export type Bump = "major" | "minor" | "patch";

const MINOR = ["Added", "Changed", "Deprecated"];
const PATCH = ["Fixed", "Security"];

// Keep a Changelog headings decide the bump; Removed, or an entry marked **Breaking**, breaks the public API
export function bumpOf(notes: string): Bump {
  const headings = [...notes.matchAll(/^### (.+)$/gm)].map((match) => match[1].trim());
  const unknown = headings.filter((heading) => heading !== "Removed" && !MINOR.includes(heading) && !PATCH.includes(heading));
  if (!headings.length || unknown.length) {
    throw new Error(
      `CHANGELOG.md [Unreleased]: put entries under Added, Changed, Deprecated, Removed, Fixed or Security${unknown.length ? ` (found: ${unknown.join(", ")})` : ""}.`,
    );
  }
  if (headings.includes("Removed") || /\*\*Breaking/i.test(notes)) return "major";
  return headings.some((heading) => MINOR.includes(heading)) ? "minor" : "patch";
}

export function nextVersion(current: string, bump: Bump): string {
  // shortcut: a prerelease suffix is dropped; prereleases are still set by hand in a release PR
  const [major, minor, patch] = current.split("-")[0].split(".").map(Number);
  if (bump === "major" && major > 0) return `${major + 1}.0.0`;
  // while 0.x, breaking changes ship in a minor release (see AGENTS.md, Versioning)
  if (bump !== "patch") return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

// moves the [Unreleased] entries under a dated version heading, below a new empty [Unreleased]
export function datedChangelog(changelog: string, version: string, date: string): string {
  return changelog.replace(/^## \[Unreleased\]$/m, `## [Unreleased]\n\n## [${version}] - ${date}`);
}

if (import.meta.main) {
  const root = join(import.meta.dir, "../../..");
  const pkgPath = join(import.meta.dir, "../package.json");
  const changelogPath = join(root, "CHANGELOG.md");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const changelog = readFileSync(changelogPath, "utf8");
  const notes = changelogSection(changelog, "Unreleased");

  if (!notes) {
    console.log("CHANGELOG.md [Unreleased] is empty: no release to prepare.");
  } else {
    const version = nextVersion(pkg.version, bumpOf(notes));
    const date = new Date().toISOString().slice(0, 10);
    writeFileSync(pkgPath, readFileSync(pkgPath, "utf8").replace(`"version": "${pkg.version}"`, `"version": "${version}"`));
    writeFileSync(changelogPath, datedChangelog(changelog, version, date));
    writeFileSync(join(root, "release-notes.md"), `${notes}\n`);
    console.log(`${pkg.name}: ${pkg.version} -> ${version}`);
    if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\n`);
  }
}
