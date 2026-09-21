import { EscaperArray } from 'core/04_STRUCTURES/Escaper/EscaperArray'
import {
    setUdgCasterTypes,
    setUdgEscapers,
    setUdgLevels,
    setUdgMonsterTypes,
    setUdgTerrainSaves,
    setUdgTerrainTypes,
    setUdgVisibilityTypes,
} from '../../../globals'
import { CasterTypeArray } from '../04_STRUCTURES/Caster/CasterTypeArray'
import { LevelArray } from '../04_STRUCTURES/Level/LevelArray'
import { MonsterTypeArray } from '../04_STRUCTURES/Monster/MonsterTypeArray'
import { TerrainSaveArray } from '../04_STRUCTURES/TerrainSave/TerrainSaveArray'
import { TerrainTypeArray } from '../04_STRUCTURES/TerrainType/TerrainTypeArray'
import { setPartitionWarningHandler } from '../04_STRUCTURES/Visibility/VisibilityPartition'
import { VisibilityTypeArray } from '../04_STRUCTURES/Visibility/VisibilityTypeArray'
import { log } from '../Log/log'

//Escapers
const initEscapers = () => {
    setUdgEscapers(new EscaperArray())
}

//Levels
export const initLevels = () => {
    setUdgLevels(new LevelArray())
}

//Terrain types
export const initTerrainTypes = () => {
    setUdgTerrainTypes(new TerrainTypeArray())
}

//Visibility types
export const initVisibilityTypes = () => {
    // the partition keeps no import of its own, so that the conversion tooling can run it too: its safety net is
    // wired to the game's log from here
    setPartitionWarningHandler(log)
    setUdgVisibilityTypes(new VisibilityTypeArray())
}

//Monster types
export const initMonsterTypes = () => {
    setUdgMonsterTypes(new MonsterTypeArray())
}

//Caster types
export const initCasterTypes = () => {
    setUdgCasterTypes(new CasterTypeArray())
}

//Terrain saves
export const initTerrainSaves = () => {
    setUdgTerrainSaves(new TerrainSaveArray())
}

//Init all arrays
export const initArrays = () => {
    initEscapers()
    initLevels()
    initTerrainTypes()
    initVisibilityTypes()
    initMonsterTypes()
    initCasterTypes()
    initTerrainSaves()
}
