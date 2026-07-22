# The `-smic` (Save Map In Cache) Pipeline

"smic" stands for **Save Map In Cache** — it's MEC's in-game level-authoring export mechanism, not an abbreviation of anything else. It's the subject of most of the desync-related bug fixes in the project's changelogs, because of a client-only execution constraint (see below). The full round trip spans **two repositories**: this one (export) and the sibling **`mec-smic-loader`** project (import/regeneration — see [below](#mec-smic-loader-the-companion-tool)).

## Exporting: `-smic` in-game

Implemented in `src/core/07_TRIGGERS/Save_map_in_gamecache/SaveMapInCache.ts` (class `SaveMapInCache`, static method `.smic`), triggered by the `-smic` chat command:

1. `SaveMapInCache.smic(player, withTerrain, fileName)` serializes the entire current runtime level-authoring state to JSON via `gameAsJsonString()`: terrain (`PushTerrainDataIntoJson`), MEC terrain-type config, monster types, caster types, and all levels (each via a `.toJson()` on its typed collection — e.g. [MonsterSpawn.toJson()](./MONSTER_SPAWNS.md#persistence-json)).
2. The JSON is written via `SaveLoad.saveFile(fileName, ...)` → `SyncSaveLoad.writeFile()` (`src/Utils/SaveLoad/TreeLib/SyncSaveLoad.ts`), which encodes it into the client's local WC3 cache/log using a two-layer trick:
   - The payload is chunked (`CHUNK_SIZE` characters per chunk — the "increased chunk size from 150 to 200" changelog entries tune this), each chunk prefixed with a hex header encoding the total chunk count and current chunk index.
   - Each chunk is written via `Preload(...)`. WC3's `Preload` natively writes its literal string argument to the log — MEC abuses this by crafting the argument as `")\ncall BlzSendSyncData("<prefix>","<header+chunk>` so the log ends up containing a literal `call BlzSendSyncData("...", "...")` line rather than a literal `call Preload(...)` line. This is **purely a text-injection trick** — no actual `BlzSendSyncData` call happens in-game; it's just what gets written to disk. Double quotes in the payload are escaped to a placeholder token (`#DQ#`) beforehand so they don't break out of the crafted string early.
3. The resulting local file/log (a `.txt`) is what the map author manually retrieves from their WC3 client and hands to `mec-smic-loader`.

Two extraction utilities exist **inside this repo** as well, for ad-hoc/manual use: `scripts/convert_smic.ts` and `bin/extractJsonFromSmicData.php`, both regex-extracting the payload from the raw `.txt` and re-serializing it to a `.json` file. These are lighter-weight alternatives to the full `mec-smic-loader` pipeline (JSON extraction only, no map regeneration).

## Why it's desync-sensitive

Step 1 runs **client-side only** (`if (p === null || GetLocalPlayer() == p)`). Any accidental deviation from that — code inside the smic flow that touches shared/synced game state instead of staying purely local — desyncs the match. This is exactly why past changelog entries repeatedly reference `-smic` causing or fixing desyncs (e.g. backslash-escaping changes in the exported strings, chunk-size tuning for large exports).

If you touch `SaveMapInCache.ts` or `SyncSaveLoad.ts`, verify the client-only guard is preserved and that nothing in the call path can trigger a synced/shared-state side effect.

## `mec-smic-loader`: the companion tool

`mec-smic-loader` is a **separate repository**, not part of `MEC-map` and not published in `MEC-map`'s own build. It's a standalone .NET CLI tool (C#, `net10.0`, `Program.cs`) distributed as an executable, bundling the same `mpqcli`/`mpqtool.exe` MPQ archive tool used in `MEC-map/bin/`. It's the actual consumer of the exported `.txt`, and does far more than JSON extraction — it's a full map-regeneration tool:

1. **Extraction** (`ExtratGameDataAsJson`): reads the `.txt` and regex-matches the *new* `call BlzSendSyncData("...", "...")` format described above; if no matches are found, it falls back to matching the *old* literal `call Preload("...")` format, for backward compatibility with maps/MEC versions that used the simpler pre-`BlzSendSyncData` encoding. Same `#DQ#` unescaping as the export side.
2. **Regeneration**, all driven from the parsed JSON:
   - `GenerateTerrainFile` — rebuilds a binary `war3map.w3e` (WC3's native terrain format) from the JSON terrain data, byte-for-byte, optionally reading the target map's *existing* `war3map.w3e` to preserve cliff/ramp/water data the JSON export doesn't carry.
   - Minimap generation (`minimap/`, using the `BlpEncoder` for WC3's `.blp` image format) — this is the "generate a new minimap" feature from the changelogs.
   - `GenerateGameDataFile` / `GenerateNewWctFile` / `GenerateNewLuaFile` — wraps the JSON in a `function setGameData() ... MEC_core.setGameData(<json>) ... end \n onGlobalInit(setGameData)` trigger block, and **patches it directly into the target map's `war3map.wct` (custom text triggers) and `war3map.lua`**, replacing any previous `setGameData` trigger block in place.
   - `GenerateFinalMapFile` — repacks everything (plus a regenerated `(listfile)`/`(attributes)`/`.imp` import list) back into the original `.w3m`/`.w3x` via the bundled MPQ tool, after first writing a timestamped backup.
3. If invoked with only a map (no data file), it offers to create a Windows shortcut (`.lnk`) pre-bound to that map, so a map author can later just drag a fresh smic `.txt` export onto the shortcut to update that specific map — a workflow aimed at non-technical map authors, not just developers.

This closes the loop back into MEC-map itself: the generated `MEC_core.setGameData(<json>)` trigger call is what `MEC_core_API.setGameData` (`src/core/API/MEC_core_API.ts`) receives at map start — it hands the JSON string to `LoadMapFromCache.initializeGameData()`, which reconstructs the runtime `Level`/`MonsterSpawn`/`Region`/etc. objects. In other words: **`-smic` exports a live authoring session to JSON; `mec-smic-loader` bakes that JSON into a distributable map file (terrain, minimap, and a `setGameData` trigger); and `MEC_core_API.setGameData` reconstructs the same runtime state from that baked-in JSON the next time the map loads.**

If you're asked to change the JSON shape of anything under `.toJson()`/`newFromJson()` in `MEC-map` (e.g. [MonsterSpawn](./MONSTER_SPAWNS.md#persistence-json)), keep in mind `mec-smic-loader` and `LoadMapFromCache` both need to stay in sync with that shape — they live in different repositories and won't be caught by this repo's own type checker.
