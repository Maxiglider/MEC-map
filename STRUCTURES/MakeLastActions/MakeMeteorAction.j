//TESH.scrollpos=0
//TESH.alwaysfold=0
library MakeMeteorAction needs MakeAction



struct MakeMeteorAction extends MakeAction
    private Meteor meteor
    private Level level
    
    method getLevel takes nothing returns Level
        return .level
    endmethod

    static method create takes Level level, Meteor meteor returns MakeMeteorAction
        local MakeMeteorAction a 
        if (meteor == 0 or meteor.getItem() == null) then
            return 0
        endif
        set a = MakeMeteorAction.allocate()
        set a.isActionMadeB = true
        set a.meteor = meteor
        set a.level = level
        return a
    endmethod
    
    method onDestroy takes nothing returns nothing
        if (not .isActionMadeB) then //si la météore a été supprimée
            call .meteor.destroy()
        endif
    endmethod
    
	method cancel takes nothing returns boolean
        if (not .isActionMadeB) then
            return false
        endif
		call .meteor.removeMeteor()
        set .isActionMadeB = false
        call Text_mkP(.owner.getPlayer(), "meteor creation cancelled")
        return true
	endmethod
	
	method redo takes nothing returns boolean
        if (.isActionMadeB) then
            return false
        endif
		call .meteor.createMeteor()
        set .isActionMadeB = true
        call Text_mkP(.owner.getPlayer(), "meteor creation redone")
        return true
	endmethod	
endstruct




endlibrary