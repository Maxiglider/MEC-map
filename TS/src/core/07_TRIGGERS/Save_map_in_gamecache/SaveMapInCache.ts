import { MemoryHandler } from 'Utils/MemoryHandler'
import { Constants } from 'core/01_libraries/Constants'
import { SaveLoad } from 'core/04_STRUCTURES/Escaper/Escaper_StartCommands'
import { getUdgCasterTypes, getUdgLevels, getUdgMonsterTypes, getUdgTerrainTypes, globals } from '../../../../globals'
import { PROD } from '../../../env'
import { jsonEncode } from '../../01_libraries/Basic_functions'
import { Text } from '../../01_libraries/Text'
import { Gravity } from '../Slide_and_CheckTerrain_triggers/Gravity'
import { PushTerrainDataIntoJson } from './Save_terrain'

export class SaveMapInCache {
    public static lastSaveFile = ''

    private static gameAsJsonString = () => {
        //old
        const jsonTerrain = MemoryHandler.getEmptyObject<any>()
        const jsonGameData = MemoryHandler.getEmptyObject<any>()

        //FOR TERRAIN FILE W3E
        //terrain types, order, height
        PushTerrainDataIntoJson(jsonTerrain)
        Text.A('map terrain saved')

        //FOR GAME DATA
        jsonGameData.gameData = MemoryHandler.getEmptyObject<any>()
        jsonGameData.gameData.USE_VTOTO_SLIDE_LOGIC = globals.USE_VTOTO_SLIDE_LOGIC
        jsonGameData.gameData.coopCircles = globals.coopCircles
        jsonGameData.gameData.CAN_TURN_IN_AIR = globals.CAN_TURN_IN_AIR
        jsonGameData.gameData.canSlideOverPathingBlockers = globals.canSlideOverPathingBlockers
        jsonGameData.gameData.animOnRevive = globals.animOnRevive
        jsonGameData.gameData.wanderMinTime = globals.wanderMinTime
        jsonGameData.gameData.wanderExtraTime = globals.wanderExtraTime
        jsonGameData.gameData.gravity = Gravity.GetRealGravity()

        //terrain config
        jsonGameData.terrainTypesMec = getUdgTerrainTypes().toJson()
        Text.A('MEC terrain configuration saved')

        //monster types
        jsonGameData.monsterTypes = getUdgMonsterTypes().toJson()
        Text.A('monster types saved')

        //caster types
        jsonGameData.casterTypes = getUdgCasterTypes().toJson()
        Text.A('caster types saved')

        //save levels
        jsonGameData.levels = getUdgLevels().toJson()
        Text.A('levels saved')

        //output
        const objData = MemoryHandler.getEmptyObject<{ [x: string]: any }>()
        objData['terrain'] = jsonTerrain
        objData['gameData'] = jsonGameData

        const output = jsonEncode(objData)
        MemoryHandler.destroyObject(objData)

        return output
    }

    private static smicStringObj = { str: '' }

    public static smic = (p: player | null = null, fileName?: string) => {
        if (p === null || GetLocalPlayer() == p) {
            const startTime = os.clock()

            const filename =
                fileName || Constants.MEC_SMIC_DATA_FILE_DATE_TPL.replace('[date]', os.date('%Y-%m-%d_%H-%M-%S'))

            SaveMapInCache.smicStringObj.str = SaveMapInCache.gameAsJsonString()

            SaveMapInCache.lastSaveFile = filename

            SaveLoad.saveFileWithoutPossibleLoading(filename, p, SaveMapInCache.smicStringObj.str, false)

            Text.A('saving game data to file "' + filename + '" done')

            const time = os.clock() - startTime

            Text.mkA('SMIC done in ' + time + ' s')
        }
    }
}
