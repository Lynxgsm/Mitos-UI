# Architecture

## 1. Overview

Mitos UI is a **Bun monorepo** with two workspaces:

| Workspace       | Package      | Role                                                                                  |
| --------------- | ------------ | ------------------------------------------------------------------------------------- |
| `packages/core` | `mitos-ui` | The design system: components written once in Mitosis, styled with StyleX, compiled for React and Svelte |
| `apps/web`      | `@mitos/web`  | The website: landing page, documentation, theme builder. A **TanStack Start** app      |

The web app follows a pragmatic **Feature-Sliced Design (FSD)** architecture adapted to **TanStack Start**. The library does not: it has its own component-per-folder structure (see §3).

> **Enforced.** `apps/web/src/app/architecture.test.ts` checks the dependency rules on every `bun run test` (§27).

### Stack

- **TanStack Start** (on Vite) with **TanStack Router** file-based routing: SSR, routing, `head`, search params, loaders
- **React 19**
- **mitos-ui**, the in-house design system, consumed through its public entry points (`mitos-ui/react`)
- **Plain CSS** with the `--mitos-*` design tokens and the site's `--site-*` variables (no Tailwind, no CSS-in-JS in the web app)
- **Shiki** for code highlighting, **Phosphor** for icons
- **bun test** for the web app's unit tests; **Vitest** + **axe-core** for the library
- **Bun** as package manager and script runner

The architecture is designed to provide:

- Clear separation of concerns
- Predictable code organization
- Low coupling between features
- Strong testability
- Clear boundaries for AI coding agents

### Commands

Run from the repository root:

```bash
bun run dev        # builds mitos-ui, then starts the web app
bun run build      # builds every workspace
bun run typecheck  # builds mitos-ui, then typechecks every workspace
bun run test       # tests every workspace
```

---

## 2. FSD Layers

The web app follows this dependency hierarchy:

```text
app
 ↓
pages
 ↓
widgets
 ↓
features
 ↓
entities
 ↓
shared
```

A layer may only depend on layers below it.

### Allowed

```text
features/select-framework
        ↓
entities/framework
        ↓
shared/ui/tabs
```

### Forbidden

```text
entities/framework
        ↓
features/select-framework
```

Slices at the same layer must not depend directly on each other.

For example:

```text
widgets/site-header
        ↓
widgets/docs-layout
```

is forbidden.

If two slices need common functionality, move it to the appropriate lower layer.

External packages are not layers: `mitos-ui/react`, `@tanstack/react-router`, `react` and `@phosphor-icons/react` may be imported from any layer.

---

## 3. Monorepo Boundaries

```text
packages/core  ──(build)──▶  dist/react, dist/svelte  ──(npm entry points)──▶  apps/web
```

- `apps/web` imports the library **only through its public entry points**: `mitos-ui/react` and `mitos-ui/react/styles.css`.
- Never import from `packages/core/src`, `packages/core/output` or `packages/core/dist/...` paths. The web app must use the library exactly like any consumer would.
- The library is built before the web app runs (`bun run dev` and `bun run typecheck` do it). After changing a component, rebuild it (`bun --filter mitos-ui build`) to see the change in the site.
- `packages/core` is **not** organized with FSD. Each component lives in `src/<name>/` (`<name>.lite.tsx`, `<name>.test.tsx`, `<name>.stories.tsx`) and is exported from `src/index.ts`. Follow the `create-component` skill (`.claude/skills/create-component/SKILL.md`) for anything in the library.

---

## 4. Project Structure

Structure of `apps/web` (docs examples abbreviated):

```text
apps/web/
├── vite.config.ts                 # tanstackStart({ router: … }) points at src/app
├── tsconfig.json                  # "@/*" → "./src/*"
└── src/
    ├── app/
    │   ├── router.tsx             # getRouter() + Register declaration
    │   ├── routeTree.gen.ts       # generated, never edited
    │   ├── architecture.test.ts   # FSD rules, checked by bun test
    │   ├── routes/                # TanStack Router file routes (thin)
    │   │   ├── __root.tsx
    │   │   ├── index.tsx
    │   │   ├── create.tsx
    │   │   └── docs/
    │   │       ├── route.tsx
    │   │       ├── index.tsx
    │   │       ├── installation.tsx
    │   │       ├── theming.tsx
    │   │       └── components/
    │   │           ├── accordion.tsx
    │   │           ├── button.tsx
    │   │           └── …
    │   └── styles/
    │       ├── base.css           # resets, fonts
    │       ├── site.css           # site-wide chrome, --site-* variables
    │       └── site-theme.ts      # SITE_THEME_CSS (the site's brand theme)
    │
    ├── pages/
    │   ├── landing/
    │   │   ├── ui/
    │   │   │   ├── landing-page.tsx
    │   │   │   ├── compile-beams.tsx
    │   │   │   ├── works-with.tsx
    │   │   │   └── theme-playground.tsx
    │   │   ├── landing.css
    │   │   └── index.ts
    │   ├── blocks/
    │   │   ├── blocks/            # one file per block, copied as-is by users (library imports only)
    │   │   ├── model/blocks.ts    # catalog: title, category; components and sources via import.meta.glob
    │   │   ├── ui/
    │   │   ├── blocks.css
    │   │   └── index.ts
    │   ├── create/
    │   │   ├── ui/
    │   │   │   ├── create-page.tsx
    │   │   │   └── preview.tsx
    │   │   ├── create.css
    │   │   └── index.ts
    │   └── docs/                  # slice group: one slice per docs page
    │       ├── introduction/
    │       ├── installation/
    │       ├── theming/
    │       └── button/
    │           ├── ui/
    │           │   └── button-page.tsx
    │           ├── examples/
    │           │   ├── button-demo.tsx
    │           │   ├── button-variants.tsx
    │           │   └── …
    │           └── index.ts
    │
    ├── widgets/
    │   ├── site-header/
    │   │   ├── ui/
    │   │   │   └── site-header.tsx
    │   │   ├── site-header.css
    │   │   └── index.ts
    │   └── docs-layout/
    │       ├── ui/
    │       │   ├── docs-layout.tsx        # header slot + sidebar + <Outlet />
    │       │   ├── docs-page.tsx          # title, lead, TOC, pager
    │       │   ├── section.tsx
    │       │   └── component-preview.tsx
    │       ├── model/
    │       │   └── nav.ts                 # DOCS_NAV, neighbours()
    │       ├── docs-layout.css
    │       └── index.ts
    │
    ├── features/
    │   ├── select-framework/
    │   │   ├── ui/
    │   │   │   └── framework-code.tsx     # React / Svelte tabs bound to the site-wide choice
    │   │   └── index.ts
    │   └── toggle-color-scheme/
    │       ├── ui/
    │       │   └── theme-toggle.tsx
    │       ├── model/
    │       │   └── color-scheme.ts        # storage key, init script
    │       ├── theme-toggle.css
    │       └── index.ts
    │
    ├── entities/
    │   ├── framework/
    │   │   ├── model/
    │   │   │   └── selected-framework.ts  # Framework, useFramework(), setFramework()
    │   │   ├── ui/
    │   │   │   └── framework-logo.tsx     # FRAMEWORKS, ReactLogo, SvelteLogo, paths
    │   │   ├── framework-logo.css
    │   │   └── index.ts
    │   └── theme/
    │       ├── model/
    │       │   ├── theme.ts               # BASES, ACCENTS, RADII, Preset, themeCss(), parsePreset()…
    │       │   └── theme.test.ts          # every preset meets WCAG AA
    │       └── index.ts
    │
    └── shared/
        ├── ui/                    # one folder per component: <name>.tsx, <name>.css, index.ts
        │   ├── code-block/
        │   ├── tabs/
        │   ├── option-group/
        │   ├── install-command/
        │   └── props-table/
        └── lib/
            └── highlight/
```

Not every folder must exist: create a segment (`ui/`, `model/`, `api/`, `lib/`) only when the slice has something to put in it.

---

## 5. App Layer

The `app` layer contains everything specific to TanStack Start:

- `router.tsx` (the router factory TanStack Start looks for)
- File routes (`routes/`), including `__root.tsx` and layout routes (`route.tsx`)
- The generated `routeTree.gen.ts`
- The HTML document, global stylesheets and `<head>`
- Root-level providers and global UI (`<Toaster />`)
- Route-level concerns: `head`, `validateSearch`, `loader`, `beforeLoad`, `pendingComponent`, `errorComponent`, `notFoundComponent`

### Configuration

TanStack Start resolves its paths relative to `srcDirectory` (`src` by default). Point the router at `src/app`:

```ts
// apps/web/vite.config.ts
export default defineConfig({
  server: { port: 3000 },
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackStart({
      router: {
        entry: "app/router.tsx",
        routesDirectory: "app/routes",
        generatedRouteTree: "app/routeTree.gen.ts",
      },
    }),
    // react's vite plugin must come after start's
    viteReact(),
  ],
});
```

### Route files stay thin

A route file declares the URL, the `head`, the search params and the data; the page slice renders it.

### Good

```tsx
// app/routes/create.tsx
import { createFileRoute } from "@tanstack/react-router";
import { CreatePage, createStylesHref } from "@/pages/create";
import { parsePreset, type Preset } from "@/entities/theme";

export const Route = createFileRoute("/create")({
  // the preset lives in the URL so a theme can be shared as a link
  validateSearch: (search: Record<string, unknown>): Preset => parsePreset(search),
  head: () => ({
    meta: [{ title: "Create a theme · Mitos UI" }],
    links: [{ rel: "stylesheet", href: createStylesHref }],
  }),
  component: CreatePage,
});
```

The page reads the route's state through the router's hooks (`getRouteApi("/create").useSearch()`), so it does not import the route file.

### Avoid

- Page markup, sections or local components inside route files.
- Business logic or data shaping inside route files (keep it in `entities`/`features`, call it from `loader`/`validateSearch`).
- Importing a route file (`Route`) from any other layer. Use `getRouteApi("<path>")` instead.
- Colocating non-route files in `routes/` with the `-` prefix: put them in the owning slice.

### The root route

`__root.tsx` owns the document: `<html>`, `<HeadContent />`, `<Scripts />`, global stylesheets (library first, then site), the color-scheme init script (before first paint) and the site theme `<style>` (after the library stylesheet, so its layer wins).

---

## 6. Pages Layer

With TanStack Router, the `pages` layer is **not optional**: every route renders a page slice.

```text
pages/
├── landing/
├── create/
└── docs/                  # slice group (a plain folder, not a slice)
    ├── installation/
    └── button/
```

A page slice:

- composes widgets, features, entities and `mitos-ui` components;
- owns the blocks used **only by that page** (`ui/`): the landing's `compile-beams.tsx` and `works-with.tsx` stay in `pages/landing`;
- owns its stylesheet and exports its URL for the route's `head`;
- for component docs, owns its **examples** (`examples/*.tsx`, shown live and as source through `?raw`).
- for `/blocks`, owns the **blocks** (`blocks/*.tsx`): same rule as docs examples, they import only `mitos-ui/react` and `react` (checked by `model/blocks.test.ts`).

```ts
// pages/landing/index.ts
export { LandingPage } from "./ui/landing-page";
export { default as landingStylesHref } from "./landing.css?url";
```

Promote a block out of a page **only when a second page needs it**: to `widgets` if it is a composed section, to `features` if it is a user action, to `shared/ui` if it is generic.

### Docs examples

Examples are displayed to users as source code. They must read like consumer code:

- import only from `mitos-ui/react` (and `react`, icon packages);
- never import site code (`@/shared/…`, `@/entities/…`);
- stay small: one idea per example.

Slices inside the `docs` group must not import each other.

---

## 7. Widgets Layer

Widgets are composed UI blocks **reused by several pages**.

| Widget        | Used by                       | Contains                                                  |
| ------------- | ----------------------------- | --------------------------------------------------------- |
| `site-header` | landing, create, docs layout  | logo, main nav, `ThemeToggle`, "Get started"              |
| `docs-layout` | every `/docs` page            | sidebar, mobile nav, `DocsPage`, `Section`, TOC, pager, `ComponentPreview`, `DOCS_NAV` |

`DocsPage`, `ComponentPreview` and the sidebar all depend on `DOCS_NAV`, which is why they form one widget instead of several (two widgets cannot import each other).

When a widget needs another widget, take it as a **slot** and let the layer above compose them. `DocsLayout` receives the header:

```tsx
// app/routes/docs/route.tsx
export const Route = createFileRoute("/docs")({
  head: () => ({ links: [{ rel: "stylesheet", href: docsLayoutStylesHref }] }),
  component: () => <DocsLayout header={<SiteHeader />} />,
});
```

Widgets may depend on:

```text
features
entities
shared
```

Widgets compose existing functionality; they do not implement new user actions.

---

## 8. Features Layer

Features represent **user actions**.

| Feature               | Action                                             | Owns                                       |
| --------------------- | -------------------------------------------------- | ------------------------------------------ |
| `select-framework`    | Pick React or Svelte for every code sample and API table | `FrameworkCode`, `FrameworkPropsTable` (tabs bound to the choice; props written for React, translated for Svelte) |
| `toggle-color-scheme` | Force light or dark mode for the site              | `ThemeToggle`, `COLOR_SCHEME_INIT_SCRIPT`  |

Candidates, kept inside `pages/create` until a second page needs them:

```text
customize-theme   # choose base, accent and radius
share-theme       # copy the theme CSS or its link
```

A feature typically contains:

```text
feature/
├── ui/
├── model/
├── api/
├── lib/
└── index.ts
```

Name features after the **intent**:

### Good

```text
select-framework
toggle-color-scheme
copy-code
share-theme
```

### Avoid

```text
framework-tabs
theme-button
code-modal
```

---

## 9. Entities Layer

Entities are the domain objects of the site.

| Entity      | What it is                                                     | Exposes                                                                  |
| ----------- | -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `framework` | A framework the library ships for (React, Svelte; Vue next)    | `FRAMEWORKS`, `useFramework()`, `setFramework()`, `ReactLogo`, `SvelteLogo` |
| `theme`     | A Mitos theme preset (base, accent, radius) and the CSS it produces | `BASES`, `ACCENTS`, `RADII`, `Preset`, `themeCss()`, `schemeAwareCss()`, `parsePreset()` |

An entity describes **what something is**. A feature describes **what the user does with it**:

```text
entities/framework           → the list, the logos, the current choice
features/select-framework    → the tabs that change the choice

entities/theme               → presets and the CSS they generate
pages/create                 → choosing and sharing a preset
```

Entity models stay framework-agnostic where possible: `themeCss()` is a pure function and is unit-tested.

---

## 10. Shared Layer

`shared` contains generic infrastructure and UI without domain knowledge.

```text
shared/
├── ui/        # generic site components (one folder per component, each with index.ts)
├── lib/       # generic helpers (highlight)
└── config/    # site-wide constants
```

`shared` never depends on `app`, `pages`, `widgets`, `features` or `entities`.

Current `shared/ui` members:

| Component        | Purpose                                            |
| ---------------- | -------------------------------------------------- |
| `code-block`     | Highlighted, copyable code                         |
| `tabs`           | APG tabs, optionally controlled (`selected`/`onSelect`) |
| `option-group`   | Radio group styled as options (theme builder)      |
| `install-command`| `bun add` / `npm install` / … tabs                 |
| `props-table`    | API reference table                                |

---

## 11. Design System Usage

The site is the first consumer of Mitos UI: it **dogfoods** the library.

Before creating any UI component, check in this order:

1. `mitos-ui/react`: Button, Accordion, Dialog, Input, Textarea, Toast…
2. `shared/ui`
3. `entities/<domain>/ui`, `features/<action>/ui`, `widgets`

If a **generic** component is missing (a checkbox, a select, tabs…), add it to the library with the `create-component` skill rather than to `shared/ui`. `shared/ui` only holds what is specific to running this website (code blocks, install commands, props tables).

`shared/ui/tabs` predates a library Tabs component: replace it when `mitos-ui` ships one.

### Avoid

```text
shared/ui/mitos-button.tsx         # wraps the library's Button
shared/ui/checkbox.tsx            # generic: belongs in packages/core
```

### Prefer

```tsx
import { Button } from "mitos-ui/react";

<Button variant="outline">Save</Button>;
```

Pass extra classes with `class` (not `className`): it is the library's prop.

---

## 12. Styling

The web app uses **plain CSS files** and the library's design tokens. StyleX is used only inside `packages/core`.

- **Tokens.** Use `var(--mitos-*)` for colors and radii (`--mitos-primary`, `--mitos-border`, `--mitos-radius-md`…) and the site variables (`--site-brand`, `--site-width`, `--site-gutter`). Hard-coded colors are reserved for brand logos.
- **Cascade layers.** The library's rules live in layers, and the site theme in `@layer site-theme`. Unlayered site CSS always wins: do not use `!important` to beat the library.
- **One stylesheet per slice** that needs one, named after it (`landing.css`, `docs-layout.css`). Prefix its classes with the slice name (`landing-`, `docs-`, `beam-`…).
- **Loading.** Stylesheets are linked from a route `head` with `?url` imports, and each slice exports its stylesheet URL from its public API (`landingStylesHref`). Where to link:
  - `__root.tsx`: the library, `app/styles/*`, and the CSS of UI present on every page (`site-header`, `toggle-color-scheme`, `entities/framework`, every `shared/ui` component);
  - `docs/route.tsx`: `docs-layout`;
  - each page's route: the page's own stylesheet.
- **Previews** of library components use the `mitos-default-theme` class, so they show what the package ships, not the site's brand theme.
- **Motion** must stop under `@media (prefers-reduced-motion: reduce)`.

```css
/* pages/landing/landing.css */
.landing-tools li {
  background: var(--mitos-background);
  color: var(--mitos-muted-foreground);
}
```

---

## 13. Rendering: SSR and Hydration

TanStack Start renders every route on the server, then hydrates it. There are **no React Server Components** and no `"use client"` directive in the web app.

Rules:

- Browser APIs (`window`, `localStorage`, `matchMedia`, `navigator.clipboard`) only run in effects, event handlers, or a `useSyncExternalStore` subscription.
- The first client render must match the server render. When a value only exists in the browser (a stored preference), render the server default first:

```ts
// entities/framework/model/selected-framework.ts
export function useFramework() {
  // the server can't know the stored choice: it renders React, the client switches after hydration
  return useSyncExternalStore(subscribe, read, () => "react" as const);
}
```

- A preference that changes the page's look before hydration (color scheme) is applied by an inline script in `__root.tsx`, before first paint.
- Page metadata goes through the route `head` (`meta`, `links`), never through effects.

---

## 14. State Management

State lives at the lowest appropriate level.

| State                      | Where                                           | Example                                   |
| -------------------------- | ----------------------------------------------- | ----------------------------------------- |
| Local UI state             | `useState` / `useReducer` in the component      | selected tab, copy status, dialog open    |
| Shareable state            | **URL search params** (`validateSearch` + `useSearch` / `navigate`) | the theme preset on `/create` |
| Persisted user preference  | entity or feature model: `localStorage` + `useSyncExternalStore` | framework choice, color scheme |
| Server state               | route `loader` (none today, see §15)            | —                                         |

Do not add a global store library: the router (URL) and small external stores cover the site's needs. Do not duplicate in React state what the URL already holds.

---

## 15. Data Loading

The site has **no backend and no API today**: its content is static and lives in the page slices.

When data is needed:

- Load it in the route `loader`, not in effects, so it is server-rendered.
- Put the fetching function in the owning slice's `api/` segment (`entities/<domain>/api/…`). For server-only work (secrets, file system), wrap it in `createServerFn` from `@tanstack/react-start`.
- Read it in the page with `getRouteApi("<path>").useLoaderData()`.
- Introduce TanStack Query only if the site needs client-side caching or mutations; do not add it preemptively.

---

## 16. Forms

The site has no submitted forms today. The theme builder uses controlled `OptionGroup`s bound to search params.

When a real form appears:

- Build it with the library's `Input` and `Textarea` and a native `<form>`.
- The form belongs to the feature that owns the user action.
- Add a form library (TanStack Form) only when validation and submission logic justify it.

---

## 17. Accessibility

Accessibility is a product requirement, for the library **and** the site.

- Native elements first (`<a>` to navigate, `<button>` to act); WAI-ARIA patterns when needed (the docs tabs follow the APG tabs pattern).
- Every interactive element and landmark has an accessible name. Decorative icons and logos are `aria-hidden` and sit next to visible text.
- Illustrations are `role="img"` with a full `aria-label`.
- Visible focus, WCAG AA contrast, reduced motion respected.
- Library components follow the stricter rules of the `create-component` skill.

---

## 18. Testing Strategy

| Scope                        | Tool                         | Location                                            |
| ---------------------------- | ---------------------------- | --------------------------------------------------- |
| Library components (React)   | Vitest + Testing Library + axe | `packages/core/src/<name>/<name>.test.tsx`        |
| Library Svelte build         | Vitest (server + jsdom)      | `packages/core/src/svelte.*.test.ts`                |
| Library tokens / contrast    | Vitest                       | `packages/core/src/config/tokens.test.ts`           |
| Library inventory and API    | Vitest                       | `packages/core/src/library.test.ts`: every component wired everywhere, React/Svelte export parity, public API snapshot, Mitosis comment pitfalls |
| Web app logic                | `bun test`                   | next to the code: `entities/theme/model/theme.test.ts` |
| Web app architecture         | `bun test`                   | `apps/web/src/app/architecture.test.ts` (§27)       |
| Web app component docs       | `bun test`                   | `apps/web/src/app/component-docs.test.ts`: a page, a route and a nav entry per exported component |
| Web app end-to-end           | Playwright (**not set up yet**) | `apps/web/tests/e2e/`                            |

Tests live next to the code they test. Pure model functions (`entities/*/model`) are the first thing to test in the web app.

### Playwright (when added)

Keep e2e tests for critical journeys: switching framework persists across pages, the theme builder produces a shareable link, docs navigation works with the keyboard.

### Prefer

```ts
await page.getByRole("tab", { name: "Svelte" }).click();
```

### Avoid

```ts
await page.locator('[data-testid="svelte-tab"]').click();
```

---

## 19. Imports

Use the `@/` alias for cross-slice imports. It requires one line in `apps/web/tsconfig.json` (Vite already resolves tsconfig paths):

```json
{ "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }
```

```tsx
import { Button } from "mitos-ui/react";
import { CodeBlock } from "@/shared/ui/code-block";
import { useFramework } from "@/entities/framework";
import { FrameworkCode } from "@/features/select-framework";
```

Inside a slice, use relative imports (`./ui/…`, `../model/…`).

Avoid deep relative imports across slices:

```tsx
import { CodeBlock } from "../../../docs/components";
```

---

## 20. Public APIs

Every slice exposes a public API through `index.ts`. In `shared`, each `ui/<component>` and `lib/<helper>` folder has its own `index.ts`.

```ts
// entities/framework/index.ts
export { setFramework, useFramework, type Framework } from "./model/selected-framework";
export { FRAMEWORKS, REACT_PATH, ReactLogo, SVELTE_PATH, SvelteLogo } from "./ui/framework-logo";
export { default as frameworkLogoStylesHref } from "./framework-logo.css?url";
```

Consumers import from the slice:

```ts
import { useFramework } from "@/entities/framework";
```

not from its internals:

```ts
import { useFramework } from "@/entities/framework/model/selected-framework";
```

Stylesheet URLs are part of the public API when a route needs them (`landingStylesHref`).

---

## 21. Naming Conventions

- **Everything in English**: files, folders, variables, routes. User-facing text is in English too (the site is in English).
- **Files and folders**: kebab-case (`site-header.tsx`, `selected-framework.ts`).
- **Components**: PascalCase (`SiteHeader`, `FrameworkCode`).
- **Slices**: domain nouns for entities (`framework`, `theme`), verb-noun intents for features (`select-framework`), section nouns for widgets (`site-header`, `docs-layout`), page names for pages (`landing`, `create`, `docs/button`).
- **CSS classes**: prefixed with the slice name.

Avoid vague names:

```text
components.tsx
utils.ts
helpers.ts
common/
misc/
```

---

## 22. Dependency Rules

```text
app → pages → widgets → features → entities → shared
```

- A slice cannot import another slice from the same layer.
- `shared` imports nothing from the app's layers.
- Nothing imports from `app` (route files, `routeTree.gen.ts`). Use `getRouteApi()` and the typed `Link`/`navigate`, which rely on the `Register` declaration in `app/router.tsx`.
- Nothing imports `packages/core` internals (§3).

If two slices need the same thing, move it down: to an entity, to `shared`, or merge the slices if they always change together (as `docs-layout` does).

---

## 23. Barrel Exports

Barrels are allowed for slice public APIs only.

### Good

```text
entities/theme/index.ts
shared/ui/code-block/index.ts
```

### Avoid

```text
shared/index.ts
shared/ui/index.ts
features/index.ts
```

---

## 24. Error, Loading and Empty States

- **Routes**: `notFoundComponent` and `errorComponent` on the root route (or a layout route), `pendingComponent` when a loader is slow. They belong to `app`.
- **Features**: translate technical failures into user-facing messages close to the action. Example: `CodeBlock` reports "Copy failed" when the clipboard is unavailable.
- **Live regions**: announce asynchronous results (`role="status"`), as `CodeBlock` and the library's Toaster do.
- Generic state components belong in `shared/ui`; domain-specific ones in their slice.

---

## 25. Feature Example: documenting a new component

For a new `Checkbox` component:

```text
packages/core/src/checkbox/         # 1. the component (create-component skill)
├── checkbox.lite.tsx
├── checkbox.test.tsx
└── checkbox.stories.tsx

apps/web/src/
├── pages/docs/checkbox/            # 2. the docs page
│   ├── ui/checkbox-page.tsx        #    DocsPage, ComponentPreview, FrameworkCode, PropsTable
│   ├── examples/checkbox-demo.tsx  #    imports only from mitos-ui/react
│   └── index.ts
├── app/routes/docs/components/
│   └── checkbox.tsx                # 3. thin route: head + component
└── widgets/docs-layout/model/
    └── nav.ts                      # 4. one entry in DOCS_NAV
```

The flow:

```text
checkbox.lite.tsx
 │  mitosis build + vite build
 ▼
mitos-ui/react, mitos-ui/svelte
 │
 ▼
pages/docs/checkbox  ──uses──▶  widgets/docs-layout, features/select-framework, shared/ui
 │
 ▼
app/routes/docs/components/checkbox.tsx
```

---

## 26. Guidelines for AI Coding Agents

When implementing something, follow these steps:

1. **Library or site?** A reusable UI component goes to `packages/core` (`create-component` skill). Anything about the website goes to `apps/web`.
2. **Identify the domain**: `framework`, `theme`, docs content…
3. **Identify the user action**, if any: select, toggle, copy, share…
4. **Search before creating**, in this order: `mitos-ui/react`, `shared/ui`, `entities/<domain>`, `features/<action>`, `widgets`, the page slice.
5. **Reuse utilities** from `shared/lib` and entity models.
6. **Keep route files thin**; put markup in the page slice.
7. **Add only the necessary files.** A block used by one page stays in that page.

Before introducing state, check: local state, URL search params, existing external stores (`entities/framework`, `features/toggle-color-scheme`).

Do not duplicate an existing abstraction. Known duplication to resolve, not to copy: `ThemePlayground` keeps its own accent and radius lists instead of using `entities/theme`.

---

## 27. Enforcement

`apps/web/src/app/architecture.test.ts` runs with `bun run test` and fails when a file:

- imports a higher layer (`entities` → `features`);
- imports another slice of its own layer (`widgets/docs-layout` → `widgets/site-header`); `shared` segments may import each other;
- reaches into a slice instead of its public API (`@/entities/framework/model/selected-framework`);
- leaves its slice with a relative import (`../../input/examples/…`).

It reads real imports only (through Bun's transpiler), so code samples shown on the site are ignored. The `app` layer is exempt from the relative-import rule.

When the test fails, fix the dependency (move code down a layer, use a slot, export from `index.ts`); do not loosen the test.

The site was migrated to this structure from a flat layout (`src/site`, `src/docs`, `src/landing`, `src/create`): see the git history of `apps/web/src` for where each file came from.

---

## 28. Rule of Thumb

> **Organize the code around the domain and user actions, not around technologies.**

Avoid organizing the web app as:

```text
components/
hooks/
utils/
styles/
```

Prefer:

```text
pages/ widgets/ features/ entities/ shared/
```

FSD is a guideline for boundaries and dependencies, not a reason to create unnecessary folders, abstractions or indirection.

---

## 29. Architecture Summary

```text
packages/core/             # design system (Mitosis + StyleX → React, Svelte); not FSD

apps/web/src/
├── app/                   # TanStack Start: router, file routes, document, global styles
├── pages/                 # one slice per route; page-only blocks and docs examples
├── widgets/               # blocks shared by several pages (site-header, docs-layout)
├── features/              # user actions (select-framework, toggle-color-scheme)
├── entities/              # domain (framework, theme)
└── shared/                # generic site UI and helpers (code-block, tabs, highlight)
```

Responsibilities:

```text
mitos-ui          → UI components (dogfooded)
Plain CSS + tokens  → styling
TanStack Router     → routing, URL state, head, loaders
React state         → local UI state
External stores     → persisted preferences
bun test / Vitest   → unit and component tests
```

The core dependency rule:

```text
app → pages → widgets → features → entities → shared
```
