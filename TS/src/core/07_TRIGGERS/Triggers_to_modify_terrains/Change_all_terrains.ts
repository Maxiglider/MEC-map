import { Constants, LARGEUR_CASE } from 'core/01_libraries/Constants'

const initChangeAllTerrains = () => {
  
    // TODO; Used to be private
    let oldTerrainTypes: Array<number> = []
    // TODO; Used to be private
    let newTerrainTypes: Array<number> = []
    // TODO; Used to be private
    let lastTerrainArrayId: number
    // TODO; Used to be private
    let nbNewTerrains: number
    // TODO; Used to be private
    let nbNewTerrainsAllowed: number
    let udg_changeAllTerrainsAtRevive = false

    const ChangeAllTerrains_Actions = (): void => {
        let x: number
        let terrainTypeId: number
        let done: boolean
        let j: number
        //local integer i = 1
        //loop
        //exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
        x = Constants.MAP_MIN_X
        while (true) {
            if (x > Constants.MAP_MAX_X) break
            terrainTypeId = GetTerrainType(x, y)
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
        if (y > Constants.MAP_MAX_Y) {
            DisableTrigger(GetTriggeringTrigger())
            RestartEnabledCheckTerrainTriggers()
            terrainModifyWorking = false
            return
        }
        //i = i + 1
        //endloop
    }

    // TODO; Used to be private
    const StartTerrainModifying = (): void => {
        y = Constants.MAP_MIN_Y
        StopEnabledCheckTerrainTriggers()
        TriggerClearActions(gg_trg_Terrain_modifying_trig)
        TriggerAddAction(gg_trg_Terrain_modifying_trig, ChangeAllTerrains_Actions)
        EnableTrigger(gg_trg_Terrain_modifying_trig)
        terrainModifyWorking = true
    }

    // TODO; Used to be private
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
            while (true) {
                if (i > lastTerrainArrayId || alreadyUsed) break
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

    // TODO; Used to be private
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

    // TODO; Used to be private
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

    const ChangeAllTerrains = (mode: string): boolean => {
        //modes : normal, known, notKnown
        let terrainTypes: Array<TerrainType> = []
        let n: number
        let i: number

        if (terrainModifyWorking) {
            Text.erA("can't execute two commands of this type simultaneously !")
            return false
        }

        n = 0
        i = 0
        while (true) {
            terrainTypes[n] = udg_terrainTypes.getWalk(i)
            if (terrainTypes[n] === 0) break
            oldTerrainTypes[n] = terrainTypes[n].getTerrainTypeId()
            n = n + 1
            i = i + 1
        }
        i = 0
        while (true) {
            terrainTypes[n] = udg_terrainTypes.getDeath(i)
            if (terrainTypes[n] === 0) break
            oldTerrainTypes[n] = terrainTypes[n].getTerrainTypeId()
            n = n + 1
            i = i + 1
        }
        i = 0
        while (true) {
            terrainTypes[n] = udg_terrainTypes.getSlide(i)
            if (terrainTypes[n] === 0) break
            oldTerrainTypes[n] = terrainTypes[n].getTerrainTypeId()
            n = n + 1
            i = i + 1
        }

        lastTerrainArrayId = n - 1
        nbNewTerrainsAllowed = NB_MAX_OF_TERRAINS - udg_nb_used_terrains

        if (mode === 'normal') {
            nbNewTerrains = 0
            i = 0
            while (true) {
                if (i > lastTerrainArrayId) break
                newTerrainTypes[i] = GetRandomTerrain_checked()
                i = i + 1
            }
        } else {
            if (mode === 'known') {
                i = 0
                while (true) {
                    if (i > lastTerrainArrayId) break
                    newTerrainTypes[i] = GetRandomKnownTerrain_checked()
                    i = i + 1
                }
            } else {
                if (mode === 'notKnown') {
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
            }
        }

        StartTerrainModifying()

        i = 0
        while (true) {
            if (i > lastTerrainArrayId) break
            terrainTypes[i].setTerrainTypeId(newTerrainTypes[i])
            AddNewTerrain(newTerrainTypes[i])
            i = i + 1
        }

        //call DisplayTextToForce(GetPlayersAll(), " ")
        //call DisplayTextToForce(GetPlayersAll(), udg_colorCode[TEAL] + "       All terrains changed !")
        //i = 0
        //loop
        //    exitwhen (i > lastTerrainArrayId)
        //        call Text.A(udg_colorCode[RED] + GetTerrainData(newTerrainTypes[i]))
        //    i = i + 1
        //endloop

        return true
    }

    return {ChangeAllTerrains}
}

export const ChangeAllTerrains = initChangeAllTerrains()