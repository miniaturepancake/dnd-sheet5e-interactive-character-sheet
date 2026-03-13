# Migration Notes

## Current Responsibilities

- src/data/characters/sable-vey/character-data.js: Sable static character dataset.
- src/data/characters/sable-vey/default-state.js: Sable default runtime state shape.
- src/data/characters/sable-vey/spell-meta.js: Sable static spell metadata.
- src/data/characters/index.js: authoritative character registry, default id, query config, and per-character runtime metadata.
- src/app/boot-loader.js: deterministic plain-script boot sequence and chooser rendering for missing/invalid character query.
- src/app/utils.js: generic utility helpers.
- src/app/current-character.js: resolves active character bundle and normalizes character-shaped runtime state.
- src/app/persistence.js: load and snapshot persistence helpers.
- src/app/store.js: central runtime state owner.
- src/app/state.js: runtime store bootstrap and shared runtime globals.
- src/app/resource-model.js: character-driven resource alias, spend, and reset primitives.
- src/app/selectors.js: stable state access/selectors and path helpers used by render/actions.
- src/app/derived.js: computed combat/spell metrics.
- src/app/reset.js: short/long/reset-all implementations via store updates.
- src/app/actions.js: centralized runtime action and mutation layer.
- src/app/view-helpers.js: spell/filter/helper rendering driven by selectors and actions.
- src/app/render.js: top-level UI rendering driven by selectors and stable access helpers.
- src/app/events.js: thin DOM event interpreter and action dispatcher.
- src/app/main.js: listener wiring and initial render call.

## Required Script Load Order

The deterministic plain-script boot order is required and file:// safe:

1. index.html static scripts:
   - src/data/characters/index.js
   - src/app/boot-loader.js
2. boot-loader character scripts:
   - registry entry scriptPaths for resolved character id
3. boot-loader shared app scripts:
   - src/app/utils.js
   - src/app/current-character.js
   - src/app/persistence.js
   - src/app/store.js
   - src/app/state.js
   - src/app/resource-model.js
   - src/app/selectors.js
   - src/app/derived.js
   - src/app/reset.js
   - src/app/actions.js
   - src/app/view-helpers.js
   - src/app/render.js
   - src/app/events.js
   - src/app/main.js

## Architectural Constraints

- Browser globals only (no ES modules).
- Works from local file:// opening.
- No runtime fetch/network dependency.
- reference/prototype.html remains unchanged.
- Rendered UI behavior is unchanged in this pass.

## Boot-Time Character Selection

- Query key comes from window.CHARACTER_BOOT_CONFIG.queryParam (currently character).
- Valid canonical ids boot directly.
- Legacy aliases can also resolve to canonical ids.
- Missing/invalid query renders chooser.
- Chooser behavior and links are unchanged.

## Runtime Engine Architecture

### Store / State Owner

- src/app/store.js owns state lifecycle via createRuntimeStore(...):
  - getState
  - setState
  - updateState
  - subscribe
- src/app/state.js bootstraps the store from loadState() and exposes:
  - getState
  - replaceState
  - updateState
  - subscribeState
- State persistence is now store-driven (snapshot persist on set/update).

### Persistence

- src/app/persistence.js now provides:
  - loadState(): read localStorage and normalize against character defaults.
  - saveStateSnapshot(runtimeState): persist a provided snapshot and update lastSavedAt.
- Canonical storage now uses each registry entry storageKey.
- Morrow Vale reads canonical storage key morrow-vale-sheet-v1 first, then falls back to legacy placeholder-adept-sheet-v1 and copies the migrated snapshot into the canonical key.
- Legacy data is not deleted during migration; canonical data simply takes precedence once it exists.
- Persist writes are triggered by store mutations, not ad hoc helpers in render/events.

### Selectors / Access Layer

- src/app/selectors.js provides stable reads:
  - active tab, filters, expanded spells
  - resource lookups by alias/id
  - spell-slot counts/availability
  - item-use availability
  - item-recovery availability
  - attunement state
  - focus-held state
  - saved timestamp
- selectors.js also provides stable path builders for event payloads:
  - spellSlotPath
  - attunementPath
  - itemRecoveryPath
  - consumablePath
  - notePath

### Resource Model Layer

- src/app/resource-model.js centralizes character-driven runtime resource logic:
  - alias -> concrete resource id mapping (from runtimeModel.resourceIds)
  - read/toggle/set resource helpers
  - spell slot/item-use/free-cast spend helpers
  - reset helpers for long/short rest support
- Helpers support both current-state reads and draft-state mutation inside store updates.

### Action / Mutation Layer

- src/app/actions.js is now the main mutation gateway.
- Owns:
  - tab switching
  - spell filters
  - spell expand/collapse
  - cast button spend resolution
  - steppers/toggles/checkbox/number edits
  - textarea updates
  - short rest / long rest / reset all dispatch
- Business logic runs through updateState(...) store mutations.

### Events Layer

- src/app/events.js now primarily:
  - parses DOM event intent and payload
  - dispatches to action/change/input handlers
  - triggers render only when action results request it
- No core cast/resource business logic remains inline.

### Render / View Layer

- src/app/render.js and src/app/view-helpers.js now read via selectors/access helpers.
- Render no longer directly assumes concrete keys for most character-shaped runtime fields.
- Runtime path strings in render are now routed through stable path helpers/aliases where practical.

## What Render No Longer Knows Directly

Render/view now asks access helpers for:

- resource alias paths/values (instead of hardcoding resources.<name> in most places)
- spell-slot values/paths
- attunement booleans/paths
- item-recovery booleans/paths
- item-use availability
- focus-held boolean
- active tab/filter state

## Character-Driven Runtime Metadata

src/data/characters/index.js runtimeModel now drives:

- focus item id
- item recovery ids
- resourceIds alias map
- spellCastRules for special cast resolution
- shortRestResourceIds and longRestResourceIds
- quickResources summary/group config for the live-play surface

## Rename / Alias Handling

- Canonical second-character id is now morrow-vale.
- placeholder-adept is now a legacy URL alias only; it is no longer a canonical registry entry.
- The chooser links only to canonical ids, so newly generated links point to ?character=morrow-vale.
- Legacy alias resolution happens before boot script loading, so placeholder-adept and morrow-vale load the same bundle, runtime model, and canonical storage key.

## Live-Play Surface

- The sticky strip has been replaced by a persistent quick-play bar plus a compact quick-resources surface.
- The quick-play bar stays visible while switching tabs and shows HP, AC, concentration, reaction, spellcasting summary, and key-resource chips.
- The quick-resources surface is driven by runtimeModel.quickResources plus existing item/resource metadata.
- Current generic sections are:
  - class resources
  - free casts
  - item powers
  - rest resources
- The structure is intentionally class-agnostic even though current character content is still Bard-specific.

## Remaining Character-Specific Areas

- The app now boots two materially different bundles: Sable Vey and Morrow Vale.
- The runtime architecture tolerates distinct identity text, stats, items, spell lists, attunement defaults, and item-use inventories without app-layer changes.
- The sheet still assumes a shared schema family across characters: Bard 11, College of Spirits features, the same core runtime resources, and the same rest/reset model.
- Several UI sections are still class- and subclass-specific rather than fully generic: spirits table, bardic inspiration language, spirit-guardian free-cast handling, and the current feature/spell presentation shape.
- Manual runtimeModel metadata authoring per character remains required.

## Query-Based Character Test

- index.html -> chooser renders
- index.html?character=sable-vey -> Sable boots
- index.html?character=morrow-vale -> Morrow Vale boots
- index.html?character=placeholder-adept -> Morrow Vale boots
- index.html?character=does-not-exist -> chooser renders

## Next Logical Refactor Target

- Introduce action-type constants and optional action schema validation to harden dispatch contracts while keeping plain-script architecture.

## Biography / Profile Override Layer (Overview tab)

### What is it
Three Overview fields are now user-editable at runtime: **Character profile (summary)**, **Personality**, and **Backstory**. On first use they show the authored bundle value. When edited, the override is stored in the persisted runtime state under `biography` and shown instead of the source text.

### State shape
```json
"biography": {
  "locked": true,
  "summary": null,
  "personality": null,
  "backstory": null
}
```
- `locked: true` = fields are read-only (locked state is the default)
- Field values are `null` to mean "use source data"; any non-null non-empty string is the persisted override
- Personality is stored as a newline-delimited string; displayed as a bullet list when locked

### Lock / unlock mechanism
- A "Unlock to edit" / "Lock editing" toggle button sits at the top of the Overview card row
- Uses the existing `toggle` action on `biography.locked` — no new action type
- Lock state persists in localStorage alongside all other runtime state
- On reload, lock state is restored exactly as saved (defaults to locked for new installs)

### Persistence
- Biography overrides are stored in the **same per-character localStorage key** as all runtime state (e.g. `sable-vey-sheet-v1`)
- They are **separate from `notes.runtime` and `notes.combat`** — those remain ephemeral play notes
- Biography overrides survive **Short Rest, Long Rest, and Reset All**:
  - Short Rest / Long Rest do not touch `biography` at all
  - `resetAll()` explicitly preserves the `biography` object before resetting everything else

### Selectors
- `selectBioLocked()` — returns `true` unless `biography.locked` is explicitly `false`
- `selectBioField(field)` — returns the stored override value, or `null` if none set
- `bioPath(field)` — returns `biography.<field>` for use in textarea dispatch payloads

### Not affected by this layer
- Authored character bundle data (`DATA.identity.*`) is never mutated
- `normalizeState` passes biography through `deepMerge` without additional normalization
- `ui.notesPasswordError` is always reset to `false` on page load (in `normalizeState`) so auth errors never persist across sessions

---

## Notes Tab Password Gate

### Security scope — CLIENT-SIDE ONLY
**This is a soft UI gate for a static GitHub Pages site. The password is stored in plain text in `src/data/characters/index.js` and is visible in the page source to anyone who views source. It is NOT server-side protection and should not be used to protect sensitive personal information.**

### Configuration
Password is configured in `window.NOTES_CONFIG` at the top of `src/data/characters/index.js`:
```js
window.NOTES_CONFIG = {
  password: 'notes', // change this value to set the password
};
```
Change the `password` value to reconfigure. The comment above it in the file makes the client-side limitation explicit.

### Behavior
- The Notes tab shows a compact password form when locked
- Entering the correct password sets `ui.notesUnlocked = true` in persisted state → Notes tab opens
- Entering the wrong password sets `ui.notesPasswordError = true` → error message shown; `notesPasswordError` is always cleared on page load
- A **Relock notes** button appears at the top of the unlocked Notes tab → sets `ui.notesUnlocked = false`
- `resetAll()` preserves `ui.notesUnlocked` (same session, user doesn't lose access after a full reset)
- Short Rest / Long Rest do not affect `ui.notesUnlocked`

### Unlock persistence
- `ui.notesUnlocked` is stored in the main per-character localStorage key
- Unlock **persists across page reload** until the user explicitly clicks "Relock notes" or clears localStorage
- This is intentional: the gate is a convenience/soft access control, not a session-timeout mechanism

### New actions
- `notesUnlock` — reads `#notes-password-input` value from DOM, checks against `NOTES_CONFIG.password`, updates state
- `notesRelock` — sets `ui.notesUnlocked = false`
- `handleSubmit` added to `events.js`; registered on `document` in `main.js` — enables Enter-to-submit on the password form

---

## Notes Tab Content Changes

- **Quick tactical notes** (including the Draw spirit button and spirit result) moved from Overview to the Notes tab
- The former "Reference notes from the markdown" card in Notes has been merged into the "Quick tactical notes" card (they showed identical data; the merged card adds the spirit draw UI)
- Notes tab is now gated; see password gate section above

---

## Overview Tab Biography Editing

- Overview no longer contains the Quick tactical notes card
- The three biography cards (Character profile, Personality, Backstory) are now conditionally read-only or editable based on `biography.locked`
- A compact lock/unlock toggle bar spans the top of the Overview biography row
- Core data, vibe, and combat state cards are not editable (they reflect authored bundle data)