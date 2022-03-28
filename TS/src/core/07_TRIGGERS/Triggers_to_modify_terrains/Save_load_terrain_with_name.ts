const initSaveLoadTerrainWithName = () => {
    // needs AllTerrainFunctions, TerrainModifyingTrig

    // TODO; Used to be private
    let saveNameInt: number
    // TODO; Used to be private
    let terrainSaves = InitHashtable()
    // TODO; Used to be private
    let terrainSave_id: number

    //save terrain

    // TODO; Used to be private
    const SaveTerrain_Actions = (): void => {
        let x = MAP_MIN_X
        while (true) {
            if (x > MAP_MAX_X) break
            //call Text.A("avant")
            SaveInteger(terrainSaves, saveNameInt, terrainSave_id, integer(udg_terrainTypes.getTerrainType(x, y)))
            //call Text.A("après")
            terrainSave_id = terrainSave_id + 1
            x = x + LARGEUR_CASE
        }

        y = y + LARGEUR_CASE
        if (y > MAP_MAX_Y) {
            terrainModifyWorking = false
            DisableTrigger(GetTriggeringTrigger())
            Text.mkA('Terrain saved')
            return
        }
    }

    const SaveTerrainWithName = (saveName: string): void => {
        if (terrainModifyWorking) {
            Text.erA("can't execute two commands of this type simultaneously !")
            return
        }
        saveNameInt = StringHash(saveName)
        TriggerClearActions(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        TriggerAddAction(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig, SaveTerrain_Actions)
        terrainSave_id = 0
        y = MAP_MIN_Y
        EnableTrigger(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        terrainModifyWorking = true
    }

    const DeleteTerrainSaveWithName = (saveName: string): boolean => {
        if (terrainModifyWorking) {
            Text.erA("can't execute two commands of this type simultaneously !")
            return false
        }
        saveNameInt = StringHash(saveName)
        if (!HaveSavedInteger(terrainSaves, saveNameInt, 0)) {
            return false
        }
        FlushChildHashtable(terrainSaves, saveNameInt)
        return true
    }

    //load terrain

    // TODO; Used to be private
    const LoadTerrain_Actions = (): void => {
        let terrainType: TerrainType
        let x: number
        //local integer i = 1
        //loop
        //exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
        x = MAP_MIN_X
        while (true) {
            if (x > MAP_MAX_X) break
            terrainType = TerrainType(LoadInteger(terrainSaves, saveNameInt, terrainSave_id))
            if (terrainType !== 0) {
                ChangeTerrainType(x, y, terrainType.getTerrainTypeId())
            }
            terrainSave_id = terrainSave_id + 1
            x = x + LARGEUR_CASE
        }
        y = y + LARGEUR_CASE
        if (y > MAP_MAX_Y) {
            TerrainModifyingTrig.RestartEnabledCheckTerrainTriggers()
            Text.mkA('Terrain loaded')
            DisableTrigger(GetTriggeringTrigger())
            terrainModifyWorking = false
            return
        }
        //i = i + 1
        //endloop
    }

    const LoadTerrainWithName = (saveName: string): boolean => {
        if (terrainModifyWorking) {
            Text.erA("can't execute two commands of this type simultaneously !")
            return true
        }
        saveNameInt = StringHash(saveName)
        if (!HaveSavedInteger(terrainSaves, saveNameInt, 0)) {
            return false
        }
        TriggerClearActions(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        TriggerAddAction(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig, LoadTerrain_Actions)
        terrainSave_id = 0
        y = MAP_MIN_Y
        EnableTrigger(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        terrainModifyWorking = true
        TerrainModifyingTrig.StopEnabledCheckTerrainTriggers()
        return true
    }
}
