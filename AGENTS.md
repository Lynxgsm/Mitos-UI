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

Follow **Keep a Changelog** with date-based releases. Until the first release, entries go under `[Unreleased]`.

---

## Releasing

CI (`.github/workflows/ci.yml`) runs the Definition of Done on every pull request and on `develop`.
`.github/workflows/release.yml` runs on every push to `main` and publishes only when the version is new.

1. Open a release PR to `main`. It sets `version` in `packages/core/package.json` and renames `[Unreleased]` in `CHANGELOG.md` to `[x.y.z] - YYYY-MM-DD`, above a new empty `[Unreleased]`.
2. On merge, the workflow publishes `mitos-ui@x.y.z` to npm with provenance. It then creates the `vx.y.z` tag and a GitHub release whose notes come from that CHANGELOG section.
3. A prerelease version (`x.y.z-beta.1`) is published under the `next` dist-tag and marked as a prerelease.

The workflow fails if the new version has no CHANGELOG section. Pushes to `main` that keep an already published version publish nothing.

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
