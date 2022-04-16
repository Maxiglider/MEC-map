import {LoadMapFromCache} from "../07_TRIGGERS/Load_map_from_gamecache/LoadMapFromCache";
import {errorHandler} from "../../Utils/mapUtils";


export const MEC_core_API = {
    setGameData: (jsonString: string) => {
        errorHandler(() => {
            LoadMapFromCache.gameDataJsonString = jsonString
            LoadMapFromCache.initializeGameData()
        })()
    }
}