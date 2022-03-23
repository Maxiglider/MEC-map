//TESH.scrollpos=0
//TESH.alwaysfold=0
library Triggers


struct Trigger
    private trigger t
    
    
    private method onDestroy takes nothing returns nothing
        call DestroyTrigger(.t)
        set .t = null
    endmethod
    
    static method create takes nothing returns Trigger
        local Trigger t = Trigger.allocate()
        set t.t = CreateTrigger()
        return t
    endmethod
    
    method activate takes boolean activ returns nothing
        if (activ) then
            call EnableTrigger(.t)
        else
            call DisableTrigger(.t)
        endif
    endmethod
endstruct


struct TriggerArray
    private Trigger array triggers [200]
    private integer lastInstance
    
    
    static method create takes nothing returns TriggerArray
        local TriggerArray ta = TriggerArray.allocate()
        set ta.lastInstance = -1
        return ta
    endmethod
    
    private method onDestroy takes nothing returns nothing
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                call .triggers[i].destroy()
            set i = i + 1
        endloop
        set .lastInstance = -1
    endmethod
    
    method activate takes boolean activ returns nothing
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                if (.triggers[i] != 0) then
                    call .triggers[i].activate(activ)
                endif
            set i = i + 1
        endloop
    endmethod
endstruct



endlibrary