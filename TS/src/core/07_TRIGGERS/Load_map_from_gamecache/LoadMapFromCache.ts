import { errorHandler } from 'Utils/mapUtils'
import { PROD } from 'env'
import { getUdgCasterTypes, getUdgLevels, getUdgMonsterTypes, getUdgTerrainTypes, globals } from '../../../../globals'
import { jsonDecode } from '../../01_libraries/Basic_functions'
import { Text } from '../../01_libraries/Text'
import { Gravity } from '../Slide_and_CheckTerrain_triggers/Gravity'

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

                    if (gameData.gameData.coopCircles) {
                        globals.coopCircles = gameData.gameData.coopCircles
                    }

                    if (gameData.gameData.CAN_TURN_IN_AIR) {
                        globals.CAN_TURN_IN_AIR = gameData.gameData.CAN_TURN_IN_AIR
                    }

                    if (gameData.gameData.canSlideOverPathingBlockers !== undefined) {
                        globals.canSlideOverPathingBlockers = gameData.gameData.canSlideOverPathingBlockers
                    }

                    if (gameData.gameData.animOnRevive !== undefined) {
                        globals.animOnRevive = gameData.gameData.animOnRevive
                    }

                    if (gameData.gameData.wanderMinTime !== undefined) {
                        globals.wanderMinTime = gameData.gameData.wanderMinTime
                    }

                    if (gameData.gameData.wanderExtraTime !== undefined) {
                        globals.wanderExtraTime = gameData.gameData.wanderExtraTime
                    }

                    if (gameData.gameData.gravity) {
                        Gravity.SetGravity(gameData.gameData.gravity)
                    }
                }

                //terrain types MEC
                if (gameData.terrainTypesMec) {
                    if (PROD) {
                        getUdgTerrainTypes().newFromJson(gameData.terrainTypesMec)
                    } else {
                        // Dont care during development
                        errorHandler(() => getUdgTerrainTypes().newFromJson(gameData.terrainTypesMec))
                    }
                }

                //monster types
                if (gameData.monsterTypes) {
                    if (PROD) {
                        getUdgMonsterTypes().newFromJson(gameData.monsterTypes)
                    } else {
                        // Dont care during development
                        errorHandler(() => getUdgMonsterTypes().newFromJson(gameData.monsterTypes))
                    }
                }

                //caster types
                if (gameData.casterTypes) {
                    if (gameData.monsterTypes) {
                        if (PROD) {
                            getUdgCasterTypes().newFromJson(gameData.casterTypes)
                        } else {
                            // Dont care during development
                            errorHandler(() => getUdgCasterTypes().newFromJson(gameData.casterTypes))
                        }
                    }
                }

                //levels
                if (gameData.levels) {
                    getUdgLevels().newFromJson(gameData.levels)
                }
            }
        }
    }
}
