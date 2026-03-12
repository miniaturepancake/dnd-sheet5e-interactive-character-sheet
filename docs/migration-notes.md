# Migration Notes

## Current Responsibilities

- src/data/characters/sable-vey/character-data.js: Sable static character dataset.
- src/data/characters/sable-vey/default-state.js: Sable default runtime state shape.
- src/data/characters/sable-vey/spell-meta.js: Sable static spell metadata.
- src/data/characters/index.js: authoritative character registry, default character id, storage key seeds, boot selection config, and per-character bundle + runtime metadata.
- src/app/boot-loader.js: deterministic boot loader that resolves active character id, loads character-specific data scripts, then loads shared app scripts.
- src/app/utils.js: generic utility helpers.
- src/app/current-character.js: resolves current character id at boot from query string with fallback, reads selected character bundle, binds DATA/DEFAULT_STATE/SPELL_META/STORAGE_KEY globals from that bundle, and normalizes character-driven runtime state (attunement ids, item-use ids, item-recovery ids).
- src/app/persistence.js: storage key and normalized state load/save helpers.
- src/app/state.js: runtime globals and initial state bootstrap.
- src/app/resource-model.js: runtime resource-definition helpers (resource aliases, spell-slot/item-use/free-cast spend helpers, and reset helpers).
- src/app/derived.js: computed state helper(s), currently derived().
- src/app/reset.js: short rest, long rest, and reset-all logic driven by current-character resource id lists.
- src/app/actions.js: centralized runtime action and cast-resolution layer used by event dispatch.
- src/app/view-helpers.js: non-tab render/view helper logic used by rendering and events.
- src/app/render.js: top-level UI render functions and renderApp.
- src/app/events.js: thin DOM event-to-action dispatch layer.
- src/app/main.js: final bootstrap wiring (event listeners and initial render call).

## Required Script Load Order

The current deterministic bootstrap order is required:

1. index.html static scripts:
	- src/data/characters/index.js
	- src/app/boot-loader.js
2. boot-loader dynamic character-specific scripts:
	- from registry entry `scriptPaths` for the resolved character id
3. boot-loader dynamic shared app scripts:
	- src/app/utils.js
	- src/app/current-character.js
	- src/app/persistence.js
	- src/app/state.js
	- src/app/resource-model.js
	- src/app/derived.js
	- src/app/reset.js
	- src/app/actions.js
	- src/app/view-helpers.js
	- src/app/render.js
	- src/app/events.js
	- src/app/main.js

## Architectural Constraints

- Keep browser-global plain scripts (no ES modules yet).
- Must work when opening index.html directly with file://.
- No runtime fetch calls and no runtime network dependency.
- Keep localStorage persistence behavior unchanged.
- Keep reset behavior and render output unchanged.
- Keep the default character mapping on Sable to preserve current behavior.

## Boot-Time Character Selection

- Selection is non-UI and starts in src/app/boot-loader.js using resolver logic from src/data/characters/index.js.
- Query parameter key is registry-configured in src/data/characters/index.js:
	- window.CHARACTER_BOOT_CONFIG.queryParam (currently `character`)
- Resolution order at boot:
	1. query value from `?character=<id>` when it matches a known registry id
	2. chooser rendering when query is missing or invalid
- The resolved id is written to `window.ACTIVE_CHARACTER_ID` and then used by src/app/current-character.js.
- Current behavior for normal file opening:
	- opening index.html without query shows the chooser.
- Invalid or unknown query ids show the chooser.

## Current Character Set

- Default character (unchanged): `sable-vey`
- Additional scaffold character: `placeholder-adept`
- The scaffold is intentionally placeholder-first and currently reuses Sable-derived data structures to validate boot/runtime wiring without introducing partial schema risk.

## Contract Change: Old vs New

- Old contract (removed):
	- each character exposed three separate globals:
	- `..._DATA`
	- `..._DEFAULT_STATE`
	- `..._SPELL_META`
	- registry mapped three global names (`dataGlobal`, `defaultStateGlobal`, `spellMetaGlobal`)
- New contract (active):
	- each character exposes one bundle object in `window.CHARACTER_BUNDLES[<id>]`
	- bundle contains at minimum:
	- `data`
	- `defaultState`
	- `spellMeta`
	- `storageKeySeed`
	- `storageKey`
	- registry references the bundle by character id (`bundleId`, defaulting to `id`)

## Normalized Runtime / Resource Model

- Runtime attunement state is now normalized from character attunement ids (`item.id` when present, otherwise `item.key`).
- Runtime item-use state is now normalized from character spell ids in:
	- `data.cantrips` entries with `id`
	- `data.specialSpells['Item-granted spells']` entries with `id`
- Runtime item recovery state now uses item-id keyed state:
	- `state.itemResources.<itemId>.recoveryAvailable`
	- Current Sable mapping: `state.itemResources.viol.recoveryAvailable`
- Legacy saved state compatibility is preserved:
	- old `resources.<itemId>Recover` fields are migrated into `itemResources` at load time.

## Character-Driven Parts Now In Place

- `src/data/characters/index.js` now supplies per-character metadata:
	- `id`
	- `label`
	- `bundleId`
	- `storageKeySeed`
	- `storageKey`
	- character-specific `scriptPaths`
	- `runtimeModel` metadata per character:
	- `focusItemId`
	- `itemRecoveryIds`
	- `resourceIds`
	- `spellCastRules`
	- `shortRestResourceIds`
	- `longRestResourceIds`
- `src/app/current-character.js` derives these id sets for the boot-selected character and exposes normalized defaults (`CHARACTER_DEFAULT_STATE`).
- `src/app/resource-model.js` resolves character-driven resource aliases and cast rule lookups into reusable spend/reset helpers.
- `src/app/actions.js` owns cast intent resolution and runtime action application.
- `src/app/persistence.js` loads into normalized character-shaped state via `normalizeState(...)`.
- `src/app/reset.js` applies short/long rest resets by resource id lists instead of hardcoded Sable field names.

## Remaining Character-Specific Areas

- The textual labels and descriptive copy in renderers are still authored for Sable.
- Resource ids in current data/default-state files still use Sable-shaped field names (`holdingViol`, `shieldFree`, `spiritGuardiansFree`, `spiritGuardiansCover`), but runtime reads/writes now go through character-driven alias and cast-rule metadata.
- The Sable runtime model values in `src/data/characters/index.js` are still explicitly configured for this one character.

## Final Per-Character File Layout

- `src/data/characters/sable-vey/character-data.js`
- `src/data/characters/sable-vey/default-state.js`
- `src/data/characters/sable-vey/spell-meta.js`
- `src/data/characters/placeholder-adept/character-data.js`
- `src/data/characters/placeholder-adept/default-state.js`
- `src/data/characters/placeholder-adept/spell-meta.js`

Each character folder now contains only that character's globals and data payloads.

## Minimum Required Character Files / Globals

For each new character id `<id>`, provide three character files and matching globals:

- `src/data/characters/<id>/character-data.js`
	- must populate `window.CHARACTER_BUNDLES['<id>'].data`
- `src/data/characters/<id>/default-state.js`
	- must populate `window.CHARACTER_BUNDLES['<id>'].defaultState`
- `src/data/characters/<id>/spell-meta.js`
	- must populate `window.CHARACTER_BUNDLES['<id>'].spellMeta`
	- these files should also preserve bundle metadata (`id`, `storageKeySeed`, `storageKey`) via bundle initialization

The registry entry in `src/data/characters/index.js` must include:

- `id`, `label`, `storageKeySeed`, `storageKey`
- `bundleId` (or use `id` as default bundle key)
- `scriptPaths` (the three file paths above)
- `runtimeModel` id lists used by reset/derived logic

## Registry Responsibilities

- Owns authoritative character ids and labels.
- Owns per-character storage key seed/key values.
- Owns bundle id lookup (`bundleId`) for each character.
- Owns per-character script path list used at boot (`scriptPaths`).
- Owns default character id (`window.DEFAULT_CHARACTER_ID`) and query-param boot config.

## Boot-Loader Responsibilities

- Resolves a safe boot character id from the registry resolver.
- Renders chooser when no valid query id is provided.
- Loads character-specific scripts first, in deterministic order.
- Loads shared app scripts after character scripts, preserving plain-script global runtime behavior.
- Does not fetch network resources and remains file:// compatible.

## Remaining Generalization Targets

- Bundle metadata is currently authored redundantly in registry and bundle-init lines; keeping both is intentional for compatibility and explicitness.
- Runtime model ids/rules are still manually authored per character in registry.
- Some UI copy remains Sable-specific text even though data/reset/persistence resolution is bundle-driven.

## Query-Based Character Test

- No query check:
	- open `index.html`
	- expected: chooser renders.
- Explicit default id check:
	- open `index.html?character=sable-vey`
	- expected: Sable loads.
- Placeholder scaffold check:
	- open `index.html?character=placeholder-adept`
	- expected: placeholder loads successfully.
- Invalid id check:
	- open `index.html?character=does-not-exist`
	- expected: chooser renders.

## Shared vs Character-Specific Files

- Shared bootstrap/runtime files:
  - src/data/characters/index.js
  - src/app/boot-loader.js
  - src/app/*.js shared app runtime files (utils/current-character/persistence/state/derived/reset/view-helpers/render/events/main)
- Character-specific files:
  - character data/default-state/spell-meta scripts listed in each registry entry `scriptPaths`

## Remaining Limitations

- Character scripts must still expose browser globals with the expected names.
- There is still no runtime UI for changing character; selection is URL/query-driven at boot only.

## Known Next Refactor Targets

- Move remaining render-layer hardcoded runtime resource paths (`resources.*`) behind alias helpers while preserving current UI text and behavior.
- Reduce render.js line length/readability with behavior-preserving formatting only when approved.
- Introduce optional smoke-test checklist or script (manual/browser-based) without adding runtime dependencies.
- Expand spell-cast rule metadata to handle additional special-case spells without touching action resolver internals.
