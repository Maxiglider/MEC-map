import { BasicFunctions } from 'core/01_libraries/Basic_functions'
import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { udg_escapers } from 'core/08_GAME/Init_structures/Init_escapers'
import { createEvent } from 'Utils/mapUtils'
import { ChangeAllTerrains } from '../../07_TRIGGERS/Triggers_to_modify_terrains/Change_all_terrains'
import { Escaper } from '../Escaper/Escaper'

export let gg_trg____Trig_checkpoint_revive_heroes: trigger

const initTrigCheckpointReviveHeroes = () => {
    let levelForReviving: Level
    let revivingFinisher: Escaper

    const Init_Trig_checkpoint_revive_heroes = () => {
        gg_trg____Trig_checkpoint_revive_heroes = createEvent({
            events: [],
            actions: [
                () => {
                    let l = levelForReviving
                    let finisher = revivingFinisher
                    let escaper: Escaper
                    let i = 0
                    while (true) {
                        if (i >= NB_ESCAPERS) break
                        escaper = udg_escapers.get(i)
                        if (escaper !== null && escaper !== finisher) {
                            if (!escaper.reviveAtStart()) {
                                escaper.moveHero(l.getStartRandomX(), l.getStartRandomY())
                                BasicFunctions.StopUnit(escaper.getHero())
                                escaper.pause(true)
                                escaper.setLastZ(0)
                                escaper.setOldDiffZ(0)
                                escaper.setSpeedZ(0)
                            }
                            SetUnitFlyHeight(escaper.getHero(), 0, 0)
                            escaper.enableSlide(false)
                        }
                        i = i + 1
                    }
                    TriggerSleepAction(1)
                    i = 0
                    while (true) {
                        if (i >= NB_ESCAPERS) break
                        escaper = udg_escapers.get(i)
                        if (escaper !== null && escaper !== finisher) {
                            escaper.pause(false)
                        }
                        i = i + 1
                    }
                    if (udg_changeAllTerrainsAtRevive) {
                        TriggerSleepAction(1.0)
                        ChangeAllTerrains.ChangeAllTerrains('normal')
                    }
                },
            ],
        })
    }

    return { levelForReviving, revivingFinisher, initTrigCheckpointReviveHeroes }
}

// TODO; Fix initializer
initTrigCheckpointReviveHeroes()
