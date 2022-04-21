import {LoadMapFromCache} from "../07_TRIGGERS/Load_map_from_gamecache/LoadMapFromCache";
import {errorHandler} from "../../Utils/mapUtils";
import {makingRightsToAll} from "../06_COMMANDS/Rights/manage_rights";
import {getUdgEscapers, getUdgLevels, getUdgMonsterTypes, getUdgTerrainTypes} from "../../../globals";
import {hooks} from "./GeneralHooks";
import {MonsterSimplePatrol} from "../04_STRUCTURES/Monster/MonsterSimplePatrol";

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

    getEscapers: getUdgEscapers,
    getTerrainTypes: getUdgTerrainTypes,
    getLevels: getUdgLevels,
    getMonsterTypes: getUdgMonsterTypes,

    //hooks
    onBeforeCreateMonsterUnit: (cb: () => any) => {
        return hooks.hooks_onBeforeCreateMonsterUnit.new(cb)
    },

    newMonsterSimplePatrol: (...args: any[]) => {
        // @ts-ignore
        return new MonsterSimplePatrol(...args)
    }
}