const initRandomizeTerrains = () => {
    // needs AllTerrainFunctions, TerrainModifyingTrig

    // TODO; Used to be private
    let oldTerrainTypes: Array<number> = []
    // TODO; Used to be private
    let newTerrainTypes: Array<number> = []
    // TODO; Used to be private
    let lastTerrainArrayId: number

    const RandomizeTerrains_Actions = (): void => {
        let x: number
        let terrainTypeId: number
        let done: boolean
        let j: number
        let i = 1
        //loop
        //exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
        x = MAP_MIN_X
        while (true) {
            if (x > MAP_MAX_X) break
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
        if (y > MAP_MAX_Y) {
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
        StopEnabledCheckTerrainTriggers()
        TriggerClearActions(gg_trg_Terrain_modifying_trig)
        TriggerAddAction(gg_trg_Terrain_modifying_trig, RandomizeTerrains_Actions)
        y = MAP_MIN_Y
        EnableTrigger(gg_trg_Terrain_modifying_trig)
        terrainModifyWorking = true
    }

    const RandomizeTerrains = (): void => {
        let i: number
        let n: number
        let isTaken: Array<boolean> = []
        let terrainTypes: Array<TerrainType> = []

        if (terrainModifyWorking) {
            Text.erA("can't execute two commands of this type simultaneously !")
            return
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

        i = 0
        while (true) {
            if (i > lastTerrainArrayId) break
            isTaken[i] = false
            i = i + 1
        }

        i = 0
        while (true) {
            if (i > lastTerrainArrayId) break
            while (true) {
                n = GetRandomInt(0, lastTerrainArrayId)
                if (!isTaken[n]) break
            }
            isTaken[n] = true
            newTerrainTypes[i] = oldTerrainTypes[n]
            i = i + 1
        }

        StartTerrainModifying()

        i = 0
        while (true) {
            if (i > lastTerrainArrayId) break
            terrainTypes[i].setTerrainTypeId(newTerrainTypes[i])
            i = i + 1
        }
    }
}
