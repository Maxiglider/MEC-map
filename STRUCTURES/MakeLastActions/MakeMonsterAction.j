//TESH.scrollpos=6
//TESH.alwaysfold=0
library MakeMonsterAction needs MakeAction



struct MakeMonsterAction extends MakeAction
    private Monster monster
    private Level level
    
    method getLevel takes nothing returns Level
        return .level
    endmethod

    static method create takes Level level, Monster monster returns MakeMonsterAction
        local MakeMonsterAction a 
        if (monster == 0 or monster.u == null) then
            return 0
        endif
        set a = MakeMonsterAction.allocate()
        set a.isActionMadeB = true
        set a.monster = monster
        set a.level = level
        return a
    endmethod
    
    method onDestroy takes nothing returns nothing
        if (not .isActionMadeB) then //si le monstre a été supprimé
            call .monster.destroy()
        endif
    endmethod
    
	method cancel takes nothing returns boolean
        if (not .isActionMadeB) then
            return false
        endif
		call .monster.removeUnit()
        set .isActionMadeB = false
        call Text_mkP(.owner.getPlayer(), "monster creation cancelled")
        return true
	endmethod
	
	method redo takes nothing returns boolean
        if (.isActionMadeB) then
            return false
        endif
		call .monster.createUnit()
        set .isActionMadeB = true
        call Text_mkP(.owner.getPlayer(), "monster creation redone")
        return true
	endmethod	
endstruct




endlibrary