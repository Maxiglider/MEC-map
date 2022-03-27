import { createEvent } from 'Utils/mapUtils'

// TODO; Trigger has no events and no external calls..?

export const InitTrig_Forces_ally = () => {
    createEvent({
        events: [],
        actions: [
            () => {
                bj_forLoopAIndex = 1
                bj_forLoopAIndexEnd = 11
                while (true) {
                    if (bj_forLoopAIndex > bj_forLoopAIndexEnd) break
                    SetPlayerAllianceStateBJ(Player(11), ConvertedPlayer(GetForLoopIndexA()), bj_ALLIANCE_ALLIED_VISION)
                    SetPlayerAllianceStateBJ(ConvertedPlayer(GetForLoopIndexA()), Player(11), bj_ALLIANCE_ALLIED_VISION)
                    bj_forLoopAIndex = bj_forLoopAIndex + 1
                }
            },
        ],
    })
}
