import { EscaperFunctions } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { udg_doubleHeroesEnabled } from './double_heroes_config'

const initDoubleKill = () => {
    let triggerDoubleKill = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(triggerDoubleKill, EVENT_PLAYER_UNIT_DEATH)
    TriggerAddAction(triggerDoubleKill, () => {
        if (udg_doubleHeroesEnabled && EscaperFunctions.IsHero(GetTriggerUnit())) {
            EscaperFunctions.GetMirrorEscaper(EscaperFunctions.Hero2Escaper(GetTriggerUnit())).kill()
        }
    })
}

export const DoubleKill = initDoubleKill()
