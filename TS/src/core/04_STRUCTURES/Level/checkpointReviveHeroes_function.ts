import { progressionUtils } from 'Utils/ProgressionUtils'
import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { getUdgEscapers } from '../../../../globals'
import { StopUnit } from '../../01_libraries/Basic_functions'
import { ChangeAllTerrains } from '../../07_TRIGGERS/Triggers_to_modify_terrains/Change_all_terrains'
import { Escaper } from '../Escaper/Escaper'
import type { Level } from './Level'
import { sameLevelProgression } from './LevelProgression'

export const checkPointReviveHeroes = (
    levelForRevining: Level,
    revivingFinisher: Escaper | undefined,
    finished?: boolean
) => {
    for (let i = 0; i < NB_ESCAPERS; i++) {
        const escaper = getUdgEscapers().get(i)

        if (escaper) {
            if (escaper !== revivingFinisher || !finished) {
                const unit = escaper.getHero()

                if (revivingFinisher && !sameLevelProgression(revivingFinisher, escaper)) {
                    continue
                }

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
            } else {
                progressionUtils.resetPlayerProgressionState(escaper)
            }
        }
    }

    TriggerSleepAction(1)

    for (let i = 0; i < NB_ESCAPERS; i++) {
        const escaper = getUdgEscapers().get(i)
        if (escaper && (escaper !== revivingFinisher || !finished)) {
            escaper.pause(false)
        }
    }

    if (ChangeAllTerrains.udg_changeAllTerrainsAtRevive) {
        TriggerSleepAction(1.0)
        ChangeAllTerrains.ChangeAllTerrains('normal')
    }
}
