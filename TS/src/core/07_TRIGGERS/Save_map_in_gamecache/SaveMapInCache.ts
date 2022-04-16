import {
    getUdgCasterTypes,
    getUdgEscapers,
    getUdgLevels,
    getUdgMonsterTypes,
    getUdgTerrainTypes
} from "../../../../globals";
import {Text} from "../../01_libraries/Text";
import {PushTerrainDataIntoJson} from "./Save_terrain";
import {SyncSaveLoad} from "../../../Utils/SaveLoad/TreeLib/SyncSaveLoad";
import {initSaveLoad} from "../../../Utils/SaveLoad/SaveLoad";
import {jsonEncode} from "../../01_libraries/Basic_functions";

export class SaveMapInCache {

    private static gameAsJson = () => {
        const jsonTerrain: {[x: string]: any} = {}
        const jsonGameData: {[x: string]: any} = {}

        //FOR TERRAIN FILE W3E
        //terrain types, order, height
        PushTerrainDataIntoJson(jsonTerrain)

        //FOR GAME DATA

        //terrain config
        Object.assign(jsonGameData, getUdgTerrainTypes().toJson())
        Text.A('terrain configuration saved')

        //monster types
        jsonGameData.monsterTypes = getUdgMonsterTypes().toJson()
        Text.A('monster types saved')

        //caster types
        jsonGameData.casterTypes = getUdgCasterTypes().toJson()
        Text.A('caster types saved')

        //destroy makes and saved actions to avoid deleted monsters to recreate
        getUdgEscapers().forMainEscapers(escaper => {
            escaper.destroyMake()
            escaper.destroyAllSavedActions()
        })

        //save levels
        jsonGameData.levels = getUdgLevels().toJson()
        Text.A("levels saved")

        //output
        return {
            terrain: jsonTerrain,
            gameData: jsonGameData
        }
    }

    public static smic = () => {
        const json = SaveMapInCache.gameAsJson()

        const SaveLoad = initSaveLoad()
        SaveLoad.saveFile('mec_data.txt', null, jsonEncode(json))

        Text.A('saving game data to file "mec_data.txt" done')
    }
}
