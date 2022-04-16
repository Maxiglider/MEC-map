import {LoadMapFromCache} from "../07_TRIGGERS/Load_map_from_gamecache/LoadMapFromCache";


export const MEC_core_API = {
    setGameData: (jsonString: string) => {
        LoadMapFromCache.gameDataJsonString = jsonString
    }
}