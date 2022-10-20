import { PROD } from 'env'
import { errorHandler } from 'Utils/mapUtils'
import { getUdgCasterTypes, getUdgLevels, getUdgMonsterTypes, getUdgTerrainTypes, globals } from '../../../../globals'
import { jsonDecode } from '../../01_libraries/Basic_functions'
import { Text } from '../../01_libraries/Text'

export class LoadMapFromCache {
    public static gameDataJsonString: string | null = null

    public static initializeGameData = () => {
        if (LoadMapFromCache.gameDataJsonString) {
            const gameData: any = jsonDecode(LoadMapFromCache.gameDataJsonString)

            if (!gameData || typeof gameData !== 'object') {
                Text.erA('invalid game data string')
            } else {
                if (gameData.gameData) {
                    if (gameData.gameData.USE_VTOTO_SLIDE_LOGIC) {
                        globals.USE_VTOTO_SLIDE_LOGIC = gameData.gameData.USE_VTOTO_SLIDE_LOGIC
                    }
                }

                //terrain types MEC
                if (gameData.terrainTypesMec) {
                    if (PROD) {
                        getUdgTerrainTypes().newFromJson(gameData.terrainTypesMec)
                    } else {
                        // Dont care for terrains during development
                        errorHandler(() => {
                            getUdgTerrainTypes().newFromJson(gameData.terrainTypesMec)
                        })
                    }
                }

                //monster types
                if (gameData.monsterTypes) {
                    getUdgMonsterTypes().newFromJson(gameData.monsterTypes)
                }

                //caster types
                if (gameData.casterTypes) {
                    getUdgCasterTypes().newFromJson(gameData.casterTypes)
                }

                //levels
                if (gameData.levels) {
                    getUdgLevels().newFromJson(gameData.levels)
                }
            }
        }
    }
}
