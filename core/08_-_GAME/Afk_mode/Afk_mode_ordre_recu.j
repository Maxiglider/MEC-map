//TESH.scrollpos=0
//TESH.alwaysfold=0
function Trig_afk_mode_ordre_recu_Actions takes nothing returns nothing
    local integer n
    if (IsHero(GetTriggerUnit())) then
        set n = GetUnitUserData(GetTriggerUnit())
        call StopAfk(n)
        call TimerStart(afkModeTimers[n], timeMinAfk, false, GetAfkModeTimeExpiresCodeFromId(n))
    endif
endfunction

//===========================================================================
function InitTrig_Afk_mode_ordre_recu takes nothing returns nothing
    set gg_trg_Afk_mode_ordre_recu = CreateTrigger(  )
    call TriggerRegisterAnyUnitEventBJ( gg_trg_Afk_mode_ordre_recu, EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER )
    call TriggerRegisterAnyUnitEventBJ( gg_trg_Afk_mode_ordre_recu, EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER )
    call TriggerAddAction( gg_trg_Afk_mode_ordre_recu, function Trig_afk_mode_ordre_recu_Actions )
endfunction

