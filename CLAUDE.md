# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Max Escape Creation (MEC) is an in-game map editor / escape-map engine for Warcraft III, written in TypeScript and compiled to Lua via `typescript-to-lua`. It is not distributed as a standalone map: the compiled bundle (`bin/MEC_core.lua`) is designed to be spliced into other people's existing `war3map.lua` files. See [PURPOSE.md](./PURPOSE.md) for what MEC is and why it exists, and [ARCHITECTURE.md](./ARCHITECTURE.md) for the technical picture.

A separate, sibling repository (`mec.maxslid.com`, a Laravel site — not part of this repo) hosts the public documentation site and pulls command metadata from this repo's `yarn generate-help` output. See [ARCHITECTURE.md](./ARCHITECTURE.md#relationship-to-the-mecmaxslidcom-documentation-site).

## Setup

- Node version is pinned via `.nvmrc` (24).
- Copy `.env.example` to `.env` and set:
  - `PROJECT_ROOT_DIR` — absolute path to this repo. **Required**: `tsconfig.js`/`build-tsconfig.ts` throws without it, which means `yarn prepare`, `yarn build`, and `yarn test` all fail until it's set.
  - `PLATFORM` — `"windows"` or `"linux"`. Gates the Wine-launch branch in `scripts/test.ts`.
  - `RELEASE_TEST_TARGET_DIR` / `DEPLOY_TARGET_FILE` — only needed for `yarn release-test*` / `yarn deploy`.
- On Linux, also edit `config.json`: set `gameExecutable` to your Wine-mapped path, and `winePrefix`/`winePath` (default assumes `~/Games/battlenet` and a `wine` binary on PATH).
- `yarn install` runs `yarn prepare` (`build-tsconfig` + `husky`) automatically — this is what generates `tsconfig.json` from `tsconfig.js`.

## Commands

| Command | What it does |
|---|---|
| `yarn build` | Compiles `src/` to Lua (tstl), merges it with `src/lualibs/*.lua` and the World Editor map's own `war3map.lua`, applies build-time Lua patches, packages `dist/${mapFolder}` into a `.w3x` at `outputFolder` (`config.json`). |
| `yarn test` | Compiles (unless `--no-launch`) and launches the actual Warcraft III client to manually play-test the map. **This is not an automated test suite** — see [Testing](#testing) below. |
| `yarn test-launch` / `yarn test-no-launch` | `yarn test --launch` / `yarn test --no-launch`. |
| `yarn release` | `yarn build` then `php ./bin/wrapLUAforWE.php` — packages the compiled bundle into the injectable `bin/MEC_core.lua`. |
| `yarn release-test` | Builds, then splices the freshly built `bin/MEC_core.lua` into every test map under `RELEASE_TEST_TARGET_DIR` (an external, git-tracked folder outside this repo). |
| `yarn release-test-publish` | Same, plus commits and pushes inside `RELEASE_TEST_TARGET_DIR`. |
| `yarn deploy` | Deploys the built map to `DEPLOY_TARGET_FILE`. |
| `yarn generate-help` | Statically scans `src/` for `registerCommand(...)` call sites (no game runtime needed) and writes `bin/commands-help.md`, `bin/commands-help.txt`, `bin/commands-data.json`. Prefer this over hand-editing a command list. |
| `yarn build-tsconfig` | Regenerates `tsconfig.json` from `tsconfig.js`. Runs automatically via `yarn prepare`. |
| `yarn prettier-staged-files` | Formats staged files; this is what the husky `pre-commit` hook runs. |

### Testing

There is no headless/CI-runnable automated test suite for game logic. `yarn test` compiles the map and launches Warcraft III (via Wine on Linux) for manual play-testing.

The closest thing to "run a single test" is the in-game e2e framework under `src/core/Test/e2e-tests/`, exposed as `MEC_core.e2e` and driven at runtime via the `-e2e` chat command inside a launched client:
```
-e2e run <testName>
-e2e speed <percentage>
-e2e stop | pause | resume
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full directory tour and runtime architecture (service registry, hooks, commands, MEC Regions, monster spawns, the `MEC_core` public API). Deep dives on specific subsystems live under `docs/`:

- [docs/BUILD_AND_RELEASE.md](./docs/BUILD_AND_RELEASE.md) — the tstl→Lua merge/patch pipeline, the two-tsconfig setup, and the injection-based release model.
- [docs/COMMANDS_SYSTEM.md](./docs/COMMANDS_SYSTEM.md) — the chat-command parser and the tiered access-control system.
- [docs/MONSTER_SPAWNS.md](./docs/MONSTER_SPAWNS.md) — zone-based recurring monster generators: positioning math, long-distance movement, unit recycling, dead zones.
- [docs/SMIC_PIPELINE.md](./docs/SMIC_PIPELINE.md) — the `-smic` (Save Map In Cache) level-export pipeline, why it's desync-sensitive, and the full round trip through the separate `mec-smic-loader` tool.
- [docs/MEMORY_HANDLER.md](./docs/MEMORY_HANDLER.md) — the object-pooling allocator used in hot paths to avoid Lua GC pressure.

## Key gotchas

- **`tsconfig.json` is generated — edit `tsconfig.js` instead.** Direct edits to `tsconfig.json` are silently overwritten by `yarn prepare`/`build-tsconfig` on the next `yarn install`.
- **MEC is an injectable engine, not a standalone map.** `bin/MEC_core.lua` gets spliced into other maps' `war3map.lua` between literal `-- Max Escape Creation` / `onGlobalInit(initMEC_core)` markers (see `scripts/releaseTest.ts`).
- **`core/Init/initializers.ts` is one big ordered bootstrap function.** Call order is significant and unenforced — adding a new subsystem means wiring it in at the right position, not just anywhere.
- **The `'React'` service key is not React.** No React dependency exists in this project; it's a custom native WC3 Frame/TOC-based UI system (`src/App/`) that happens to reuse that name in `ServiceManager`.
- **Command access-tier checks intentionally cascade.** `accessCheck()` in `src/core/06_COMMANDS/Command_execution.ts` falls through `truemax → max → make/cheat → red → all` on purpose — a higher tier must also satisfy every lower tier's condition. This is not a missing-`break` bug.
- **`bin/commands-help.md` / `commands-help.txt` / `commands-data.json` are generated, not committed by default.** Run `yarn generate-help` before relying on them.
