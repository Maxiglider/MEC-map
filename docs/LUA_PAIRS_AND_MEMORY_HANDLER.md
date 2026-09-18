# Lua `pairs` and the MemoryHandler

*[Version française](./LUA_PAIRS_AND_MEMORY_HANDLER.fr.md)*

In a Warcraft III multiplayer game, every machine runs the same Lua code on the same inputs and must reach the same state. The first difference that reaches the game (a unit order, a position, which unit gets reused) desyncs it. A `pairs` walk whose order is not the same on every machine is enough, as soon as that order decides something.

This page explains:
- how `pairs` chooses its order in Lua 5.3, the Lua of Warcraft III;
- why tables keyed by handle ids are walked in another order on each machine;
- how the [MemoryHandler](./MEMORY_HANDLER.md) pool turns an order difference into a lasting one;
- what commit `c2d3b80` changed in `LongDistanceMoveOrder.ts`.

Commit `c2d3b80` (branch `v2.2beta`) backports to v2.2 the part of `ed85ea5` (branch `feat/async-sliding`) that applies there: the monster spawn unit recycler, MEC regions and long distance move orders.

## 1. How `pairs` walks a table

`pairs(t)` calls `next(t, key)` over and over. `next` does not follow the insertion order: it follows the order in which the table stores its entries.

### A table has two parts

- **The array part**: integer keys from 1 up, stored by index. On each rehash Lua sizes it so that more than half of its slots are used.
- **The hash part**: every other key (strings, large or sparse integers, tables, handles…). It is an array of nodes whose size is a power of 2.

A handle id (1048576 and above) always lives in the hash part.

### The order of `next`

1. The array part, from index 1 to its size.
2. Then the hash part, from node 0 to the last node, skipping nodes whose value is nil.

### Where a key lands in the hash part

- **Main position.** For an integer key: `key & (size - 1)`, the key modulo the node count (`hashint` → `hashpow2` in `ltable.c`). Strings use their hash; tables, functions and handles (userdata) use their memory address.
- **Collision.** If a live entry already holds the main position, the new key goes into a free node. Lua finds it by moving a `lastfree` pointer down from the end of the node array. `lastfree` only moves down, until the next rehash.
- **Deletion.** `t[k] = nil` only clears the value. The node keeps its key, `next` skips it, and `lastfree` never hands it out again. A later key whose main position is that node does take it.
- **Rehash.** It only happens when a new key finds no free node. Lua counts the live keys, picks new sizes for both parts, and reinserts the old hash nodes **from the last one to the first** (`luaH_resize`). A table never shrinks otherwise.

### What the order depends on

Three things decide the order:
- **the key values**;
- **the table sizes**;
- **the history of the table**: which keys were inserted and deleted before, in which order.

Two machines applying the very same operations to two fresh tables get the same order. One different key, or a different past, is enough to change it.

Special keys:
- **Strings** are hashed with a seed that Lua 5.3.6 builds by default from the time and memory addresses (`luai_makeseed` in `lstate.c`). Whether Warcraft III fixes that seed is not documented.
- **Tables, functions and handles** are hashed by memory address, which differs on each machine.

Not concerned by `pairs`:
- A TypeScript array walked with `for…of` compiles to a numeric loop, in index order.
- A TSTL `Map` walks its entries in insertion order (`firstKey`/`nextKey` links), whatever its keys.

### Measured in Lua 5.3.6

| Case | Result |
| --- | --- |
| Orders A then B, handle ids 1048600 / 1048605 on PC 1 and 1048601 / 1048604 on PC 2 | PC 1: `A B`, PC 2: `B A` |
| Orders A B C D, other handle ids on each PC | PC 1: `A B C D`, PC 2: `D C B A` |
| Keys 1048600, 1048608, 1048616 inserted as A B C, then as C B A | `B C A`, then `B A C` |
| Same inserts and deletes of sequence keys on two fresh tables | same order |
| Emptied tables that held other handle ids on each PC, reused with the same dense sequence keys 1..n | no divergence in 20,000 random cases |
| Same, reused with the same integer keys spread over 1..100,000 | diverged in 7,226 of 20,000 cases |
| Same, reused with the same strings | diverged in 7,484 of 20,000 cases |

The first row with the formula: the table has 2 nodes, so a key's node is its parity.
- On PC 1, A (1048600, even) takes node 0 and B takes node 1: `A B`.
- On PC 2, B (1048604, even) takes node 0 and A takes node 1: `B A`.

## 2. Why handle ids differ between machines

- **Reuse timing.** A destroyed handle's id is reused once Lua's garbage collector has collected it. The collector runs according to how much memory the machine has allocated.
- **Local allocations.** Code running on one machine only (interface, camera, texts, local effects) allocates on that machine alone.
- **No way to sync the collector.** Since patch 1.32 `collectgarbage` cannot be called.

So the same unit can have handle id 1048600 on one machine and 1048601 on another.

Looking an entry up by handle id is fine: each machine finds its own entry under its own id. **Walking** a table keyed by handle ids is not, because the order comes from the key values.

## 3. How the MemoryHandler makes the difference last

How the pool works (`src/Utils/MemoryHandler.ts`):
- `destroyObject`, `destroyArray` and `destroyClassObject` empty the table (a `pairs` walk that sets each key to nil). They then push it at the end of a queue: `cachedObjects` for plain objects and arrays, or one queue per class name for class objects.
- `getEmptyObject`, `getEmptyArray` and `getEmptyClass` take the first table of the queue (`shift()`), or create a new one when the queue is empty.

This has three consequences.

1. **The order of `destroy*` calls decides which table the next `getEmpty*` hands out.** If one machine destroys A then B and another destroys B then A, their queues are in a different order. The same code then receives a different recycled table on each machine.
2. **An emptied table keeps its past.** Its node count, its `lastfree` pointer and the positions of its old keys stay. If that past differs between machines, for example a table that held handle ids, `pairs` can walk the same new keys in a different order (the last three rows of the table above). Dense sequence keys showed no divergence; spread integer keys and strings did.
3. **The divergence spreads silently.** Every later `getEmpty*` on that queue inherits the difference. Nothing shows until a walk over one of those tables issues orders or destroys objects in another order.

With `recursive = true`, `destroy*` also destroys the child objects in `pairs` order, so their queue order follows the parent table's layout.

## 4. The case of `LongDistanceMoveOrder.ts` (commit `c2d3b80`)

A spawn whose monsters travel farther than `MAX_DISTANCE_PER_MOVE_ORDER` gets a `LongDistanceMoveOrder` (`MonsterSpawn.ts`). Its constructor takes pooled objects:
- the order itself (`getEmptyClass(LongDistanceMoveOrder, …)`);
- two waypoint arrays;
- a 64×64 `HorizontalRectangleRegion` watching the monster, whose own tables (`watchedUnits`, callbacks, `unitsConsideredInRegion`, debug lists) come from the pool too.

### Before

```ts
// every 10 s
for (const [_, longDistanceMoveOrder] of pairs(LongDistanceMoveOrder.unitToLongDistanceMoveOrder)) {
    longDistanceMoveOrder.destroyIfObsolete() // dead unit → destroy()
}

static unitToLongDistanceMoveOrder: { [x: number]: LongDistanceMoveOrder } = {} // keys: GetHandleId(unit)
```

`destroy()` hands everything back:

```ts
this.nextWaypointRegion.destroy()                            // the region's tables → cachedObjects
MemoryHandler.destroyArray(this.waypointsX)                  // → cachedObjects
MemoryHandler.destroyArray(this.waypointsY)                  // → cachedObjects
MemoryHandler.destroyClassObject(this.nextWaypointRegion, …) // → HorizontalRectangleRegion queue
MemoryHandler.destroyClassObject(this, …)                    // → LongDistanceMoveOrder queue
```

The chain that leads to a desync:

1. **The walk order differs.** Two orders A and B whose units died are walked A then B on one machine and B then A on the other (first row of the table).
2. **Nothing visible happens yet.** The units are dead and no order is issued. Regions are plain Lua objects and create no native handles, except debug lightnings and effects when `debugLongDistanceMoves` is on.
3. **The queues differ.** The tables of A and B come back in opposite orders on the two machines. This affects the `LongDistanceMoveOrder` queue, the `HorizontalRectangleRegion` queue, and `cachedObjects`, which all pooled MEC code shares.
4. **The next spawns receive other tables.** The next long distance move takes A's objects on one machine and B's on the other. So does every `getEmptyObject` elsewhere.
5. **Those tables have different pasts.** They held handle ids (`unitsConsideredInRegion`, and before this commit `watchedUnits` too), so their layout differs between machines.
6. **A walk ends up changing the game.** The game desyncs as soon as a walk over such a table runs in another order. In regions, that walk is the enter and leave callbacks, run every 0.05 s, which issue the `IssuePointOrder` to the next waypoint.

### After

```ts
/** By handle id of the unit: looked up on this machine, never walked */
static unitToLongDistanceMoveOrder: { [x: number]: LongDistanceMoveOrder } = {}
static ordersInSequence: { [sequence: number]: LongDistanceMoveOrder } = {}
private static lastSequence = 0

// constructor
LongDistanceMoveOrder.lastSequence++
this.sequence = LongDistanceMoveOrder.lastSequence
LongDistanceMoveOrder.ordersInSequence[this.sequence] = this

// destroy()
delete LongDistanceMoveOrder.ordersInSequence[this.sequence]

// every 10 s
for (const [_, longDistanceMoveOrder] of pairs(LongDistanceMoveOrder.ordersInSequence)) { … }
```

- **Same numbers everywhere.** Spawns create orders in synced code, so each order gets **the same sequence number on every machine**.
- **Same order everywhere.** `ordersInSequence` receives the same keys, inserted and deleted in the same order since its creation. It therefore has the same layout, the same `pairs` order, the same `destroy()` order and the same queues on every machine.
- **Handle ids for lookups only.** The handle id table stays for `OnNextWaypointReached`, which only looks up the order of the unit that entered.

What it does not remove: the pooled tables still keyed by handle ids for lookups (`unitsConsideredInRegion`, `watchSequenceByHandleId`, the recycler's `isUnavailable`) still get a different past on each machine. They now come back to the queues in the same order everywhere. However, one of them reused later for a walk over spread integer keys or strings could still be walked in another order (section 3, point 2). MEC's walked region tables use dense sequence keys, for which no divergence was measured.

### Weight of the three changes in the commit

| File | Walk keyed by handle ids before | Effect on the game |
| --- | --- | --- |
| `SimpleUnitRecycler.ts` | the units handed back, when they are queued for reuse | **Direct**: another unit is reused for the same spawn, so units stand in different places. The most likely cause of desyncs with frequent spawns. |
| `MECRegion.ts` | the watched units | **Direct as soon as a callback issues orders**: enter and leave callbacks fire in another order, and the queues fill in another order. |
| `LongDistanceMoveOrder.ts` | the orders, during the 10 s cleanup | **Indirect**: only the queue order changes, and a desync needs a later walk to act on it. |

## 5. Rules for synced code

- **Never walk with `pairs` a table keyed by handle ids, handles, tables or functions** when the walk order can matter; returning objects to the pool counts. Key the walked table by a creation counter, and keep handle ids for lookups.
- **For walked collections, prefer ordered keys**: arrays, dense sequence keys (1, 2, 3…), or a TSTL `Map`, which walks in insertion order.
- **The order of `destroy*` and `getEmpty*` calls is game state.** It must be the same on every machine.
- **Code running on one machine only must not take tables from the pool, nor give any back.** It would shift that machine's queues alone.
- **A pooled table can arrive with a different past on each machine.** Do not walk a pooled table with spread integer keys or string keys when the order matters.

## 6. Status

- **`ed85ea5`** on `feat/async-sliding`: a two-instance LAN test with big spawns desynced within about two minutes before the fix, and no longer did after it (2026-09-12).
- **`c2d3b80`** on `v2.2beta`: typecheck and build pass. Not tested in game yet.

## Sources

- **Lua 5.3.6 source:**
  - `src/ltable.c`: `hashint`, `hashpow2`, `luaH_next`, `getfreepos`, `luaH_newkey`, `luaH_resize`;
  - `src/lstate.c`: `luai_makeseed`.
- **MEC:**
  - `src/Utils/MemoryHandler.ts`;
  - `src/core/04_STRUCTURES/Monster/LongDistanceMoveOrder.ts`;
  - `src/core/04_STRUCTURES/Region/MECRegion.ts`;
  - `src/core/04_STRUCTURES/MonsterSpawn/SimpleUnitRecycler.ts`;
  - `src/core/04_STRUCTURES/MonsterSpawn/MonsterSpawn.ts`.
- **See also:** [MEMORY_HANDLER.md](./MEMORY_HANDLER.md) and [MONSTER_SPAWNS.md](./MONSTER_SPAWNS.md).
