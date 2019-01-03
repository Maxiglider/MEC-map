//TESH.scrollpos=0
//TESH.alwaysfold=0
globals
    boolean udg_gameIsLost = false
endglobals


function Trig_Lose_a_life_and_res_Actions takes nothing returns nothing
    local integer i
    call udg_lives.loseALife()
    if (udg_lives.get() < 0) then
        if (not udg_gameIsLost) then
            set udg_gameIsLost = true
            call DisplayTextToForce( GetPlayersAll(), "You have no more lives !" )
            call TriggerSleepAction( 2 )
            call DisplayTextToForce( GetPlayersAll(), "The game will restart in 10 seconds." )
            call TriggerSleepAction( 10.00 )
            call udg_levels.restartTheGame()
            set udg_gameIsLost = false
        endif
    else
        if (udg_changeAllTerrainsAtRevive) then
            call TriggerSleepAction( 6.00 )
            call ChangeAllTerrains("normal")
            call TriggerSleepAction( 2.00 )
        else
            call TriggerSleepAction( 8.00 )
        endif
        set i = 0
        loop
            exitwhen (i > 11)
                if (udg_escapers.get(i) != 0) then
                    call udg_escapers.get(i).reviveAtStart()
                endif
            set i = i + 1
        endloop
        call Text_A("|cff5c2e2eYou have lost a life !")
        //set AnticheatTeleport_justRevived = true
    endif
endfunction

//===========================================================================
function InitTrig_Lose_a_life_and_res takes nothing returns nothing
    set gg_trg_Lose_a_life_and_res = CreateTrigger(  )
    call TriggerAddAction( gg_trg_Lose_a_life_and_res, function Trig_Lose_a_life_and_res_Actions )
endfunction

