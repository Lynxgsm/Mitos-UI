# Changelog

All notable changes to `@omni/core` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). While `@omni/core` is `0.x`, breaking changes may ship in a minor release.

This file covers the library only: changes to the documentation website (`apps/web`) are not listed.

## [Unreleased]

### Added

- React entry point `@omni/core/react` (React 19) and its precompiled stylesheet `@omni/core/react/styles.css`. Components are marked `"use client"` and work with server rendering; no StyleX or bundler plugin is needed in the consuming app.
- Svelte entry point `@omni/core/svelte` (Svelte 5, runes syntax) and its stylesheet `@omni/core/svelte/styles.css`. Components ship as `.svelte` files compiled by the consuming app, so SvelteKit server rendering works. Props match the React components; native event handlers are lowercase (`oninput`) and forwarded to the underlying element.
- Default theme exposed as `--omni-*` CSS custom properties (colors and radii) with light and dark values. Every library rule lives in a cascade layer, so unlayered consumer CSS overrides it regardless of load order.
- `Button` with `variant` (`default`, `secondary`, `outline`, `ghost`, `link`, `destructive`) and `size` (`xs` to `4xl`). Renders a native `<button>` that defaults to `type="button"` and forwards native, `aria-*` and `data-*` attributes.
- `Accordion` with `items`, `multiple` and `defaultOpen`, following the WAI-ARIA accordion pattern (arrow keys, `Home`, `End`). Collapsed panels are `inert`; the animation stops under reduced motion.
- `Dialog`, controlled through `open` and `onClose`, with `title`, `description`, `footer` and an `alert` mode (`role="alertdialog"`, no close button). Built on the native modal `<dialog>`: focus moves in, `Escape` closes, focus returns to the trigger.
- `Input` and `Textarea` with a wrapping `label`, `description` and `error`, linked through `aria-describedby` and `aria-invalid`.
- `Toaster` and the `toast()`, `dismissToast()` and `dismissAllToasts()` functions, with `default` and `destructive` variants, an optional action, and a configurable `duration`. Toasts pause on hover and focus, toasts with an action never auto-dismiss, and messages are announced through polite or assertive live regions.
