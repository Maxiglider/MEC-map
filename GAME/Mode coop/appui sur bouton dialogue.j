//TESH.scrollpos=0
//TESH.alwaysfold=0
function TrigAppuiBoutonDialogue_Actions takes nothing returns nothing
    set udg_coopModeActive = GetClickedButton() == btnChoixCoop
    set dialBoutonAppuye = true
    if (udg_coopModeActive) then
        call DisplayTextToForce(GetPlayersAll(), "coop mode chosen by first player")
    else
        call DisplayTextToForce(GetPlayersAll(), "solo mode chosen by first player")
    endif
endfunction





function InitTrig_appui_sur_bouton_dialogue takes nothing returns nothing
    set gg_trg_appui_sur_bouton_dialogue = CreateTrigger()
    //évènement défini dans le trigger "creation dialogue"
    call TriggerAddAction(gg_trg_appui_sur_bouton_dialogue, function TrigAppuiBoutonDialogue_Actions)
endfunction