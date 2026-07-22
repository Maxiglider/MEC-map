# Build & Release Pipeline

## The two tsconfig files

`tsconfig.js` is the hand-edited source of truth — it's a `.js` file (not `.json`) specifically so it can `import 'dotenv/config'` and read `process.env.PROJECT_ROOT_DIR`, throwing if it's unset (the `war3-transformer` plugin needs an absolute root for `mapDir`/`entryFile`/`outputDir`).

`scripts/build-tsconfig.ts` (`yarn build-tsconfig`) imports `tsconfig.js` and serializes it to `tsconfig.json`, which is what `tstl`, IDEs, and other tooling actually read. This runs automatically via `yarn prepare` (wired into `yarn install` through husky).

**Never hand-edit `tsconfig.json` directly** — it will be silently clobbered on the next `yarn install`/`yarn prepare`.

## `yarn build`

`scripts/build.ts` loads `config.json` and calls `compileMap()` (`scripts/utils.ts`):

1. Copies `maps/map.w3x` → `dist/map.w3x`.
2. Runs `tstl -p tsconfig.json`, producing `dist/tstl_output.lua`. The `war3-transformer` compiler plugin (configured in `tsconfig.js`) rewrites/generates code referencing the map's terrain/object data during this pass.
3. Merges, in order: each `src/lualibs/*.lua` file (wrapped as `name = function() … end`), then the World-Editor-generated `dist/map.w3x/war3map.lua`, then `dist/tstl_output.lua`. Runs `processScriptIncludes` to resolve `include("file")` directives via literal splicing.
4. Applies **three hardcoded string-replacement Lua patches** to the merged output:
   - Rewrites TSTL's generated `require()` polyfill to add circular-dependency detection/error reporting.
   - Rewrites TSTL's `__TS__ArraySplice` to a simplified 2-arg fast path.
   - Rewrites `__TS__ObjectGetOwnPropertyDescriptors` to return a shared cached empty-table singleton instead of allocating `{}` per call.

   **These patches fail silently** — if a `typescript-to-lua` upgrade changes its generated boilerplate and a target string isn't found, `compileMap()` only logs a `console.warn`; the build still succeeds, minus that patch. If you bump `typescript-to-lua`, check these warnings.
5. Optionally minifies via `luamin` if `config.minifyScript`.
6. Writes the result to both `dist/map.w3x/war3map.lua` (host-map-Lua-included) and `dist/tstl_output_extended.lua` (host-map-Lua-excluded — the "pure MEC core" bundle used by the release step below).

Back in `build.ts`, the `dist/${mapFolder}` directory is packaged into a `.w3x` archive at `config.outputFolder` using `mdx-m3-viewer-th`'s `War3Map`.

## `yarn release`

`yarn build && php ./bin/wrapLUAforWE.php`. The PHP script:

1. Reads `dist/tstl_output_extended.lua` and `src/MEC_core_version`.
2. Wraps the bundle in a `get_MEC_core()` function plus a self-contained init/event system (`onGlobalInit` / `onTriggerInit` / `onInitialization` / `onGameStart`, each `pcall`-wrapped with delayed error printing via a 1s timer).
3. Performs two regex-based string replacements coupled to tstl's current output format:
   - `return require("src.main", ...)` → `return ____modules["src.main"]`
   - Collapses `addScriptHook(W3TS_HOOK.MAIN_AFTER, errorHandler(tsMain))` (from `main.ts`) into a direct `errorHandler(tsMain)()` call.

   Unlike the build-time patches above, **this one hard-fails loudly** (prints `"addScriptHook replacement failed !"`) if the pattern isn't found — a `w3ts`/tstl output-format change could break `yarn release` specifically. It doesn't throw, so a script consumer needs to check the printed output.
4. Emits `bin/MEC_core.lua`, also injecting an in-game "quest" that shows the MEC version/credits.

## Injecting into a host map

MEC is designed to be spliced into another map's existing `war3map.lua`, between literal markers:
```
-- Max Escape Creation
...
onGlobalInit(initMEC_core)
```

`scripts/releaseTest.ts` automates this for every `.w3x`/`.w3m` file under `RELEASE_TEST_TARGET_DIR` (an env var pointing outside this repo): it opens each archive with `mdx-m3-viewer-th`, finds the existing `war3map.lua`, splices in the freshly built `bin/MEC_core.lua` between the markers, re-saves, and (if the filename contains `_`) renames it with a new timestamp suffix. With `--publish`, it also commits and pushes inside that external target directory.

This is distinct from `yarn test`, which is for iterative development (see [CLAUDE.md](../CLAUDE.md#testing)) — `releaseTest.ts` is the "ship an updated MEC core to all live test maps" tool.

## `yarn deploy`

Deploys the built map to `DEPLOY_TARGET_FILE` (an `.env` variable).
