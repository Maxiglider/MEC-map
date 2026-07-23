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

export const setHeroBaseCollisionSize = (newCollisionSize: number) => {
    globals.heroBaseCollisionSize = newCollisionSize
    getUdgEscapers().forAll(escaper => {
        escaper.setHeroCollisionSize(newCollisionSize)
    })
}
