import { createEvent } from 'Utils/mapUtils'
import {globals} from "../../../../globals";

let dialChoixModeCoop: dialog
let dialBoutonAppuye: boolean
const DIAL_TIME_TO_ANSWER = 10
let dialTimerTempLimite: timer

globals.coopModeActive = true

export const InitTrig_creation_dialogue = () => {
    createEvent({
        events: [t => TriggerRegisterTimerEvent(t, 0, false)],
        actions: [
            () => {
                dialChoixModeCoop = DialogCreate()
                dialTimerTempLimite = CreateTimer()
                DialogSetMessageBJ(dialChoixModeCoop, 'Choose a game mode for everybody')
                const btnChoixCoop = DialogAddButton(dialChoixModeCoop, 'Coop (you can revive allies)', 0)
                DialogAddButton(dialChoixModeCoop, 'Solo', 0)

                createEvent({
                    events: [t => TriggerRegisterDialogEventBJ(t, dialChoixModeCoop)],
                    actions: [
                        () => {
                            globals.coopModeActive = GetClickedButton() === btnChoixCoop
                            dialBoutonAppuye = true
                            if (globals.coopModeActive) {
                                DisplayTextToForce(GetPlayersAll(), 'coop mode chosen by first player')
                            } else {
                                DisplayTextToForce(GetPlayersAll(), 'solo mode chosen by first player')
                            }
                        },
                    ],
                })
            },
        ],
    })
}

export const gg_trg_apparition_dialogue_et_fermeture_automatique = createEvent({
    events: [t => TriggerRegisterTimerEventSingle(t, 1)],
    actions: [
        () => {
            //détermination du premier joueur
            let i = 0
            while (true) {
                if (
                    (GetPlayerController(Player(i)) === MAP_CONTROL_USER &&
                        GetPlayerSlotState(Player(i)) === PLAYER_SLOT_STATE_PLAYING) ||
                    i > 11
                )
                    break
                i = i + 1
            }
            if (i > 11) {
                return
            }
            const udg_joueurDialogue = Player(i)
            DialogDisplay(udg_joueurDialogue, dialChoixModeCoop, true)
            let dialBoutonAppuye = false
            TimerStart(dialTimerTempLimite, DIAL_TIME_TO_ANSWER, false, () => {
                if (!dialBoutonAppuye) {
                    DialogDisplay(udg_joueurDialogue, dialChoixModeCoop, false)
                    if (globals.coopModeActive) {
                        DisplayTextToForce(GetPlayersAll(), 'coop mode automatically chosen')
                    } else {
                        DisplayTextToForce(GetPlayersAll(), 'solo mode automatically chosen')
                    }
                }
            })
        },
    ],
})
