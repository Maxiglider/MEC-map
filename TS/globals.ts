import type { CasterTypeArray } from './src/core/04_STRUCTURES/Caster/CasterTypeArray'
import type { EscaperArray } from './src/core/04_STRUCTURES/Escaper/EscaperArray'
import type { LevelArray } from './src/core/04_STRUCTURES/Level/LevelArray'
import type { Monster } from './src/core/04_STRUCTURES/Monster/Monster'
import type { MonsterTypeArray } from './src/core/04_STRUCTURES/Monster/MonsterTypeArray'
import type { TerrainTypeArray } from './src/core/04_STRUCTURES/TerrainType/TerrainTypeArray'

//GLOBALS

export const globals: {
    escapers?: EscaperArray
    levels?: LevelArray
    terrainTypes?: TerrainTypeArray
    casterTypes?: CasterTypeArray
    monsterTypes?: MonsterTypeArray
    coopModeActive?: boolean
    autoreviveDelay?: number
    logStrings: string[]
    MAP_MIN_X: number
    MAP_MAX_X: number
    MAP_MIN_Y: number
    MAP_MAX_Y: number,
    CAN_TURN_IN_AIR: boolean
} = {
    logStrings: [],
    MAP_MIN_X: 0,
    MAP_MAX_X: 0,
    MAP_MIN_Y: 0,
    MAP_MAX_Y: 0,
    coopModeActive: true,
    CAN_TURN_IN_AIR: false
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

//Monsters
export const udg_monsters: { [x: number]: Monster } = {}
