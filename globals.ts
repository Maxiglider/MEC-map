import { Constants } from './src/core/01_libraries/Constants'
import type { CasterTypeArray } from './src/core/04_STRUCTURES/Caster/CasterTypeArray'
import type { EscaperArray } from './src/core/04_STRUCTURES/Escaper/EscaperArray'
import type { LevelArray } from './src/core/04_STRUCTURES/Level/LevelArray'
import type { Monster } from './src/core/04_STRUCTURES/Monster/Monster'
import type { MonsterType } from './src/core/04_STRUCTURES/Monster/MonsterType'
import type { MonsterTypeArray } from './src/core/04_STRUCTURES/Monster/MonsterTypeArray'
import type { TerrainSaveArray } from './src/core/04_STRUCTURES/TerrainSave/TerrainSaveArray'
import type { TerrainTypeArray } from './src/core/04_STRUCTURES/TerrainType/TerrainTypeArray'
import { Natives } from './src/core/wc3_natives_unsecured/Natives'

//GLOBALS

export const globals: {
    escapers?: EscaperArray
    levels?: LevelArray
    terrainTypes?: TerrainTypeArray
    casterTypes?: CasterTypeArray
    monsterTypes?: MonsterTypeArray
    terrainSaves?: TerrainSaveArray
    coopModeActive?: boolean
    autoreviveDelay?: number
    logStrings: string[]

    // Map rects data
    MAP_MIN_X: number
    MAP_MAX_X: number
    MAP_MIN_Y: number
    MAP_MAX_Y: number
    ENTIRE_MAP_RECT?: rect
    WORLD_BOUNDS_RECT?: rect

    CAN_TURN_IN_AIR: boolean
    USE_VTOTO_SLIDE_LOGIC: boolean
    coopCircles: boolean
    heroToEscaperHandles: { [heroId: number]: number }
    canSlideOverPathingBlockers: boolean
    animOnRevive: string
    wanderMinTime: number
    wanderExtraTime: number
    forceReviveAtStart: boolean
    killAfkHeroes: boolean
    wanderEffectStr: string
    wanderEffectFacing: boolean
    scoreboardLabel: string
    heroBaseCollisionSize: number
    heroModelPath: string
    heroBaseScale?: number // hero base scale from unit type ID (Worleditor value)
    debugLongDistanceMoves: boolean
} = {
    logStrings: [],

    // Map rects data
    MAP_MIN_X: 0,
    MAP_MAX_X: 0,
    MAP_MIN_Y: 0,
    MAP_MAX_Y: 0,
    ENTIRE_MAP_RECT: undefined,
    WORLD_BOUNDS_RECT: undefined,

    coopModeActive: true,
    CAN_TURN_IN_AIR: false,
    USE_VTOTO_SLIDE_LOGIC: false,
    coopCircles: true,
    heroToEscaperHandles: {},
    canSlideOverPathingBlockers: true,
    animOnRevive: 'channel',
    wanderMinTime: 5,
    wanderExtraTime: 7,
    forceReviveAtStart: false,
    killAfkHeroes: true,
    wanderEffectStr: 'AbilitiesSpellsOtherTalkToMeTalkToMe.mdl',
    wanderEffectFacing: false,
    scoreboardLabel: 'Scoreboard',

    // For old maps retrocompatibility, the MEC_core.setGameData applied won't contain an heroBaseCollisionSize value,
    //    this will be detected and set heroBaseCollisionSize to 0 to keep the same behavior as before
    // Very new maps won't have a MEC_core.setGameData call, so heroBaseCollisionSize will be kept to the value bellow
    // For other maps, those smiced on the version of the add of heroBaseCollisionSize or later, the value set by MEC_core.setGameData will be used
    heroBaseCollisionSize: Constants.RECOMMANDED_HERO_BASE_COLLISION_SIZE,

    // The model the hero is drawn with while an effect stands in for its unit. A map saved before
    // this was saved with it keeps the model of the engine, which is the hero's own.
    heroModelPath: Constants.HERO_MODEL_PATH,
    heroBaseScale: undefined,
    debugLongDistanceMoves: false,
}

export const init_globals = () => {
    globals.ENTIRE_MAP_RECT = Natives.UGetEntireMapRect()
    globals.WORLD_BOUNDS_RECT = Natives.UGetWorldBounds()
}

//SETTERS - GETTERS

//Escapers
export const setUdgEscapers = (escaperArray: EscaperArray) => {
    //print('called setUdgEscapers')
    globals.escapers = escaperArray
}

export const getUdgEscapers = (): EscaperArray => {
    //print('called getUdgEscapers')
    return <EscaperArray>globals.escapers
}

//Levels
export const setUdgLevels = (la: LevelArray) => {
    //print('called setUdgLevels')
    globals.levels = la
}

export const getUdgLevels = (): LevelArray => {
    //print('called getUdgLevels')
    return <LevelArray>globals.levels
}

//Terrain types
export const setUdgTerrainTypes = (tta: TerrainTypeArray) => {
    //print('called setUdgTerrainTypes')
    globals.terrainTypes = tta
}

export const getUdgTerrainTypes = (): TerrainTypeArray => {
    //print('called getUdgTerrainTypes')
    return <TerrainTypeArray>globals.terrainTypes
}

//Caster types
export const setUdgCasterTypes = (cta: CasterTypeArray) => {
    //print('called setUdgCasterTypes')
    globals.casterTypes = cta
}

export const getUdgCasterTypes = (): CasterTypeArray => {
    //print('called getUdgCasterTypes')
    return <CasterTypeArray>globals.casterTypes
}

//Monster types
export const setUdgMonsterTypes = (mta: MonsterTypeArray) => {
    //print('called setUdgMonsterTypes')
    globals.monsterTypes = mta
}

export const getUdgMonsterTypes = (): MonsterTypeArray => {
    //print('called getUdgMonsterTypes')
    return <MonsterTypeArray>globals.monsterTypes
}

//Terrain saves
export const setUdgTerrainSaves = (tsa: TerrainSaveArray) => {
    //print('called setUdgTerrainSaves')
    globals.terrainSaves = tsa
}

export const getUdgTerrainSaves = (): TerrainSaveArray => {
    //print('called getUdgTerrainSaves')
    return <TerrainSaveArray>globals.terrainSaves
}

//Monsters
export const udg_monsters: { [x: number]: Monster } = {}

export const udg_spawned_monsters: { [x: number]: MonsterType | null } = {}

/**
 * The units behind udg_spawned_monsters, which only holds their type: a handle id cannot be
 * turned back into a unit, and the contact check of the async slide has to walk them all,
 * wherever they come from. Both tables are written by the two functions below so that they
 * cannot drift apart, and udg_spawned_monsters keeps the shape the public API exposes.
 *
 * Keyed by the order the units were registered in, which every machine goes through alike - not
 * by their handle id. Lua recycles handle ids on each machine at the pace of its own garbage
 * collector, so the same unit soon has another id on another machine, and a contact telling that
 * id to every machine would name another unit on some of them.
 */
export const udg_spawned_monster_units: { [spawnedMonsterId: number]: unit | null } = {}

/** The registration number of every spawned unit, by handle id: looked up on this machine, never walked nor sent */
const spawnedMonsterIdByHandleId: { [handleId: number]: number } = {}
const spawnedMonsterIds = { last: 0 }

/** The number every machine knows this spawned unit by, while it is registered */
export const getSpawnedMonsterId = (monsterUnit: unit): number | undefined =>
    spawnedMonsterIdByHandleId[GetHandleId(monsterUnit)]

export const registerSpawnedMonster = (monsterUnit: unit, monsterType: MonsterType) => {
    const handleId = GetHandleId(monsterUnit)
    const previousId = spawnedMonsterIdByHandleId[handleId]

    // a recycled unit comes back under the same handle, and under a new number
    if (previousId !== undefined) {
        udg_spawned_monster_units[previousId] = null
    }

    spawnedMonsterIds.last++

    udg_spawned_monsters[handleId] = monsterType
    udg_spawned_monster_units[spawnedMonsterIds.last] = monsterUnit
    spawnedMonsterIdByHandleId[handleId] = spawnedMonsterIds.last
}

export const unregisterSpawnedMonster = (monsterUnit: unit) => {
    const handleId = GetHandleId(monsterUnit)
    const spawnedMonsterId = spawnedMonsterIdByHandleId[handleId]

    udg_spawned_monsters[handleId] = null

    if (spawnedMonsterId !== undefined) {
        udg_spawned_monster_units[spawnedMonsterId] = null
        delete spawnedMonsterIdByHandleId[handleId]
    }
}

/**
 * The hero effect of every escaper is drawn again, so that the new model is seen at once rather
 * than at the next game. Called from a command, which reaches every machine on the same turn.
 */
export const setHeroModelPath = (newModelPath: string) => {
    globals.heroModelPath = newModelPath

    getUdgEscapers()?.forAll(escaper => {
        escaper.refreshHeroEffectModel()
    })
}

export const setHeroBaseCollisionSize = (newCollisionSize: number) => {
    globals.heroBaseCollisionSize = newCollisionSize
    getUdgEscapers().forAll(escaper => {
        escaper.setHeroCollisionSize(newCollisionSize)
    })
}
