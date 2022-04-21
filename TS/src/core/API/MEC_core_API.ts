import {LoadMapFromCache} from "../07_TRIGGERS/Load_map_from_gamecache/LoadMapFromCache";
import {errorHandler} from "../../Utils/mapUtils";
import {makingRightsToAll} from "../06_COMMANDS/Rights/manage_rights";
import {getUdgEscapers, getUdgLevels, getUdgTerrainTypes} from "../../../globals";

export const MEC_core_API = {
    setGameData: (jsonString: string) => {
        errorHandler(() => {
            LoadMapFromCache.gameDataJsonString = jsonString
            LoadMapFromCache.initializeGameData()
        })()
    },

    makingRightsToAll: () => {
        makingRightsToAll()
    },

    getEscapers: () => getUdgEscapers(),
    getTerrainTypes: () => getUdgTerrainTypes(),
    getLevels: () => getUdgLevels()
}