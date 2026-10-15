# Agent Rules

## Project

- Read `ARCHITECTURE.md` before structural changes: monorepo boundaries, FSD layers of `apps/web`, styling, rendering.
- Use **Bun** for everything (`bun add`, `bun run …`); never npm, pnpm or yarn.
- Everything is in **English**: code, files, routes, commit messages and user-facing text.
- Library components (`packages/core`) follow the `create-component` skill (`.claude/skills/create-component/SKILL.md`): Mitosis source, StyleX, tests with axe, story, export.
- Before creating UI in the website, look in `mitos-ui/react` first; a missing generic component belongs in the library, not in the site.
- Accessibility is a requirement, not a polish step: native elements, WAI-ARIA patterns, WCAG AA contrast, reduced motion.

## Definition of Done

Run from the repository root, and say so if any step was skipped or fails:

```bash
bun run typecheck
bun run test
bun run build
```

---

## Versioning

`mitos-ui` follows **Semantic Versioning 2.0.0**.

```text
MAJOR.MINOR.PATCH
```

- **MAJOR** — incompatible changes to the public API.
- **MINOR** — new backward-compatible functionality.
- **PATCH** — backward-compatible fixes.

The public API is everything a consumer can rely on:

- the entry points: `mitos-ui/react`, `mitos-ui/svelte` and their `styles.css`;
- exported components, functions (`toast`, …) and types;
- component props, events and default values (`variant`, `size`, `class`, `onClick`…);
- the rendered HTML semantics and ARIA behavior consumers and assistive technologies depend on;
- the `--mitos-*` CSS custom properties and the cascade-layer guarantee (unlayered consumer CSS wins);
- the supported framework versions (React 19, Svelte 5).

While `mitos-ui` is `0.x`, breaking changes may use a `MINOR` release.

Never change a version by hand outside of a release, and never reset it. CI never publishes `0.0.0`.

`@mitos/web` is the website, not a package: it is not versioned.

---

## Changelog

`CHANGELOG.md` (at the repository root) records changes to `mitos-ui` that consumers can see.

Examples:

- new components or new framework targets (Vue);
- new props, variants or tokens;
- changed defaults, markup or keyboard behavior;
- user-visible bug fixes, including accessibility fixes;
- breaking changes, with a migration note.

Do not update it for test-only changes, formatting, comments, internal refactoring, build tooling, or website-only changes (`apps/web`).

Follow **Keep a Changelog** with date-based releases. New entries go under `[Unreleased]`, in one of its headings: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`. Start a breaking entry with `**Breaking:**`. These headings decide the next version (see Releasing), so never write a version or a date by hand.

---

## Releasing

Branches flow one way: work branches → `develop` → `main`. Merge `develop` into `main` with a merge commit, never squash or rebase, so `main` never has commits `develop` lacks.

- `ci.yml` runs the Definition of Done on every pull request and on `develop`.
- `release-pr.yml` runs on every push to `develop`. When `[Unreleased]` has entries, it keeps a `Release x.y.z` PR to `develop` up to date (branch `release/next`). The version comes from the CHANGELOG headings:
  - `Fixed` or `Security` only → patch;
  - `Added`, `Changed` or `Deprecated` → minor;
  - `Removed` or a `**Breaking:**` entry → major, or minor while `0.x`.
- `release.yml` runs on every push to `main` and publishes only when the version is new.

To release:

1. Merge the `Release x.y.z` PR into `develop`. It sets the version in `packages/core/package.json` and moves the `[Unreleased]` entries under `[x.y.z] - YYYY-MM-DD`.
2. Merge `develop` into `main`. The workflow publishes `mitos-ui@x.y.z` to npm with provenance. It then creates the `vx.y.z` tag and a GitHub release whose notes come from that CHANGELOG section.

Merging `develop` into `main` without a release PR publishes nothing. A prerelease (`x.y.z-beta.1`) is still set by hand in a PR; it is published under the `next` dist-tag and marked as a prerelease.

Publishing uses npm trusted publishing (OIDC) only: the trusted publisher of `mitos-ui` on npmjs.com is repository `Lynxgsm/Mitos-UI`, workflow `release.yml`, allowed action `npm publish`. The package requires 2FA and refuses tokens, so there is no npm token anywhere: never add one. Renaming the repository or the workflow file means updating the trusted publisher first.

---

## Documentation

Keep documentation responsibilities separate:

- `AGENTS.md` → agent rules and constraints.
- `ARCHITECTURE.md` → architecture and design decisions.
- `apps/web` (the docs site) → user-facing documentation of the library: installation, theming, one page per component.
- `README.md` → repository entry point: what Mitos UI is, how to run and contribute.
- `SECURITY.md` → vulnerability handling and reporting (to create before the first public release).
- `CHANGELOG.md` → user-visible history of `mitos-ui`.

When a component's public API changes, update its docs page in `apps/web` in the same change.
