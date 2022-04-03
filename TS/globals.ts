import type { CasterTypeArray } from './src/core/04_STRUCTURES/Caster/CasterTypeArray'
import type { MonsterTypeArray } from './src/core/04_STRUCTURES/Monster/MonsterTypeArray'
import type { TerrainTypeArray } from './src/core/04_STRUCTURES/TerrainType/TerrainTypeArray'
import type { EscaperArray } from './src/core/04_STRUCTURES/Escaper/EscaperArray'
import type {LevelArray} from "./src/core/04_STRUCTURES/Level/LevelArray";
import type {Monster} from "./src/core/04_STRUCTURES/Monster/Monster";



//Escapers
let udg_escapers: EscaperArray

export const setUdgEscapers = (escaperArray: EscaperArray) => {
    udg_escapers = escaperArray
}

export const getUdgEscapers = () => {
    return udg_escapers
}


//Levels
let udg_levels: LevelArray

export const setUdgLEvels = (la: LevelArray) => {
    if(!udg_levels) {
        udg_levels = la
    }
}

export const getUdgLevels = () => {
    return udg_levels
}


//Terrain types
let udg_terrainTypes: TerrainTypeArray

export const setUdgTerrainTypes = (tta: TerrainTypeArray) => {
    udg_terrainTypes = tta
}

export const getUdgTerrainTypes = () => {
    return udg_terrainTypes
}


//Caster types
let udg_casterTypes: CasterTypeArray

export const setUdgCasterTypes = (cta: CasterTypeArray) => {
    udg_casterTypes = cta
}

export const getUdgCasterTypes = () => {
    return udg_casterTypes
}


//Monster types
let udg_monsterTypes: MonsterTypeArray

export const setUdgMonsterTypes = (mta: MonsterTypeArray) => {
    udg_monsterTypes = mta
}

export const getUdgMonsterTypes = () => {
    return udg_monsterTypes
}


//Monsters
export let udg_monsters: Monster[] = []
