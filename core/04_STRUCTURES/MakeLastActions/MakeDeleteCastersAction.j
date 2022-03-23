//TESH.scrollpos=51
//TESH.alwaysfold=0
library MakeDeleteCastersAction needs MakeAction



struct MakeDeleteCastersAction extends MakeAction
    static hashtable suppressions
    static integer suppressionLastId
    
    private static method onInit takes nothing returns nothing
        set MakeDeleteCastersAction.suppressions = InitHashtable()
        set MakeDeleteCastersAction.suppressionLastId = -1
    endmethod
    
    static method newSuppression takes hashtable suppression returns integer
        local integer i
        local integer suppressionId = MakeDeleteCastersAction.suppressionLastId + 1
        set MakeDeleteCastersAction.suppressionLastId = suppressionId
        set i = 0
        loop
            exitwhen (not HaveSavedInteger(suppression, 0, i))
                call SaveInteger(MakeDeleteCastersAction.suppressions, suppressionId, i, LoadInteger(suppression, 0, i))
            set i = i + 1
        endloop
        return suppressionId
    endmethod
    
    static method removeSuppression takes integer suppressionId returns nothing
        call FlushChildHashtable(MakeDeleteCastersAction.suppressions, suppressionId)
    endmethod    
    
    
    private integer suppressionId
    private Level level
    
    method getLevel takes nothing returns Level
        return .level
    endmethod

    static method create takes Level level, hashtable suppression returns MakeDeleteCastersAction
        local MakeDeleteCastersAction a 
        if (suppression == null) then
            return 0
        endif
        set a = MakeDeleteCastersAction.allocate()
        set a.isActionMadeB = true
        set a.suppressionId = MakeDeleteCastersAction.newSuppression(suppression)
        set a.level = level
        return a
    endmethod
    
    method onDestroy takes nothing returns nothing
        local integer i
        if (.isActionMadeB) then
            //suppression définitive des casters
            set i = 0
            loop
                exitwhen (not HaveSavedInteger(MakeDeleteCastersAction.suppressions, .suppressionId, i))
                    call Caster(LoadInteger(MakeDeleteCastersAction.suppressions, .suppressionId, i)).destroy()
                set i = i + 1
            endloop
        endif
        call MakeDeleteCastersAction.removeSuppression(.suppressionId)
    endmethod
    
	method cancel takes nothing returns boolean
        local integer i
        if (not .isActionMadeB) then
            return false
        endif
		//création des casters supprimées
        set i = 0
        loop
            exitwhen (not HaveSavedInteger(MakeDeleteCastersAction.suppressions, .suppressionId, i))
                call Caster(LoadInteger(MakeDeleteCastersAction.suppressions, .suppressionId, i)).enable()
            set i = i + 1
        endloop
        set .isActionMadeB = false
        call Text_mkP(.owner.getPlayer(), "caster deleting cancelled")
        return true
	endmethod
	
	method redo takes nothing returns boolean
        local integer i
        if (.isActionMadeB) then
            return false
        endif
		//suppression des casters recréés
        set i = 0
        loop
            exitwhen (not HaveSavedInteger(MakeDeleteCastersAction.suppressions, .suppressionId, i))
                call Caster(LoadInteger(MakeDeleteCastersAction.suppressions, .suppressionId, i)).disable()
            set i = i + 1
        endloop
        set .isActionMadeB = true
        call Text_mkP(.owner.getPlayer(), "caster deleting redone")
        return true
	endmethod	
endstruct




endlibrary