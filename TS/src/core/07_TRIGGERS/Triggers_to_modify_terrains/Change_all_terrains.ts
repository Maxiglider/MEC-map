import {Constants, LARGEUR_CASE, NB_MAX_OF_TERRAINS} from 'core/01_libraries/Constants'
import {Text} from 'core/01_libraries/Text'
import {TerrainType} from 'core/04_STRUCTURES/TerrainType/TerrainType'
import {Globals} from 'core/09_From_old_Worldedit_triggers/globals_variables_and_triggers'
import {getUdgTerrainTypes} from '../../../../globals'
import {errorHandler} from '../../../Utils/mapUtils'
import {ChangeTerrainType} from '../Modify_terrain_Functions/Modify_terrain_functions'
import {
    AddNewTerrain,
    GetRandomNotUsedTerrain,
    GetRandomTerrain,
    GetRandomUsedTerrain,
    IsTerrainAlreadyUsed,
} from '../Modify_terrain_Functions/Terrain_functions'
import {TerrainModifyingTrig} from './Terrain_modifying_trig'
import {TerrainTypeMax} from "../Modify_terrain_Functions/Terrain_type_max";
import {log} from "../../../../../core/Log/log";

const initChangeAllTerrains = () => {
    let oldTerrainTypes: number[] = []
    let newTerrainTypes: number[] = []
    let lastTerrainArrayId: number
    let nbNewTerrains: number
    let nbNewTerrainsAllowed: number
    let udg_changeAllTerrainsAtRevive = false
    let terrainModifyWorking = false
    let getTerrainNbEach: number[] = []

    const ModifyTerrain = () => {
        let y = Constants.MAP_MIN_Y

        let x: number
        let terrainTypeId: number
        let done: boolean
        let j: number

        while (y <= Constants.MAP_MAX_Y) {
            x = Constants.MAP_MIN_X

            while (x <= Constants.MAP_MAX_X) {
                terrainTypeId = GetTerrainType(x, y)

                let newGet = false
                const terrainMaxId = TerrainTypeMax.TerrainTypeId2TerrainTypeMaxId(terrainTypeId)
                if (getTerrainNbEach[terrainMaxId]) {
                    getTerrainNbEach[terrainMaxId]++
                } else {
                    getTerrainNbEach[terrainMaxId] = 1
                    newGet = true
                }

                done = false
                j = 0
                while (true) {
                    if (j > lastTerrainArrayId || done) break
                    if (terrainTypeId === oldTerrainTypes[j]) {
                        ChangeTerrainType(x, y, newTerrainTypes[j])
                        done = true
                    }
                    j = j + 1
                }
                x = x + LARGEUR_CASE
            }

            y = y + LARGEUR_CASE
        }
    }

    const GetRandomTerrain_checked = (): number => {
        let i: number
        let rdmTerrain: number
        let alreadyUsed: boolean
        while (true) {
            if (nbNewTerrains >= nbNewTerrainsAllowed) {
                rdmTerrain = GetRandomUsedTerrain()
            } else {
                rdmTerrain = GetRandomTerrain()
            }
            alreadyUsed = false
            i = 0
            while (i <= lastTerrainArrayId && !alreadyUsed) {
                alreadyUsed = newTerrainTypes[i] === rdmTerrain
                i = i + 1
            }
            if (!alreadyUsed) break
        }
        if (!IsTerrainAlreadyUsed(rdmTerrain)) {
            nbNewTerrains = nbNewTerrains + 1
        }
        return rdmTerrain
    }

    const GetRandomKnownTerrain_checked = (): number => {
        let i: number
        let rdmTerrain: number
        let alreadyUsed: boolean
        while (true) {
            rdmTerrain = GetRandomUsedTerrain()
            alreadyUsed = false
            i = 0
            while (true) {
                if (i > lastTerrainArrayId || alreadyUsed) break
                alreadyUsed = newTerrainTypes[i] === rdmTerrain
                i = i + 1
            }
            if (!alreadyUsed) break
        }
        return rdmTerrain
    }

    const GetRandomNotKnownTerrain_checked = (): number => {
        let i: number
        let rdmTerrain: number
        let alreadyUsed: boolean
        while (true) {
            rdmTerrain = GetRandomNotUsedTerrain()
            alreadyUsed = false
            i = 0
            while (true) {
                if (i > lastTerrainArrayId || alreadyUsed) break
                alreadyUsed = newTerrainTypes[i] === rdmTerrain
                i = i + 1
            }
            if (!alreadyUsed) break
        }
        return rdmTerrain
    }

    const ChangeAllTerrains = (mode = "normal"): boolean => {
        oldTerrainTypes = []
        newTerrainTypes = []
        lastTerrainArrayId = 0
        nbNewTerrains = 0
        nbNewTerrainsAllowed = 0
        udg_changeAllTerrainsAtRevive = false
        terrainModifyWorking = false
        getTerrainNbEach = []


        //modes : normal, known, notKnown
        let terrainTypes: TerrainType[] = []
        let n: number
        let i: number

        if (terrainModifyWorking) {
            Text.erA("can't execute two commands of this type simultaneously !")
            return false
        }

        n = 0
        const allTT = getUdgTerrainTypes().getAll()
        allTT.map(TT => {
            oldTerrainTypes[n] = TT.getTerrainTypeId()
            n++
        })

        lastTerrainArrayId = n - 1
        nbNewTerrainsAllowed = NB_MAX_OF_TERRAINS - Globals.udg_nb_used_terrains

        if (mode === 'normal') {
            nbNewTerrains = 0
            i = 0
            while (true) {
                if (i > lastTerrainArrayId) break
                newTerrainTypes[i] = GetRandomTerrain_checked()
                i = i + 1
            }
        } else if (mode === 'known') {
            i = 0
            while (true) {
                if (i > lastTerrainArrayId) break
                newTerrainTypes[i] = GetRandomKnownTerrain_checked()
                i = i + 1
            }
        } else if (mode === 'notKnown') {
            nbNewTerrains = lastTerrainArrayId + 1
            if (nbNewTerrains > nbNewTerrainsAllowed) {
                return false
            }
            i = 0
            while (true) {
                if (i > lastTerrainArrayId) break
                newTerrainTypes[i] = GetRandomNotKnownTerrain_checked()
                i = i + 1
            }
        }

        ModifyTerrain()


        n = 0
        allTT.map(TT => {
            TT.setTerrainTypeId(newTerrainTypes[n])
            AddNewTerrain(newTerrainTypes[n])
            n++
        })

        return true
    }

    return {udg_changeAllTerrainsAtRevive, ChangeAllTerrains}
}

export const ChangeAllTerrains = initChangeAllTerrains()
