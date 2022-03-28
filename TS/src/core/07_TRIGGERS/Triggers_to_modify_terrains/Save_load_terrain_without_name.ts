const initSaveLoadTerrainWithoutName = () => {
    // needs AllTerrainFunctions, TerrainModifyingTrig

    // TODO; Used to be private
    let terrainSave: Array<TerrainType> = []
    // TODO; Used to be private
    let terrainSave_id: number

    //save terrain

    // TODO; Used to be private
    const SaveTerrain_Actions = (): void => {
        let x = MAP_MIN_X
        while (true) {
            if (x > MAP_MAX_X) break
            terrainSave[terrainSave_id] = udg_terrainTypes.getTerrainType(x, y)
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

    const SaveTerrainWithoutName = (): void => {
        if (terrainModifyWorking) {
            Text.erA("can't execute two commands of this type simultaneously !")
            return
        }
        TriggerClearActions(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        TriggerAddAction(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig, SaveTerrain_Actions)
        terrainSave_id = 0
        y = MAP_MIN_Y
        EnableTrigger(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        terrainModifyWorking = true
    }

    //load terrain

    // TODO; Used to be private
    const LoadTerrain_Actions = (): void => {
        let x: number
        //local integer i = 1
        //loop
        //exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
        x = MAP_MIN_X
        while (true) {
            if (x > MAP_MAX_X) break
            if (terrainSave[terrainSave_id] !== 0) {
                ChangeTerrainType(x, y, terrainSave[terrainSave_id].getTerrainTypeId())
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

    const LoadTerrainWithoutName = (): void => {
        if (terrainModifyWorking) {
            Text.erA("can't execute two commands of this type simultaneously !")
            return
        }
        TriggerClearActions(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        TriggerAddAction(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig, LoadTerrain_Actions)
        terrainSave_id = 0
        y = MAP_MIN_Y
        EnableTrigger(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        terrainModifyWorking = true
        TerrainModifyingTrig.StopEnabledCheckTerrainTriggers()
    }
}
