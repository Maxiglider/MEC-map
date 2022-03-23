function Trig_Camera_reset_Actions takes nothing returns nothing
    local player TP = GetTriggerPlayer()
    local integer TPN = GetPlayerId(TP)
    call udg_escapers.get(TPN).resetCamera()
endfunction

//===========================================================================
function InitTrig_Camera_reset takes nothing returns nothing
    set gg_trg_Camera_reset = CreateTrigger(  )
    call TriggerRegisterPlayerEventEndCinematic( gg_trg_Camera_reset, Player(0) )
    call TriggerRegisterPlayerEventEndCinematic( gg_trg_Camera_reset, Player(1) )
    call TriggerRegisterPlayerEventEndCinematic( gg_trg_Camera_reset, Player(2) )
    call TriggerRegisterPlayerEventEndCinematic( gg_trg_Camera_reset, Player(3) )
    call TriggerRegisterPlayerEventEndCinematic( gg_trg_Camera_reset, Player(4) )
    call TriggerRegisterPlayerEventEndCinematic( gg_trg_Camera_reset, Player(5) )
    call TriggerRegisterPlayerEventEndCinematic( gg_trg_Camera_reset, Player(6) )
    call TriggerRegisterPlayerEventEndCinematic( gg_trg_Camera_reset, Player(7) )
    call TriggerRegisterPlayerEventEndCinematic( gg_trg_Camera_reset, Player(8) )
    call TriggerRegisterPlayerEventEndCinematic( gg_trg_Camera_reset, Player(9) )
    call TriggerRegisterPlayerEventEndCinematic( gg_trg_Camera_reset, Player(10) )
    call TriggerRegisterPlayerEventEndCinematic( gg_trg_Camera_reset, Player(11) )
    call TriggerAddAction( gg_trg_Camera_reset, function Trig_Camera_reset_Actions )
endfunction

