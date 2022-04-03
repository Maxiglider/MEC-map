import { CasterTypeArray } from './src/core/04_STRUCTURES/Caster/CasterTypeArray'
import { MonsterTypeArray } from './src/core/04_STRUCTURES/Monster/MonsterTypeArray'
import { TerrainTypeArray } from './src/core/04_STRUCTURES/TerrainType/TerrainTypeArray'

export let udg_terrainTypes: TerrainTypeArray
export let udg_monsterTypes: MonsterTypeArray
export let udg_casterTypes: CasterTypeArray


export function init_globals(){
    udg_terrainTypes = new TerrainTypeArray()
    udg_monsterTypes = new MonsterTypeArray()
    udg_casterTypes = new CasterTypeArray()
}
