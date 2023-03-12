import { ServiceManager } from 'Services'
import { getUdgEscapers, getUdgLevels, getUdgMonsterTypes, getUdgTerrainTypes, globals } from '../../../globals'
import { errorHandler } from '../../Utils/mapUtils'
import { SetMeteorEffect } from '../04_STRUCTURES/Escaper/Escaper'
import { Hero2Escaper, IsHero } from '../04_STRUCTURES/Escaper/Escaper_functions'
import { createMonsterSmartPatrol, MonsterSimplePatrol } from '../04_STRUCTURES/Monster/MonsterSimplePatrol'
import { makingRightsToAll } from '../06_COMMANDS/Rights/manage_rights'
import { LoadMapFromCache } from '../07_TRIGGERS/Load_map_from_gamecache/LoadMapFromCache'
import { Gravity } from '../07_TRIGGERS/Slide_and_CheckTerrain_triggers/Gravity'
import { ReinitTerrains } from '../07_TRIGGERS/Triggers_to_modify_terrains/Reinit_terrains'
import { ReinitTerrainsPositions } from '../07_TRIGGERS/Triggers_to_modify_terrains/Reinit_terrains_position_Change_variations_and_ut_at_beginning'
import { heroes } from '../08_GAME/Init_game/Heroes'
import { hooks } from './GeneralHooks'
import { MecHook } from './MecHook'

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

    //globals getters
    getEscapers: getUdgEscapers,
    getTerrainTypes: getUdgTerrainTypes,
    getLevels: getUdgLevels,
    getMonsterTypes: getUdgMonsterTypes,

    //constructors
    newMonsterSimplePatrol: (...args: ConstructorParameters<typeof MonsterSimplePatrol>) => {
        return createMonsterSmartPatrol(...args)
    },

    //hooks
    destroyHook: (hookId: number) => {
        return MecHook.destroy(hookId)
    },

    onBeforeCreateMonsterUnit: (cb: () => any) => {
        return hooks.hooks_onBeforeCreateMonsterUnit.new(cb)
    },

    onAfterCreateMonsterUnit: (cb: () => any) => {
        return hooks.hooks_onAfterCreateMonsterUnit.new(cb)
    },

    onStartLevel: (levelNum: number, cb: () => any) => {
        const level = getUdgLevels().get(levelNum)
        if (level) {
            return level.hooks_onStart.new(cb)
        }

        return null
    },

    onEndLevel: (levelNum: number, cb: () => any) => {
        const level = getUdgLevels().get(levelNum)
        if (level) {
            return level.hooks_onEnd.new(cb)
        }

        return null
    },

    //terrain
    terrain: {
        reinitTypes: ReinitTerrains.ReinitTerrains,
        reinitPositions: ReinitTerrainsPositions.ReinitTerrainsPosition,
    },

    //various settings
    setEffectForMissingHeroes: heroes.setEffectForMissingHeroes,
    setMeteorEffect: SetMeteorEffect,
    setGravity: Gravity.SetGravity,
    setCanTurnInTheAir: (b: boolean) => {
        globals.CAN_TURN_IN_AIR = b
    },
    setStaticSpawnPositions: heroes.setStaticSpawnPositions,

    //helpers
    isHero: IsHero,
    hero2Escaper: Hero2Escaper,

    setPointsEnabled: (enabled: boolean) => {
        ServiceManager.getService('Multiboard').setPointsEnabled(enabled)
    },

    adjustPlayerPoints: (playerId: number, points: number) => {
        ServiceManager.getService('Multiboard').adjustPlayerPoints(playerId, points)
    },

    setPlayerPoints: (playerId: number, points: number) => {
        ServiceManager.getService('Multiboard').setPlayerPoints(playerId, points)
    },
}
