import { getUdgCasterTypes, getUdgLevels, getUdgMonsterTypes, getUdgTerrainTypes, globals } from '../../../../globals'
import { B2S, jsonDecode } from '../../01_libraries/Basic_functions'
import { Text } from '../../01_libraries/Text'
import { Gravity } from '../Slide_and_CheckTerrain_triggers/Gravity'
import { initCasterTypes, initLevels, initMonsterTypes, initTerrainTypes } from '../../Init/initArrays'

export class LoadMapFromCache {
    public static gameDataJsonString: string | null = null

    public static initializeGameData = (currentlyOnGameStart = true) => {
        if (LoadMapFromCache.gameDataJsonString) {
            const gameData: any = jsonDecode(LoadMapFromCache.gameDataJsonString)

            if (!gameData || typeof gameData !== 'object') {
                Text.erA('invalid game data string')
            } else {
                if (!currentlyOnGameStart) {
                    //erase previous data from the game
                    getUdgLevels().destroy()
                    getUdgCasterTypes().destroy()
                    getUdgMonsterTypes().destroy()
                    getUdgTerrainTypes().destroy()
                    initTerrainTypes()
                    initMonsterTypes()
                    initCasterTypes()
                    initLevels()
                }

                // game properties
                if (gameData.gameData) {
                    if (gameData.gameData.USE_VTOTO_SLIDE_LOGIC !== undefined) {
                        globals.USE_VTOTO_SLIDE_LOGIC = gameData.gameData.USE_VTOTO_SLIDE_LOGIC
                    }

                    if (gameData.gameData.coopCircles !== undefined) {
                        globals.coopCircles = gameData.gameData.coopCircles
                    }

                    if (gameData.gameData.CAN_TURN_IN_AIR !== undefined) {
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

                    if (gameData.gameData.gravity !== undefined) {
                        Gravity.SetGravity(gameData.gameData.gravity)
                    }
                }

                //terrain types MEC
                if (gameData.terrainTypesMec) {
                    getUdgTerrainTypes().newFromJson(gameData.terrainTypesMec)
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

                if (!currentlyOnGameStart) {
                    //restart the game to apply the changes and make mobs appear
                    getUdgLevels().restartTheGame()
                }
            }
        }
    }
}
