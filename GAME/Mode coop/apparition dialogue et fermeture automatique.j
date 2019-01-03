//TESH.scrollpos=0
//TESH.alwaysfold=0
function FermerDialogueAutomatiquement takes nothing returns nothing
    if (not dialBoutonAppuye) then
        call DialogDisplay(udg_joueurDialogue, dialChoixModeCoop, false)
        if (udg_coopModeActive) then
            call DisplayTextToForce(GetPlayersAll(), "coop mode automatically chosen")
        else
            call DisplayTextToForce(GetPlayersAll(), "solo mode automatically chosen")
        endif
    endif
endfunction



function Trig_apparition_dialogue_Actions takes nothing returns nothing
    //détermination du premier joueur
    local integer i = 0
    loop
        exitwhen  (GetPlayerController(Player(i)) == MAP_CONTROL_USER and GetPlayerSlotState(Player(i)) == PLAYER_SLOT_STATE_PLAYING) or i > 11
        set i = i + 1
    endloop
    if (i > 11) then
        return
    endif
    set udg_joueurDialogue = Player(i)
    call DialogDisplay(udg_joueurDialogue, dialChoixModeCoop, true)
    set dialBoutonAppuye = false
    call TimerStart(dialTimerTempLimite, DIAL_TIME_TO_ANSWER, false, function FermerDialogueAutomatiquement)
endfunction

//===========================================================================
function InitTrig_apparition_dialogue_et_fermeture_automatique takes nothing returns nothing
    set gg_trg_apparition_dialogue_et_fermeture_automatique = CreateTrigger(  )
    call TriggerRegisterTimerEventSingle( gg_trg_apparition_dialogue_et_fermeture_automatique, 1)
    call TriggerAddAction( gg_trg_apparition_dialogue_et_fermeture_automatique, function Trig_apparition_dialogue_Actions )
endfunction

