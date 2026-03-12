# Migration Notes

## Current Responsibilities

- src/data/sable-data.js: static character dataset.
- src/data/default-state.js: default runtime state shape.
- src/data/spell-meta.js: static spell metadata.
- src/app/utils.js: generic utility helpers.
- src/app/persistence.js: storage key and state load/save helpers.
- src/app/state.js: runtime globals and initial state bootstrap.
- src/app/derived.js: computed state helper(s), currently derived().
- src/app/reset.js: short rest, long rest, and reset-all logic.
- src/app/view-helpers.js: non-tab render/view helper logic used by rendering and events.
- src/app/render.js: top-level UI render functions and renderApp.
- src/app/events.js: click/change/input event handlers.
- src/app/main.js: final bootstrap wiring (event listeners and initial render call).

## Required Script Load Order

The current plain-script order in index.html is required:

1. src/data/sable-data.js
2. src/data/default-state.js
3. src/data/spell-meta.js
4. src/app/utils.js
5. src/app/persistence.js
6. src/app/state.js
7. src/app/derived.js
8. src/app/reset.js
9. src/app/view-helpers.js
10. src/app/render.js
11. src/app/events.js
12. src/app/main.js

## Architectural Constraints

- Keep browser-global plain scripts (no ES modules yet).
- Must work when opening index.html directly with file://.
- No runtime fetch calls and no runtime network dependency.
- Keep localStorage persistence behavior unchanged.
- Keep reset behavior and render output unchanged.

## Known Next Refactor Targets

- Split events.js into smaller handler-focused files while preserving global function names.
- Reduce render.js line length/readability with behavior-preserving formatting only when approved.
- Introduce optional smoke-test checklist or script (manual/browser-based) without adding runtime dependencies.
- Evaluate gradual transition path from globals to modules once file:// compatibility strategy is explicitly approved.
