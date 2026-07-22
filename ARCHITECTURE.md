# Architecture

This document describes the big-picture architecture of MEC (Max Escape Creation): how the pieces fit together, not a file-by-file listing. For commands, see [CLAUDE.md](./CLAUDE.md). For deep dives on specific subsystems, see [docs/](./docs/).

## What MEC actually is

MEC is not a standalone Warcraft III map — it's an **injectable engine**. The build produces `bin/MEC_core.lua`, a self-contained bundle meant to be spliced between two literal markers (`-- Max Escape Creation` … `onGlobalInit(initMEC_core)`) inside *other people's* existing `war3map.lua` files. `scripts/releaseTest.ts` automates this splice across a folder of externally-tracked test maps (`RELEASE_TEST_TARGET_DIR`, outside this repo), and can even auto-commit/push there with `--publish`. See [docs/BUILD_AND_RELEASE.md](./docs/BUILD_AND_RELEASE.md) for the full pipeline.

Once injected, the map exposes a global `MEC_core` object (`src/core/API/MEC_core_API.ts`) that the *host* map's own GUI triggers or custom Lua scripts call into — this is the literal source of the "MEC_core API" section in the project's changelogs.

## Directory tour

- **`src/`** — all TypeScript source, compiled to Lua via `typescript-to-lua`. Entry point `src/main.ts`.
  - `core/01_libraries` … `core/09_From_old_Worldedit_triggers` — numbered folders reflecting the historical order in which legacy JASS/GUI-trigger logic was ported to TypeScript. They're now just organizational buckets, not a dependency order:
    - `04_STRUCTURES` — the domain model: `Escaper`, `Level`, `Region`, `Monster`, `MonsterSpawn`, `TerrainType`.
    - `06_COMMANDS` — the chat-command system (see [docs/COMMANDS_SYSTEM.md](./docs/COMMANDS_SYSTEM.md)).
    - `07_TRIGGERS` — WC3 GUI-trigger equivalents (save/load, terrain, slide physics), including the smic pipeline.
    - `08_GAME` — game-loop features (AFK detection, APM/CPM counters, camera, death handling).
    - `09_From_old_Worldedit_triggers` — a near-literal port of old World Editor GUI trigger globals.
  - `core/API` — the public `MEC_core` surface (see above).
  - `core/wc3_natives_unsecured/Natives.ts` — wraps raw w3ts/JASS natives with `assertDefined()` so nullable native return types become non-null, throwing with a stack trace on an unexpected `null` instead of scattering `!` assertions everywhere.
  - `core/Test/e2e-tests` — the in-game e2e test framework (there is no headless test runner; see [CLAUDE.md](./CLAUDE.md#testing)).
  - `App/` — the in-game UI layer (`Interface.ts`, `renderInterface.ts`). **Not React** despite the `ServiceManager` key being named `'React'` — it's a custom retained-mode UI built on the native WC3 BLZ Frame API (TOC skin files).
  - `Utils/MemoryHandler.ts` — object-pooling allocator (see [docs/MEMORY_HANDLER.md](./docs/MEMORY_HANDLER.md)).
  - `Utils/SaveLoad/` — game-cache save/load primitives (the `Preload()`-based persistence hack WC3 maps rely on) plus `TreeLib` for terrain doodad data.
  - `lualibs/` — hand-written **pure Lua** modules (`info.lua`, `json.lua`, `strings.lua`), each with a `.d.ts` for TS typing. These are *not* compiled from TypeScript; the build wraps and prepends them ahead of the tstl output.
  - `Services.ts` — a small typed service locator (`ServiceManager`). `registerServices({...})` runs each init function once and stores the result under a typed key (`Lives`, `Multiboard`, `Cmd`, `React`, `MEC_core_API`, `MECRegionService`, …). `getService(name)` throws if the service is missing.
  - `core/Init/initializers.ts` — one large, ordered, sequential bootstrap function calling ~25 `init_X()` functions across `core/`. Call order matters and is unenforced by any dependency mechanism.

- **`scripts/`** — Node/ts-node build and tooling scripts (build, test, deploy, release, `generate-help-docs.ts`, `convert_smic.ts`, `debug-memory-handler.ts`, `build-tsconfig.ts`).

- **`converter/`** and **`ConvertMaps/`** — legacy/one-off migration tooling, not part of the live engine:
  - `converter/` — a JASS→TypeScript source converter used historically to port old JASS trigger code.
  - `ConvertMaps/` — archived legacy MEC1 maps plus converters to migrate their level/monster data into MEC2's JSON format. `ConvertMaps/TS/` is a **fully independent** yarn project (own `package.json`/`tsconfig.json`/`yarn.lock`) — don't assume it shares this repo's build/test tooling.

- **`bin/`** — release packaging (`wrapLUAforWE.php`) plus PHP CLI helpers (`generate-core.php`, `listCommands.php`, `extractJsonFromSmicData.php`, …) and platform MPQ archive tools (`linux/mpqcli`, `windows/mpqtool.exe`). Also the destination for generated docs (`commands-help.md`, `commands-data.json`) and smic pipeline artifacts.

- **`maps/map.w3x/`** — the *source* map: uncompressed World-Editor-authored data (terrain, doodads, object data) plus a placeholder `war3map.lua` that gets overwritten at build time.

- **`dist/`** — build output only: `dist/map.w3x/` (compiled map folder), `dist/tstl_output.lua` / `dist/tstl_output_extended.lua` (raw tstl bundle, with/without the map's own Lua), `dist/bin/map.w3x` (final packaged archive).

## Runtime architecture

### Bootstrap

`main.ts`'s `tsMain()` runs via a `w3ts` script hook (`addScriptHook(W3TS_HOOK.MAIN_AFTER, ...)`) — which the release pipeline replaces with a direct call once injected into a host map (see [docs/BUILD_AND_RELEASE.md](./docs/BUILD_AND_RELEASE.md)). It, in order: registers all services via `ServiceManager`, registers two inline commands, calls `Cmd.initCommands()`, calls `initializers()`, then `React.init()`.

### `MEC_core` public API

`src/core/API/MEC_core_API.ts` is a flat object assigned to the global `MEC_core`, callable from the *host* map's own Lua/GUI trigger scripts once MEC core is injected. It exposes game-data loading, getters for escapers/terrain types/levels/monster types, monster-patrol constructors, hook registration, runtime settings (gravity, wander behavior, AFK time, meteor effect, …), scoring, and `e2e`.

### Hooks

`core/API/GeneralHooks.ts` + `MecHook.ts`/`MecHookArray.ts` implement a typed registry of named hook arrays (`hooks_onGameWinning`, `hooks_onBeforeHeroUsingMeteor`, `hooks_onHeroEnterRegion`, …). `MEC_core_API` exposes typed wrapper methods over these so host-map scripts get hook registration without touching the internal array API directly. Some hooks are per-`Level` rather than global (e.g. `onStartLevel`).

### Commands

The chat-command system (`-command` syntax) is detailed in [docs/COMMANDS_SYSTEM.md](./docs/COMMANDS_SYSTEM.md). In short: any chat message starting with `-` is parsed (with support for comma-chained multi-commands and parenthesis-grouping), matched against a flat array of registered commands, and gated by a deliberately-cascading access-tier check.

### MEC Regions

`core/04_STRUCTURES/Region/` — a shape-abstraction hierarchy (`HorizontalRectangleRegion`, `RectangleRegion` (diagonal-capable), `LineRegion`, `CircleRegion`, `ParallelogramRegion`, `TrapezeRegion`), backed by `MECRegion_service.ts` (registered as `MECRegionService`). Used across features that need an arbitrary zone: TP end-zones, monster kill rects, monster spawn dead zones.

### Monsters and spawns

`core/04_STRUCTURES/Monster/` (the monster itself — movement strategies like `MonsterNoMove`, `MonsterSimplePatrol`, `MonsterMultiplePatrols`, `MonsterTeleport`, `LongDistanceMoveOrder` for auto-split long patrols) is distinct from `core/04_STRUCTURES/MonsterSpawn/` (spawn-point definitions that *create* Monster instances: direction modes, dead zones, recycling via `SimpleUnitRecycler`). See [docs/MONSTER_SPAWNS.md](./docs/MONSTER_SPAWNS.md) for the full breakdown — notably, spawned monsters bypass the movement-strategy classes entirely and compute their own positioning/movement.

### w3ts as the WC3 API layer

`w3ts` (from the external `wc3-ts-template`) provides typed OOP wrappers over raw JASS/Lua natives and the `W3TS_HOOK`/`addScriptHook` mechanism used for the single main entry point. Natives that can return `null` are additionally wrapped via `assertDefined()` (see [Directory tour](#directory-tour) above).

## Relationship to the mec.maxslid.com documentation site

`mec.maxslid.com` is a **separate Laravel repository** (not part of this repo) that hosts the public MEC documentation website, including a searchable command reference. It stays in sync with this repo via a small Node bridge script, `website-updates-from-mec-map/refresh-commands-doc-if-new.js`, which:

1. Clones or pulls this repo (`MEC-map`).
2. Runs `yarn generate-help` to produce `bin/commands-data.json`.
3. Maps each command's `group` field to a `mc_commande_type` row and upserts all commands into a MySQL database (`mc_commande` table) that the Laravel site renders.

**Known drift**: the bridge script currently does `cd ./MEC-map/TS && git pull && yarn`, referencing a `TS/` subfolder. This repo's TypeScript content was moved from a `TS/` subfolder to the repository root (see the "removed the old jass content from MEC1 and put MEC2 content from TS/ folder to the root directory" changelog entry) — so that script's paths are likely stale relative to this repo's current layout. If you're asked to touch that bridge script, verify the actual paths first rather than trusting the existing `cd` commands.
