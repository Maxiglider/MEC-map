import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { udg_escapers } from 'core/08_GAME/Init_structures/Init_escapers'
import { StopUnit } from '../../01_libraries/Basic_functions'
import { ChangeAllTerrains } from '../../07_TRIGGERS/Triggers_to_modify_terrains/Change_all_terrains'
import { Escaper } from '../Escaper/Escaper'
import { Level } from './Level'

export const checkPointReviveHeroes = (levelForRevining: Level, revivingFinisher: Escaper | undefined) => {
    for (let i = 0; i < NB_ESCAPERS; i++) {
        const escaper = udg_escapers.get(i)
        if (escaper && escaper !== revivingFinisher) {
            const unit = escaper.getHero()

            if (!escaper.reviveAtStart()) {
                escaper.moveHero(levelForRevining.getStartRandomX(), levelForRevining.getStartRandomY())

                unit && StopUnit(unit)

                escaper.pause(true)
                escaper.setLastZ(0)
                escaper.setOldDiffZ(0)
                escaper.setSpeedZ(0)
            }

            unit && SetUnitFlyHeight(unit, 0, 0)
            escaper.enableSlide(false)
        }
    }

    TriggerSleepAction(1)

    for (let i = 0; i < NB_ESCAPERS; i++) {
        const escaper = udg_escapers.get(i)
        if (escaper && escaper !== revivingFinisher) {
            escaper.pause(false)
        }
    }

    if (ChangeAllTerrains.udg_changeAllTerrainsAtRevive) {
        TriggerSleepAction(1.0)
        ChangeAllTerrains.ChangeAllTerrains('normal')
    }
}
