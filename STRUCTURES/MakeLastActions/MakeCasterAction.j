//TESH.scrollpos=0
//TESH.alwaysfold=0
library MakeCasterAction needs MakeAction



struct MakeCasterAction extends MakeAction
    private Caster caster
    private Level level
    
    method getLevel takes nothing returns Level
        return .level
    endmethod

    static method create takes Level level, Caster caster returns MakeCasterAction
        local MakeCasterAction a 
        if (caster == 0 or caster.casterUnit == null) then
            return 0
        endif
        set a = MakeCasterAction.allocate()
        set a.isActionMadeB = true
        set a.caster = caster
        set a.level = level
        return a
    endmethod
    
    method onDestroy takes nothing returns nothing
        if (not .isActionMadeB) then //si le caster a été supprimé
            call .caster.destroy()
        endif
    endmethod
    
	method cancel takes nothing returns boolean
        if (not .isActionMadeB) then
            return false
        endif
		call .caster.disable()
        set .isActionMadeB = false
        call Text_mkP(.owner.getPlayer(), "caster creation cancelled")
        return true
	endmethod
	
	method redo takes nothing returns boolean
        if (.isActionMadeB) then
            return false
        endif
		call .caster.enable()
        set .isActionMadeB = true
        call Text_mkP(.owner.getPlayer(), "meteor creation redone")
        return true
	endmethod	
endstruct




endlibrary