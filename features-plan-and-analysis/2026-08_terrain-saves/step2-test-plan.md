# Step 2 — Test Plan

Manual, in-game (`yarn test-launch`). No automated tests exist for this project (see `CLAUDE.md`). Run these in order — several depend on state left by earlier ones. Use `-dts` (once step 3 exists) isn't available yet, so verify state via command feedback text and `-smic`/`-lmfc` round-trips instead.

Setup: make sure you're on a level with some visible/distinct terrain (so a save/load is visually obvious), and note the level number you're "making" on (e.g. level 0).

## 1. Basic whole-map save/load/unload/delete round trip

1. Change some terrain by hand (paint a different tile type somewhere visible).
2. `-saveTerrain test1` (or `-st test1`) → expect `terrain save "test1" created`.
3. Change the terrain again (paint something else, different from both the original and from step 2's capture).
4. `-loadTerrain test1` (`-lt test1`) → expect `terrain loaded`, and the map should visually revert to exactly what it looked like at step 2 (the save), **not** the original pre-step-1 state.
5. `-unloadTerrain test1` (`-ult test1`) → expect `terrain unloaded`, and the map should revert to what it was **right before** the `-loadTerrain` in step 4 (i.e. the `previousTerrain` snapshot, not the saved content).
6. `-unloadTerrain test1` again (already unapplied) → expect an error (`this terrain save is not currently applied`), and the terrain should stay untouched.
7. `-deleteTerrainSave test1` (`-delts test1`) → expect `terrain save deleted`, and the live terrain should **not change at all** (it's currently unapplied from step 5, but this must hold regardless of applied state — see §7).

## 2. Label validation

- `-saveTerrain 1abc` → error, label can't start with a digit.
- `-saveTerrain -abc` → error, label can't start with `-`.
- `-saveTerrain ""` (empty, if the parser even lets you try) → error.
- `-saveTerrain validLabel` → succeeds.

## 3. Uniqueness / collision

1. `-saveTerrain dup` → succeeds.
2. `-saveTerrain dup` again (same label, same level, no `global`) → expect an error (label already used), **not** a silent overwrite.
3. `-deleteTerrainSave dup` to clean up.

## 4. Global vs. level scoping

1. On level 0: `-saveTerrain scopeTest` → should be created **on level 0** by default (no explicit scope needed).
2. Go to level 1 (however this project switches making-level in test setup) and `-saveTerrain scopeTest` again → should succeed as a **separate** entry (same label, different level — allowed).
3. Back on level 0: `-saveTerrain scopeTest global` (or `-saveTerrain scopeTest all global`, matching the strict positional syntax — zone slot must be filled to reach the scope slot) → expect an error: `scopeTest` already exists at level 0, and also can't become global while level-scoped entries with that label exist elsewhere. This checks the cross-exclusivity rule.
4. `-deleteTerrainSave scopeTest` on level 0, then on level 1, to clean up both.
5. `-saveTerrain globalTest all global` → should succeed as a **global** entry.
6. `-saveTerrain globalTest` on any level (no `global`) → expect an error (label already used globally, can't also be level-scoped).
7. `-deleteTerrainSave globalTest` to clean up.

## 5. Addressing syntax (`x-label` prefix, bare-label resolution order)

1. Create `addrTest` on level 0 and again on level 1 (two separate entries, per §4).
2. `-loadTerrain addrTest` while making on level 0 → should resolve to level 0's entry (global-first-then-current-level rule; since there's no global `addrTest`, it falls through to the current level).
3. `-loadTerrain 1-addrTest` while making on level 0 → should explicitly resolve to **level 1's** entry instead, proving the prefix overrides the default current-level resolution.
4. `-deleteTerrainSave 0-addrTest` and `-deleteTerrainSave 1-addrTest` to clean up both via explicit addressing.

## 6. `setTerrainSaveLevel`

1. `-saveTerrain moveTest` on level 0.
2. `-setTerrainSaveLevel moveTest 1` → moves it to level 1. Verify via `-loadTerrain 1-moveTest` (works) and `-loadTerrain 0-moveTest` (fails, doesn't exist there anymore).
3. `-setTerrainSaveLevel 1-moveTest global` (or `g`) → moves it to global. Verify `-loadTerrain moveTest` works from any level now.
4. `-setTerrainSaveLevel moveTest current` (or `c`) while making on level 0 → moves it back to level 0.
5. Try moving a save to a level/global scope that would collide with an existing label there → expect the "already used for this level/global scope" error, and the save should **stay at its original scope** (not partially moved).
6. Clean up.

## 7. Apply/unapply edge cases (the "rising edge" rule)

This is the trickiest behavioral rule from the design — worth testing deliberately:

1. `-saveTerrain edgeTest` capturing some terrain state **A**.
2. Change the live terrain to state **B**.
3. `-loadTerrain edgeTest` → live terrain becomes the saved content, `previousTerrain` snapshot = **B**.
4. Change the live terrain again, by hand, to state **C** (simulating something else touching the tiles while applied).
5. `-loadTerrain edgeTest` again (already applied) → live terrain should be **repainted** with the saved content (proving the write is unconditional even when already applied), but the internal snapshot should **still** be **B**, not **C** — verify this directly:
6. `-unloadTerrain edgeTest` → terrain should revert to **B**, **not** C. This confirms the `previousTerrain` snapshot wasn't overwritten by the second `-loadTerrain` in step 5.
7. `-deleteTerrainSave edgeTest` while currently applied (re-`-loadTerrain edgeTest` first if you already unloaded it in step 6) → the live terrain must **not change** as a result of the delete itself, regardless of applied state.

## 8. `-smic` / reload persistence round trip

1. Create at least one terrain save of each kind: whole-map + level-scoped, whole-map + global.
2. `-smic` → check the log shows `Terrain saves saved` between `Levels saved` and `Saving game data to file...` (already validated in step 1, re-confirm here with actual data present this time, not an empty array).
3. `-lmfc` (load map from cache, using the file just saved) → after reload, verify both terrain saves still exist and are still usable (`-loadTerrain` on each still works), and that the level-scoped one still correctly resolves to its original level (not global, not a different level).

## 9. Tooling sanity check

- `yarn generate-help` → confirm all 5 commands (`saveTerrain`, `loadTerrain`, `unloadTerrain`, `deleteTerrainSave`, `setTerrainSaveLevel`) appear correctly in `bin/commands-help.md` under the `make` group (already spot-checked during development, but worth a final confirmation after the label-validator move).
