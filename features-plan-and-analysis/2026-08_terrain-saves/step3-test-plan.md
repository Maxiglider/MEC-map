# Step 3 — Test Plan

Manual, in-game (`yarn test-launch`). Builds on step 2's test plan — run that first if you haven't validated the whole-map commands recently.

## 1. Zone-scoped save via click flow

1. `-saveTerrain zoneTest rect` → expect a making-message like `Define the terrain save zone with 2 clicks`.
2. Click two points on the map to define a rectangle (opposite corners).
3. Expect `terrain save "zoneTest" created`.
4. Change terrain **inside** the zone, and separately change terrain **outside** the zone (both visible, different tiles).
5. `-loadTerrain zoneTest` → only the terrain **inside** the drawn rectangle should be repainted with the saved content; terrain outside the zone must be untouched.
6. `-unloadTerrain zoneTest` → only the zone's tiles revert to their pre-apply state; outside stays as changed in step 4.
7. While the zone is still displayed (or via `-dts zoneTest`, see §5), visually confirm the yellow `debugRects` outline lines up exactly with tile edges — no corner should land mid-tile.
8. `-deleteTerrainSave zoneTest` to clean up.

## 2. Clicks snap to the tile grid, zone can never be rejected as too thin

1. `-saveTerrain thinTest rect`.
2. Click twice inside the **same** tile (the landmark cross should follow your cursor normally, not jump to a tile corner).
3. Expect `terrain save "thinTest" created` — this should **always succeed**, never an error. `-dts thinTest` should show exactly `1 tile`, and its `debugRects` outline should exactly edge that one tile (not centered on your clicks, not offset).
4. Click two points a couple tiles apart and confirm the resulting zone's `debugRects` outline exactly edges the full set of touched tiles (no fractional/mid-tile edges), regardless of where within each tile you clicked.
5. Clean up (`-delts thinTest`).

## 3. `updateTerrainSave` — re-capture in place vs. redraw

1. `-saveTerrain updTest` (whole map, for simplicity) → created.
2. Change some terrain.
3. `-updateTerrainSave updTest` (no second param) → re-captures in place. `-loadTerrain updTest` should now apply the **new** terrain state from step 2, not the original.
4. `-updateTerrainSave updTest rect` → click a rectangle. Expect `terrain save "updTest" zone updated`. The save should now be zone-scoped (no longer whole-map) — verify via `-dts updTest` showing zone bounds instead of "whole map".
5. Repeat the extremely-close-clicks case (§2) but via `-updateTerrainSave ... rect` instead — expect the same success (`terrain save "updTest" zone updated`, at least 1 tile), no rejection.
6. Clean up.

## 4. `displayTerrainSave` — list modes

Set up: create at least 3 terrain saves — one global (`globalA`), one on level 0 (`lvl0A`), one on level 1 (`lvl1A`). Make on level 0 for the following unless stated otherwise.

1. `-displayTerrainSave` (no param) → expect `globalA` listed first, then `lvl0A` (current level), **not** `lvl1A`.
2. `-displayTerrainSave 1` → expect only `lvl1A`, not `globalA` or `lvl0A`.
3. `-displayTerrainSave global` (or `g`) → expect only `globalA`.
4. `-displayTerrainSave current` (or `c`) → expect only `lvl0A` (while making on level 0).
5. `-displayTerrainSave 99` (a level that doesn't exist) → expect `unknown level` error.
6. Create enough terrain saves (10+) at the same scope to force pagination, then `-displayTerrainSave current 2` → expect page 2 contents, with a page header showing `(page 2/N)`.
7. Clean up all test saves.

## 5. `displayTerrainSave` — detail mode

1. `-saveTerrain detailTest rect` and draw a zone.
2. `-displayTerrainSave detailTest` → expect: label, level (or "global"), a tile surface line like `324 tiles (5.3%)` (not "whole map"), `applied: no`. Camera should pan to the zone's center, and the zone's debug rectangle outline should appear briefly then disappear on its own after a few seconds (no manual toggle needed). Sanity-check the numbers: the tile count should roughly match what you'd expect for the rectangle you drew, and the percentage should be `getSurface() / (map width in tiles × map height in tiles) × 100`, rounded to one decimal.
3. `-loadTerrain detailTest`, then `-displayTerrainSave detailTest` again → `applied: yes` now.
4. `-displayTerrainSave 0-detailTest` (explicit level prefix, assuming you're on level 0) → same detail view, confirms addressing syntax still works for the detail branch.
5. A whole-map save's detail view (`-displayTerrainSave updTest` from an earlier whole-map save, if you kept one) → expect `whole map` instead of a tile surface line, and **no** camera pan / debug rect (nothing to center on).
6. Clean up.

## 6. Regression check on step 2 behavior

Quickly re-run a couple of spot checks from `step2-test-plan.md` (label validation, uniqueness, global/level scoping, the apply/unapply rising-edge rule) to make sure nothing regressed while adding zone support — these paths share the same `TerrainSave`/`TerrainSaveArray` code.

## 7. Tooling sanity check

- `yarn generate-help` → confirm `updateTerrainSave` and `displayTerrainSave` appear correctly in `bin/commands-help.md` under `make` (166 make commands total expected, up from 163 in step 2 — `unloadTerrain` + these two).
