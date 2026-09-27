import { getUdgLevels } from '../../../../globals'
import { createTimer } from '../../../Utils/mapUtils'
import { applyDefaultAutoTurnMode } from '../../06_COMMANDS/Helpers/commands-helpers'
import { refreshStartZoneHints } from '../../08_GAME/Init_game/Start_zone_hints'

export const init_startFirstLevel = () => {
    createTimer(0, false, () => {
        getUdgLevels().get(0)?.activate(true)
        getUdgLevels().refreshVisibilities()
        refreshStartZoneHints()

        // on every machine at once, as the command would: every player starts steering with the mouse
        applyDefaultAutoTurnMode()
    })
}
