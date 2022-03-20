//TESH.scrollpos=0
//TESH.alwaysfold=0
function Trig_Giving_making_rights_Actions takes nothing returns nothing
    local integer playerId = 0
    //giving admin rights to the first player
    loop
        exitwhen udg_escapers.get(playerId) != 0
        set playerId = playerId + 1
    endloop
    call udg_escapers.get(playerId).setIsTrueMaximaxou(true)
    //giving other players make rights
    loop
        set playerId = playerId + 1
        exitwhen playerId >= NB_ESCAPERS
            if(udg_escapers.get(playerId) != 0)then
                call udg_escapers.get(playerId).setCanCheat(true)
            endif
    endloop            
endfunction

//===========================================================================
function InitTrig_Giving_making_rights takes nothing returns nothing
    set gg_trg_Giving_making_rights = CreateTrigger(  )
    call TriggerRegisterTimerEventSingle( gg_trg_Giving_making_rights, 0.00 )
    call TriggerAddAction( gg_trg_Giving_making_rights, function Trig_Giving_making_rights_Actions )
endfunction

