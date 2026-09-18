# `pairs` en Lua et le MemoryHandler

*[English version](./LUA_PAIRS_AND_MEMORY_HANDLER.md)*

Dans une partie multijoueur de Warcraft III, chaque machine exécute le même code Lua sur les mêmes entrées et doit arriver au même état. La première différence qui atteint la partie (un ordre donné à une unité, une position, l'unité réutilisée) la désynchronise. Un parcours `pairs` dont l'ordre n'est pas le même sur toutes les machines suffit, dès que cet ordre décide de quelque chose.

Cette page explique :
- comment `pairs` choisit son ordre en Lua 5.3, le Lua de Warcraft III ;
- pourquoi une table indexée par identifiants de handles est parcourue dans un ordre différent sur chaque machine ;
- comment la réserve du [MemoryHandler](./MEMORY_HANDLER.md) rend un écart d'ordre durable ;
- ce que le commit `c2d3b80` a changé dans `LongDistanceMoveOrder.ts`.

Le commit `c2d3b80` (branche `v2.2beta`) reporte sur la v2.2 la partie du commit `ed85ea5` (branche `feat/async-sliding`) qui s'y applique : le recycleur d'unités des spawns, les régions MEC et les déplacements longue distance.

## 1. Comment `pairs` parcourt une table

`pairs(t)` appelle `next(t, clé)` en boucle. `next` ne suit pas l'ordre d'insertion : il suit l'ordre dans lequel la table range ses entrées.

### Une table a deux parties

- **La partie tableau** : les clés entières à partir de 1, rangées par indice. À chaque réorganisation, Lua la dimensionne pour que plus de la moitié de ses cases soient utilisées.
- **La partie hachage** : toutes les autres clés (textes, entiers grands ou espacés, tables, handles…). C'est un tableau de nœuds dont la taille est une puissance de 2.

Un identifiant de handle (1048576 et plus) est toujours dans la partie hachage.

### L'ordre de `next`

1. La partie tableau, de l'indice 1 à sa taille.
2. Puis la partie hachage, du nœud 0 au dernier, en sautant les nœuds dont la valeur est nil.

### Où tombe une clé dans la partie hachage

- **Position principale.** Pour une clé entière : `clé & (taille - 1)`, c'est-à-dire la clé modulo le nombre de nœuds (`hashint` → `hashpow2` dans `ltable.c`). Les textes utilisent leur hash ; les tables, fonctions et handles (userdata) utilisent leur adresse mémoire.
- **Collision.** Si une entrée vivante occupe déjà la position principale, la nouvelle clé va dans un nœud libre. Lua le trouve en faisant descendre un pointeur `lastfree` depuis la fin du tableau de nœuds. `lastfree` ne fait que descendre, jusqu'à la prochaine réorganisation.
- **Suppression.** `t[k] = nil` efface seulement la valeur. Le nœud garde sa clé, `next` le saute, et `lastfree` ne le redonne plus. Une clé ajoutée plus tard dont c'est la position principale le reprend, en revanche.
- **Réorganisation (rehash).** Elle n'a lieu que quand une nouvelle clé ne trouve aucun nœud libre. Lua compte les clés vivantes, choisit de nouvelles tailles pour les deux parties et réinsère les anciens nœuds **du dernier au premier** (`luaH_resize`). En dehors de ça, une table ne rétrécit jamais.

### De quoi dépend l'ordre

Trois choses décident de l'ordre :
- **les valeurs des clés** ;
- **les tailles de la table** ;
- **l'historique de la table** : quelles clés ont été insérées et supprimées avant, et dans quel ordre.

Deux machines qui appliquent exactement les mêmes opérations à deux tables neuves obtiennent le même ordre. Une seule clé différente, ou un passé différent, suffit à le changer.

Clés particulières :
- **Les textes** sont hachés avec une graine que Lua 5.3.6 construit par défaut à partir de l'heure et d'adresses mémoire (`luai_makeseed` dans `lstate.c`). On ne sait pas si Warcraft III fixe cette graine.
- **Les tables, fonctions et handles** sont hachés par adresse mémoire, différente sur chaque machine.

Ne passent pas par `pairs` :
- Un tableau TypeScript parcouru avec `for…of` est compilé en boucle numérique, dans l'ordre des indices.
- Une `Map` TSTL se parcourt dans l'ordre d'insertion (liens `firstKey`/`nextKey`), quelles que soient ses clés.

### Mesuré en Lua 5.3.6

| Cas | Résultat |
| --- | --- |
| Ordres A puis B, handles 1048600 / 1048605 sur le PC 1 et 1048601 / 1048604 sur le PC 2 | PC 1 : `A B`, PC 2 : `B A` |
| Ordres A B C D, d'autres handles sur chaque PC | PC 1 : `A B C D`, PC 2 : `D C B A` |
| Clés 1048600, 1048608, 1048616 insérées dans l'ordre A B C, puis C B A | `B C A`, puis `B A C` |
| Mêmes insertions et suppressions de clés séquentielles sur deux tables neuves | même ordre |
| Tables vidées qui contenaient d'autres handles sur chaque PC, réutilisées avec les mêmes clés séquentielles denses 1..n | aucun écart sur 20 000 cas aléatoires |
| Pareil, réutilisées avec les mêmes clés entières réparties sur 1..100 000 | écart dans 7 226 cas sur 20 000 |
| Pareil, réutilisées avec les mêmes textes | écart dans 7 484 cas sur 20 000 |

La première ligne avec la formule : la table a 2 nœuds, donc le nœud d'une clé est sa parité.
- Sur le PC 1, A (1048600, pair) prend le nœud 0 et B le nœud 1 : `A B`.
- Sur le PC 2, B (1048604, pair) prend le nœud 0 et A le nœud 1 : `B A`.

## 2. Pourquoi les identifiants de handles diffèrent entre machines

- **Moment de la réutilisation.** L'identifiant d'un handle détruit est réutilisé une fois que le ramasse-miettes de Lua l'a collecté. Le ramasse-miettes avance selon la mémoire que la machine a allouée.
- **Allocations locales.** Le code qui ne tourne que sur une machine (interface, caméra, textes, effets locaux) alloue sur cette machine seulement.
- **Impossible de synchroniser le ramasse-miettes.** Depuis le patch 1.32, on ne peut plus appeler `collectgarbage`.

La même unité peut donc avoir l'identifiant 1048600 sur une machine et 1048601 sur une autre.

Chercher une entrée par identifiant de handle ne pose pas de problème : chaque machine trouve sa propre entrée sous son propre identifiant. **Parcourir** une table indexée par identifiants de handles en pose un, parce que l'ordre vient des valeurs des clés.

## 3. Comment le MemoryHandler rend l'écart durable

Fonctionnement de la réserve (`src/Utils/MemoryHandler.ts`) :
- `destroyObject`, `destroyArray` et `destroyClassObject` vident la table (un parcours `pairs` qui met chaque clé à nil). Ils l'ajoutent ensuite en fin de file : `cachedObjects` pour les objets simples et les tableaux, ou une file par nom de classe pour les objets de classe.
- `getEmptyObject`, `getEmptyArray` et `getEmptyClass` prennent la première table de la file (`shift()`), ou en créent une neuve quand la file est vide.

Il y a trois conséquences.

1. **L'ordre des appels `destroy*` décide de la table que donnera le prochain `getEmpty*`.** Si une machine détruit A puis B et une autre B puis A, leurs files sont dans un ordre différent. Le même code reçoit alors une table recyclée différente sur chaque machine.
2. **Une table vidée garde son passé.** Son nombre de nœuds, son pointeur `lastfree` et les positions de ses anciennes clés restent. Si ce passé diffère entre machines, par exemple une table qui contenait des identifiants de handles, `pairs` peut parcourir les mêmes nouvelles clés dans un ordre différent (les trois dernières lignes du tableau ci-dessus). Les clés séquentielles denses n'ont montré aucun écart ; les clés entières réparties et les textes, si.
3. **L'écart se propage sans bruit.** Chaque `getEmpty*` suivant sur cette file hérite de la différence. Rien ne se voit tant qu'un parcours sur l'une de ces tables ne donne pas des ordres ou ne détruit pas des objets dans un autre ordre.

Avec `recursive = true`, `destroy*` détruit aussi les objets enfants dans l'ordre de `pairs`, donc leur ordre dans la file suit la disposition de la table parente.

## 4. Le cas de `LongDistanceMoveOrder.ts` (commit `c2d3b80`)

Un spawn dont les monstres parcourent plus de `MAX_DISTANCE_PER_MOVE_ORDER` reçoit un `LongDistanceMoveOrder` (`MonsterSpawn.ts`). Son constructeur prend des objets dans la réserve :
- l'ordre lui-même (`getEmptyClass(LongDistanceMoveOrder, …)`) ;
- deux tableaux de points de passage ;
- une `HorizontalRectangleRegion` de 64×64 qui surveille le monstre, et dont les tables (`watchedUnits`, callbacks, `unitsConsideredInRegion`, listes de debug) viennent aussi de la réserve.

### Avant

```ts
// toutes les 10 s
for (const [_, longDistanceMoveOrder] of pairs(LongDistanceMoveOrder.unitToLongDistanceMoveOrder)) {
    longDistanceMoveOrder.destroyIfObsolete() // unité morte → destroy()
}

static unitToLongDistanceMoveOrder: { [x: number]: LongDistanceMoveOrder } = {} // clés : GetHandleId(unit)
```

`destroy()` rend tout à la réserve :

```ts
this.nextWaypointRegion.destroy()                            // les tables de la région → cachedObjects
MemoryHandler.destroyArray(this.waypointsX)                  // → cachedObjects
MemoryHandler.destroyArray(this.waypointsY)                  // → cachedObjects
MemoryHandler.destroyClassObject(this.nextWaypointRegion, …) // → file des HorizontalRectangleRegion
MemoryHandler.destroyClassObject(this, …)                    // → file des LongDistanceMoveOrder
```

L'enchaînement qui mène à la désynchronisation :

1. **L'ordre de parcours diffère.** Deux ordres A et B dont les unités sont mortes sont parcourus A puis B sur une machine, B puis A sur l'autre (première ligne du tableau).
2. **Rien de visible ne se passe encore.** Les unités sont mortes et aucun ordre n'est donné. Les régions sont de simples objets Lua et ne créent pas de handles natifs, sauf les éclairs et effets de debug quand `debugLongDistanceMoves` est activé.
3. **Les files diffèrent.** Les tables de A et de B reviennent dans des ordres opposés sur les deux machines. Ça touche la file des `LongDistanceMoveOrder`, celle des `HorizontalRectangleRegion`, et `cachedObjects`, que partage tout le code de MEC qui utilise la réserve.
4. **Les spawns suivants reçoivent d'autres tables.** Le prochain déplacement longue distance prend les objets de A sur une machine et ceux de B sur l'autre. Il en va de même pour chaque `getEmptyObject` ailleurs.
5. **Ces tables ont des passés différents.** Elles contenaient des identifiants de handles (`unitsConsideredInRegion`, et avant ce commit `watchedUnits` aussi), donc leur disposition diffère entre machines.
6. **Un parcours finit par modifier la partie.** La partie se désynchronise dès qu'un parcours sur une telle table s'exécute dans un autre ordre. Dans les régions, ce parcours, ce sont les callbacks d'entrée et de sortie, exécutés toutes les 0,05 s, qui donnent l'`IssuePointOrder` vers le point de passage suivant.

### Après

```ts
/** By handle id of the unit: looked up on this machine, never walked */
static unitToLongDistanceMoveOrder: { [x: number]: LongDistanceMoveOrder } = {}
static ordersInSequence: { [sequence: number]: LongDistanceMoveOrder } = {}
private static lastSequence = 0

// constructeur
LongDistanceMoveOrder.lastSequence++
this.sequence = LongDistanceMoveOrder.lastSequence
LongDistanceMoveOrder.ordersInSequence[this.sequence] = this

// destroy()
delete LongDistanceMoveOrder.ordersInSequence[this.sequence]

// toutes les 10 s
for (const [_, longDistanceMoveOrder] of pairs(LongDistanceMoveOrder.ordersInSequence)) { … }
```

- **Mêmes numéros partout.** Les ordres sont créés par les spawns, dans du code synchronisé, donc chaque ordre reçoit **le même numéro de séquence sur toutes les machines**.
- **Même ordre partout.** `ordersInSequence` reçoit les mêmes clés, insérées et supprimées dans le même ordre depuis sa création. Elle a donc la même disposition, le même ordre de `pairs`, le même ordre de `destroy()` et les mêmes files sur toutes les machines.
- **Les identifiants de handles servent seulement à chercher.** La table par identifiant de handle reste pour `OnNextWaypointReached`, qui ne fait que chercher l'ordre de l'unité entrée.

Ce que ça ne supprime pas : les tables de la réserve encore indexées par identifiants de handles pour les recherches (`unitsConsideredInRegion`, `watchSequenceByHandleId`, `isUnavailable` du recycleur) ont toujours un passé différent sur chaque machine. Elles reviennent désormais dans les files dans le même ordre partout. Mais l'une d'elles, réutilisée plus tard pour un parcours sur des clés entières réparties ou des textes, pourrait encore être parcourue dans un autre ordre (section 3, point 2). Les tables des régions MEC qui sont parcourues utilisent des clés séquentielles denses, pour lesquelles aucun écart n'a été mesuré.

### Poids des trois changements du commit

| Fichier | Parcours indexé par identifiants de handles avant | Effet sur la partie |
| --- | --- | --- |
| `SimpleUnitRecycler.ts` | les unités rendues, au moment de les remettre dans la file de réutilisation | **Direct** : une autre unité est réutilisée pour le même spawn, donc les unités ne sont pas aux mêmes endroits. La cause la plus probable des désynchronisations sur les spawns fréquents. |
| `MECRegion.ts` | les unités surveillées | **Direct dès qu'un callback donne des ordres** : les callbacks d'entrée et de sortie s'exécutent dans un autre ordre, et les files se remplissent dans un autre ordre. |
| `LongDistanceMoveOrder.ts` | les ordres, pendant le nettoyage toutes les 10 s | **Indirect** : seul l'ordre des files change, et il faut qu'un parcours ultérieur en dépende pour désynchroniser. |

## 5. Règles pour le code synchronisé

- **Ne jamais parcourir avec `pairs` une table indexée par identifiants de handles, handles, tables ou fonctions** quand l'ordre du parcours peut compter ; rendre des objets à la réserve compte. Indexer la table parcourue par un compteur de création, et garder les identifiants de handles pour les recherches.
- **Pour les collections parcourues, préférer des clés ordonnées** : les tableaux, les clés séquentielles denses (1, 2, 3…) ou une `Map` TSTL, parcourue dans l'ordre d'insertion.
- **L'ordre des appels `destroy*` et `getEmpty*` fait partie de l'état de la partie.** Il doit être le même sur toutes les machines.
- **Le code qui ne tourne que sur une machine ne doit ni prendre de tables dans la réserve, ni en rendre.** Il décalerait les files de cette seule machine.
- **Une table de la réserve peut arriver avec un passé différent sur chaque machine.** Ne pas parcourir une table de la réserve avec des clés entières réparties ou des textes quand l'ordre compte.

## 6. État

- **`ed85ea5`** sur `feat/async-sliding` : un test LAN à deux instances avec de gros spawns se désynchronisait en deux minutes environ avant le correctif, et plus du tout après (2026-09-12).
- **`c2d3b80`** sur `v2.2beta` : la vérification des types et le build passent. Pas encore testé en jeu.

## Sources

- **Code source de Lua 5.3.6 :**
  - `src/ltable.c` : `hashint`, `hashpow2`, `luaH_next`, `getfreepos`, `luaH_newkey`, `luaH_resize` ;
  - `src/lstate.c` : `luai_makeseed`.
- **MEC :**
  - `src/Utils/MemoryHandler.ts` ;
  - `src/core/04_STRUCTURES/Monster/LongDistanceMoveOrder.ts` ;
  - `src/core/04_STRUCTURES/Region/MECRegion.ts` ;
  - `src/core/04_STRUCTURES/MonsterSpawn/SimpleUnitRecycler.ts` ;
  - `src/core/04_STRUCTURES/MonsterSpawn/MonsterSpawn.ts`.
- **Voir aussi :** [MEMORY_HANDLER.md](./MEMORY_HANDLER.md) et [MONSTER_SPAWNS.md](./MONSTER_SPAWNS.md).
