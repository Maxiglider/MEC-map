//TESH.scrollpos=0
//TESH.alwaysfold=0
globals
    real udg_autoreviveDelay = 4
endglobals



function Trig_autorevive_Conditions takes nothing returns boolean
    return IsHero(GetTriggerUnit())
endfunction

function Trig_autorevive_Actions takes nothing returns nothing
    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    if (escaper.hasAutorevive()) then
        call TriggerSleepAction(udg_autoreviveDelay)
        call escaper.reviveAtStart()
        call escaper.selectHero()
    endif
endfunction


//===========================================================================
function InitTrig_Autorevive takes nothing returns nothing
    set gg_trg_Autorevive = CreateTrigger()
    call TriggerRegisterAnyUnitEventBJ(gg_trg_Autorevive, EVENT_PLAYER_UNIT_DEATH)
    call TriggerAddCondition(gg_trg_Autorevive, Condition( function Trig_autorevive_Conditions))
    call TriggerAddAction(gg_trg_Autorevive, function Trig_autorevive_Actions)
endfunction

