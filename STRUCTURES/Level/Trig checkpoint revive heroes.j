//TESH.scrollpos=0
//TESH.alwaysfold=0
library TrigCheckpointReviveHeroes initializer Init_Trig_checkpoint_revive_heroes needs ChangeAllTerrains


globals
    public Level levelForReviving
    public Escaper revivingFinisher
endglobals



function Trig_Trig_checkpoint_revive_heroes_Actions takes nothing returns nothing
    local Level l = levelForReviving
    local Escaper finisher = revivingFinisher
    local Escaper escaper
    local integer i = 0
    loop
        exitwhen (i > 11)
            set escaper = udg_escapers.get(i)
            if (escaper != 0 and escaper != finisher) then
                if (not escaper.reviveAtStart()) then
                    call escaper.moveHero(l.getStartRandomX(), l.getStartRandomY())
                    call StopUnit(escaper.getHero())
                    call escaper.pause(true)
                    call escaper.setLastZ(0)
                    call escaper.setOldDiffZ(0)
                    call escaper.setSpeedZ(0)
                endif
                call SetUnitFlyHeight(escaper.getHero(), 0, 0)
                call escaper.enableSlide(false)
            endif
        set i = i + 1
    endloop    
    call TriggerSleepAction(1)
    set i = 0
    loop
        exitwhen (i > 11)
            set escaper = udg_escapers.get(i)
            if (escaper != 0 and escaper != finisher) then
                call escaper.pause(false)
            endif
        set i = i + 1
    endloop 
    if (udg_changeAllTerrainsAtRevive) then
        call TriggerSleepAction(1.00)
        call ChangeAllTerrains("normal")
    endif
endfunction

//===========================================================================
function Init_Trig_checkpoint_revive_heroes takes nothing returns nothing
    set gg_trg____Trig_checkpoint_revive_heroes = CreateTrigger(  )
    call TriggerAddAction( gg_trg____Trig_checkpoint_revive_heroes, function Trig_Trig_checkpoint_revive_heroes_Actions )
endfunction


endlibrary

