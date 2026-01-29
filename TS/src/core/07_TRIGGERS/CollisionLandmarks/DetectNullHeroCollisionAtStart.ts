import { createTimer } from '../../../Utils/mapUtils'
import { getUdgEscapers, globals } from '../../../../globals'
import { Text } from '../../01_libraries/Text'
import { Constants } from '../../01_libraries/Constants'

export const init_DetectNullHeroCollisionAtStart = () => {
    // If the heroBaseCollisionSize is null at start (after MEC_core.setGameData call), it's probably unintentionnal and because of the old MEC bahavior (before v2.2)
    // So we display a message to invite all players that have the right to do it, to type the command -patchImmo

    const messages = [
        `The hero base collision size is currently set to 0, which is probably unintentionnal and because of the old MEC behavior.`,
        `To fix this, an easy way is to type the |cff1ce6b9-patchImmo|cfffeba0e command in the chat (only players with making rights can do this and sees this message).`,
        `This will set the hero base collision size to ${Constants.RECOMMANDED_HERO_BASE_COLLISION_SIZE} (default value) and reduce all monsters immolation radius in consequence to keep the same behavior as before.`,
    ]

    createTimer(10, false, () => {
        if (globals.heroBaseCollisionSize === 0) {
            getUdgEscapers().forAll(escaper => {
                if (escaper.canCheat()) {
                    for(const message of messages){
                        Text.ForPlayer_timed_withColorCode(escaper.getPlayer(), 25, '|cfffeba0e', message)
                    }
                }
            })
        }
    })
}
