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
- Valid ?character=<id> boots that character.
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

## Remaining Character-Specific Areas

- The app now boots two materially different bundles: Sable Vey and Morrow Vale.
- The runtime architecture tolerates distinct identity text, stats, items, spell lists, attunement defaults, and item-use inventories without app-layer changes.
- The sheet still assumes a shared schema family across characters: Bard 11, College of Spirits features, the same core runtime resources, and the same rest/reset model.
- Several UI sections are still class- and subclass-specific rather than fully generic: spirits table, bardic inspiration language, spirit-guardian free-cast handling, and the current feature/spell presentation shape.
- Manual runtimeModel metadata authoring per character remains required.

## Query-Based Character Test

- index.html -> chooser renders
- index.html?character=sable-vey -> Sable boots
- index.html?character=placeholder-adept -> Morrow Vale boots
- index.html?character=does-not-exist -> chooser renders

## Next Logical Refactor Target

- Introduce action-type constants and optional action schema validation to harden dispatch contracts while keeping plain-script architecture.