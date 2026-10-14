---
name: create-component
description: Créer ou ajouter un composant UI dans packages/core d'omni-system-ui (Checkbox, Switch, Input, Select, Tabs, Dialog, Tooltip, Accordion, Menu…), selon le schéma de Button (source Mitosis .lite.tsx + StyleX + tokens, test Vitest + axe, story Storybook, export dans index.ts) et toujours conforme HTML + WAI-ARIA. À utiliser dès qu'on demande un nouveau composant, widget ou élément d'interface dans ce repo, même si la demande ne parle ni de Mitosis, ni d'accessibilité, ni de tests.
---

# Créer un composant dans `packages/core`

Chaque composant suit le schéma de `packages/core/src/button/`. Lis ces trois fichiers avant d'écrire quoi que ce soit, puis calque-les :
`button.lite.tsx`, `button.test.tsx`, `button.stories.tsx`.

L'accessibilité n'est pas une option : un composant non conforme HTML + WAI-ARIA n'est pas terminé, même si l'utilisateur ne l'a pas demandé.

## Workflow

### 1. Choisir l'élément natif ou le pattern APG, avant le code

Première règle d'ARIA : si un élément HTML natif fait le travail, on l'utilise. Il apporte gratuitement le rôle, le clavier, le focus, la soumission de formulaire et le support des technologies d'assistance. ARIA seulement quand aucun natif ne convient.

| Besoin | Utiliser |
|---|---|
| Case à cocher | `<input type="checkbox">` (+ `indeterminate` via la propriété DOM) |
| Interrupteur | `<button role="switch" aria-checked>` ou `<input type="checkbox" role="switch">` |
| Champ texte | `<input>` + `<label for>` |
| Liste déroulante simple | `<select>` |
| Modale | `<dialog>` + `showModal()` |
| Accordéon | `<details>/<summary>` ou boutons `aria-expanded` |
| Onglets, menu, combobox, listbox, tooltip | pattern APG : voir `references/a11y-checklist.md` |

Annonce ton choix à l'utilisateur en une ligne (« Checkbox → `<input type="checkbox">` natif ») avant de coder.

### 2. Source Mitosis : `src/<name>/<name>.lite.tsx`

Calque `button.lite.tsx` :
- `useStore` de `@builder.io/mitosis` pour l'état et les valeurs dérivées. **Pas de hooks React** (`useState`, `useEffect`, `useRef` React) : Mitosis compile vers d'autres frameworks. Utilise `useStore`, `useRef`, `onMount`, `onUpdate` de `@builder.io/mitosis`.
- `class`, jamais `className`, dans le JSX et dans les props.
- `OWN_PROPS` : les props consommées par le composant ; tout le reste (attributs natifs, `aria-*`, `data-*`, handlers) est transféré à l'élément racine via `state.attributes`. Garde le getter et son commentaire tels quels : dans la cible Svelte, `props` y devient l'objet `$props()` (voir `mitosis.config.cjs`).
- Le type `<Name>Props` déclare les attributs natifs utiles et la signature `[attribute: \`aria-${string}\` | \`data-${string}\`]`.
- Styles : `stylex.create`, couleurs et rayons depuis `@/config/tokens.stylex` (`colors["--omni-…"]`, `radii["--omni-radius-…"]`). Classes fusionnées avec `clsx(stylex.props(...).className, props.class)`.
- Composant export `default`, fichier en kebab-case, composant en PascalCase.
- Composant composé (Tabs, Dialog…) : un fichier `.lite.tsx` par partie si nécessaire, dans le même dossier.

Pièges du parseur Mitosis (le build échoue avec un message peu clair) :
- **pas de fonction au niveau du module** (`function x() {}` hors du composant → « Could not JSON5 parse object ») : mets la logique dans un getter ou une méthode de `useStore` ;
- **pas d'apostrophe ni de guillemets dans les commentaires** à l'intérieur du type `<Name>Props`, des objets `stylex.create` ou du composant : Mitosis recolle alors la suite sur la ligne du commentaire, soit un « Format error … '}' expected », soit, pire, des styles **silencieusement commentés** (vérifie la présence de la règle dans `dist/react/assets/stylex.css`) ;
- pour un élément conditionnel, utilise un ternaire en JSX (`{cond ? <img /> : <span />}`), il devient `{#if}{:else}` en Svelte.

### 3. Styles accessibles

- **Focus visible** : reprends le motif de Button : `outlineStyle: { default: "none", ":focus-visible": "solid" }`, `outlineWidth: 2`, `outlineOffset: 2`, `outlineColor: colors["--omni-ring"]` (WCAG 1.4.11 / 2.4.7). Pour un `<input>` stylé, l'outline va sur l'input lui-même.
- **Couleurs** : jamais de couleur en dur. Besoin d'une nouvelle couleur → ajoute un token dans `src/config/tokens.stylex.ts` (clair + `[DARK]`) **et** la paire texte/fond correspondante dans `src/config/tokens.test.ts` (texte ≥ 4.5:1, non-texte ≥ 3:1). Ce test lit le CSS compilé : c'est lui qui garantit le contraste, pas axe (jsdom n'a pas de rendu).
- **Désactivé** : `:disabled` (ou `[aria-disabled=true]`) avec `opacity: 0.5` et `pointerEvents: "none"`, comme Button.
- **Animation** : toute transition/animation non triviale est coupée sous `@media (prefers-reduced-motion: reduce)`.
- Zone cliquable ≥ 24×24 px (WCAG 2.5.8).

### 4. Test : `src/<name>/<name>.test.tsx`

Calque `button.test.tsx` (première ligne `/** @jsxImportSource react */`, import depuis `@/<name>/<name>` = sortie React compilée, `afterEach(cleanup)`). Couvre au minimum :
- **Test axe**, obligatoire, en premier, sur toutes les variantes/états significatifs rendus ensemble :
  ```tsx
  // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
  const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
  expect(violations).toEqual([]);
  ```
  (`import axe from "axe-core";`)
- Requêtes **par rôle et nom accessible** (`getByRole("checkbox", { name: "Accepter" })`), jamais par classe ou `data-testid`.
- Les **interactions clavier** du pattern APG (`fireEvent.keyDown(el, { key: "ArrowRight" })`) et le déplacement du focus (`document.activeElement`).
- Les **états `aria-*`** avant/après interaction (`aria-selected`, `aria-expanded`, `aria-checked`…).
- L'état **désactivé** (pas de callback, pas de focus si attendu).
- Transfert des attributs `aria-*`/`data-*`/natifs et absence de fuite des props propres (comme Button).
- Pour les overlays : focus déplacé à l'ouverture, `Escape` ferme, focus restauré sur le déclencheur.

### 5. Story : `src/<name>/<name>.stories.tsx`

Même forme que `button.stories.tsx` : `meta` avec `title: "Components/<Name>"`, `args`, `argTypes` (`select` / `inline-radio` pour les unions), `satisfies Meta<typeof X>`, une story par variante/état (dont `Disabled`), et une story « All… » si le composant a des variantes. Callbacks via `fn()` de `storybook/test`. Les exemples doivent eux-mêmes être accessibles (labels, noms).

### 6. Export : `src/index.ts`

```ts
export { default as <Name> } from "./<name>/<name>.lite";
export type { <Name>Props } from "./<name>/<name>.lite";
```

Ajoute aussi le composant aux tests de la sortie Svelte 5 (runes, réécrite depuis la sortie Mitosis par `mitosis.config.cjs`) : import dans le fixture de `src/svelte.test.helpers.ts`, une entrée dans `renders` de `src/svelte.server.test.ts` (compile sans warning, rendu serveur, classes présentes dans le CSS partagé) et son interaction principale dans `src/svelte.client.test.ts`. Si le build échoue avec « no Svelte 5 rewrite for … », c'est qu'une construction Mitosis n'est pas encore convertie en runes : ajoute la règle dans `mitosis.config.cjs`.

`src/library.test.ts` vérifie tout ce câblage pour chaque composant (test, story, exports, tests Svelte, `CHANGELOG.md`), la parité des exports React/Svelte (avec un instantané de l'API publique à mettre à jour volontairement : c'est un changement d'API à noter au changelog) et l'absence d'apostrophes ou de guillemets dans les commentaires Mitosis. Côté site, `apps/web/src/app/component-docs.test.ts` exige une page de doc, une route et une entrée de navigation pour chaque composant exporté.

### 7. Vérifier

Depuis la racine du repo : `bun run test` puis `bun run typecheck`. Les deux doivent passer avant de dire que c'est fini. Si un test a été désactivé ou une règle axe coupée (autre que `color-contrast`), dis-le explicitement et pourquoi.

## Règles HTML / ARIA

- **HTML valide** : pas d'élément interactif dans un autre (`<button>` dans `<a>`, `<a>` dans `<button>`…) ; c'est invalide et le comportement clavier/lecteur d'écran devient imprévisible.
- **`type="button"` par défaut** sur tout `<button>` : sinon il soumet le formulaire parent.
- **Champ = label associé** (`<label for>` ou label englobant ; à défaut `aria-labelledby`/`aria-label`). Un placeholder n'est pas un label.
- **Nom accessible obligatoire** pour tout élément interactif ou landmark (contenu texte, label, `aria-label`, `aria-labelledby`). Un bouton icône sans nom est muet pour un lecteur d'écran.
- **Pas de `role` redondant** (`<button role="button">`, `<nav role="navigation">`) ni contradictoire avec la sémantique native.
- **`aria-*` cohérents avec l'état réel** : mis à jour à chaque changement (`aria-expanded`, `aria-selected`, `aria-checked="mixed"`…), et chaque `aria-controls`/`aria-labelledby` pointe vers un `id` existant. Un état ARIA faux est pire que pas d'ARIA.
- **Ids** : générés de manière stable et unique par instance (préfixe + id fourni en prop ou compteur), jamais en dur.
- **Clavier complet selon l'APG** : tout ce qui se fait à la souris se fait au clavier. Pas de handler `onClick` seul sur un `<div>` ; utilise l'élément natif.
- **Focus** : jamais `tabIndex` > 0. Widgets composites (tabs, listbox, menu, radio group) : un seul arrêt de tabulation, roving `tabIndex` (0 sur l'élément actif, -1 sur les autres) ou `aria-activedescendant`. Overlays : focus piégé tant que c'est ouvert, restauré au déclencheur à la fermeture.
- **Ne pas masquer le focus** : pas de `outline: none` sans remplacement `:focus-visible`.
- **`prefers-reduced-motion`** respecté pour les animations.
- **Contenu masqué** : `hidden`/`display: none` le retire aussi de l'arbre d'accessibilité ; `aria-hidden="true"` ne doit jamais contenir d'élément focusable.

Le détail par pattern (rôles, attributs, touches, focus) est dans [`references/a11y-checklist.md`](references/a11y-checklist.md). Lis la section du pattern concerné avant d'écrire le composant.

## Fin de tâche

Résume à l'utilisateur : élément natif / pattern APG retenu, fichiers créés, tokens ajoutés, résultat de `bun run test` et `bun run typecheck`.
