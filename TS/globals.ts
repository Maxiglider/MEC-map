import { CasterTypeArray } from './src/core/04_STRUCTURES/Caster/CasterTypeArray'
import { MonsterTypeArray } from './src/core/04_STRUCTURES/Monster/MonsterTypeArray'
import { TerrainTypeArray } from './src/core/04_STRUCTURES/TerrainType/TerrainTypeArray'
import type { EscaperArray } from './src/core/04_STRUCTURES/Escaper/EscaperArray'
import type {LevelArray} from "./src/core/04_STRUCTURES/Level/LevelArray";

export let udg_terrainTypes: TerrainTypeArray
export let udg_monsterTypes: MonsterTypeArray
export let udg_casterTypes: CasterTypeArray


export function init_globals(){
    udg_terrainTypes = new TerrainTypeArray()
    udg_monsterTypes = new MonsterTypeArray()
    udg_casterTypes = new CasterTypeArray()
}


export let udg_escapers: EscaperArray

export const setUdgEscapers = (escaperArray: EscaperArray) => {
    udg_escapers = escaperArray
}


export let udg_levels: LevelArray

export const setUdgLEvels = (la: LevelArray) => {
    if(!udg_levels) {
        udg_levels = la
    }
}