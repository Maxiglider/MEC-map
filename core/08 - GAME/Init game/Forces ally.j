function Trig_Forces_ally_Actions takes nothing returns nothing
    set bj_forLoopAIndex = 1
    set bj_forLoopAIndexEnd = 11
    loop
        exitwhen bj_forLoopAIndex > bj_forLoopAIndexEnd
        call SetPlayerAllianceStateBJ( Player(11), ConvertedPlayer(GetForLoopIndexA()), bj_ALLIANCE_ALLIED_VISION )
        call SetPlayerAllianceStateBJ( ConvertedPlayer(GetForLoopIndexA()), Player(11), bj_ALLIANCE_ALLIED_VISION )
        set bj_forLoopAIndex = bj_forLoopAIndex + 1
    endloop
endfunction

//===========================================================================
function InitTrig_Forces_ally takes nothing returns nothing
    set gg_trg_Forces_ally = CreateTrigger(  )
    call TriggerAddAction( gg_trg_Forces_ally, function Trig_Forces_ally_Actions )
endfunction

