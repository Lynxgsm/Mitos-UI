// Release helper for CI (.github/workflows): decides whether the version in package.json must be published, and
// takes its notes from the CHANGELOG. A release is a PR that sets the version and dates its CHANGELOG section;
// merged on main, that version is published once. 0.0.0 means nothing has been released yet.
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export type Release = { name: string; version: string; publish: boolean; prerelease: boolean; notes: string | null };

// The body of "## [version] - date", up to the next "## [" heading.
export function changelogSection(changelog: string, version: string): string | null {
  const lines = changelog.split("\n");
  const start = lines.findIndex((line) => line.startsWith(`## [${version}]`));
  if (start < 0) return null;
  const end = lines.findIndex((line, index) => index > start && line.startsWith("## ["));
  const body = lines.slice(start + 1, end < 0 ? undefined : end).join("\n").trim();
  return body || null;
}

export function release(pkg: { name: string; version: string }, changelog: string, isPublished: (spec: string) => boolean): Release {
  const publish = pkg.version !== "0.0.0" && !isPublished(`${pkg.name}@${pkg.version}`);
  return {
    name: pkg.name,
    version: pkg.version,
    publish,
    prerelease: pkg.version.includes("-"),
    notes: changelogSection(changelog, pkg.version),
  };
}

if (import.meta.main) {
  const root = join(import.meta.dir, "../../..");
  const pkg = JSON.parse(readFileSync(join(import.meta.dir, "../package.json"), "utf8"));
  const changelog = readFileSync(join(root, "CHANGELOG.md"), "utf8");
  // a 404 from the registry (never published) is a non-zero exit, like any other failure: both mean "publish it"
  const isPublished = (spec: string) => Bun.spawnSync(["npm", "view", spec, "version"]).exitCode === 0;
  const info = release(pkg, changelog, isPublished);

  console.log(`${info.name}@${info.version}: ${info.publish ? "to publish" : "nothing to publish"}`);
  if (info.publish && !info.notes) {
    console.error(`CHANGELOG.md has no "## [${info.version}] - YYYY-MM-DD" section: add the release notes first.`);
    process.exit(1);
  }
  if (info.notes) writeFileSync(join(root, "release-notes.md"), `${info.notes}\n`);
  if (process.env.GITHUB_OUTPUT) {
    const output = { name: info.name, version: info.version, publish: info.publish, prerelease: info.prerelease };
    appendFileSync(process.env.GITHUB_OUTPUT, Object.entries(output).map(([key, value]) => `${key}=${value}\n`).join(""));
  }
}
