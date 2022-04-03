import type { CasterTypeArray } from './src/core/04_STRUCTURES/Caster/CasterTypeArray'
import type { MonsterTypeArray } from './src/core/04_STRUCTURES/Monster/MonsterTypeArray'
import type { TerrainTypeArray } from './src/core/04_STRUCTURES/TerrainType/TerrainTypeArray'
import type { EscaperArray } from './src/core/04_STRUCTURES/Escaper/EscaperArray'
import type {LevelArray} from "./src/core/04_STRUCTURES/Level/LevelArray";



//Escapers
export let udg_escapers: EscaperArray

export const setUdgEscapers = (escaperArray: EscaperArray) => {
    udg_escapers = escaperArray
}


//Levels
export let udg_levels: LevelArray

export const setUdgLEvels = (la: LevelArray) => {
    if(!udg_levels) {
        udg_levels = la
    }
}


//Terrain types
export let udg_terrainTypes: TerrainTypeArray

export const setUdgTerrainTypes = (tta: TerrainTypeArray) => {
    udg_terrainTypes = tta
}


//Monster types
export let udg_monsterTypes: MonsterTypeArray

export const setUdgMonsterTypes = (mta: MonsterTypeArray) => {
    udg_monsterTypes = mta
}


//Caster types
export let udg_casterTypes: CasterTypeArray

export const setUdgCasterTypes = (cta: CasterTypeArray) => {
    udg_casterTypes = cta
}
