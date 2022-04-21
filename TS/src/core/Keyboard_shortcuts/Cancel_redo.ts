import {NB_PLAYERS_MAX} from "../01_libraries/Constants";
import {ServiceManager} from "../../Services";
import {getUdgEscapers} from "../../../globals";

export const init_shortcurt_cancelRedo = () => {

    const { ExecuteCommand } = ServiceManager.getService('Cmd')

    function Cancel_Actions() {
        const escaper = getUdgEscapers().get(GetPlayerId(GetTriggerPlayer()))
        ExecuteCommand(escaper, '-z')
    }

    function Redo_Actions() {
        const escaper = getUdgEscapers().get(GetPlayerId(GetTriggerPlayer()))
        ExecuteCommand(escaper, '-y')
    }

    for(let i = 0; i < NB_PLAYERS_MAX; i++){

        //cancel
        const trgCancel = CreateTrigger()

        TriggerAddAction(trgCancel, Cancel_Actions)
        BlzTriggerRegisterPlayerKeyEvent(trgCancel, Player(i), OSKEY_Z, 2, false) //CTRL Z

        //redo
        const trgRedo = CreateTrigger()

        TriggerAddAction(trgRedo, Redo_Actions)
        BlzTriggerRegisterPlayerKeyEvent(trgRedo, Player(i), OSKEY_Z, 3, false) //CTRL SHIFT Z
        BlzTriggerRegisterPlayerKeyEvent(trgRedo, Player(i), OSKEY_Y, 2, false) //CTRL Y
    }
}