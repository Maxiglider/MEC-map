/**
 * Step 5 of the conversion of an old slide map to MEC (see .claude/skills/convert-slide-map/SKILL.md).
 *
 * yarn convert-slide-map:gamedata "<map file name in original-maps/>"
 *
 * Reads conversion-work/<map>/conversion.json (the interpretation of the map, written per map) and facts.json,
 * builds the MEC game data, writes it to conversion-work/<map>/gamedata.json with a summary in gamedata.md, and
 * bakes it into the converted map made by the rebase: the unit types the spec asks for, and the setGameData
 * trigger in war3map.lua and war3map.wct, in place of the base map's own.
 */
import { spawnSync } from 'child_process'
import 'dotenv/config'
import * as fs from 'fs'
import War3Map from 'mdx-m3-viewer-th/dist/cjs/parsers/w3x/map'
import War3MapW3e from 'mdx-m3-viewer-th/dist/cjs/parsers/w3x/w3e/file'
import War3MapW3u from 'mdx-m3-viewer-th/dist/cjs/parsers/w3x/w3u/file'
import Modification from 'mdx-m3-viewer-th/dist/cjs/parsers/w3x/w3u/modification'
import ModifiedObject from 'mdx-m3-viewer-th/dist/cjs/parsers/w3x/w3u/modifiedobject'
import * as path from 'path'
import { callArgs, jassUnescape } from './jass'
import { parseWts, saveArchiveWhole } from './mapFiles'
import { readMecOneData } from './mecOneData'
import { fixObjectDataWriter, isSkinField, variableTypeOf } from './objectData'
import { addCustomTextTriggers, CustomTextTrigger, hasCategory } from './triggerFiles'
import { VisibilityTileGroup, visibilityTilesOfLevels } from './visibilityTiles'

fixObjectDataWriter()

type Rect = { minX: number; minY: number; maxX: number; maxY: number }
type RectRef = string | Rect | { aroundUnitsOfType: string; padding?: number }
type Json = { [key: string]: any }

const outputRoot = process.env.MAPS_OUTPUT_DIR_FOR_AI_CONVERSION_TO_MEC
const baseMapPath = process.env.MEC_BASE_MAP_LOCATION
const mapFileName = process.argv[2] ? path.basename(process.argv[2]) : undefined
if (!outputRoot || !baseMapPath || !mapFileName) {
    throw new Error(
        'Usage: yarn convert-slide-map:gamedata "<map file name in original-maps/>" (MAPS_OUTPUT_DIR_FOR_AI_CONVERSION_TO_MEC and MEC_BASE_MAP_LOCATION set)'
    )
}

const mapName = mapFileName.replace(/\.w3[mx]$/i, '')
const workDir = path.join(outputRoot, 'conversion-work', mapName)
const rebaseInfo = path.join(workDir, 'rebase.json')
if (!fs.existsSync(rebaseInfo)) throw new Error('No rebase.json: run the rebase first')
const outputMap: string = JSON.parse(fs.readFileSync(rebaseInfo, 'utf8')).output
const spec: Json = JSON.parse(fs.readFileSync(path.join(workDir, 'conversion.json'), 'utf8'))
const facts: Json = JSON.parse(fs.readFileSync(path.join(workDir, 'facts.json'), 'utf8'))
const oldScript = fs.readFileSync(path.join(workDir, 'war3map.j'), 'utf8')
if (!fs.existsSync(outputMap)) throw new Error(`${outputMap} does not exist: run the rebase first`)
if (path.resolve(outputMap) === path.resolve(baseMapPath))
    throw new Error('The converted map cannot be the base map: the base map is only read')

const warnings: string[] = []
const warn = (message: string) => warnings.push(message)

// ---------------------------------------------------------------------------------------------- MEC 1 maps

/**
 * A MEC 1 map writes its own data in its calls: terrain types, monster types, levels and every monster, which a
 * MEC 2 game data takes over one for one. The spec says `"mecOne": true` and only has to add what the calls don't
 * hold (the hero, the game data, the quests, the custom triggers), or to override what they do.
 */
const mecOne = spec.mecOne ? readMecOneData(oldScript) : undefined
if (mecOne) {
    spec.terrainTypes ??= mecOne.terrainTypes
    spec.monsterTypes ??= mecOne.monsterTypes
    spec.levels ??= mecOne.levels.map((l, i) => ({
        start: l.startRegion ?? l.start,
        // the last level of a MEC 1 map has no end: reaching it is winning the game
        ...(l.end
            ? { end: l.end }
            : i + 1 < mecOne.levels.length
              ? { end: { stripAt: mecOne.levels[i + 1].start } }
              : {}),
        visibilities: l.visibilities,
        ...(l.nbLives !== undefined ? { nbLives: l.nbLives } : {}),
        ...(l.startMessage ? { startMessage: l.startMessage } : {}),
    }))
}

// monster types the old map's data doesn't hold: the projectiles a caster shoots, say (spec extraMonsterTypes),
// and the fields to add to the ones it does hold, without writing them all out again (spec monsterTypeOverrides)
spec.monsterTypes = [...(spec.monsterTypes ?? []), ...(spec.extraMonsterTypes ?? [])]
for (const [label, fields] of Object.entries((spec.monsterTypeOverrides ?? {}) as Json)) {
    if (label.startsWith('$')) continue
    const type = (spec.monsterTypes as Json[]).find(t => t.label === label)
    if (!type) throw new Error(`monsterTypeOverrides: unknown monster type ${label}`)
    Object.assign(type, fields)
}

// monster types the old map defines and nothing uses (spec dropMonsterTypes): MEC 1's template ones, a family its
// author gave up on. Dropped only when named, and checked again once the game data is built, so a type still used
// stops the build rather than leaving monsters without their type
const droppedMonsterTypes = new Set<string>((spec.dropMonsterTypes ?? []).filter((l: string) => !l.startsWith('$')))
for (const label of droppedMonsterTypes) {
    if (!(spec.monsterTypes as Json[]).some(t => t.label === label))
        throw new Error(`dropMonsterTypes: unknown monster type ${label}`)
}
spec.monsterTypes = (spec.monsterTypes as Json[]).filter(t => !droppedMonsterTypes.has(t.label))

// the hero's base collision is MEC's 25 on every converted map, whatever the old map was (user's rule)
const MEC_HERO_COLLISION = 25
if (spec.patchImmo !== undefined)
    throw new Error('patchImmo: no longer a spec field, a MEC 1 map is always patched to 25')
if (
    spec.gameData?.heroBaseCollisionSize !== undefined &&
    Number(spec.gameData.heroBaseCollisionSize) !== MEC_HERO_COLLISION
)
    throw new Error(
        `gameData.heroBaseCollisionSize: every converted map has MEC's ${MEC_HERO_COLLISION}, not ${spec.gameData.heroBaseCollisionSize}`
    )
spec.gameData = { ...(spec.gameData ?? {}), heroBaseCollisionSize: MEC_HERO_COLLISION }

// A MEC 1 map's radii are in its own frame: it killed at the radius plus the old hero's collision. So what MEC's
// -patchImmo does in game is done here (user's rule): every radius moves by what the hero's collision gains, and each
// monster kills at the distance it did. A radius the gain swallows would have to stay at 5 and kill from further than
// before, and one the gain does not move by a whole step of 5 is rounded down: the first case is the user's to decide,
// so the build stops and names those types - an immolationRadius in monsterTypeOverrides, in the old map's frame,
// settles each of them. Overrides are applied before, which is why they are written in the old frame.
if (spec.mecOne) {
    if (spec.hero?.collision === undefined)
        throw new Error("hero.collision: the old hero's collision is needed to move a MEC 1 map to MEC's own")
    const delta = Number(spec.hero.collision) - MEC_HERO_COLLISION
    const shifted = (spec.monsterTypes as Json[])
        .filter(type => Number(type.immolationRadius ?? 0) > 0)
        .map(type => ({
            type,
            radius: Number(type.immolationRadius),
            to: Math.floor((Number(type.immolationRadius) + delta) / 5) * 5,
        }))
    const growing = shifted.filter(({ to }) => to < 5)
    if (growing.length > 0) {
        throw new Error(
            `patchImmo not applied: these monster types would kill from further than in the old map (radius + old hero collision ${spec.hero.collision} = ` +
                `${growing.map(({ type, radius }) => `${type.label} ${radius + Number(spec.hero.collision)}`).join(', ')}; MEC's smallest is 5 + ${MEC_HERO_COLLISION}). ` +
                'Ask the user how to handle them, then set their immolationRadius in monsterTypeOverrides'
        )
    }
    for (const { type, to } of shifted) type.immolationRadius = Math.min(400, to)
    if (delta % 5 !== 0) warn(`patchImmo: the shift of ${delta} is not a whole step of 5, every radius rounded down`)
}

// ---------------------------------------------------------------------------------------------- geometry

const rectOf = (name: string): Rect => {
    const r = facts.rects['gg_rct_' + name.replace(/^gg_rct_/, '')]
    if (!r) throw new Error(`Unknown region ${name}`)
    return r
}
const center = (r: Rect) => ({ x: (r.minX + r.maxX) / 2, y: (r.minY + r.maxY) / 2 })
const inside = (r: Rect, x: number, y: number) => x >= r.minX && x <= r.maxX && y >= r.minY && y <= r.maxY

// bj_mapInitialPlayableArea: the camera bounds of main before the margins
const cameraBounds =
    /SetCameraBounds\(([-\d.]+)\+GetCameraMargin\(CAMERA_MARGIN_LEFT\),([-\d.]+)\+GetCameraMargin\(CAMERA_MARGIN_BOTTOM\),([-\d.]+)-GetCameraMargin\(CAMERA_MARGIN_RIGHT\),([-\d.]+)-/.exec(
        oldScript
    )
const playable: Rect | undefined = cameraBounds
    ? {
          minX: Number(cameraBounds[1]),
          minY: Number(cameraBounds[2]),
          maxX: Number(cameraBounds[3]),
          maxY: Number(cameraBounds[4]),
      }
    : undefined

const resolveRect = (ref: RectRef): Rect => {
    if (typeof ref === 'string') {
        if (ref === 'playable') {
            if (!playable) throw new Error('No SetCameraBounds in the old main: the playable area is unknown')
            return playable
        }
        return rectOf(ref)
    }
    if ('aroundUnitsOfType' in ref) {
        const units = facts.units.filter((u: Json) => u.typeId === ref.aroundUnitsOfType)
        const padding = ref.padding ?? 0
        return {
            minX: Math.min(...units.map((u: Json) => u.x)) - padding,
            minY: Math.min(...units.map((u: Json) => u.y)) - padding,
            maxX: Math.max(...units.map((u: Json) => u.x)) + padding,
            maxY: Math.max(...units.map((u: Json) => u.y)) + padding,
        }
    }
    return ref
}
const rounded = (r: Rect) => ({
    minX: Math.round(r.minX),
    minY: Math.round(r.minY),
    maxX: Math.round(r.maxX),
    maxY: Math.round(r.maxY),
})

/** GetRectCenter(gg_rct_X) in an argument, as a point */
const rectCenterArg = (arg?: string) => {
    const name = arg && /gg_rct_(\w+)/.exec(arg)?.[1]
    return name ? center(rectOf(name)) : undefined
}

const w3e = new War3MapW3e()
w3e.load(fs.readFileSync(path.join(workDir, 'extracted', 'war3map.w3e')))
const [offsetX, offsetY] = w3e.centerOffset
const tileAt = (x: number, y: number) => {
    const corner = w3e.corners[Math.round((y - offsetY) / 128)]?.[Math.round((x - offsetX) / 128)]
    return corner ? w3e.groundTilesets[corner.groundTexture] : undefined
}

// ---------------------------------------------------------------------------------------------- level ends

/**
 * The end of a level as a strip across the next level's start: heroes are partly in that start when it
 * fires, and it reaches far into the death terrain on both sides, so no hero goes round it (a classic flaw
 * of maps where the end region and the next start are the same). The side heroes come in from is the side
 * of the start region first reached walking the non-death terrain from the level's own start, that region
 * being closed.
 */
// the tiles that kill: named in the spec, else the tiles of its death terrain types
const deathTiles = new Set<string>(
    spec.endStrips?.deathTiles ??
        spec.gates?.deathTiles ??
        (spec.terrainTypes as Json[]).filter(t => t.kind === 'death').map(t => t.tile)
)
const cornerX = (x: number) => Math.round((x - offsetX) / 128)
const cornerY = (y: number) => Math.round((y - offsetY) / 128)
const isOpenCorner = (i: number, j: number) => {
    const corner = w3e.corners[j]?.[i]
    return !!corner && !deathTiles.has(w3e.groundTilesets[corner.groundTexture])
}

const endStrip = (pad: Rect, from: Rect, levelNumber: number): Rect => {
    const o = { thickness: 64, depth: 128, overflow: 256, ...(spec.endStrips ?? {}) }
    const [pi1, pi2, pj1, pj2] = [
        Math.ceil((pad.minX - offsetX) / 128),
        Math.floor((pad.maxX - offsetX) / 128),
        Math.ceil((pad.minY - offsetY) / 128),
        Math.floor((pad.maxY - offsetY) / 128),
    ]
    const inPad = (i: number, j: number) => i >= pi1 && i <= pi2 && j >= pj1 && j <= pj2

    // walk the open corners from the level's start, the pad closed, through the portals too (both ways, as MEC's)
    const jumps = new Map<string, [number, number]>()
    for (const p of spec.portals ?? []) {
        const [a, b] = [center(rectOf(p.triggerUnitAt)), center(rectOf(p.targetUnitAt))].map(
            c => [cornerX(c.x), cornerY(c.y)] as [number, number]
        )
        jumps.set(a.join(), b)
        jumps.set(b.join(), a)
    }
    const distance = new Map<string, number>()
    const queue: [number, number][] = [[cornerX(center(from).x), cornerY(center(from).y)]]
    distance.set(queue[0].join(), 0)
    while (queue.length > 0) {
        const [i, j] = queue.shift()!
        const jump = jumps.get(`${i},${j}`)
        if (jump && !distance.has(jump.join())) {
            distance.set(jump.join(), distance.get(`${i},${j}`)! + 1)
            queue.push(jump)
        }
        for (const [di, dj] of [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
        ]) {
            const key = `${i + di},${j + dj}`
            if (distance.has(key) || inPad(i + di, j + dj) || !isOpenCorner(i + di, j + dj)) continue
            distance.set(key, distance.get(`${i},${j}`)! + 1)
            queue.push([i + di, j + dj])
        }
    }

    const sides = [
        { side: 'west', corners: range(pj1, pj2).map(j => [pi1 - 1, j]) },
        { side: 'east', corners: range(pj1, pj2).map(j => [pi2 + 1, j]) },
        { side: 'south', corners: range(pi1, pi2).map(i => [i, pj1 - 1]) },
        { side: 'north', corners: range(pi1, pi2).map(i => [i, pj2 + 1]) },
    ].map(s => ({ ...s, reach: Math.min(...s.corners.map(([i, j]) => distance.get(`${i},${j}`) ?? Infinity)) }))
    const entry = sides.reduce((best, s) => (s.reach < best.reach ? s : best))
    if (entry.reach === Infinity) {
        warn(
            `level ${levelNumber}: its end could not be reached walking from its start: the whole start region of the next level is used`
        )
        return pad
    }

    // how far the strip reaches on both ends: over the pad, then on while the ground stays death terrain
    const vertical = entry.side === 'west' || entry.side === 'east'
    const reach = (fixed: number, fromValue: number, sign: number) => {
        let v = fromValue
        for (let t = 32; t <= o.overflow; t += 32) {
            const x = vertical ? fixed : fromValue + sign * t
            const y = vertical ? fromValue + sign * t : fixed
            // the terrain corner nearest to a point just past the pad's edge can still be one of the pad's own
            if (!inPad(cornerX(x), cornerY(y)) && !deathTiles.has(tileAt(x, y) ?? '')) break
            v = fromValue + sign * t
        }
        return v
    }

    if (vertical) {
        const x = entry.side === 'west' ? pad.minX + o.depth : pad.maxX - o.depth
        return {
            minX: x - o.thickness / 2,
            maxX: x + o.thickness / 2,
            minY: reach(x, pad.minY, -1),
            maxY: reach(x, pad.maxY, 1),
        }
    }
    const y = entry.side === 'south' ? pad.minY + o.depth : pad.maxY - o.depth
    return {
        minY: y - o.thickness / 2,
        maxY: y + o.thickness / 2,
        minX: reach(y, pad.minX, -1),
        maxX: reach(y, pad.maxX, 1),
    }
}
function range(a: number, b: number) {
    return Array.from({ length: b - a + 1 }, (_, k) => a + k)
}

// ---------------------------------------------------------------------------------------------- levels of things

const levels: Json[] = spec.levels

const levelVisibilities = levels.map(l => (l.visibilities as RectRef[]).map(resolveRect))
// areas whose units and gates belong to a level whatever its visibility says (spec levels[].unitsIn): for a map whose
// visibility doesn't split the levels (Sliding Bunnys shows the whole map from the start)
const levelUnitAreas = levels.map(l => ((l.unitsIn ?? []) as RectRef[]).map(resolveRect))

/** The first level whose visibility holds the point, or the last level */
const levelOfPoint = (x: number, y: number) => {
    const inArea = levelUnitAreas.findIndex(rects => rects.some(r => inside(r, x, y)))
    if (inArea !== -1) return inArea
    const found = levelVisibilities.findIndex(rects => rects.some(r => inside(r, x, y)))
    return found === -1 ? levels.length - 1 : found
}

const triggerCode = (name: string): string => {
    const trigger = facts.triggers.find((t: Json) => t.name === name)
    if (!trigger) throw new Error(`Unknown trigger ${name}`)
    return trigger.code.join('\n')
}
const functionBody = (code: string, fn: string) => {
    const start = code.indexOf(`function ${fn} takes`)
    return start === -1 ? '' : code.substring(start, code.indexOf('endfunction', start))
}

const unitKey = (u: Json, index: number) => u.variable ?? `#${index}`
const removedAtLevel = new Map<string, number>()

// the units a checkpoint removes belong to the level it ends: named ones, and the ones in a region it clears
levels.forEach((level, levelIndex) => {
    if (!level.removedBy) return
    const code = triggerCode(level.removedBy)

    for (const m of code.matchAll(/RemoveUnit\((gg_unit_\w+)\)/g)) {
        !removedAtLevel.has(m[1]) && removedAtLevel.set(m[1], levelIndex)
    }

    for (const line of code.split('\n')) {
        const group = callArgs(line, 'ForGroupBJ')
        const matching = group && callArgs(group[0], 'GetUnitsInRectMatching')
        if (!group || !matching) continue

        const enumFn = /function\s+(\w+)/.exec(group[1])?.[1]
        if (!enumFn || !/RemoveUnit\(GetEnumUnit\(\)\)/.test(functionBody(code, enumFn))) continue

        const r = rectOf(matching[0].replace('gg_rct_', ''))
        const filter = functionBody(code, /function\s+(\w+)/.exec(matching[1])?.[1] ?? '')
        const only = [...filter.matchAll(/GetUnitTypeId\(GetFilterUnit\(\)\)=='(\w{4})'/g)].map(m => m[1])
        const not = [...filter.matchAll(/GetUnitTypeId\(GetFilterUnit\(\)\)!='(\w{4})'/g)].map(m => m[1])

        facts.units.forEach((u: Json, i: number) => {
            if (!inside(r, u.x, u.y)) return
            if (only.length > 0 && !only.includes(u.typeId)) return
            if (not.includes(u.typeId)) return
            !removedAtLevel.has(unitKey(u, i)) && removedAtLevel.set(unitKey(u, i), levelIndex)
        })
    }
})

const levelOfUnit = (u: Json, index: number) => removedAtLevel.get(unitKey(u, index)) ?? levelOfPoint(u.x, u.y)

// ---------------------------------------------------------------------------------------------- monster types

const monsterTypes: Json[] = spec.monsterTypes.map((mt: Json) => ({
    height: -1,
    isClickable: false,
    isWanderable: false,
    nbMeteorsToKill: 1,
    ...mt,
}))
const monsterTypeLabels = new Set(monsterTypes.map(mt => mt.label))
const requireMonsterType = (label: string) => {
    if (!monsterTypeLabels.has(label)) throw new Error(`Unknown monster type ${label}`)
    return label
}

// ---------------------------------------------------------------------------------------------- monsters

const levelMonsters: Json[][] = levels.map(() => [])
let nextMonsterId = 0
const consumed = new Set<string>()
const addMonster = (levelIndex: number, monster: Json) => {
    const withId = { id: nextMonsterId++, ...monster }
    levelMonsters[levelIndex].push(withId)
    return withId
}
/** An angle MEC keeps: it reads 0 as "no angle", so a unit facing east is written 360 */
const angleOf = (degrees: number) => {
    const a = Math.round(((degrees % 360) + 360) % 360)
    return a === 0 ? 360 : a
}

const unitAt = (rectName: string) => {
    const c = center(rectOf(rectName))
    const index = facts.units.findIndex((u: Json) => Math.hypot(u.x - c.x, u.y - c.y) < 64)
    if (index === -1) throw new Error(`No unit stands at ${rectName}`)
    return { unit: facts.units[index], index }
}

// teleporting monsters: a periodic trigger moving one unit through region centres
for (const t of spec.teleportsFromTriggers ?? []) {
    const trigger = facts.triggers.find((x: Json) => x.name === t.trigger)
    const code = triggerCode(t.trigger)
    const moves = [...code.matchAll(/SetUnitPositionLoc\((gg_unit_\w+),GetRectCenter\(gg_rct_(\w+)\)\)/g)]
    const period = Number(trigger.events.find((e: Json) => e.kind === 'TimerEventPeriodic')?.args[0])
    if (moves.length === 0 || !period) throw new Error(`${t.trigger} is not a periodic teleport`)

    const variable = moves[0][1]
    const index = facts.units.findIndex((u: Json) => u.variable === variable)
    const unit = facts.units[index]
    const spots = moves.map(m => center(rectOf(m[2])))
    consumed.add(unitKey(unit, index))
    addMonster(levelOfUnit(unit, index), {
        monsterClassName: 'MonsterTeleport',
        monsterTypeLabel: requireMonsterType(t.monsterType),
        mode: 'normal',
        // the old trigger goes through the spots within its period: each spot gets an even share of it
        period: Math.round((period / spots.length) * 100) / 100,
        angle: angleOf(unit.facing),
        xArr: spots.map(s => Math.round(s.x)),
        yArr: spots.map(s => Math.round(s.y)),
    })
}

// keys: the old triggers opening a gate when a hero carrying an item enters a region give each key its gate
const keyOfGate = new Map<string, Json>()
if (spec.keyAndDoors) {
    for (const t of facts.triggers as Json[]) {
        const code = t.code.join('\n')
        const item = /UnitHasItem\(GetTriggerUnit\(\),(gg_item_\w+)\)/.exec(code)?.[1]
        const gate = /ModifyGateBJ\([^,]+,(gg_dest_\w+)\)/.exec(code)?.[1]
        const key = item && (facts.items as Json[]).find(i => i.variable === item)
        if (key && gate) keyOfGate.set(gate, key)
    }
}

// gates: MEC doors, each door's kill rect where it blocks the ground (its pathing, measured by MEC core), never from
// the terrain (user's rule). The gates a key opens become key and door pairs; the others doors without a key, which
// the map's custom triggers open (spec.keyAndDoors.keylessDoors)
const doorTypes: Json[] = []
const keyForDoorTypes: Json[] = []
const levelKeyAndDoors: Json[][] = levels.map(() => [])
let nextKeyAndDoorId = 1
if (spec.gates) {
    const g = spec.gates
    for (const d of facts.doodads.filter((d: Json) => g.doodadTypes[d.id])) {
        // a gate closing the start of a level stands in the visibility of the one before too: the spec says
        const forcedLevel = d.scriptName && g.levels?.[d.scriptName]
        const gateLevel = forcedLevel ? forcedLevel - 1 : levelOfPoint(d.x, d.y)

        const key = d.scriptName && keyOfGate.get(d.scriptName)
        // gates the old map opens from a trigger of its own (a monster reaching a region, say): doors without a key,
        // which the map's custom triggers open (spec.keyAndDoors.keylessDoors)
        const listedKeyless = !!d.scriptName && (spec.keyAndDoors?.keylessDoors ?? []).includes(d.scriptName)
        !key &&
            !listedKeyless &&
            warn(
                `gate ${d.scriptName ?? d.editorId}: no key opens it and it isn't in keyAndDoors.keylessDoors: a door without a key, which a custom trigger has to open`
            )
        const keyless = !key
        // a kind of door per destructable, without kill rect dimensions: each door's kill rect is where it blocks the
        // ground (its pathing), measured by MEC core where it stands; never from the terrain (user's rule)
        const doorLabel = `door${d.id}`
        if ((key || keyless) && !doorTypes.some(t => t.label === doorLabel)) {
            doorTypes.push({ label: doorLabel, alias: `dr${doorTypes.length + 1}`, destructableTypeId: d.id })
        }
        if (keyless) {
            levelKeyAndDoors[gateLevel].push({
                id: nextKeyAndDoorId++,
                doorTypeLabel: doorLabel,
                keyForDoorTypeLabel: null,
                doorX: Math.round(d.x),
                doorY: Math.round(d.y),
            })
            continue
        }
        if (key) {
            const keyLabel = `key${key.typeId}`
            if (!keyForDoorTypes.some(t => t.label === keyLabel)) {
                keyForDoorTypes.push({
                    label: keyLabel,
                    alias: `k${keyForDoorTypes.length + 1}`,
                    itemTypeId: key.typeId,
                })
            }
            const keyLevel = levelOfPoint(key.x, key.y)
            keyLevel !== gateLevel &&
                warn(
                    `key ${key.variable} (level ${keyLevel + 1}) opens ${d.scriptName} (level ${gateLevel + 1}): put in the door's level`
                )
            levelKeyAndDoors[gateLevel].push({
                id: nextKeyAndDoorId++,
                doorTypeLabel: doorLabel,
                keyForDoorTypeLabel: keyLabel,
                doorX: Math.round(d.x),
                doorY: Math.round(d.y),
                keyX: Math.round(key.x),
                keyY: Math.round(key.y),
            })
        }
    }
}

// clear mobs and portals stand on units of the old map (a circle of power, say): those become their monsters
const monsterOnUnitAt = (rectName: string, monsterType: string) => {
    const { unit, index } = unitAt(rectName)
    consumed.add(unitKey(unit, index))
    const level = levelOfUnit(unit, index)
    const monster = addMonster(level, {
        monsterClassName: 'MonsterNoMove',
        monsterTypeLabel: requireMonsterType(monsterType),
        x: Math.round(unit.x),
        y: Math.round(unit.y),
        angle: angleOf(unit.facing),
    })
    return { id: monster.id, level }
}

const levelClearMobs: Json[][] = levels.map(() => [])
for (const c of spec.clearMobs ?? []) {
    const trigger = monsterOnUnitAt(c.triggerUnitAt, c.monsterType)
    // gates are MEC doors, not monsters: a clear mob can't block them (open them from a custom trigger instead)
    if ((c.blockGates ?? []).length > 0) {
        throw new Error(
            `clear mob at ${c.triggerUnitAt}: gates are doors now, not block mobs; open them from a custom trigger`
        )
    }
    const blocks: number[] = []
    levelClearMobs[trigger.level].push({
        triggerMobId: trigger.id,
        blockMobsIds: blocks,
        disableDuration: c.disableDuration ?? 0,
    })
}

const levelPortals: Json[][] = levels.map(() => [])
for (const p of spec.portals ?? []) {
    const trigger = monsterOnUnitAt(p.triggerUnitAt, p.monsterType)
    const target = monsterOnUnitAt(p.targetUnitAt, p.monsterType)
    if (target.level !== trigger.level) {
        warn(
            `portal ${p.triggerUnitAt} (level ${trigger.level + 1}) → ${p.targetUnitAt} (level ${target.level + 1}): the target moved into the trigger's level`
        )
        const moved = levelMonsters[target.level].findIndex(m => m.id === target.id)
        levelMonsters[trigger.level].push(...levelMonsters[target.level].splice(moved, 1))
    }
    levelPortals[trigger.level].push({
        triggerMobId: trigger.id,
        targetMobId: target.id,
        freezeDuration: p.freezeDuration ?? 0,
        portalEffect: p.effect ?? null,
        portalEffectDuration: p.effectDuration ?? 0,
        oneWay: p.oneWay === true,
    })
}

// loops: triggers moving a unit that enters one region on to the next, forming cycles
const nextInLoop = new Map<string, string>()
for (const t of facts.triggers) {
    if (t.events.length !== 1 || t.events[0].kind !== 'EnterRectSimple') continue
    const order = facts.orders.find(
        (o: Json) => o.triggers.includes(t.name) && o.unit === 'GetTriggerUnit()' && o.order === 'move'
    )
    const to = order && /gg_rct_(\w+)/.exec(order.target.join(','))?.[1]
    to && nextInLoop.set(t.events[0].args[0].replace('gg_rct_', ''), to)
}
const cycleFrom = (start: string) => {
    const cycle = [start]
    for (let next = nextInLoop.get(start); next && next !== start; next = nextInLoop.get(next)) {
        if (cycle.includes(next) || cycle.length > 64) return undefined
        cycle.push(next)
    }
    return nextInLoop.get(cycle[cycle.length - 1]) === start ? cycle : undefined
}

// every other unit of a monster type: its first order says how it moves
const speedOf = (variable?: string) => {
    if (!variable) return undefined
    const m = new RegExp(`SetUnitMoveSpeed\\(${variable},([-\\d.]+)\\)`).exec(oldScript)
    return m ? String(Number(m[1])) : undefined
}
const ignored = new Set<string>(spec.ignoredUnitTypes ?? [])
const decor: Json[] = []

facts.units.forEach((u: Json, index: number) => {
    const key = unitKey(u, index)
    if (consumed.has(key)) return
    if (ignored.has(u.typeId)) {
        // the players' unit (a hero type, or the spec's hero.unitType) isn't decor: MEC has its own heroes
        u.typeId !== (spec.hero?.unitType ?? spec.heroUnitType) &&
            !/^[A-Z]/.test(u.typeId) &&
            decor.push({ typeId: u.typeId, x: u.x, y: u.y, facing: u.facing, owner: u.owner })
        return
    }

    const baseLabel = spec.unitMonsterTypes[u.typeId]
    if (!baseLabel) {
        warn(`unit ${key} of type ${u.typeId} at ${u.x}, ${u.y}: no monster type for it, left out`)
        return
    }
    const speed = speedOf(u.variable)
    const label = requireMonsterType((speed && spec.speedVariants?.[u.typeId]?.[speed]) || baseLabel)
    const level = levelOfUnit(u, index)
    const order = u.variable ? facts.orders.find((o: Json) => o.unit === u.variable) : undefined
    const target = rectCenterArg(order?.target.join(','))

    if (order?.order === 'patrol' && target) {
        addMonster(level, {
            monsterClassName: 'MonsterSimplePatrol',
            monsterTypeLabel: label,
            x1: Math.round(u.x),
            y1: Math.round(u.y),
            x2: Math.round(target.x),
            y2: Math.round(target.y),
        })
    } else if (order?.order === 'attackground' && target) {
        addMonster(level, {
            monsterClassName: 'MonsterNoMove',
            monsterTypeLabel: label,
            x: Math.round(u.x),
            y: Math.round(u.y),
            angle: angleOf(u.facing),
            attackGroundX: Math.round(target.x),
            attackGroundY: Math.round(target.y),
            attackGroundDelay: 0,
        })
    } else if (order?.order === 'move' && target) {
        const first = /gg_rct_(\w+)/.exec(order.target.join(','))![1]
        const cycle = cycleFrom(first)
        if (!cycle) {
            warn(`unit ${key}: a move order to ${first}, which is no loop: left immobile`)
        }
        addMonster(
            level,
            cycle
                ? {
                      monsterClassName: 'MonsterMultiplePatrols',
                      monsterTypeLabel: label,
                      mode: 'normal',
                      xArr: cycle.map(r => Math.round(center(rectOf(r)).x)),
                      yArr: cycle.map(r => Math.round(center(rectOf(r)).y)),
                  }
                : {
                      monsterClassName: 'MonsterNoMove',
                      monsterTypeLabel: label,
                      x: Math.round(u.x),
                      y: Math.round(u.y),
                      angle: angleOf(u.facing),
                  }
        )
    } else {
        order && warn(`unit ${key}: order ${order.order} not converted, left immobile`)
        addMonster(level, {
            monsterClassName: 'MonsterNoMove',
            monsterTypeLabel: label,
            x: Math.round(u.x),
            y: Math.round(u.y),
            angle: angleOf(u.facing),
        })
    }
})

// trains: units sent one after another on a loop, placed where each would be once the last one is in
for (const t of spec.trains ?? []) {
    const label = requireMonsterType(t.monsterType)
    const speed = monsterTypes.find(mt => mt.label === label)!.speed
    const loop = (t.loop as string[]).map(r => center(rectOf(r)))
    const entry = center(rectOf(t.entry))
    const edges = loop.map((p, i) => ({ from: p, to: loop[(i + 1) % loop.length] }))
    const perimeter = edges.reduce((sum, e) => sum + Math.hypot(e.to.x - e.from.x, e.to.y - e.from.y), 0)
    const entryLeg = Math.hypot(loop[0].x - entry.x, loop[0].y - entry.y)

    for (let k = 0; k < t.count; k++) {
        // the k-th unit left (count - 1 - k) intervals before the last one
        let travelled = (t.count - 1 - k) * t.interval * speed - entryLeg
        const points: { x: number; y: number }[] = []
        if (travelled < 0) {
            // still on its way in: it starts there, then goes round
            const f = 1 + travelled / entryLeg
            points.push({ x: entry.x + (loop[0].x - entry.x) * f, y: entry.y + (loop[0].y - entry.y) * f })
            points.push(...loop)
        } else {
            travelled %= perimeter
            let e = 0
            for (; e < edges.length; e++) {
                const length = Math.hypot(edges[e].to.x - edges[e].from.x, edges[e].to.y - edges[e].from.y)
                if (travelled <= length) break
                travelled -= length
            }
            const edge = edges[e % edges.length]
            const length = Math.hypot(edge.to.x - edge.from.x, edge.to.y - edge.from.y)
            points.push({
                x: edge.from.x + ((edge.to.x - edge.from.x) * travelled) / length,
                y: edge.from.y + ((edge.to.y - edge.from.y) * travelled) / length,
            })
            for (let i = 1; i <= loop.length; i++) points.push(loop[(e + i) % loop.length])
        }
        addMonster(t.level - 1, {
            monsterClassName: 'MonsterMultiplePatrols',
            monsterTypeLabel: label,
            mode: 'normal',
            xArr: points.map(p => Math.round(p.x)),
            yArr: points.map(p => Math.round(p.y)),
        })
    }
}

// spawns
const levelSpawns: Json[][] = levels.map(() => [])
for (const s of spec.spawns ?? []) {
    const from = rectOf(s.startRect)
    const to = rectOf(s.endRect)
    const vertical = s.direction === 'down' || s.direction === 'up'
    // a spawn running over several levels: each level gets its own copy, MEC running spawns per level
    const spawnLevels: number[] = s.levels ?? [s.level]
    for (const spawnLevel of spawnLevels)
        levelSpawns[spawnLevel - 1].push({
            label: s.label,
            monsterTypeLabel: requireMonsterType(s.monsterType),
            mecRegion: vertical
                ? {
                      type: 'HorizontalRectangleRegion',
                      x1: from.minX,
                      x2: from.maxX,
                      y1: Math.round(center(from).y),
                      y2: Math.round(center(to).y),
                      direction: s.direction,
                  }
                : {
                      type: 'HorizontalRectangleRegion',
                      y1: from.minY,
                      y2: from.maxY,
                      x1: Math.round(center(from).x),
                      x2: Math.round(center(to).x),
                      direction: s.direction,
                  },
            frequency: s.frequency,
            spawnAmount: s.spawnAmount ?? 1,
            initialDelay: s.initialDelay ?? 0,
            monsterDirectionMode: s.monsterDirectionMode ?? 'straight',
            keepAliveForNextLevel: s.keepAliveForNextLevel === true,
        })
}

// meteors: MEC's own, where the old map had the items that opened its gates (keys, say)
const levelMeteors: Json[][] = levels.map(() => [])
for (const item of facts.items.filter((i: Json) => (spec.meteorsAtItemsOfTypes ?? []).includes(i.typeId))) {
    levelMeteors[levelOfPoint(item.x, item.y)].push({ x: Math.round(item.x), y: Math.round(item.y) })
}

// ---------------------------------------------------------------------------------------------- MEC 1 monsters

// A MEC 1 map has no unit placed in the editor, so the blocks above found nothing: its monsters, spawns and meteors
// are written in its own calls, level by level, and go in as they are.
if (mecOne) {
    mecOne.levels.forEach((l, i) => {
        if (i >= levels.length) {
            warn(`MEC 1 level ${i + 1} has no level in the spec: its monsters are left out`)
            return
        }
        // the ids are given again here, so that a MEC 1 map and a hand-made one number their monsters the same way
        l.monsters.forEach(({ id: _mecOneId, ...monster }) =>
            addMonster(i, { ...monster, monsterTypeLabel: requireMonsterType(monster.monsterTypeLabel) })
        )
        l.monsterSpawns.forEach(spawn =>
            levelSpawns[i].push({ ...spawn, monsterTypeLabel: requireMonsterType(spawn.monsterTypeLabel) })
        )
        l.meteors.forEach(meteor => levelMeteors[i].push(meteor))
    })
}

// ------------------------------------------------- monsters the spec adds

// extraMonsters: monsters no old unit and no MEC 1 call describes - a book of life where the old map hid a secret,
// say. `{ level, monsterType, x, y, angle? }`, or `x1/y1/x2/y2` for a patrol.
for (const m of (spec.extraMonsters ?? []) as Json[]) {
    if (m.$comment !== undefined && m.level === undefined) continue
    if (typeof m.level !== 'number' || m.level < 0 || m.level >= levels.length)
        throw new Error(`extraMonsters: level ${m.level} is not a level of the map`)

    addMonster(m.level, {
        monsterClassName: m.x1 !== undefined ? 'MonsterSimplePatrol' : 'MonsterNoMove',
        monsterTypeLabel: requireMonsterType(m.monsterType),
        ...(m.x1 !== undefined
            ? { x1: Math.round(m.x1), y1: Math.round(m.y1), x2: Math.round(m.x2), y2: Math.round(m.y2) }
            : {
                  x: Math.round(m.x),
                  y: Math.round(m.y),
                  ...(m.angle !== undefined ? { angle: angleOf(m.angle) } : {}),
              }),
    })
}

// ------------------------------------------------- portals, clear mobs and circles of a MEC 1 map

// A MEC 1 map has no unit placed in the editor: its teleporters, its levers and its rotating circles are monsters
// of its own data, paired by triggers of its own. So these three blocks work from the monsters rather than from
// the old map's units, which is what `portals`, `clearMobs` and the rest above do for a hand-made map.

const levelCircleMobs: Json[][] = levels.map(() => [])

/** The immobile monsters of a level of one type, in the order the level holds them */
const immobileMonstersOfType = (levelIndex: number, label: string) =>
    levelMonsters[levelIndex].filter(m => m.monsterClassName === 'MonsterNoMove' && m.monsterTypeLabel === label)

const distanceBetween = (a: Json, b: Json) => Math.hypot(a.x - b.x, a.y - b.y)

// portalsFromMonsterTypes: { "<entry type>": "<exit type>" | { to, effect, effectDuration, freezeDuration, oneWay } }
// Every monster of the entry type becomes a portal to the nearest monster of the exit type in its level, which is
// what an old map's teleporter trigger looks for ("the nearest TP_Target of the map", and only the current level's
// monsters exist while it is played).
for (const [entryLabel, rawOptions] of Object.entries((spec.portalsFromMonsterTypes ?? {}) as Json)) {
    if (entryLabel.startsWith('$')) continue
    const options: Json = typeof rawOptions === 'string' ? { to: rawOptions } : rawOptions
    requireMonsterType(entryLabel)
    requireMonsterType(options.to)

    let nbPortals = 0
    levels.forEach((_level, i) => {
        const exits = immobileMonstersOfType(i, options.to)
        for (const entry of immobileMonstersOfType(i, entryLabel)) {
            const exit = exits
                .filter(e => e.id !== entry.id)
                .sort((a, b) => distanceBetween(entry, a) - distanceBetween(entry, b))[0]
            if (!exit) {
                warn(
                    `portalsFromMonsterTypes: the ${entryLabel} at ${entry.x},${entry.y} (level ${i + 1}) has no ${options.to} in its level: no portal`
                )
                continue
            }
            nbPortals++
            levelPortals[i].push({
                triggerMobId: entry.id,
                targetMobId: exit.id,
                freezeDuration: options.freezeDuration ?? 0,
                portalEffect: options.effect ?? null,
                portalEffectDuration: options.effectDuration ?? 0,
                oneWay: options.oneWay !== false,
            })
        }
    })
    if (nbPortals === 0) warn(`portalsFromMonsterTypes: no monster of type ${entryLabel} to turn into a portal`)
}

// clearMobsFromMonsterTypes: { "<trigger type>": "<blocked type>" | { clears, disableDuration } }
// Each monster of the trigger type clears the nearest monster of the blocked type in its level, each block mob
// taken once: the old trigger removes the nearest one still standing, so the closest pairs go first.
for (const [triggerLabel, rawOptions] of Object.entries((spec.clearMobsFromMonsterTypes ?? {}) as Json)) {
    if (triggerLabel.startsWith('$')) continue
    const options: Json = typeof rawOptions === 'string' ? { clears: rawOptions } : rawOptions
    requireMonsterType(triggerLabel)
    requireMonsterType(options.clears)

    let nbClearMobs = 0
    levels.forEach((_level, i) => {
        const triggers = immobileMonstersOfType(i, triggerLabel)
        const blocked = immobileMonstersOfType(i, options.clears)
        const pairs = triggers
            .flatMap(trigger => blocked.map(block => ({ trigger, block, distance: distanceBetween(trigger, block) })))
            // the ids break a tie, so that the same pairs come out on every run
            .sort((a, b) => a.distance - b.distance || a.trigger.id - b.trigger.id || a.block.id - b.block.id)

        const takenTriggers = new Set<number>()
        const takenBlocks = new Set<number>()
        for (const { trigger, block } of pairs) {
            if (takenTriggers.has(trigger.id) || takenBlocks.has(block.id)) continue
            takenTriggers.add(trigger.id)
            takenBlocks.add(block.id)
            nbClearMobs++
            levelClearMobs[i].push({
                triggerMobId: trigger.id,
                blockMobsIds: [block.id],
                disableDuration: options.disableDuration ?? 0,
            })
        }
        for (const trigger of triggers) {
            if (!takenTriggers.has(trigger.id))
                warn(
                    `clearMobsFromMonsterTypes: the ${triggerLabel} at ${trigger.x},${trigger.y} (level ${i + 1}) clears nothing: no ${options.clears} left in its level`
                )
        }
    })
    if (nbClearMobs === 0)
        warn(`clearMobsFromMonsterTypes: no monster of type ${triggerLabel} to turn into a clear mob`)
}

// circleMobs: the rings and arcs of monsters an old map turns around a hidden centre, from its own triggers.
//   { level, centre: { x, y }, patrolTo?, centreMonsterType, monsterType, radius, rotationSpeed, direction,
//     facing?, angles: [...] }
// MEC's circle spreads its mobs evenly (360/n apart) from its initial angle, which is a ring. An arc - the mobs
// bunched on one side, the gap being the way through - is written as one circle per mob instead, each with its own
// hidden centre at the same place and its own angle: the same motion, with nothing else to move it.
const EVEN_SPACING_TOLERANCE = 0.01
for (const circle of (spec.circleMobs ?? []) as Json[]) {
    if (circle.$comment !== undefined && circle.level === undefined) continue
    const levelIndex = circle.level
    if (typeof levelIndex !== 'number' || levelIndex < 0 || levelIndex >= levels.length)
        throw new Error(`circleMobs: level ${circle.level} is not a level of the map`)
    requireMonsterType(circle.monsterType)
    requireMonsterType(circle.centreMonsterType)

    const angles: number[] = circle.angles
    if (!Array.isArray(angles) || angles.length === 0)
        throw new Error(`circleMobs: the circle of level ${levelIndex + 1} has no angles`)

    const spacing = 360 / angles.length
    const evenlySpaced = angles.every((angle, n) => {
        const off = (((angle - angles[0] - n * spacing) % 360) + 360) % 360
        return off < EVEN_SPACING_TOLERANCE || off > 360 - EVEN_SPACING_TOLERANCE
    })

    const newCentre = () =>
        addMonster(levelIndex, {
            monsterClassName: circle.patrolTo ? 'MonsterSimplePatrol' : 'MonsterNoMove',
            monsterTypeLabel: circle.centreMonsterType,
            ...(circle.patrolTo
                ? {
                      x1: Math.round(circle.centre.x),
                      y1: Math.round(circle.centre.y),
                      x2: Math.round(circle.patrolTo.x),
                      y2: Math.round(circle.patrolTo.y),
                  }
                : { x: Math.round(circle.centre.x), y: Math.round(circle.centre.y) }),
        })

    const newMob = (angle: number) =>
        addMonster(levelIndex, {
            monsterClassName: 'MonsterNoMove',
            monsterTypeLabel: circle.monsterType,
            x: Math.round(circle.centre.x + circle.radius * Math.cos((angle * Math.PI) / 180)),
            y: Math.round(circle.centre.y + circle.radius * Math.sin((angle * Math.PI) / 180)),
        })

    const newCircle = (centreId: number, mobIds: number[], initialAngle: number) =>
        levelCircleMobs[levelIndex].push({
            mainMobId: centreId,
            blockMobsIds: mobIds,
            rotationSpeed: circle.rotationSpeed,
            direction: circle.direction ?? 'ccw',
            facing: circle.facing ?? 'ccw',
            shape: circle.shape ?? 'circle',
            radius: circle.radius,
            initialAngle: ((initialAngle % 360) + 360) % 360,
        })

    if (evenlySpaced) {
        newCircle(
            newCentre().id,
            angles.map(angle => newMob(angle).id),
            angles[0]
        )
    } else {
        for (const angle of angles) newCircle(newCentre().id, [newMob(angle).id], angle)
    }
}

// ---------------------------------------------------------------------------------------------- casters

// A caster type shoots a projectile monster type from a caster monster type. `castersFromMonsterTypes` then turns
// every immobile monster of a type into a caster of the type it names: an old map places its shooting mages as
// plain monsters, and a trigger of its own makes them fire.
const casterTypes: Json[] = (spec.casterTypes ?? []).map((ct: Json) => ({
    label: ct.label,
    ...(ct.alias ? { alias: ct.alias } : {}),
    casterMonsterTypeLabel: requireMonsterType(ct.casterMonsterType),
    projectileMonsterTypeLabel: requireMonsterType(ct.projectileMonsterType),
    range: ct.range,
    projectileSpeed: ct.projectileSpeed,
    loadTime: ct.loadTime,
    animation: ct.animation ?? 'spell',
    ...(ct.isBlind ? { isBlind: true } : {}),
    ...(ct.nbShots > 1
        ? {
              nbShots: ct.nbShots,
              shotAngleStep: ct.shotAngleStep ?? 0,
              firstShotAngle: ct.firstShotAngle ?? -(((ct.nbShots - 1) * (ct.shotAngleStep ?? 0)) / 2),
          }
        : {}),
}))
const casterTypeLabels = new Set(casterTypes.map(ct => ct.label))

for (const [monsterTypeLabel, casterTypeLabel] of Object.entries((spec.castersFromMonsterTypes ?? {}) as Json)) {
    if (monsterTypeLabel.startsWith('$')) continue
    if (!casterTypeLabels.has(casterTypeLabel as string))
        throw new Error(`castersFromMonsterTypes: unknown caster type ${casterTypeLabel}`)

    let nbTurned = 0
    levelMonsters.forEach((monsters, i) => {
        levelMonsters[i] = monsters.map(m => {
            if (m.monsterClassName !== 'MonsterNoMove' || m.monsterTypeLabel !== monsterTypeLabel) return m
            nbTurned++
            return { id: m.id, monsterClassName: 'Caster', casterTypeLabel, x: m.x, y: m.y, angle: m.angle }
        })
    })

    if (nbTurned === 0) warn(`castersFromMonsterTypes: no immobile monster of type ${monsterTypeLabel} to turn`)
}

// ---------------------------------------------------------------------------------------------- the game data

// the model of the effect a hero slides as in async mode: the old hero's own, when it has one (the rebase gives
// its looks to MEC's hero units)
const heroType =
    spec.hero?.unitType ??
    (facts.units as Json[]).find(u => /^[A-Z]/.test(u.typeId) && /^Player\((\d|1[01])\)$/.test(u.owner))?.typeId
const oldUnitObjects: Json[] = [
    ...(facts.objectData['war3map.w3u']?.changedStandard ?? []),
    ...(facts.objectData['war3map.w3u']?.custom ?? []),
]
const heroModelMod = oldUnitObjects.find(o => o.newId === heroType || (!o.newId && o.oldId === heroType))?.modifications
    ?.umdl
// a hero based on another unit than the Demon Hunter keeps that unit's model (World Editor defaults), as the rebase
// gives MEC's heroes
const heroBaseType = oldUnitObjects.find(o => o.newId === heroType)?.oldId ?? heroType
const baseModel =
    heroBaseType && heroBaseType !== 'Edem'
        ? (
              JSON.parse(
                  fs.readFileSync(require.resolve('war3-objectdata-th/dist/cjs/generated/unitsdata.json'), 'utf8')
              ) as Json
          )[heroBaseType]?.modelFile
        : undefined
const heroModelPath = heroModelMod ?? spec.hero?.model ?? baseModel

// what the old map's own data says about a terrain type, corrected (spec terrainTypeOverrides: label -> fields).
// The tile is the one MEC reads the ground with, so changing it moves which ground is walk, slide or death - it
// repaints nothing: the terrain itself is the old map's war3map.w3e, carried over untouched.
for (const [label, fields] of Object.entries((spec.terrainTypeOverrides ?? {}) as Json)) {
    if (label.startsWith('$')) continue
    const terrainType = (spec.terrainTypes as Json[]).find(t => t.label === label)
    if (!terrainType) throw new Error(`terrainTypeOverrides: unknown terrain type ${label}`)
    Object.assign(terrainType, fields)
}

// the tiles the old map renamed by re-skinning them (spec terrainTypeIdRemap), so MEC reads the ground by the id
// the rebase wrote into the w3e's tileset list
const terrainTypeIdRemap: { [oldId: string]: string } = Object.fromEntries(
    Object.entries((spec.terrainTypeIdRemap ?? {}) as { [k: string]: string }).filter(([from]) => !from.startsWith('$'))
)

const terrainTypesMec = (spec.terrainTypes as Json[]).map((t, orderId) => {
    const common = {
        terrainTypeId: terrainTypeIdRemap[t.tile] ?? t.tile,
        label: t.label,
        alias: t.alias,
        kind: t.kind,
        cliffClassId: t.cliffClassId ?? 1,
        orderId,
    }
    if (t.kind === 'walk') return { ...common, walkSpeed: t.walkSpeed }
    if (t.kind === 'slide')
        return { ...common, slideSpeed: t.slideSpeed, canTurn: t.canTurn, rotationSpeed: t.rotationSpeed ?? 0.9549 }
    // MEC names this field killingEffet
    return { ...common, killingEffet: t.killingEffect ?? '', timeToKill: t.timeToKill, toleranceDist: t.toleranceDist }
})

const map = new War3Map()
map.load(new Uint8Array(fs.readFileSync(outputMap)), false)
const archive = map.archive
const fileText = (name: string) => Buffer.from(archive.get(name)!.bytes()!).toString('utf8')

// The effect a hero slides as in async mode is named after the file that is really there: an old map's object data
// says `.mdl` where the file imported beside it is `.mdx`, and the rebase repoints the unit types the same way.
const heroModelInMap =
    heroModelPath && !archive.get(heroModelPath) && archive.get(heroModelPath.replace(/\.mdl$/i, '.mdx'))
        ? heroModelPath.replace(/\.mdl$/i, '.mdx')
        : heroModelPath
const heroModel = heroModelInMap ? { heroModelPath: heroModelInMap } : {}

let lua = fileText('war3map.lua')
const blockStart = lua.indexOf('function setGameData()')
const blockEnd = lua.indexOf('onGlobalInit(setGameData)', blockStart)
if (blockStart === -1 || blockEnd === -1) throw new Error('No setGameData block in the base map’s war3map.lua')
const baseJson = /MEC_core\.setGameData\((".*")\)/.exec(lua.substring(blockStart, blockEnd))
const baseGameData = baseJson ? JSON.parse(JSON.parse(baseJson[1])).gameData : {}

// the mortars' areas, for MEC's hero collision (user's rule: MEC's hero collision stays): a shell's areas reach to
// the edge of a hero's collision circle, in the engine as in MEC (MortarSplash), so with MEC's collision in place of the
// old hero's (spec.hero.collision), MEC's judgment of the areas is shifted by the difference (gameData.mortarAreaShift,
// core 5fd68cef): the shells reach the heroes as far as in the old map. Not by changing the mortar units'
// weapons at runtime: their attack broke off (user's test)
const mecHeroCollision = Number({ ...baseGameData, ...(spec.gameData ?? {}) }.heroBaseCollisionSize ?? 25)
const mortarAreaShift = spec.hero?.collision !== undefined ? Number(spec.hero.collision) - mecHeroCollision : 0

// ---------------------------------------------------------------------------------------------- safe starts

/**
 * Heroes appear anywhere in a level's start, and stand there until they move: every point of it, and a margin
 * around it, must be ground they can stand on. A start reaching onto a death tile kills a hero as it appears, and
 * one on a slide tile sends it off at once. So a start is shrunk, side by side, until it holds walk tiles only
 * (spec.safeStarts.margin, 48 by default), and a monster whose path comes within its reach of it is warned about.
 */
const walkTiles = new Set<string>((spec.terrainTypes as Json[]).filter(t => t.kind === 'walk').map(t => t.tile))
const safeMargin: number = spec.safeStarts?.margin ?? 48
const isSafePoint = (x: number, y: number) => walkTiles.has(tileAt(x, y) ?? '')
const isSafeArea = (minX: number, minY: number, maxX: number, maxY: number) => {
    for (let x = minX - safeMargin; x <= maxX + safeMargin; x += 16) {
        for (let y = minY - safeMargin; y <= maxY + safeMargin; y += 16) {
            if (!isSafePoint(x, y)) return false
        }
    }
    return true
}

/**
 * Whether a start is shrunk onto walk tiles. A hand-made map's starts are guessed from where its script revived the
 * heroes, so they can reach onto the terrain around; a MEC 1 map's starts are the ones its author made in game and
 * played on, and they stand on the slide terrain on purpose. Those are kept, and only checked for death tiles.
 */
const shrinkStarts: boolean = spec.safeStarts?.shrink ?? !spec.mecOne

const safeStart = (r: Rect, levelNumber: number): Rect => {
    if (!shrinkStarts) {
        for (let x = r.minX; x <= r.maxX; x += 16) {
            for (let y = r.minY; y <= r.maxY; y += 16) {
                if (deathTiles.has(tileAt(x, y) ?? '')) {
                    warn(`level ${levelNumber}: its start holds the death tile ${tileAt(x, y)} at ${x}, ${y}`)
                    return r
                }
            }
        }
        return r
    }

    const s = { ...r }
    const step = 16
    for (let guard = 0; guard < 400 && !isSafeArea(s.minX, s.minY, s.maxX, s.maxY); guard++) {
        // the side whose own strip holds unsafe ground moves in
        const strips: [keyof Rect, number, number, number, number][] = [
            ['minX', s.minX, s.minY, s.minX, s.maxY],
            ['maxX', s.maxX, s.minY, s.maxX, s.maxY],
            ['minY', s.minX, s.minY, s.maxX, s.minY],
            ['maxY', s.minX, s.maxY, s.maxX, s.maxY],
        ]
        let moved = false
        for (const [side, x1, y1, x2, y2] of strips) {
            if (!isSafeArea(x1, y1, x2, y2)) {
                s[side] += side.startsWith('min') ? step : -step
                moved = true
            }
        }
        if (!moved || s.maxX - s.minX < 64 || s.maxY - s.minY < 64) {
            warn(
                `level ${levelNumber}: no safe start could be found in ${JSON.stringify(rounded(r))}: kept as it is, check it`
            )
            return r
        }
    }
    if (s.minX !== r.minX || s.minY !== r.minY || s.maxX !== r.maxX || s.maxY !== r.maxY) {
        startNotes.push(
            `level ${levelNumber}: start shrunk from ${JSON.stringify(rounded(r))} to ${JSON.stringify(rounded(s))}, onto walk tiles only (margin ${safeMargin})`
        )
    }
    return s
}
const startNotes: string[] = []
const safeStarts = levels.map((level, i) => safeStart(resolveRect(level.start), i + 1))

// monsters coming within reach of a start: the point of their path nearest to it
const distanceToRect = (x: number, y: number, r: Rect) =>
    Math.hypot(Math.max(r.minX - x, 0, x - r.maxX), Math.max(r.minY - y, 0, y - r.maxY))
const pathPoints = (m: Json): { x: number; y: number }[] => {
    type Point = { x: number; y: number }
    const line = (a: Point, b: Point): Point[] => {
        const steps = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 16))
        return Array.from({ length: steps + 1 }, (_, k) => ({
            x: a.x + ((b.x - a.x) * k) / steps,
            y: a.y + ((b.y - a.y) * k) / steps,
        }))
    }
    if (m.monsterClassName === 'MonsterNoMove' || m.monsterClassName === 'MonsterTeleport') {
        return m.xArr ? m.xArr.map((x: number, k: number) => ({ x, y: m.yArr[k] })) : [{ x: m.x, y: m.y }]
    }
    if (m.monsterClassName === 'Caster') return [{ x: m.x, y: m.y }]
    if (m.monsterClassName === 'MonsterSimplePatrol') return line({ x: m.x1, y: m.y1 }, { x: m.x2, y: m.y2 })
    if (m.monsterClassName === 'MonsterMultiplePatrols') {
        const points: Point[] = m.xArr.map((x: number, k: number) => ({ x, y: m.yArr[k] }))
        return points.flatMap((p, k) =>
            k + 1 < points.length || m.mode === 'normal' ? line(p, points[(k + 1) % points.length]) : [p]
        )
    }
    return []
}
// a caster's unit is built from the monster type its caster type shoots from, immolation included
const monsterTypeLabelOf = (m: Json): string =>
    m.monsterClassName === 'Caster'
        ? casterTypes.find(ct => ct.label === m.casterTypeLabel)?.casterMonsterTypeLabel
        : m.monsterTypeLabel

safeStarts.forEach((start, i) => {
    for (const m of levelMonsters[i]) {
        const label = monsterTypeLabelOf(m)
        const type = monsterTypes.find(mt => mt.label === label)
        if (!type || type.killRectDimensions || (m.monsterClassName === 'MonsterNoMove' && /^(plate)$/.test(label)))
            continue
        const reach = (type.immolationRadius ?? 0) + mecHeroCollision + safeMargin
        const nearest = Math.min(...pathPoints(m).map(p => distanceToRect(p.x, p.y, start)))
        if (nearest < reach) {
            warn(
                `level ${i + 1}: monster ${m.id} (${label} ${m.monsterClassName}) comes within ${Math.round(nearest)} of the start (reach ${reach})`
            )
        }
    }
})

// ---------------------------------------------------------------------------------------------- visibility tiles

/**
 * An old map that lights part of its maze now and then needs a `periodic` visibility type, and a type lives on
 * tiles: so every level of such a map goes to tiles, its reveal-only rectangles included, since a level holds
 * either the rectangles or the tiles and a `masked` tile cannot hide what a legacy level reveals
 * (docs/VISIBILITY.md). A map whose levels only ever reveal keeps its rectangles, which move no border.
 */
/**
 * The visibility a maker set in game and saved with `-smic`, taken as it is (spec visibilityFrom: a file of the work
 * folder holding `visibilityTypes` and, per level, its `visibilityTiles`).
 *
 * What this step works out from the old map's rectangles is a first draft: the two systems do not resolve a tile the
 * same way, and a border moves by up to a tile. Once the maker has gone over it in game, their own is the truth, and
 * a build that computed it again would undo their work - so the file wins, whole, and the spec's own
 * `periodicVisibilities` are left in it only to say where the draft came from.
 */
const visibilityFromFile: { visibilityTypes?: Json[]; levels?: Json[] } | undefined = spec.visibilityFrom
    ? JSON.parse(fs.readFileSync(path.join(workDir, spec.visibilityFrom), 'utf8'))
    : undefined

const visibilityTypes: Json[] = (visibilityFromFile?.visibilityTypes ?? spec.visibilityTypes ?? []).map((vt: Json) => ({
    label: vt.label,
    alias: vt.alias ?? null,
    kind: 'periodic',
    startState: vt.startState ?? 'masked',
    visibleTime: vt.visibleTime,
    maskedTime: vt.maskedTime,
}))
const visibilityTypeLabels = new Set(visibilityTypes.map(vt => vt.label))

const periodicVisibilities: { level: number; type: string; rect: Rect }[] = (spec.periodicVisibilities ?? []).map(
    (pv: Json) => {
        if (!visibilityTypeLabels.has(pv.type)) throw new Error(`periodicVisibilities: unknown type ${pv.type}`)
        if (!levels[pv.level]) throw new Error(`periodicVisibilities: no level ${pv.level}`)
        return { level: pv.level, type: pv.type, rect: resolveRect(pv.rect) }
    }
)

const generatedVisibilityTiles = periodicVisibilities.length
    ? visibilityTilesOfLevels(
          levels.map((_level, i) => ({
              visible: levelVisibilities[i],
              periodic: periodicVisibilities.filter(pv => pv.level === i).map(pv => ({ type: pv.type, rect: pv.rect })),
          }))
      )
    : undefined

const visibilityTiles = visibilityFromFile
    ? levels.map((_level, i) => {
          const level = (visibilityFromFile.levels ?? []).find((l: Json) => l.id === i)
          if (!level) throw new Error(`${spec.visibilityFrom}: nothing for level ${i}`)
          return level.visibilityTiles as VisibilityTileGroup[]
      })
    : generatedVisibilityTiles

const visibilityNote = visibilityFromFile
    ? `Visibility: taken from \`${spec.visibilityFrom}\` as it is, not worked out again - ` +
      `${visibilityTiles!.reduce((n, groups) => n + groups.reduce((m, g) => m + g.rects.length, 0), 0)} rectangles.`
    : undefined

const gameData = {
    terrainTypesMec,
    monsterTypes,
    casterTypes,
    ...(visibilityTypes.length ? { visibilityTypes } : {}),
    levels: levels.map((level, i) => ({
        id: i,
        start: rounded(safeStarts[i]),
        // a level without an end is the last one: reaching it wins the game (MEC 1 maps write no end there)
        ...(level.end
            ? {
                  end: rounded(
                      level.end.stripAt
                          ? endStrip(resolveRect(level.end.stripAt), resolveRect(level.start), i + 1)
                          : resolveRect(level.end)
                  ),
              }
            : {}),
        // the old reveal-only rectangles, or the tiles they became when the map needs more than revealing
        ...(visibilityTiles
            ? { visibilities: [], visibilityTiles: visibilityTiles[i] }
            : {
                  visibilities: levelVisibilities[i].map(r => ({
                      x1: Math.round(r.minX),
                      y1: Math.round(r.minY),
                      x2: Math.round(r.maxX),
                      y2: Math.round(r.maxY),
                  })),
              }),
        resetVisiblitiesAtStart: level.resetVisiblitiesAtStart ?? false,
        ...(level.nbLives !== undefined ? { nbLives: level.nbLives } : {}),
        ...(level.startMessage ? { startMessage: level.startMessage } : {}),
        monsters: levelMonsters[i],
        monsterSpawns: levelSpawns[i],
        meteors: levelMeteors[i],
        clearMobs: levelClearMobs[i],
        portalMobs: levelPortals[i],
        keyAndDoors: levelKeyAndDoors[i],
        circleMobs: levelCircleMobs[i],
        staticSlides: [],
        regions: [],
    })),
    doorTypes,
    keyForDoorTypes,
    gameData: {
        ...baseGameData,
        ...heroModel,
        ...(mortarAreaShift !== 0 ? { mortarAreaShift } : {}),
        ...Object.fromEntries(Object.entries((spec.gameData ?? {}) as Json).filter(([key]) => !key.startsWith('$'))),
    },
}

const gameDataString = JSON.stringify(gameData)

// a dropped monster type still named by the game data or a custom trigger stops the build
const customTriggersText = ((spec.customTriggers ?? []) as string[])
    .map(file => fs.readFileSync(path.join(workDir, file), 'utf8'))
    .join('\n')
for (const label of droppedMonsterTypes) {
    const quoted = JSON.stringify(label)
    if (gameDataString.includes(`:${quoted}`) || customTriggersText.includes(quoted))
        throw new Error(`dropMonsterTypes: ${label} is still used`)
}
fs.writeFileSync(path.join(workDir, 'gamedata.json'), JSON.stringify(gameData, null, 2))

// ---------------------------------------------------------------------------------------------- bake

// the setGameData trigger, as mec-smic-loader writes it: a Lua string of the JSON (JSON escapes are Lua escapes
// here: no control characters are left in it)
if (/[ -]/.test(gameDataString)) throw new Error('The game data holds control characters')
const trigger = `function setGameData()\n    MEC_core.setGameData(${JSON.stringify(gameDataString)})\nend\n\n`

// the custom triggers of the map (spec.customTriggers, Lua files of the work folder), right after setGameData
const INIT_LINE = 'onGlobalInit(setGameData)'
// the decor: the old units that are neither heroes nor monsters (decor.json), created as they stood, with no
// pathing so they block nobody. Old neutral players 12 to 15 become the neutral players of a 24 player map.
const NEUTRALS: { [old: string]: string } = {
    'Player(12)': 'Player(PLAYER_NEUTRAL_AGGRESSIVE)',
    'Player(13)': 'Player(bj_PLAYER_NEUTRAL_VICTIM)',
    'Player(14)': 'Player(bj_PLAYER_NEUTRAL_EXTRA)',
    'Player(15)': 'Player(PLAYER_NEUTRAL_PASSIVE)',
}
const decorCode = spec.decor
    ? `-- decor (generated from decor.json)
onGlobalInit(function()
    local FROZEN = { ${((spec.decor.frozenTypes ?? []) as string[]).map(t => `["${t}"] = true`).join(', ')} }
    local UNCLICKABLE = { ${((spec.decor.unclickableTypes ?? []) as string[]).map(t => `["${t}"] = true`).join(', ')} }
    local DECOR = {
${decor.map(d => `        { "${d.typeId}", ${Math.round(d.x)}, ${Math.round(d.y)}, ${Math.round(d.facing)}, ${NEUTRALS[d.owner] ?? 'Player(PLAYER_NEUTRAL_PASSIVE)'} },`).join('\n')}
    }
    for _, d in ipairs(DECOR) do
        local u = CreateUnit(d[5], FourCC(d[1]), d[2], d[3], d[4])
        SetUnitPathing(u, false)
        if FROZEN[d[1]] then
            SetUnitTimeScale(u, 0)
        end
        if UNCLICKABLE[d[1]] then
            -- locust: not selectable nor targetable, and left out of the unit enumerations
            UnitAddAbility(u, FourCC("Aloc"))
        end
    end
end)
`
    : ''

// the destructables the old script created itself (CreateDestructable in main, for those its triggers use): their
// doodad entries are flagged so that the game leaves them out, so they are created the same way here, with the
// same arguments. Created from the doodad file instead, the old map's bridges lost their animations. The types
// MEC recreates as its own objects (the gates) are left out.
const recreatedTypes = new Set<string>([
    ...Object.keys(spec.gates?.doodadTypes ?? {}),
    ...(spec.removeDoodadTypes ?? []),
])
// Those set to a gg_dest_ variable have a doodad entry: with spec.scriptDestructables "file", the rebase placed them
// from the file, and they are left out here; by default ("script") the rebase removed them, and they are created here.
const destructablesByScript = (spec.scriptDestructables ?? 'script') === 'script'
const scriptDestructables = [...oldScript.matchAll(/(gg_dest_\w+\s*=\s*)?CreateDestructable(Z?)\('(\w{4})',([^)]*)\)/g)]
    .filter(m => (destructablesByScript || !m[1]) && !recreatedTypes.has(m[3]))
    .map(m => [m[0], m[2], m[3], m[4]] as RegExpMatchArray)
    .map(
        m =>
            `    CreateDestructable${m[1]}(FourCC("${m[2]}"), ${m[3]
                .split(',')
                .map(a => (/^-?\.\d/.test(a) ? a.replace('.', '0.') : a))
                .join(', ')})`
    )
const destructablesCode = scriptDestructables.length
    ? `-- destructables the old script created (generated from its CreateDestructable calls)
onGlobalInit(function()
${scriptDestructables.join('\n')}
end)
`
    : ''

// the old map's quests (spec.legacyQuests): created before MEC's own (onGlobalInit runs before its map
// initialization triggers), with their text resolved; the ones listed in "drop" (obsolete commands) left out
const oldWts = parseWts(fs.readFileSync(path.join(workDir, 'extracted', 'war3map.wts'), 'utf8'))
const jassText = (arg: string): string | undefined => {
    const written = arg.trim()

    // a map made in the World Editor with GUI quests writes their text in a constant (every MEC 1 map does)
    if (/^[A-Za-z_]\w*$/.test(written)) {
        const constant = new RegExp(`constant string ${written}=("(?:[^"\\\\]|\\\\.)*")`, 's').exec(oldScript)
        return constant ? jassText(constant[1]) : undefined
    }

    const literal = /^"(.*)"$/s.exec(written)?.[1]
    if (literal === undefined) return undefined
    const raw = jassUnescape(literal)
    return raw.replace(/^TRIGSTR_\d+$/, key => oldWts[key] ?? key)
}
const legacyQuests = spec.legacyQuests
    ? oldScript
          .split('\n')
          .map(line => callArgs(line, 'CreateQuestBJ'))
          .filter((args): args is string[] => !!args && args.length === 4)
          .map(([type, title, text, icon]) => ({
              type,
              title: jassText(title),
              text: jassText(text),
              icon: jassText(icon),
          }))
          .filter(q => q.title !== undefined && !(spec.legacyQuests.drop ?? []).includes(q.title))
          // personal data the user chose to take out (legacyQuests.replaceText: title → new text)
          .map(q => ({ ...q, text: spec.legacyQuests.replaceText?.[q.title!] ?? q.text }))
    : []

const questsCode = legacyQuests.length
    ? `-- the old map's quests, created before MEC's own; the obsolete ones (commands MEC doesn't have) left out
onGlobalInit(function()
${legacyQuests.map(q => `    CreateQuestBJ(${q.type}, ${JSON.stringify(q.title)}, ${JSON.stringify(q.text ?? '')}, ${JSON.stringify(q.icon ?? '')})`).join('\n')}
end)
`
    : ''

// the custom triggers: each block of the spec's files (its comment lines, then its onGlobalInit), named after the
// first words of its comment. A block with a "-- @level N" line goes in the sub-category "Level N" (MEC's level
// ids, from 0), as the editor shows MEC's levels; the others stay at the root of the category, first.
const blocksOf = (file: string) => {
    const full = path.join(workDir, file)
    const check = spawnSync('luac', ['-p', full], { encoding: 'utf8' })
    if (check.error) warn(`luac not found: ${file} not checked`)
    else if (check.status !== 0) throw new Error(`${file} is not valid Lua: ${check.stderr}`)

    const text = fs.readFileSync(full, 'utf8').replace(/\r\n?/g, '\n')
    return text
        .split(/\n[ \t]*\n(?=(?:--[^\n]*\n)+onGlobalInit\()/)
        .map(block => block.trim())
        .filter(block => /onGlobalInit\(/.test(block))
        .map(block => {
            const firstComment = /^--\s*([^\n]*)/.exec(block)?.[1] ?? file
            const name =
                firstComment
                    .split(/[(:.,]/)[0]
                    .trim()
                    .slice(0, 60) || file
            const level = /^--\s*@level\s+(\d+)\s*$/m.exec(block)?.[1]
            return {
                name,
                description: `from ${file}`,
                code: block + '\n',
                level: level === undefined ? -1 : Number(level),
            }
        })
}

const customTriggers: CustomTextTrigger[] = [
    ...(questsCode ? [{ name: 'Original map legacy quests', code: questsCode }] : []),
    ...(destructablesCode ? [{ name: 'Destructables of the original script', code: destructablesCode }] : []),
    ...(decorCode ? [{ name: 'Decor of the original map', code: decorCode }] : []),
    ...((spec.customTriggers ?? []) as string[])
        .flatMap(blocksOf)
        .sort((a, b) => a.level - b.level)
        .map(({ level, ...t }) => (level === -1 ? t : { ...t, subCategory: `Level ${level}` })),
]
const CUSTOM_CATEGORY = 'Converted from the original map'

// the custom triggers used to be baked into the setGameData block: removed from there if found
const customCode = ''
// between markers, so that running this step again replaces them rather than adding them twice
const CUSTOM_START = '-- convert-slide-map: custom triggers'
const CUSTOM_END = '-- convert-slide-map: end of custom triggers'
const withCustom = (rest: string) => {
    if (!rest.startsWith(INIT_LINE)) throw new Error(`The setGameData block does not end with ${INIT_LINE}`)
    let after = rest.substring(INIT_LINE.length)
    const start = after.indexOf(CUSTOM_START)
    const end = after.indexOf(CUSTOM_END)
    if (start !== -1 && end !== -1) {
        after = after.substring(0, start).replace(/\s+$/, '') + after.substring(end + CUSTOM_END.length)
    }
    return customCode ? `${INIT_LINE}\n\n${CUSTOM_START}\n${customCode}${CUSTOM_END}${after}` : INIT_LINE + after
}

lua = lua.substring(0, blockStart) + trigger + withCustom(lua.substring(blockEnd))

// the custom triggers' code where the World Editor writes the enabled custom text triggers: after the last of the
// base map's, before the generated functions (InitSounds…), so that a save from the editor writes the same
// searched past the setGameData trigger only: MEC core, above it, has an InitCustomTriggers of its own (a wrapper)
const customTextTriggersEnd = lua.indexOf(INIT_LINE)
const generatedStart = [
    '\nfunction InitSounds()',
    '\nfunction CreateRegions()',
    '\nfunction InitCustomTriggers()',
    '\nfunction main()',
]
    .map(marker => lua.indexOf(marker, customTextTriggersEnd))
    .filter(i => i !== -1)
    .sort((x, y) => x - y)[0]
if (generatedStart === undefined) throw new Error('No InitSounds/CreateRegions/main in the base map’s war3map.lua')
lua = lua.substring(0, generatedStart) + '\n' + customTriggers.map(t => t.code).join('') + lua.substring(generatedStart)

// the start region of the base map, gg_rct_departLvl_0: MEC starts the heroes and the camera there
const start = gameData.levels[0].start
const departLine = /gg_rct_departLvl_0 = Rect\([^)]*\)/
if (!departLine.test(lua)) throw new Error('No gg_rct_departLvl_0 = Rect(...) in the base map’s war3map.lua')
lua = lua.replace(
    departLine,
    `gg_rct_departLvl_0 = Rect(${start.minX}.0, ${start.minY}.0, ${start.maxX}.0, ${start.maxY}.0)`
)
archive.set('war3map.lua', Buffer.from(lua, 'utf8'))

// and in war3map.w3r for the editor: left, bottom, right, top, then the region's name
const w3r = Buffer.from(archive.get('war3map.w3r')!.bytes()!)
const departName = w3r.indexOf('departLvl 0\0')
if (departName === -1) throw new Error('No "departLvl 0" region in the base map’s war3map.w3r')
;[start.minX, start.minY, start.maxX, start.maxY].forEach((v, i) => w3r.writeFloatLE(v, departName - 16 + i * 4))
archive.set('war3map.w3r', w3r)

// war3map.wct: the same text, in its own custom text block, prefixed by its length with the final null
const wct = Buffer.from(archive.get('war3map.wct')!.bytes()!)
const wctStart = wct.indexOf('function setGameData()')
if (wctStart === -1) throw new Error('No setGameData block in the base map’s war3map.wct')
const wctLength = wct.readUInt32LE(wctStart - 4)
const oldBlock = wct.toString('utf8', wctStart, wctStart + wctLength - 1)
const wctEnd = oldBlock.indexOf('onGlobalInit(setGameData)')
if (wctEnd === -1) throw new Error('The setGameData block of war3map.wct does not end with onGlobalInit(setGameData)')
const newBlock = Buffer.from(trigger + withCustom(oldBlock.substring(wctEnd)), 'utf8')
const length = Buffer.alloc(4)
length.writeUInt32LE(newBlock.length + 1)
const wctWithGameData = Buffer.concat([
    wct.subarray(0, wctStart - 4),
    length,
    newBlock,
    wct.subarray(wctStart + wctLength - 1),
])

// the custom triggers as custom text triggers of the editor, in their own category, at the end of the tree
const wtg = Buffer.from(archive.get('war3map.wtg')!.bytes()!)
if (hasCategory(wtg, CUSTOM_CATEGORY)) {
    throw new Error(`The map already holds "${CUSTOM_CATEGORY}": run the rebase before (yarn convert-slide-map:build)`)
}
const triggerFiles = addCustomTextTriggers(wtg, wctWithGameData, CUSTOM_CATEGORY, customTriggers)
archive.set('war3map.wtg', triggerFiles.wtg)
archive.set('war3map.wct', triggerFiles.wct)

// the unit types the spec asks for: gameplay fields in war3map.w3u, looks in war3mapSkin.w3u, as the base map does
if ((spec.unitTypes ?? []).length > 0) {
    const w3u = new War3MapW3u()
    w3u.load(archive.get('war3map.w3u')!.bytes()!)
    const skin = new War3MapW3u()
    skin.load(archive.get('war3mapSkin.w3u')!.bytes()!)

    for (const unitType of spec.unitTypes) {
        for (const [file, isSkin] of [
            [w3u, false],
            [skin, true],
        ] as const) {
            file.customTable.objects = file.customTable.objects.filter(o => o.newId !== unitType.id)
            const object = new ModifiedObject()
            object.oldId = unitType.baseId
            object.newId = unitType.id
            object.sets = 1
            object.setsFlag = [0]
            object.modifications = Object.entries(unitType.fields as Json)
                .filter(([id]) => isSkinField(id) === isSkin)
                .map(([id, value]) => {
                    const m = new Modification()
                    m.id = id
                    m.variableType = variableTypeOf(id, value)
                    m.value = value
                    return m
                })
            file.customTable.objects.push(object)
        }
    }
    archive.set('war3map.w3u', w3u.save())
    archive.set('war3mapSkin.w3u', skin.save())
}

const saved = saveArchiveWhole(archive)
fs.writeFileSync(outputMap, saved)

// ---------------------------------------------------------------------------------------------- summary

const count = (list: Json[], key: (x: Json) => string) =>
    Object.entries(list.reduce((c: Json, x) => ((c[key(x)] = (c[key(x)] ?? 0) + 1), c), {}))
        .map(([k, n]) => `${n} ${k}`)
        .join(', ')

fs.writeFileSync(
    path.join(workDir, 'gamedata.md'),
    [
        `# ${mapName}: game data`,
        '',
        `Baked into \`${outputMap}\`; the JSON is in \`gamedata.json\` (${Math.round(gameDataString.length / 1024)} KB).`,
        '',
        '| Level | Monsters | Spawns | Meteors | Keys and doors | Clear mobs | Portals | Circles |',
        '| --- | --- | --- | --- | --- | --- | --- | --- |',
        ...gameData.levels.map(
            (l, i) =>
                `| ${i + 1} | ${count(l.monsters, m => `${monsterTypeLabelOf(m)} ${m.monsterClassName.replace('Monster', '')}`) || '—'} | ${l.monsterSpawns.length} | ${l.meteors.length} | ${l.keyAndDoors.length} | ${l.clearMobs.length} | ${l.portalMobs.length} | ${l.circleMobs.length} |`
        ),
        '',
        `Monster types: ${monsterTypes.map(mt => mt.label + (mt.killRectDimensions ? ` (kill rect ${mt.killRectDimensions.width}×${mt.killRectDimensions.height})` : '')).join(', ')}.`,
        '',
        `Custom triggers (category "${CUSTOM_CATEGORY}" in the editor): ${customTriggers.map(t => t.name).join(', ') || 'none'}.`,
        '',
        ...(visibilityNote ? [visibilityNote, ''] : []),
        `Legacy quests: ${legacyQuests.map(q => q.title).join(', ') || 'none'} (the conversion note goes to MEC's own version quest: see rebase.md).`,
        '',
        `Decor: ${count(decor, d => d.typeId) || 'none'}${spec.decor ? ' (created by the generated decor trigger)' : ' (not created: no decor entry in the spec)'}.`,
        '',
        '## Starts',
        '',
        ...(startNotes.length
            ? startNotes.map(n => `- ${n}`)
            : [
                  shrinkStarts
                      ? 'All level starts stand on walk tiles only.'
                      : "The level starts are the old map's own, kept as they are, and none of them holds a death tile.",
              ]),
        '',
        '## Warnings',
        '',
        ...(warnings.length ? warnings.map(w => `- ${w}`) : ['None.']),
        '',
    ].join('\n')
)
fs.writeFileSync(path.join(workDir, 'decor.json'), JSON.stringify(decor, null, 2))

console.info(fs.readFileSync(path.join(workDir, 'gamedata.md'), 'utf8'))
