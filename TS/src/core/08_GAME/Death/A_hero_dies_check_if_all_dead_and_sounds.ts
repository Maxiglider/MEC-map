import { COOP_REVIVE_DIST, NB_ESCAPERS } from 'core/01_libraries/Constants'
import { EscaperFunctions } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { createEvent } from 'Utils/mapUtils'
import { udg_terrainTypes } from '../../../../globals'
import { Globals } from '../../09_From_old_Worldedit_triggers/globals_variables_and_triggers'
import { AfkMode } from '../Afk_mode/Afk_mode'
import { udg_escapers } from '../Init_structures/Init_escapers'
import { udg_coopModeActive } from '../Mode_coop/creation_dialogue'
import { DeplacementHeroHorsDeathPath } from '../Mode_coop/deplacement_heros_hors_death_path'
import { gg_trg_Lose_a_life_and_res } from './Lose_a_life_and_res'

let udg_nbKilled = 0

export const InitTrig_A_hero_dies_check_if_all_dead_and_sounds = () => {
    createEvent({
        events: [t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_DEATH)],
        conditions: [() => EscaperFunctions.IsHero(GetTriggerUnit())],
        actions: [
            () => () => {
                let hero = GetTriggerUnit()
                let n = GetUnitUserData(hero)
                let nbAlive = 0
                let last = false
                let i: number
                let diffX: number
                let diffY: number

                udg_nbKilled = udg_nbKilled + 1
                if (udg_nbKilled === 3 && Globals.udg_tripleKillSoundOn) {
                    StartSound(gg_snd_multisquish)
                    udg_nbKilled = 0
                }

                i = 0
                while (true) {
                    if (i >= NB_ESCAPERS) break
                    if (udg_escapers.get(i).isAlive()) {
                        nbAlive = nbAlive + 1
                    }
                    i = i + 1
                }

                if (nbAlive === 0) {
                    TriggerExecute(gg_trg_Lose_a_life_and_res)
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
                    if (udg_coopModeActive) {
                        TriggerSleepAction(1.3)

                        //si héros déjà vivant, inutile de le ressuciter
                        if (IsUnitAliveBJ(hero)) {
                            TriggerSleepAction(3.7)
                            udg_nbKilled = udg_nbKilled - 1
                            return
                        }

                        //déplacement du héros si mort sur le death path
                        if (udg_terrainTypes.getTerrainType(GetUnitX(hero), GetUnitY(hero)).getKind() == 'death') {
                            DeplacementHeroHorsDeathPath.DeplacementHeroHorsDeathPath(hero)
                        }

                        //revive si autre héros (vivant) au même endroit
                        i = 0
                        while (true) {
                            if (i >= NB_ESCAPERS) break
                            if (i != n && udg_escapers.get(i).isAlive()) {
                                const h1 = udg_escapers.get(i).getHero()

                                if (!h1) {
                                    continue
                                }

                                diffX = GetUnitX(h1) - GetUnitX(hero)
                                diffY = GetUnitY(h1) - GetUnitY(hero)
                                if (SquareRoot(diffX * diffX + diffY * diffY) < COOP_REVIVE_DIST) {
                                    udg_escapers.get(n).coopReviveHero()
                                    TriggerSleepAction(3.7)
                                    udg_nbKilled = udg_nbKilled - 1
                                    return
                                }
                            }
                            i = i + 1
                        }
                        udg_escapers.get(n).enableTrigCoopRevive()
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
