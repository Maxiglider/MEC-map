import { SaveLoad } from 'core/04_STRUCTURES/Escaper/Escaper_StartCommands'
import { getUdgCasterTypes, getUdgLevels, getUdgMonsterTypes, getUdgTerrainTypes } from '../../../../globals'
import { ArrayHandler } from '../../../Utils/ArrayHandler'
import {
    clearArrayOrObject,
    getHighestClearedId,
    getNbArraysObjectsCleared,
    resetNbArraysObjectsCleared,
} from '../../../Utils/clearArrayOrObject'
import { ObjectHandler } from '../../../Utils/ObjectHandler'
import { jsonEncode } from '../../01_libraries/Basic_functions'
import { MEC_SMIC_DATA_FILE_DATE_TPL } from '../../01_libraries/Constants'
import { Text } from '../../01_libraries/Text'
import { PushTerrainDataIntoJson } from './Save_terrain'

export class SaveMapInCache {
    public static lastSaveFile = ''

    private static gameAsJsonString = () => {
        //old
        const jsonTerrain = ObjectHandler.getNewObject<any>()
        const jsonGameData = ObjectHandler.getNewObject<any>()

        //FOR TERRAIN FILE W3E
        //terrain types, order, height
        PushTerrainDataIntoJson(jsonTerrain)
        Text.A('map terrain saved')

        //FOR GAME DATA

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
        const objData = ObjectHandler.getNewObject<{ [x: string]: any }>()
        objData['terrain'] = jsonTerrain
        objData['gameData'] = jsonGameData

        const output = jsonEncode(objData)
        clearArrayOrObject(objData)

        return output
    }

    private static smicStringObj = { str: '' }

    public static smic = (p: player | null = null) => {
        if (p === null || GetLocalPlayer() == p) {
            const startTime = os.clock()

            const filename = MEC_SMIC_DATA_FILE_DATE_TPL.replace('[date]', os.date('%Y-%m-%d_%H-%M-%S'))

            SaveMapInCache.smicStringObj.str = SaveMapInCache.gameAsJsonString()

            SaveMapInCache.lastSaveFile = filename
            SaveLoad.saveFileWithoutPossibleLoading(filename, p, SaveMapInCache.smicStringObj.str, false)

            Text.A('saving game data to file "' + filename + '" done')

            print(getNbArraysObjectsCleared() + ' arrays or objects cleared ; highest : ' + getHighestClearedId())
            print(
                'Highest Array index : ' +
                    ArrayHandler.getNextIndex() +
                    ' ; Highest Object index : ' +
                    ObjectHandler.getNextIndex()
            )
            resetNbArraysObjectsCleared()

            const time = os.clock() - startTime

            Text.mkA('SMIC done in ' + time + ' s')
        }
    }
}
