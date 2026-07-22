# MemoryHandler: Object Pooling

`src/Utils/MemoryHandler.ts` is a hand-rolled **object-pooling allocator**, used pervasively throughout the runtime instead of raw `{}` / `[]` / `new X()` in hot paths (e.g. command parsing, per-frame region/monster logic). The motivation: Lua 5.3's garbage collector (the runtime WC3 maps run on) is a known performance bottleneck at scale, so MEC recycles Lua tables from per-shape or per-class free-lists rather than letting them get garbage collected.

This is an **opt-in performance pattern for hot paths, not a mandatory replacement for all object creation**. Plain `{}` / `[]` literals remain safe and normal to use elsewhere.

## API

- `getEmptyObject<T>()` / `getEmptyArray<T>()` / `getEmptyClass(ClassCtor, ...args)` — get a pooled instance.
- `destroyObject()` / `destroyArray()` / `destroyClassObject()` — return an instance to its pool. **Mandatory** once you're done with a pooled instance.

`getEmptyClass` bypasses TSTL's normal `class`/`new` codegen and manually invokes `classInstance.prototype.____constructor(obj, ...params)` on a pooled table — a deliberate, TSTL-internals-aware optimization. It's fragile if `typescript-to-lua`'s class-compilation internals change.

## Safety mechanisms

Pooled objects get a Lua metatable with:
- `__gc` — an auto-recycle safety net if a caller forgets to call `destroy*`.
- `__index` / `__newindex` guards that **throw with a stack trace** on read/write after `destroy*()` was called — use-after-free detection. Do not hold a reference to a pooled object past its `destroy*()` call.
- An optional `__debugName` for tracking (see below).

## Debugging allocations

`printDebugInfo()` prints a leaderboard of most-allocated debug names — but only for objects created with an explicit `debugName`; most call sites in the general codebase don't pass one (the cheap/default allocation path is anonymous).

For heavier, on-demand profiling, `yarn test-memory-handler` runs `scripts/debug-memory-handler.ts`, which regex-rewrites the **compiled** `dist/map.w3x/war3map.lua` (not the TS source) to:
- auto-tag every `MemoryHandler.getEmptyObject()/getEmptyArray()/getEmptyClass()` call site with an auto-incrementing debug name plus a live stack trace prefix (`info():GetStackTrace()`), and
- wrap every raw table literal and function literal in the compiled output with a `__fakePrint` counter call, toggled at runtime via two global flags (`_G['trackPrintMap']`, `_G['printCreation']`).

This gives in-game visibility into allocation hot spots even for code that bypasses `MemoryHandler` entirely. It's a manual, on-demand profiling workflow — not wired into CI or normal builds — and it mutates the compiled Lua post-hoc via string surgery rather than any TS-level tooling.
