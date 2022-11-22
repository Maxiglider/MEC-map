import { COOP_REVIVE_DIST, NB_ESCAPERS } from 'core/01_libraries/Constants'
import { IsHero } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { createEvent } from 'Utils/mapUtils'
import { getUdgEscapers, getUdgTerrainTypes, globals } from '../../../../globals'
import { Globals } from '../../09_From_old_Worldedit_triggers/globals_variables_and_triggers'
import { AfkMode } from '../Afk_mode/Afk_mode'
import { DeplacementHeroHorsDeathPath } from '../Mode_coop/deplacement_heros_hors_death_path'
import { gg_trg_Lose_a_life_and_res } from './Lose_a_life_and_res'

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
                let last = false

                udg_nbKilled = udg_nbKilled + 1
                if (udg_nbKilled === 3 && Globals.udg_tripleKillSoundOn) {
                    StartSound(gg_snd_multisquish)
                    udg_nbKilled = 0
                }

                for (let i = 0; i < NB_ESCAPERS; i++) {
                    if (getUdgEscapers().get(i)?.isAlive()) {
                        nbAlive = nbAlive + 1
                    }
                }

                if (nbAlive === 0) {
                    TriggerExecute(gg_trg_Lose_a_life_and_res.trigger)
                    TriggerSleepAction(2)
                    StartSound(gg_snd_questFailed)
                    last = true
                } else {
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
                    AfkMode.KillAllHeroesAfkInFiveSeconds()
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
