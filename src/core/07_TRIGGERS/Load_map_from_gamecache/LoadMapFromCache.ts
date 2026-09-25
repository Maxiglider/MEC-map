import {
    getUdgCasterTypes,
    getUdgLevels,
    getUdgMonsterTypes,
    getUdgTerrainSaves,
    getUdgTerrainTypes,
    getUdgVisibilityTypes,
    globals,
    setHeroBaseCollisionSize,
    setHeroModelPath,
} from '../../../../globals'
import { jsonDecode } from '../../01_libraries/Basic_functions'
import { Text } from '../../01_libraries/Text'
import {
    doorTypes,
    doorTypesFromJson,
    keyForDoorTypes,
    keyForDoorTypesFromJson,
} from '../../04_STRUCTURES/KeyAndDoor/KeyAndDoorTypes'
import { VisibilityCompositor } from '../../04_STRUCTURES/Visibility/VisibilityCompositor'
import {
    initCasterTypes,
    initLevels,
    initMonsterTypes,
    initTerrainSaves,
    initTerrainTypes,
    initVisibilityTypes,
} from '../../Init/initArrays'
import { Gravity } from '../Slide_and_CheckTerrain_triggers/Gravity'

export class LoadMapFromCache {
    public static gameDataJsonString: string | null = null

    public static initializeGameData = (currentlyOnGameStart = true) => {
        if (LoadMapFromCache.gameDataJsonString) {
            const gameData: any = jsonDecode(LoadMapFromCache.gameDataJsonString)

            if (!gameData || typeof gameData !== 'object') {
                Text.erA('invalid game data string')
            } else {
                const levelIdBefore = getUdgLevels().getCurrentLevel().id

                if (!currentlyOnGameStart) {
                    //erase previous data from the game
                    //the fog modifiers first: they belong to the levels about to be thrown away
                    VisibilityCompositor.destroy()
                    getUdgLevels().destroy()
                    getUdgCasterTypes().destroy()
                    getUdgMonsterTypes().destroy()
                    getUdgTerrainTypes().destroy()
                    getUdgVisibilityTypes().destroy()
                    getUdgTerrainSaves().destroy()
                    initTerrainTypes()
                    initVisibilityTypes()
                    initMonsterTypes()
                    initCasterTypes()
                    initLevels()
                    initTerrainSaves()
                    doorTypes.clear()
                    keyForDoorTypes.clear()
                }

                // game properties
                if (gameData.gameData) {
                    if (gameData.gameData.USE_VTOTO_SLIDE_LOGIC !== undefined) {
                        globals.USE_VTOTO_SLIDE_LOGIC = gameData.gameData.USE_VTOTO_SLIDE_LOGIC
                    }

                    if (gameData.gameData.coopCircles !== undefined) {
                        globals.coopCircles = gameData.gameData.coopCircles
                    }

                    if (gameData.gameData.mortarAreaShift !== undefined) {
                        globals.mortarAreaShift = gameData.gameData.mortarAreaShift
                    }

                    if (gameData.gameData.terrainSaveMobTransparency !== undefined) {
                        globals.terrainSaveMobTransparency = gameData.gameData.terrainSaveMobTransparency
                    }

                    if (gameData.gameData.lifeBonusMessageDuration !== undefined) {
                        globals.lifeBonusMessageDuration = gameData.gameData.lifeBonusMessageDuration
                    }

                    if (gameData.gameData.coopModeChoice !== undefined) {
                        globals.coopModeChoice = gameData.gameData.coopModeChoice
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

                    // For old maps retrocompatibility, the MEC_core.setGameData applied won't contain an heroBaseCollisionSize value,
                    //    this will be detected and set heroBaseCollisionSize to 0 to keep the same behavior as before
                    setHeroBaseCollisionSize(gameData.gameData.heroBaseCollisionSize ?? 0)

                    // a map saved before this was saved keeps the model of the engine
                    if (gameData.gameData.heroModelPath) {
                        setHeroModelPath(gameData.gameData.heroModelPath)
                    }
                }

                //terrain types MEC
                if (gameData.terrainTypesMec) {
                    getUdgTerrainTypes().newFromJson(gameData.terrainTypesMec)
                }

                //visibility types, before the levels whose tiles reference them by label
                if (gameData.visibilityTypes) {
                    getUdgVisibilityTypes().newFromJson(gameData.visibilityTypes)
                }

                //monster types
                if (gameData.monsterTypes) {
                    getUdgMonsterTypes().newFromJson(gameData.monsterTypes)
                }

                //caster types
                if (gameData.casterTypes) {
                    getUdgCasterTypes().newFromJson(gameData.casterTypes)
                }

                //door and key types, before the levels whose key and door pairs use them
                if (gameData.doorTypes) {
                    doorTypesFromJson(gameData.doorTypes)
                }
                if (gameData.keyForDoorTypes) {
                    keyForDoorTypesFromJson(gameData.keyForDoorTypes)
                }

                //levels
                if (gameData.levels) {
                    getUdgLevels().newFromJson(gameData.levels)
                }

                //terrain saves - must run after levels, since level-scoped terrain saves resolve their Level by id
                if (gameData.terrainSaves) {
                    getUdgTerrainSaves().newFromJson(gameData.terrainSaves)
                }

                if (!currentlyOnGameStart) {
                    // load the level number we were in before, or first level if the previous level id doesn't exist
                    const newLevelId = levelIdBefore <= getUdgLevels().getLastLevelId() ? levelIdBefore : 0
                    if (newLevelId === levelIdBefore) {
                        getUdgLevels().refreshCurrentLevel()
                    } else {
                        getUdgLevels().goToLevel(undefined, false, newLevelId)
                    }
                }
            }
        }
    }
}
