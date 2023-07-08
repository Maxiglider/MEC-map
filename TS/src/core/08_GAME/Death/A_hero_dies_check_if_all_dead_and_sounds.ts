import { MemoryHandler } from 'Utils/MemoryHandler'
import { createEvent, runInTrigger } from 'Utils/mapUtils'
import { arrayPush } from 'core/01_libraries/Basic_functions'
import { COOP_REVIVE_DIST, NB_ESCAPERS } from 'core/01_libraries/Constants'
import { IsHero } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { sameLevelProgression } from 'core/04_STRUCTURES/Level/LevelProgression'
import { getUdgEscapers, getUdgTerrainTypes, globals } from '../../../../globals'
import { Globals } from '../../09_From_old_Worldedit_triggers/globals_variables_and_triggers'
import { AfkMode } from '../Afk_mode/Afk_mode'
import { DeplacementHeroHorsDeathPath } from '../Mode_coop/deplacement_heros_hors_death_path'
import { loseALifeAndRes } from './Lose_a_life_and_res'

const initReviveTrigManager = () => {
    const groups: number[][] = []

    return {
        createGroup: () => {
            const group = MemoryHandler.getEmptyArray<number>()
            arrayPush(groups, group)
            return group
        },
        clearGroup: (group: number[]) => {
            MemoryHandler.destroyArray(group)

            const index = groups.findIndex(item => item === group)
            groups.splice(index, 1)
        },
        removeEscaper: (escaperId: number) => {
            for (const group of groups) {
                const index = group.indexOf(escaperId)

                if (index !== -1) {
                    group.splice(index, 1)
                }
            }
        },
    }
}

export const reviveTrigManager = initReviveTrigManager()

export const InitTrig_A_hero_dies_check_if_all_dead_and_sounds = () => {
    let udg_nbKilled = 0

    createEvent({
        events: [t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_DEATH)],
        conditions: [() => IsHero(GetTriggerUnit())],
        actions: [
            () => {
                const hero = GetTriggerUnit()
                const n = GetUnitUserData(hero)
                let nbAlive = 0
                let nbAliveWithoutAr = 0
                let last = false

                udg_nbKilled = udg_nbKilled + 1
                if (udg_nbKilled === 3 && Globals.udg_tripleKillSoundOn) {
                    StartSound(gg_snd_multisquish)
                    udg_nbKilled = 0
                }

                const escaperIds = reviveTrigManager.createGroup()

                for (let i = 0; i < NB_ESCAPERS; i++) {
                    if (
                        getUdgEscapers().get(i)?.isAlive() &&
                        !getUdgEscapers().get(i)?.hasAutorevive() &&
                        !(
                            getUdgEscapers().get(n) &&
                            !sameLevelProgression(getUdgEscapers().get(n)!, getUdgEscapers().get(i)!)
                        )
                    ) {
                        nbAlive = nbAlive + 1
                    }

                    if (
                        !getUdgEscapers().get(i)?.isAlive() &&
                        !getUdgEscapers().get(i)?.hasAutorevive() &&
                        getUdgEscapers().get(i) &&
                        getUdgEscapers().get(n) &&
                        sameLevelProgression(getUdgEscapers().get(n)!, getUdgEscapers().get(i)!)
                    ) {
                        arrayPush(escaperIds, i)
                    }

                    if (
                        !getUdgEscapers().get(i)?.hasAutorevive() &&
                        GetPlayerController(Player(i)) === MAP_CONTROL_USER &&
                        GetPlayerSlotState(Player(i)) === PLAYER_SLOT_STATE_PLAYING
                    ) {
                        nbAliveWithoutAr++
                    }
                }

                // No need to continue when everyone has autorevive
                if (nbAliveWithoutAr === 0) {
                    reviveTrigManager.clearGroup(escaperIds)
                    return
                }

                if (nbAlive === 0) {
                    runInTrigger(() => {
                        loseALifeAndRes(escaperIds)
                        reviveTrigManager.clearGroup(escaperIds)
                        TriggerSleepAction(2)
                        StartSound(gg_snd_questFailed)
                        last = true
                    })
                } else {
                    reviveTrigManager.clearGroup(escaperIds)

                    if (nbAlive === 1) {
                        StartSound(gg_snd_warning)
                    }
                }

                if (AfkMode.isAfk[n]) {
                    DestroyTextTag(AfkMode.afkModeTextTags[n])
                } else {
                    PauseTimer(AfkMode.afkModeTimers[n])
                }

                if (AfkMode.AreAllAliveHeroesAfk()) {
                    AfkMode.KillAllHeroesAfkInFourSeconds()
                }

                if (last) {
                    TriggerSleepAction(3)
                } else {
                    //coop
                    if (globals.coopModeActive) {
                        TriggerSleepAction(1.3)

                        const hero2 = getUdgEscapers().get(n)?.getHero()

                        if (!hero2 || GetHandleId(hero) !== GetHandleId(hero2)) {
                            return
                        }

                        //si héros déjà vivant, inutile de le ressuciter
                        if (IsUnitAliveBJ(hero2)) {
                            TriggerSleepAction(3.7)
                            udg_nbKilled = udg_nbKilled - 1
                            return
                        }

                        //déplacement du héros si mort sur le death path
                        if (
                            getUdgTerrainTypes().getTerrainType(GetUnitX(hero2), GetUnitY(hero2))?.getKind() === 'death'
                        ) {
                            DeplacementHeroHorsDeathPath.DeplacementHeroHorsDeathPath(hero2)
                        }

                        if (globals.coopCircles) {
                            //revive si autre héros (vivant) au même endroit
                            for (let i = 0; i < NB_ESCAPERS; i++) {
                                if (i !== n && getUdgEscapers().get(i)?.isAlive()) {
                                    const h1 = getUdgEscapers().get(i)?.getHero()

                                    if (!h1) {
                                        continue
                                    }

                                    const diffX = GetUnitX(h1) - GetUnitX(hero2)
                                    const diffY = GetUnitY(h1) - GetUnitY(hero2)

                                    if (SquareRoot(diffX * diffX + diffY * diffY) < COOP_REVIVE_DIST) {
                                        getUdgEscapers().get(n)?.coopReviveHero()
                                        TriggerSleepAction(3.7)
                                        udg_nbKilled = udg_nbKilled - 1
                                        return
                                    }
                                }
                            }

                            getUdgEscapers().get(n)?.enableTrigCoopRevive()
                        }

                        TriggerSleepAction(3.7)
                    } else {
                        TriggerSleepAction(5)
                    }
                }

                SetUnitAnimation(hero, 'stand')
                udg_nbKilled = udg_nbKilled - 1
            },
        ],
    })
}
