import { EscaperArray } from 'core/04_STRUCTURES/Escaper/EscaperArray'
import {
    setUdgCasterTypes,
    setUdgEscapers,
    setUdgLevels,
    setUdgMonsterTypes,
    setUdgTerrainTypes
} from "../../../globals";
import {LevelArray} from "../04_STRUCTURES/Level/LevelArray";
import {TerrainTypeArray} from "../04_STRUCTURES/TerrainType/TerrainTypeArray";
import {MonsterTypeArray} from "../04_STRUCTURES/Monster/MonsterTypeArray";
import {CasterTypeArray} from "../04_STRUCTURES/Caster/CasterTypeArray";


//Escapers
const initEscapers = () => {
    setUdgEscapers(new EscaperArray())
}


//Levels
const initLevels = () => {
    setUdgLevels(new LevelArray())
}


//Terrain types
const initTerrainTypes = () => {
    setUdgTerrainTypes(new TerrainTypeArray())
}


//Monster types
const initMonsterTypes = () => {
    setUdgMonsterTypes(new MonsterTypeArray())
}


//Caster types
const initCasterTypes = () => {
    setUdgCasterTypes(new CasterTypeArray())
}



//Init all arrays
export const initArrays = () => {
    initEscapers()
    initLevels()
    initTerrainTypes()
    initMonsterTypes()
    initCasterTypes()
}