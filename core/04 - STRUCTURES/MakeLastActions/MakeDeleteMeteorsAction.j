//TESH.scrollpos=0
//TESH.alwaysfold=0
library MakeDeleteMeteorsAction needs MakeAction



struct MakeDeleteMeteorsAction extends MakeAction
    static hashtable suppressions
    static integer suppressionLastId
    
    private static method onInit takes nothing returns nothing
        set MakeDeleteMeteorsAction.suppressions = InitHashtable()
        set MakeDeleteMeteorsAction.suppressionLastId = -1
    endmethod
    
    static method newSuppression takes hashtable suppression returns integer
        local integer i
        local integer suppressionId = MakeDeleteMeteorsAction.suppressionLastId + 1
        set MakeDeleteMeteorsAction.suppressionLastId = suppressionId
        set i = 0
        loop
            exitwhen (not HaveSavedInteger(suppression, 0, i))
                call SaveInteger(MakeDeleteMeteorsAction.suppressions, suppressionId, i, LoadInteger(suppression, 0, i))
            set i = i + 1
        endloop
        return suppressionId
    endmethod
    
    static method removeSuppression takes integer suppressionId returns nothing
        call FlushChildHashtable(MakeDeleteMeteorsAction.suppressions, suppressionId)
    endmethod    
    
    
    private integer suppressionId
    private Level level
    
    method getLevel takes nothing returns Level
        return .level
    endmethod

    static method create takes Level level, hashtable suppression returns MakeDeleteMeteorsAction
        local MakeDeleteMeteorsAction a 
        if (suppression == null) then
            return 0
        endif
        set a = MakeDeleteMeteorsAction.allocate()
        set a.isActionMadeB = true
        set a.suppressionId = MakeDeleteMeteorsAction.newSuppression(suppression)
        set a.level = level
        return a
    endmethod
    
    method onDestroy takes nothing returns nothing
        local integer i
        if (.isActionMadeB) then
            //suppression définitive des météores
            set i = 0
            loop
                exitwhen (not HaveSavedInteger(MakeDeleteMeteorsAction.suppressions, .suppressionId, i))
                    call Meteor(LoadInteger(MakeDeleteMeteorsAction.suppressions, .suppressionId, i)).destroy()
                set i = i + 1
            endloop
        endif
        call MakeDeleteMeteorsAction.removeSuppression(.suppressionId)
    endmethod
    
	method cancel takes nothing returns boolean
        local integer i
        if (not .isActionMadeB) then
            return false
        endif
		//création des météores supprimées
        set i = 0
        loop
            exitwhen (not HaveSavedInteger(MakeDeleteMeteorsAction.suppressions, .suppressionId, i))
                call Meteor(LoadInteger(MakeDeleteMeteorsAction.suppressions, .suppressionId, i)).createMeteor()
            set i = i + 1
        endloop
        set .isActionMadeB = false
        call Text_mkP(.owner.getPlayer(), "meteor deleting cancelled")
        return true
	endmethod
	
	method redo takes nothing returns boolean
        local integer i
        if (.isActionMadeB) then
            return false
        endif
		//suppression des météores recréés
        set i = 0
        loop
            exitwhen (not HaveSavedInteger(MakeDeleteMeteorsAction.suppressions, .suppressionId, i))
                call Meteor(LoadInteger(MakeDeleteMeteorsAction.suppressions, .suppressionId, i)).removeMeteor()
            set i = i + 1
        endloop
        set .isActionMadeB = true
        call Text_mkP(.owner.getPlayer(), "meteor deleting redone")
        return true
	endmethod	
endstruct




endlibrary