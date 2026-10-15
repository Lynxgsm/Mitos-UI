# Mitos UI

Accessible, themeable UI components written once with [Mitosis](https://mitosis.builder.io/) and styled with
[StyleX](https://stylexjs.com/), compiled for **React 19** and **Svelte 5**.

- **One source, two frameworks**: every component is a single `.lite.tsx` file, compiled to React and to Svelte 5 runes.
- **Accessible by default**: native elements and WAI-ARIA patterns, axe tests for every component, WCAG AA contrast checked in CI.
- **Themeable**: every color and radius is a `--mitos-*` CSS custom property. The library styles live in cascade layers, so your own CSS always wins.
- **No bundler plugin**: one precompiled stylesheet.

```bash
npm install mitos-ui
```

```tsx
import "mitos-ui/react/styles.css";
import { Button } from "mitos-ui/react";

export default function App() {
  return <Button>Click me</Button>;
}
```

Usage for Svelte, theming and one page per component are covered in the [documentation site](https://lynxgsm.github.io/Mitos-UI/) (`apps/web`).

## Repository

| Workspace       | Package            | Role                                                             |
| --------------- | ------------------ | ---------------------------------------------------------------- |
| `packages/core` | `mitos-ui` | The component library, published to npm                          |
| `apps/web`      | `@mitos/web`        | The website: landing page, documentation, blocks, theme builder |

## Development

Requires [Bun](https://bun.sh/) 1.4 or later. Use Bun for every command.

```bash
bun install
bun run dev         # builds the library, then starts the website
bun run storybook   # library components in Storybook
bun run typecheck
bun run test
bun run build
```

## Contributing

1. Read [ARCHITECTURE.md](ARCHITECTURE.md) and [AGENTS.md](AGENTS.md): they describe the structure and the rules the code follows.
2. New components follow the [create-component skill](.claude/skills/create-component/SKILL.md): Mitosis source, StyleX, tests with axe, a story, the export, and a docs page.
3. Note changes that consumers can see in [CHANGELOG.md](CHANGELOG.md), under `[Unreleased]`.
4. Open a pull request against `develop`. CI runs typecheck, tests and build.

Releases are published to npm from `main`; see "Releasing" in [AGENTS.md](AGENTS.md).

## License

[MIT](LICENSE)
