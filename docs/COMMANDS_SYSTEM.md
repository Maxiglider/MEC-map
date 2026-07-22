# Chat Command System

MEC's admin/debug/gameplay commands are chat-driven: any chat message starting with `-` is intercepted (`TriggerRegisterPlayerChatEvent(t, player, '-', false)`, registered for every player in `src/core/06_COMMANDS/Command_execution.ts`).

For the actual list of commands, don't hand-transcribe — run `yarn generate-help` (see [CLAUDE.md](../CLAUDE.md)), which statically scans `src/` for `registerCommand(...)` call sites and writes `bin/commands-help.md` / `bin/commands-help.txt` / `bin/commands-data.json`. This document explains the *system*, not the command list.

## Parsing

- **Comma-chained multi-commands**: a single chat line can contain multiple commands (`-cmd1,cmd2`), with `\,` escaping a literal comma and parentheses grouping so commas inside `(...)` don't split the command (`-cmd(a,b,c)` stays one command). This is a manual character-by-character parser in `ExecuteCommand`, not a regex split.
- Each individual command is parsed into `{name, noParam, nbParam, param1..param5}` via `parseCmdContext`, using pooled objects from `MemoryHandler` (`getEmptyObject`/`destroyObject`) — every command dispatch allocates and frees from the object pool (see [MEMORY_HANDLER.md](./MEMORY_HANDLER.md)).

## Registration

Commands are plain objects (`ICommand`: `name`, `alias[]`, `group`, `argDescription`, `description`, optional `enabled()`, `cb()`) pushed into a flat array via `registerCommand()`. They're organized by access tier, one file per tier under `src/core/06_COMMANDS/Commands/` (`1_all.ts` … `6_superadmin.ts`, with `4_make_monsters.ts` / `4_make_spawns.ts` / `4_make_terrain.ts` as sub-splits of the "make" tier). `initCommands()` calls each tier's `initExecuteCommandX()` in order, then registers a built-in `help`/`h`/`?` command with search-term filtering and pagination.

## Access control

Six tiers exist: `'all' | 'red' | 'cheat' | 'make' | 'max' | 'truemax'`.

`accessCheck()` (`Command_execution.ts`) is a `switch` where higher tiers **deliberately fall through** into lower ones:

```
case 'truemax': // falls through
case 'max':     // falls through
case 'make':
case 'cheat':   // falls through
case 'red':     // falls through
case 'all':
```

This means a `truemax`-tier command implicitly requires satisfying *every* lower tier's check too, not just the top one. **This is intentional privilege-hierarchy design — not a missing-`break` bug.** Don't "fix" it by adding breaks.

`escaper.cmdAccessMap[cmd.name]` is checked first and can grant access to one specific command regardless of the player's tier — a per-player command override map.
