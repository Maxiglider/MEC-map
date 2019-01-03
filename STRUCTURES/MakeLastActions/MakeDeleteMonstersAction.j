//TESH.scrollpos=30
//TESH.alwaysfold=0
library MakeDeleteMonstersAction needs MakeAction



struct MakeDeleteMonstersAction extends MakeAction
    static hashtable suppressions
    static integer suppressionLastId
    
    private static method onInit takes nothing returns nothing
        set MakeDeleteMonstersAction.suppressions = InitHashtable()
        set MakeDeleteMonstersAction.suppressionLastId = -1
    endmethod
    
    static method newSuppression takes hashtable suppression returns integer
        local integer i
        local integer suppressionId = MakeDeleteMonstersAction.suppressionLastId + 1
        set MakeDeleteMonstersAction.suppressionLastId = suppressionId
        set i = 0
        loop
            exitwhen (not HaveSavedInteger(suppression, 0, i))
                call SaveInteger(MakeDeleteMonstersAction.suppressions, suppressionId, i, LoadInteger(suppression, 0, i))
            set i = i + 1
        endloop
        return suppressionId
    endmethod
    
    static method removeSuppression takes integer suppressionId returns nothing
        call FlushChildHashtable(MakeDeleteMonstersAction.suppressions, suppressionId)
    endmethod    
    
    
    private integer suppressionId
    private Level level
    
    method getLevel takes nothing returns Level
        return .level
    endmethod

    static method create takes Level level, hashtable suppression returns MakeDeleteMonstersAction
        local MakeDeleteMonstersAction a 
        if (suppression == null) then
            return 0
        endif
        set a = MakeDeleteMonstersAction.allocate()
        set a.isActionMadeB = true
        set a.suppressionId = MakeDeleteMonstersAction.newSuppression(suppression)
        set a.level = level
        return a
    endmethod
    
    method onDestroy takes nothing returns nothing
        local integer i
        if (.isActionMadeB) then
            //suppression définitive des mobs
            set i = 0
            loop
                exitwhen (not HaveSavedInteger(MakeDeleteMonstersAction.suppressions, .suppressionId, i))
                    call Monster(LoadInteger(MakeDeleteMonstersAction.suppressions, .suppressionId, i)).destroy()
                set i = i + 1
            endloop
        endif
        call MakeDeleteMonstersAction.removeSuppression(.suppressionId)
    endmethod
    
	method cancel takes nothing returns boolean
        local integer i
        if (not .isActionMadeB) then
            return false
        endif
		//création des monstres supprimés
        set i = 0
        loop
            exitwhen (not HaveSavedInteger(MakeDeleteMonstersAction.suppressions, .suppressionId, i))
                call Monster(LoadInteger(MakeDeleteMonstersAction.suppressions, .suppressionId, i)).createUnit()
            set i = i + 1
        endloop
        set .isActionMadeB = false
        call Text_mkP(.owner.getPlayer(), "monster deleting cancelled")
        return true
	endmethod
	
	method redo takes nothing returns boolean
        local integer i
        if (.isActionMadeB) then
            return false
        endif
		//suppression des monstres recréés
        set i = 0
        loop
            exitwhen (not HaveSavedInteger(MakeDeleteMonstersAction.suppressions, .suppressionId, i))
                call Monster(LoadInteger(MakeDeleteMonstersAction.suppressions, .suppressionId, i)).removeUnit()
            set i = i + 1
        endloop
        set .isActionMadeB = true
        call Text_mkP(.owner.getPlayer(), "monster deleting redone")
        return true
	endmethod	
endstruct




endlibrary