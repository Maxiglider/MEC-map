import { ServiceManager } from 'Services'
import { createEvent, createTimer } from 'Utils/mapUtils'
import { Constants } from 'core/01_libraries/Constants'
import { hooks } from 'core/API/GeneralHooks'
import { globals } from '../../../../globals'
import { Natives } from '../../wc3_natives_unsecured/Natives'

let dialChoixModeCoop: dialog
let dialBoutonAppuye: boolean
const DIAL_TIME_TO_ANSWER = 10
let dialTimerTempLimite: timer

/**
 * A dialog closing gives the player their hands back, the camera's arrow keys included, even during a cinematic: the
 * first player could move the camera through a map's intro once they had chosen coop or solo (Murloc Slide 2, user's
 * report, 2026-09-25). So once the dialog is gone, a cinematic playing gets its locked control back, at once and on
 * the next frame, when the engine's own hand back comes. Local state only, the same on every machine: no desync.
 */
const keepCinematicControl = () => {
    const lock = () => {
        if (bj_cineModeAlreadyIn) {
            EnableUserControl(false)
        }
    }
    lock()
    createTimer(0, false, lock)
}

/** The mode chosen for everybody, told to the hooks */
const runModeSelectionHooks = () => {
    if (!!hooks.hooks_onModeSelection) {
        for (const hook of hooks.hooks_onModeSelection.getHooks()) {
            hook.execute(globals.coopModeActive ? 'coop' : 'solo')
        }
    }
}

/** -enableCoop: coop or solo from now on, for this game only (not saved by -smic) */
export const setCoopModeActive = (active: boolean) => {
    globals.coopModeActive = active
    DisplayTextToForce(Natives.UGetPlayersAll(), active ? 'Coop mode enabled' : 'Solo mode enabled')
    runModeSelectionHooks()
}

export const InitTrig_creation_dialogue = () => {
    createTimer(0, false, () => {
        dialChoixModeCoop = Natives.UDialogCreate()
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
                    keepCinematicControl()
                    if (globals.coopModeActive) {
                        DisplayTextToForce(Natives.UGetPlayersAll(), 'Coop mode chosen by first player')
                    } else {
                        DisplayTextToForce(Natives.UGetPlayersAll(), 'Solo mode chosen by first player')
                    }

                    if (!!hooks.hooks_onModeSelection) {
                        for (const hook of hooks.hooks_onModeSelection.getHooks()) {
                            hook.execute(globals.coopModeActive ? 'coop' : 'solo')
                        }
                    }

                    ServiceManager.getService('Multiboard').resetRoundScores()
                },
            ],
        })
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
                    (GetPlayerController(Natives.UPlayer(i)) === MAP_CONTROL_USER &&
                        GetPlayerSlotState(Natives.UPlayer(i)) === PLAYER_SLOT_STATE_PLAYING) ||
                    i > Constants.NB_PLAYERS_MAX - 1
                )
                    break
                i = i + 1
            }
            if (i > Constants.NB_PLAYERS_MAX - 1) {
                return
            }

            // no choice for the first player (-coopModeChoice off): solo
            if (!globals.coopModeChoice) {
                globals.coopModeActive = false
                DisplayTextToForce(Natives.UGetPlayersAll(), 'Solo mode')
                runModeSelectionHooks()
                ServiceManager.getService('Multiboard').resetRoundScores()
                return
            }

            const udg_joueurDialogue = Natives.UPlayer(i)
            DialogDisplay(udg_joueurDialogue, dialChoixModeCoop, true)
            dialBoutonAppuye = false
            TimerStart(dialTimerTempLimite, DIAL_TIME_TO_ANSWER, false, () => {
                if (!dialBoutonAppuye) {
                    DialogDisplay(udg_joueurDialogue, dialChoixModeCoop, false)
                    keepCinematicControl()
                    if (globals.coopModeActive) {
                        DisplayTextToForce(Natives.UGetPlayersAll(), 'Coop mode automatically chosen')
                    } else {
                        DisplayTextToForce(Natives.UGetPlayersAll(), 'Solo mode automatically chosen')
                    }

                    if (!!hooks.hooks_onModeSelection) {
                        for (const hook of hooks.hooks_onModeSelection.getHooks()) {
                            hook.execute(globals.coopModeActive ? 'coop' : 'solo')
                        }
                    }

                    ServiceManager.getService('Multiboard').resetRoundScores()
                }
            })
        },
    ],
})
