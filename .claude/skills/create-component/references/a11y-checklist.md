# Checklist a11y par pattern (WAI-ARIA APG)

Source : https://www.w3.org/WAI/ARIA/apg/patterns/ . Pour chaque pattern : élément/rôle, attributs, clavier, focus, et ce que le test doit vérifier.

## Sommaire
- [Button / Toggle button](#button--toggle-button)
- [Checkbox](#checkbox)
- [Switch](#switch)
- [Radio group](#radio-group)
- [Text field](#text-field)
- [Tabs](#tabs)
- [Dialog (modal)](#dialog-modal)
- [Alert dialog](#alert-dialog)
- [Disclosure / Accordion](#disclosure--accordion)
- [Menu button](#menu-button)
- [Listbox / Select custom](#listbox--select-custom)
- [Combobox](#combobox)
- [Tooltip](#tooltip)
- [Slider](#slider)
- [Alert / Toast](#alert--toast)

---

## Button / Toggle button
- `<button type="button">`. Bascule : `aria-pressed="true|false"` (le nom ne change pas avec l'état).
- Clavier : `Enter`, `Space` (natifs).
- Test : `getByRole("button", { name, pressed })`.

## Checkbox
- `<input type="checkbox">` + `<label>` associé. Ne pas recréer avec `role="checkbox"`.
- Indéterminé : propriété DOM `el.indeterminate = true` (pas d'attribut HTML) → exposé comme `aria-checked="mixed"`. Mitosis : la poser dans `onMount`/`onUpdate` via `useRef`.
- Clavier : `Space` (natif).
- Groupe : `<fieldset>` + `<legend>`.
- Test : `getByRole("checkbox", { name })`, `.checked`, `.indeterminate`, clic sur le label coche la case.

## Switch
- `<button type="button" role="switch" aria-checked="true|false">` ou `<input type="checkbox" role="switch">`.
- Clavier : `Space` (et `Enter` pour le bouton).
- Le libellé ne change pas avec l'état (pas « On »/« Off » comme nom).
- Test : `getByRole("switch", { name, checked })`.

## Radio group
- Natif : `<fieldset><legend>` + `<input type="radio" name>` partagé. Le navigateur gère déjà les flèches et le tab unique.
- Custom (rare) : `role="radiogroup"` + `role="radio"` + `aria-checked`, roving tabIndex, flèches déplacent focus **et** sélection.
- Test : flèches changent la sélection, un seul arrêt Tab.

## Text field
- `<input>` / `<textarea>` + `<label for>`. Aide : `aria-describedby` → id du texte d'aide.
- Erreur : `aria-invalid="true"` + message lié par `aria-describedby` (ou `aria-errormessage`).
- Requis : attribut `required` natif (pas seulement un astérisque visuel).
- Test : `getByRole("textbox", { name })`, `aria-invalid`, description accessible (`toHaveAccessibleDescription` n'existe pas sans jest-dom : lire l'élément pointé par `aria-describedby`).

## Tabs
- Conteneur `role="tablist"` (+ `aria-label` ou `aria-labelledby`, `aria-orientation="vertical"` si vertical).
- Onglets : `<button type="button" role="tab" aria-selected aria-controls="<panelId>" id="<tabId>">`.
- Panneaux : `role="tabpanel" aria-labelledby="<tabId>" id="<panelId>" tabIndex={0}` ; les inactifs `hidden`.
- Focus : roving tabIndex (onglet actif 0, autres -1). Tab depuis la tablist va dans le panneau actif.
- Clavier (horizontal) : `ArrowRight`/`ArrowLeft` (bouclent), `Home`, `End`. Activation automatique (le focus sélectionne) par défaut ; manuelle (`Enter`/`Space`) si le contenu est coûteux. Vertical : `ArrowDown`/`ArrowUp`.
- Onglet désactivé : `aria-disabled="true"`, focusable mais non activable.
- Test : rôles tablist/tab/tabpanel, `aria-selected` change, `aria-controls` ↔ `id` du panneau, flèches + Home/End déplacent `document.activeElement`, un seul tab avec `tabIndex=0`.

## Dialog (modal)
- `<dialog>` ouvert avec `showModal()` (inertie de l'arrière-plan, `Escape`, couche supérieure natifs). Pas `open` en attribut pour une modale.
- Nom : `aria-labelledby` → titre ; description optionnelle `aria-describedby`.
- Focus : à l'ouverture, sur le premier élément focusable pertinent (ou l'action la moins destructive) ; à la fermeture, **restauré** sur l'élément déclencheur.
- Clavier : `Escape` ferme (événement `cancel` natif → synchroniser l'état), Tab reste dans la modale (natif avec `showModal`).
- Un bouton de fermeture avec un nom accessible.
- jsdom : `HTMLDialogElement.prototype.showModal`/`close` peuvent manquer ; les stubber dans le test (`open = true/false`) plutôt que d'abandonner le test.
- Test : `getByRole("dialog", { name })`, focus initial, `Escape` ferme, focus restauré.

## Alert dialog
- Comme Dialog, avec `role="alertdialog"` sur le `<dialog>` : confirmation d'une action destructive.
- `aria-describedby` → le message. Focus initial sur l'action **la moins destructive** (Annuler).
- Bouton destructif avec un libellé explicite (« Supprimer le fichier », pas « OK »).

## Disclosure / Accordion
- Simple : `<details>/<summary>` natif.
- Custom : en-tête `<h3><button type="button" aria-expanded aria-controls="<panelId>">` ; panneau `id`, `hidden` quand fermé (`role="region"` + `aria-labelledby` seulement si peu de panneaux).
- Clavier : `Enter`/`Space` ; optionnel `ArrowDown`/`ArrowUp`/`Home`/`End` entre en-têtes.
- Test : `aria-expanded` bascule, panneau visible/caché.

## Menu button
- Déclencheur `<button type="button" aria-haspopup="menu" aria-expanded aria-controls>`.
- Menu `role="menu"` (+ nom), items `role="menuitem"` (ou `menuitemcheckbox`/`menuitemradio` + `aria-checked`).
- Ouverture : `Enter`/`Space`/`ArrowDown` → focus 1er item ; `ArrowUp` → dernier.
- Dans le menu : flèches (bouclent), `Home`/`End`, saisie de caractères (typeahead), `Escape` ferme et rend le focus au bouton, `Tab` ferme.
- Réservé aux actions ; pour de la navigation, une liste de liens.

## Listbox / Select custom
- Préférer `<select>` natif. Custom seulement si nécessaire.
- `role="listbox"` (+ nom, `aria-multiselectable` si multiple), options `role="option" aria-selected`.
- Focus : roving tabIndex ou `aria-activedescendant` sur la listbox.
- Clavier : flèches, `Home`/`End`, typeahead ; multi : `Space` bascule, `Shift+flèches`.

## Combobox
- `<input role="combobox" aria-expanded aria-controls="<listboxId>" aria-autocomplete="list|both|none">` + `<label>`.
- Option active : `aria-activedescendant` (le focus DOM reste dans l'input).
- Clavier : `ArrowDown` ouvre/descend, `ArrowUp`, `Enter` valide, `Escape` ferme (puis vide), `Alt+ArrowDown` ouvre sans bouger.
- Nombre de résultats annoncé si utile (région `aria-live="polite"`).

## Tooltip
- `role="tooltip"` avec `id` ; déclencheur `aria-describedby="<tooltipId>"`.
- Apparaît au survol **et** au focus ; `Escape` le ferme sans déplacer le focus ; reste visible quand la souris passe dessus (WCAG 1.4.13).
- Jamais de contenu interactif dedans (sinon c'est un popover/dialog). Pas le seul porteur d'une information essentielle.

## Slider
- Préférer `<input type="range">` + `<label>`.
- Custom : `role="slider" aria-valuenow aria-valuemin aria-valuemax` (+ `aria-valuetext` si la valeur brute n'est pas parlante), `tabIndex={0}`.
- Clavier : flèches ±pas, `PageUp`/`PageDown` ±grand pas, `Home`/`End` min/max.

## Alert / Toast
- Message important et temporaire : `role="status"` (poli) ou `role="alert"` (assertif, pour les erreurs). La région doit exister **avant** que le texte y soit injecté.
- Pas de vol de focus. Pas de disparition automatique pour un message qui demande une action ; durée suffisante sinon (WCAG 2.2.1), pause au survol/focus.
