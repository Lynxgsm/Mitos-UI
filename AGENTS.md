# Agent Rules

## Project

- Read `ARCHITECTURE.md` before structural changes: monorepo boundaries, FSD layers of `apps/web`, styling, rendering.
- Use **Bun** for everything (`bun add`, `bun run …`); never npm, pnpm or yarn.
- Everything is in **English**: code, files, routes, commit messages and user-facing text.
- Library components (`packages/core`) follow the `create-component` skill (`.claude/skills/create-component/SKILL.md`): Mitosis source, StyleX, tests with axe, story, export.
- Before creating UI in the website, look in `@omni/core/react` first; a missing generic component belongs in the library, not in the site.
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

`@omni/core` follows **Semantic Versioning 2.0.0**.

```text
MAJOR.MINOR.PATCH
```

- **MAJOR** — incompatible changes to the public API.
- **MINOR** — new backward-compatible functionality.
- **PATCH** — backward-compatible fixes.

The public API is everything a consumer can rely on:

- the entry points: `@omni/core/react`, `@omni/core/svelte` and their `styles.css`;
- exported components, functions (`toast`, …) and types;
- component props, events and default values (`variant`, `size`, `class`, `onClick`…);
- the rendered HTML semantics and ARIA behavior consumers and assistive technologies depend on;
- the `--omni-*` CSS custom properties and the cascade-layer guarantee (unlayered consumer CSS wins);
- the supported framework versions (React 19, Svelte 5).

While `@omni/core` is `0.x`, breaking changes may use a `MINOR` release.

`@omni/core` is still `0.0.0` and private: nothing has been released yet. Never change a version by hand outside of a release, and never reset it.

`@omni/web` is the website, not a package: it is not versioned.

---

## Changelog

`CHANGELOG.md` (at the repository root) records changes to `@omni/core` that consumers can see.

Examples:

- new components or new framework targets (Vue);
- new props, variants or tokens;
- changed defaults, markup or keyboard behavior;
- user-visible bug fixes, including accessibility fixes;
- breaking changes, with a migration note.

Do not update it for test-only changes, formatting, comments, internal refactoring, build tooling, or website-only changes (`apps/web`).

Follow **Keep a Changelog** with date-based releases. Until the first release, entries go under `[Unreleased]`.

---

## Documentation

Keep documentation responsibilities separate:

- `AGENTS.md` → agent rules and constraints.
- `ARCHITECTURE.md` → architecture and design decisions.
- `apps/web` (the docs site) → user-facing documentation of the library: installation, theming, one page per component.
- `README.md` → repository entry point: what Omni UI is, how to run and contribute (to create).
- `SECURITY.md` → vulnerability handling and reporting (to create before the first public release).
- `CHANGELOG.md` → user-visible history of `@omni/core`.

When a component's public API changes, update its docs page in `apps/web` in the same change.
