import {
    getUdgCasterTypes,
    getUdgEscapers,
    getUdgLevels,
    getUdgMonsterTypes,
    getUdgTerrainTypes
} from "../../../../globals";
import {Text} from "../../01_libraries/Text";
import {PushTerrainDataIntoJson} from "./Save_terrain";
import {initSaveLoad} from "../../../Utils/SaveLoad/SaveLoad";
import {jsonEncode} from "../../01_libraries/Basic_functions";
import {MEC_SMIC_DATA_FILE_DATE_TPL} from "../../01_libraries/Constants";

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

        //save levels
        jsonGameData.levels = getUdgLevels().toJson()
        Text.A("levels saved")

        //output
        return {
            terrain: jsonTerrain,
            gameData: jsonGameData
        }
    }

    public static smic = (p: player | null = null) => {
        const SaveLoad = initSaveLoad()

        if(p === null || GetLocalPlayer() == p) {
            const filename = MEC_SMIC_DATA_FILE_DATE_TPL.replace('[date]', os.date("%Y-%m-%d_%H-%M-%S"))

            const json = SaveMapInCache.gameAsJson()

            SaveLoad.saveFile(filename, p, jsonEncode(json))

            Text.A('saving game data to file "' + filename + '" done')
        }
    }
}
