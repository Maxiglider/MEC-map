//TESH.scrollpos=0
//TESH.alwaysfold=0
globals
    dialog dialChoixModeCoop
    button btnChoixCoop
    button btnChoixSolo
    boolean dialBoutonAppuye
    constant real DIAL_TIME_TO_ANSWER = 10.
    player udg_joueurDialogue
    timer dialTimerTempLimite
    boolean udg_coopModeActive = true
endglobals


function CreationDialogue_Actions takes nothing returns nothing
    set dialChoixModeCoop = DialogCreate()
    set dialTimerTempLimite = CreateTimer()
    call DialogSetMessageBJ(dialChoixModeCoop, "Choose a game mode for everybody")
    set btnChoixCoop = DialogAddButton(dialChoixModeCoop, "Coop (you can revive allies)", 0)
    set btnChoixSolo = DialogAddButton(dialChoixModeCoop, "Solo", 0)
    call TriggerRegisterDialogEventBJ( gg_trg_appui_sur_bouton_dialogue, dialChoixModeCoop)
endfunction

function InitTrig_creation_dialogue takes nothing returns nothing
    set gg_trg_creation_dialogue =  CreateTrigger()
    call TriggerAddAction(gg_trg_creation_dialogue, function CreationDialogue_Actions)
    call TriggerRegisterTimerEvent(gg_trg_creation_dialogue, 0, false)
endfunction
