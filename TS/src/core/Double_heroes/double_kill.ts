import { GetMirrorEscaper, Hero2Escaper, IsHero } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { errorHandler } from '../../Utils/mapUtils'
import { udg_doubleHeroesEnabled } from './double_heroes_config'

export const init_doubleKill = () => {
    let triggerDoubleKill = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(triggerDoubleKill, EVENT_PLAYER_UNIT_DEATH)
    TriggerAddAction(
        triggerDoubleKill,
        errorHandler(() => {
            if (udg_doubleHeroesEnabled && IsHero(GetTriggerUnit())) {
                GetMirrorEscaper(Hero2Escaper(GetTriggerUnit()))?.kill()
            }
        })
    )
}
