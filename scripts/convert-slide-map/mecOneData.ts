/**
 * The data of a MEC 1 map, read straight out of its own calls.
 *
 * A MEC 1 map (the vJass MEC of this repo's `v1-jass` tag, made in the World Editor) writes its terrain types, its
 * monster types and every one of its monsters as plain calls in its `Init_terrain_types`,
 * `Init_monster_and_caster_types` and `Init_levelN[_partM]` triggers. Those calls are a MEC 2 game data one for one,
 * so nothing here is guessed: what a hand-made map makes us infer from its units and its triggers is written down.
 *
 * The one place where the two MECs differ is the immolation radius. MEC 1 killed with the engine's immolation
 * ability, measured to the edge of the hero's collision circle; MEC 2 kills at `immolationRadius +
 * heroBaseCollisionSize`. The radii are carried over untouched, and the conversion keeps the old map's game by
 * setting `heroBaseCollisionSize` to the old hero's collision (see the skill's report).
 */

import { jassUnescape } from './jass'

type Json = { [key: string]: any }
type Rect = { minX: number; minY: number; maxX: number; maxY: number }

export type MecOneLevel = {
    nbLives?: number
    startMessage?: string
    /** the region the start is taken from, when MEC 1 wrote `GetRectMinX(gg_rct_...)` rather than numbers */
    startRegion?: string
    start: Rect
    end?: Rect
    visibilities: Rect[]
    monsters: Json[]
    monsterSpawns: Json[]
    meteors: Json[]
}

export type MecOneData = {
    terrainTypes: Json[]
    monsterTypes: Json[]
    levels: MecOneLevel[]
}

/**
 * MEC reads an angle of 0 as "no angle", so a monster facing east is written 360.
 *
 * MEC 1's own -1 is kept as it is: both MECs read it as "no angle of its own" and give the unit a random facing
 * (`GetRandomDirectionDeg` in `NewImmobileMonsterForPlayer`). Dropping it made every such monster face east, all the
 * same way, where the old map scattered them - which shows on anything with a front, like Aerial Slide's levers
 * (user's report, 2026-09-23).
 */
const angleOf = (degrees: number) => {
    if (degrees < 0) return -1
    const a = Math.round(((degrees % 360) + 360) % 360)
    return a === 0 ? 360 : a
}

const rect = (x1: number, y1: number, x2: number, y2: number): Rect => ({
    minX: Math.round(Math.min(x1, x2)),
    minY: Math.round(Math.min(y1, y2)),
    maxX: Math.round(Math.max(x1, x2)),
    maxY: Math.round(Math.max(y1, y2)),
})

/** The arguments of a call, as written, split on the commas that are not inside a nested call or a string */
const splitArgs = (args: string): string[] => {
    const out: string[] = []
    let depth = 0
    let current = ''
    let inString = false

    for (let i = 0; i < args.length; i++) {
        const c = args[i]
        if (inString) {
            current += c
            if (c === '\\') current += args[++i] ?? ''
            else if (c === '"') inString = false
            continue
        }
        if (c === '"') inString = true
        if (c === '(') depth++
        if (c === ')') depth--
        if (c === ',' && depth === 0) {
            out.push(current.trim())
            current = ''
        } else {
            current += c
        }
    }
    out.push(current.trim())

    return out
}

/** The arguments of the first `fn(...)` of the line, or undefined; a bracket inside a string (a `:)` in a start message) counts for nothing */
const callOf = (line: string, fn: string): string[] | undefined => {
    const start = line.indexOf(`${fn}(`)
    if (start === -1) return undefined

    let depth = 0
    let inString = false
    for (let i = start + fn.length; i < line.length; i++) {
        const c = line[i]
        if (inString) {
            if (c === '\\') i++
            else if (c === '"') inString = false
            continue
        }
        if (c === '"') inString = true
        if (c === '(') depth++
        if (c === ')') {
            depth--
            if (depth === 0) return splitArgs(line.substring(start + fn.length + 1, i))
        }
    }
    return undefined
}

/** A number as JASS writes it: `((- 1219 )*1.0)`, the minus sign apart from its digits */
const num = (arg: string) => Number(arg.replace(/[()\s]/g, '').replace(/\*1\.0$/, ''))

/** A string as JASS writes it, with its escapes undone: `"Abilities\\\\Spells\\\\..."` is one backslash each */
const jassString = (arg: string) => {
    const literal = /"(.*)"/.exec(arg)?.[1]
    return literal === undefined ? undefined : jassUnescape(literal)
}

/** The label of the monster type a call takes, from its `MonsterTypeArray_get(udg_monsterTypes,"label")` argument */
const monsterTypeArg = (arg: string) => /"([^"]+)"/.exec(arg)?.[1]

const KNOWN_TERRAIN_KINDS = { newSlide: 'slide', newWalk: 'walk', newDeath: 'death' } as const

/**
 * The one field whose meaning changed between versions of MEC 1.
 *
 * Early MEC 1 creates a monster with `if (scale != 1) SetUnitScale(...)`, so 1 is its "leave the unit's own scale
 * alone"; MEC 2 writes that as -1 and takes 1 for a real scale of 1. Copied over as written, every type of such a
 * map - they all declare 1 - would be forced to 1 and lose its unit's `usca`: Slide Is Magic's eight "Giant" mages,
 * made at `usca` 2, showed at half their size (user's report, 2026-09-21).
 * Later MEC 1 already tests `scale != -1`, as MEC 2 does (Aerial Slide v1.2c): its scales go over as they are. So the
 * map's own `NewImmobileMonsterForPlayer` says which one it is.
 */
const scaleOneIsOwnScale = (script: string) => /if\s*\(?\s*scale\s*!=\s*1\s*\)?\s*then/.test(script)

export const readMecOneData = (script: string): MecOneData => {
    const terrainTypes: Json[] = []
    const monsterTypes: Json[] = []
    const levels: MecOneLevel[] = []

    const level = (id: number): MecOneLevel => {
        while (levels.length <= id) {
            levels.push({ start: rect(0, 0, 0, 0), visibilities: [], monsters: [], monsterSpawns: [], meteors: [] })
        }
        return levels[id]
    }

    let currentTrigger: string | undefined
    let currentLevel: number | undefined
    // the points a multiple-patrol monster walks through, stored one by one before the monster that uses them
    let storedLocs: { x: number; y: number }[] = []
    let storedTeleportLocs: { x: number; y: number }[] = []
    let nextMonsterId = 0
    let nbSpawns = 0
    const mecTwoScale = scaleOneIsOwnScale(script)
        ? (mecOneScale: number) => (mecOneScale === 1 ? -1 : mecOneScale)
        : (mecOneScale: number) => mecOneScale

    for (const rawLine of script.split('\n')) {
        const line = rawLine.trim()

        const fn = /^function\s+(?:InitTrig_|Trig_)?([A-Za-z0-9_]+?)(?:_Actions|_Conditions|_Func\w*)?\s+takes/.exec(
            line
        )
        if (fn) {
            currentTrigger = fn[1]
            currentLevel = undefined
        }

        // a map's data is written in its init triggers alone: the same calls elsewhere are MEC 1 running
        if (!currentTrigger || !/^init_/i.test(currentTrigger)) continue

        const forced = /ForceGetLevel\((\d+)\)/.exec(line)
        if (forced) currentLevel = Number(forced[1])

        // ------------------------------------------------------------------------------- terrain types
        for (const [call, kind] of Object.entries(KNOWN_TERRAIN_KINDS)) {
            const args = callOf(line, `s__TerrainTypeArray_${call}`)
            if (!args) continue

            const label = /"([^"]*)"/.exec(args[1])?.[1] ?? ''
            const tile = /'(....)'/.exec(args[2])?.[1] ?? ''

            if (kind === 'death') {
                terrainTypes.push({
                    label,
                    tile,
                    kind,
                    killingEffect: jassString(args[3]),
                    timeToKill: num(args[4]),
                    toleranceDist: num(args[5]),
                })
            } else if (kind === 'walk') {
                terrainTypes.push({ label, tile, kind, walkSpeed: num(args[3]) })
            } else {
                // MEC 1's slides have no "cannot turn": a hero steers on every one of them
                terrainTypes.push({ label, tile, kind, slideSpeed: num(args[3]), canTurn: true })
            }
        }

        // ------------------------------------------------------------------------------- monster types
        const newType = callOf(line, 's__MonsterTypeArray_new')
        if (newType) {
            monsterTypes.push({
                label: /"([^"]*)"/.exec(newType[1])?.[1] ?? '',
                unitTypeId: /'(....)'/.exec(newType[2])?.[1] ?? '',
                scale: mecTwoScale(num(newType[3])),
                immolationRadius: num(newType[4]),
                speed: Math.round(num(newType[5])),
                isClickable: newType[6] === 'true',
                isWanderable: false,
                nbMeteorsToKill: 1,
                height: -1,
            })
        }

        // the setters MEC 1 chains onto the type it has just made, or onto one it looks up again
        const killEffect = callOf(line, 's__MonsterType_setKillingEffectStr')
        if (killEffect) {
            const target = monsterTypeArg(killEffect[0]) ?? monsterTypes[monsterTypes.length - 1]?.label
            const type = monsterTypes.find(t => t.label === target) ?? monsterTypes[monsterTypes.length - 1]
            type && (type.killingEffect = jassString(killEffect[1]))
        }

        // the height a flying monster is shown at, from later MEC 1 on
        const height = callOf(line, 's__MonsterType_setHeight')
        if (height) {
            const target = monsterTypeArg(height[0]) ?? monsterTypes[monsterTypes.length - 1]?.label
            const type = monsterTypes.find(t => t.label === target) ?? monsterTypes[monsterTypes.length - 1]
            type && (type.height = num(height[1]))
        }

        const meteorsToKill = callOf(line, 's__MonsterType_setNbMeteorsToKill')
        if (meteorsToKill) {
            const target = monsterTypeArg(meteorsToKill[0]) ?? monsterTypes[monsterTypes.length - 1]?.label
            const type = monsterTypes.find(t => t.label === target) ?? monsterTypes[monsterTypes.length - 1]
            type && (type.nbMeteorsToKill = num(meteorsToKill[1]))
        }

        if (currentLevel === undefined) continue
        const lvl = level(currentLevel)

        // ------------------------------------------------------------------------------- the level itself
        const startMessage = callOf(line, 's__Level_setStartMessage')
        if (startMessage) lvl.startMessage = jassString(startMessage[1])

        const lives = callOf(line, 's__Level_setNbLivesEarned')
        if (lives) lvl.nbLives = num(lives[1])

        const start = callOf(line, 's__Level_newStart')
        if (start && start.length === 5) {
            // MEC 1's map template starts level 0 on its own region rather than on numbers
            const region = /gg_rct_(\w+)/.exec(start[1])?.[1]
            if (region) {
                lvl.startRegion = region
            } else {
                lvl.start = rect(num(start[1]), num(start[2]), num(start[3]), num(start[4]))
            }
        }

        const end = callOf(line, 's__Level_newEnd')
        if (end && end.length === 5) {
            lvl.end = rect(num(end[1]), num(end[2]), num(end[3]), num(end[4]))
        }

        const vm = callOf(line, 's__VisibilityModifierArray_new')
        if (vm && vm.length === 5) {
            lvl.visibilities.push(rect(num(vm[1]), num(vm[2]), num(vm[3]), num(vm[4])))
        }

        // ------------------------------------------------------------------------------- the monsters
        const noMove = callOf(line, 's__MonsterNoMoveArray_new')
        if (noMove && noMove.length === 6) {
            lvl.monsters.push({
                id: nextMonsterId++,
                monsterClassName: 'MonsterNoMove',
                monsterTypeLabel: monsterTypeArg(noMove[1]),
                x: Math.round(num(noMove[2])),
                y: Math.round(num(noMove[3])),
                angle: angleOf(num(noMove[4])),
            })
        }

        const patrol = callOf(line, 's__MonsterSimplePatrolArray_new')
        if (patrol && patrol.length === 7) {
            lvl.monsters.push({
                id: nextMonsterId++,
                monsterClassName: 'MonsterSimplePatrol',
                monsterTypeLabel: monsterTypeArg(patrol[1]),
                x1: Math.round(num(patrol[2])),
                y1: Math.round(num(patrol[3])),
                x2: Math.round(num(patrol[4])),
                y2: Math.round(num(patrol[5])),
            })
        }

        const storeLoc = callOf(line, 's__MonsterMultiplePatrols_storeNewLoc')
        if (storeLoc && storeLoc.length === 2) {
            storedLocs.push({ x: Math.round(num(storeLoc[0])), y: Math.round(num(storeLoc[1])) })
        }

        const multi = callOf(line, 's__MonsterMultiplePatrolsArray_new')
        if (multi && multi.length === 4) {
            lvl.monsters.push({
                id: nextMonsterId++,
                monsterClassName: 'MonsterMultiplePatrols',
                monsterTypeLabel: monsterTypeArg(multi[1]),
                mode: /"([^"]*)"/.exec(multi[2])?.[1] ?? 'normal',
                xArr: storedLocs.map(p => p.x),
                yArr: storedLocs.map(p => p.y),
            })
            storedLocs = []
        }

        // a monster jumping from spot to spot on a timer, from later MEC 1 on: its spots stored one by one before it,
        // like a multiple patrol's
        const storeTeleportLoc = callOf(line, 's__MonsterTeleport_storeNewLoc')
        if (storeTeleportLoc && storeTeleportLoc.length === 2) {
            storedTeleportLocs.push({
                x: Math.round(num(storeTeleportLoc[0])),
                y: Math.round(num(storeTeleportLoc[1])),
            })
        }

        const teleport = callOf(line, 's__MonsterTeleportArray_new')
        if (teleport && teleport.length === 6) {
            lvl.monsters.push({
                id: nextMonsterId++,
                monsterClassName: 'MonsterTeleport',
                monsterTypeLabel: monsterTypeArg(teleport[1]),
                period: num(teleport[2]),
                // passed to CreateUnit as it is, in MEC 1 as in MEC 2: -1 is a random facing
                angle: num(teleport[3]),
                mode: /"([^"]*)"/.exec(teleport[4])?.[1] ?? 'normal',
                xArr: storedTeleportLocs.map(p => p.x),
                yArr: storedTeleportLocs.map(p => p.y),
            })
            storedTeleportLocs = []
        }

        // ------------------------------------------------------------------------------- spawns and meteors
        const spawn = callOf(line, 's__MonsterSpawnArray_new')
        if (spawn && spawn.length === 10) {
            const from = rect(num(spawn[5]), num(spawn[6]), num(spawn[7]), num(spawn[8]))
            const direction = /"([^"]*)"/.exec(spawn[3])?.[1] ?? 'leftToRight'
            // MEC 1's own names for where a spawn walks, which MEC 2 says in a direction and a region
            const vertical = direction === 'upToDown' || direction === 'downToUp'
            const mecDirection = { leftToRight: 'right', rightToLeft: 'left', upToDown: 'down', downToUp: 'up' }[
                direction
            ]

            lvl.monsterSpawns.push({
                label: /"([^"]*)"/.exec(spawn[1])?.[1] ?? `spawn${++nbSpawns}`,
                monsterTypeLabel: monsterTypeArg(spawn[2]),
                mecRegion: vertical
                    ? {
                          type: 'HorizontalRectangleRegion',
                          x1: from.minX,
                          x2: from.maxX,
                          y1: direction === 'upToDown' ? from.maxY : from.minY,
                          y2: direction === 'upToDown' ? from.minY : from.maxY,
                          direction: mecDirection,
                      }
                    : {
                          type: 'HorizontalRectangleRegion',
                          y1: from.minY,
                          y2: from.maxY,
                          x1: direction === 'rightToLeft' ? from.maxX : from.minX,
                          x2: direction === 'rightToLeft' ? from.minX : from.maxX,
                          direction: mecDirection,
                      },
                frequency: num(spawn[4]),
                spawnAmount: 1,
                initialDelay: 0,
                monsterDirectionMode: 'straight',
                keepAliveForNextLevel: false,
            })
        }

        const meteor = callOf(line, 's__MeteorArray_new')
        if (meteor && meteor.length === 4) {
            lvl.meteors.push({ x: Math.round(num(meteor[1])), y: Math.round(num(meteor[2])) })
        }
    }

    return { terrainTypes, monsterTypes, levels }
}
