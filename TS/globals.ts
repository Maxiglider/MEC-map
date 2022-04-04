import type { CasterTypeArray } from './src/core/04_STRUCTURES/Caster/CasterTypeArray'
import type { MonsterTypeArray } from './src/core/04_STRUCTURES/Monster/MonsterTypeArray'
import type { TerrainTypeArray } from './src/core/04_STRUCTURES/TerrainType/TerrainTypeArray'
import type { EscaperArray } from './src/core/04_STRUCTURES/Escaper/EscaperArray'
import type {LevelArray} from "./src/core/04_STRUCTURES/Level/LevelArray";
import type {Monster} from "./src/core/04_STRUCTURES/Monster/Monster";


//GLOBALS

const globals: {
    escapers?: EscaperArray,
    levels?: LevelArray,
    terrainTypes?: TerrainTypeArray,
    casterTypes?: CasterTypeArray,
    monsterTypes?: MonsterTypeArray
} = {}




//SETTERS - GETTERS

//Escapers
export const setUdgEscapers = (escaperArray: EscaperArray) => {
    globals.escapers = escaperArray
}

export const getUdgEscapers = (): EscaperArray => {
    if(!globals.escapers) throw "globals.escapers called before init"
    return globals.escapers
}


//Levels
export const setUdgLEvels = (la: LevelArray) => {
    globals.levels = la
}

export const getUdgLevels = (): LevelArray => {
    if(!globals.levels) throw "globals.levels called before init"
    return globals.levels
}


//Terrain types
export const setUdgTerrainTypes = (tta: TerrainTypeArray) => {
    globals.terrainTypes = tta
}

export const getUdgTerrainTypes = (): TerrainTypeArray => {
    if(!globals.terrainTypes) throw "globals.terrainTypes called before init"
    return globals.terrainTypes
}


//Caster types
export const setUdgCasterTypes = (cta: CasterTypeArray) => {
    globals.casterTypes = cta
}

export const getUdgCasterTypes = (): CasterTypeArray => {
    if(!globals.casterTypes) throw "globals.casterTypes called before init"
    return globals.casterTypes
}


//Monster types
export const setUdgMonsterTypes = (mta: MonsterTypeArray) => {
    globals.monsterTypes = mta
}

export const getUdgMonsterTypes = (): MonsterTypeArray => {
    if(!globals.monsterTypes) throw "globals.monsterTypes called before init"
    return globals.monsterTypes
}


//Monsters
export const udg_monsters: Monster[] = []
