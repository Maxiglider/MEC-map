import { createEvent, forRange } from 'Utils/mapUtils'

export const InitTrig_Forces_ally = () => {
    createEvent({
        events: [],
        actions: [
            () => {
                forRange(12, i => {
                    forRange(12, j => {
                        SetPlayerAllianceStateBJ(Player(12 + j), ConvertedPlayer(i), bj_ALLIANCE_ALLIED_VISION)
                        SetPlayerAllianceStateBJ(ConvertedPlayer(i), Player(12 + j), bj_ALLIANCE_ALLIED_VISION)
                    })
                })
            },
        ],
    })
}
