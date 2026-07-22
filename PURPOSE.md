# Purpose

## What MEC is

Max Escape Creation (MEC) is an **in-game level editor and runtime engine for Warcraft III "escape" maps**. Escape is a custom-game genre where a group of players navigates a level full of moving monsters, slide terrain, and traps trying to reach an end zone without dying — think co-op obstacle course rather than melee/RPG.

MEC's reason for existing is that building this kind of map by hand, purely through Warcraft III's native World Editor (placing every monster, patrol path, trigger, and terrain-effect region as static GUI objects), is slow and awkward for a genre whose core content — recurring monster spawns, patrol patterns, slide/kill/dead zones — is repetitive and needs constant live iteration. MEC instead lets a map author build and tune all of that **while the map is actually running**, via chat commands (`-createMonsterSpawn`, `-createMonster`, `-newRegion`, …) and simple map clicks to define zones, with immediate visual/gameplay feedback. See [docs/COMMANDS_SYSTEM.md](./docs/COMMANDS_SYSTEM.md) and [docs/MONSTER_SPAWNS.md](./docs/MONSTER_SPAWNS.md) for what that authoring surface actually looks like.

## Why it's an engine, not a map

MEC is deliberately built to be **shared across many separate escape maps**, not tied to one. The compiled output (`bin/MEC_core.lua`) is designed to be spliced into any host map's own `war3map.lua` (see [ARCHITECTURE.md](./ARCHITECTURE.md#what-mec-actually-is)). In practice this means:

- Map authors get a common, maintained toolkit (monster AI/patrol behavior, region shapes, save/export tooling, scoring, hooks for custom triggers) without reimplementing it per map.
- Improvements and bug fixes to core mechanics (see the version changelogs, e.g. `2026-03-02_MEC_v2.2_changelog.md`) benefit every map built on MEC at once, via `yarn release-test`/`releaseTest.ts` pushing an updated core out to tracked test maps.
- A map's actual level content (terrain, story, monster placement) stays map-specific; only the *engine* — the reusable authoring/runtime layer — is centralized here.

## History

MEC started in 2008 during the development of *Murloc Slide*, originally just to speed up monster creation for that map. It's a project by Maxiglider. In 2022, Stan joined and brought **MEC 2**: a TypeScript rewrite (compiled to Lua via `typescript-to-lua`, see [docs/BUILD_AND_RELEASE.md](./docs/BUILD_AND_RELEASE.md)) targeting modern Warcraft III Reforged, replacing the original JASS-based MEC. Players/maps on older Warcraft III versions can still use the legacy MEC.

## Who it's for

- **Escape map authors** — the primary users of the in-game command/click authoring tools this repo builds.
- **Players** of maps built on MEC — who interact with the runtime side (monster behavior, slide physics, scoring, lives) without ever seeing MEC itself.
- **MEC's own maintainers** — extending the engine's capabilities (new region shapes, new hook points, new commands) in a way that propagates to every map using it.

## Ecosystem

- **This repository (`MEC-map`)** — the engine's source and build/release tooling.
- **Discord server** (http://discord.gg/N8QwwFTcYJ) — the community hub; the *active*, most up-to-date changelog is maintained there rather than in this repo.
- **[mec.maxslid.com](https://mec.maxslid.com/)** — the public documentation website (a separate Laravel project, not part of this repo) with a searchable command reference, kept in sync with this repo's `yarn generate-help` output. See [ARCHITECTURE.md](./ARCHITECTURE.md#relationship-to-the-mecmaxslidcom-documentation-site).
- **`mec-smic-loader`** — a separate standalone .NET CLI tool (not part of this repo) that map authors run outside the game to turn a `-smic` export into an updated, distributable map file (terrain, minimap, and the level data baked in). See [docs/SMIC_PIPELINE.md](./docs/SMIC_PIPELINE.md#mec-smic-loader-the-companion-tool) for the full round trip.
