//TESH.scrollpos=17
//TESH.alwaysfold=0
library MakeVisibilityModifierAction needs MakeAction



struct MakeVisibilityModifierAction extends MakeAction
    private Level level
    private VisibilityModifier visibilityModifierSave
    private VisibilityModifier visibilityModifierPointeur //pointe vers le vm effectif
    
    method getLevel takes nothing returns Level
        return .level
    endmethod

    static method create takes Level level, VisibilityModifier visibilityModifier returns MakeVisibilityModifierAction
        local MakeVisibilityModifierAction a 
        if (visibilityModifier == 0) then
            return 0
        endif
        set a = MakeVisibilityModifierAction.allocate()
        set a.isActionMadeB = true
        set a.level = level
        set a.visibilityModifierSave = 0
        set a.visibilityModifierPointeur = visibilityModifier
        return a
    endmethod
    
    method onDestroy takes nothing returns nothing
        if (.visibilityModifierSave != 0) then
            call .visibilityModifierSave.destroy()
        endif
    endmethod
    
	method cancel takes nothing returns boolean
        if (not .isActionMadeB) then
            return false
        endif
		set .visibilityModifierSave = .visibilityModifierPointeur.copy()
        call .visibilityModifierPointeur.destroy()
        set .isActionMadeB = false
        call Text_mkP(.owner.getPlayer(), "visibility creation cancelled")
        return true
	endmethod
	
	method redo takes nothing returns boolean
        if (.isActionMadeB) then
            return false
        endif
        set .visibilityModifierPointeur = .level.newVisibilityModifierFromExisting(.visibilityModifierSave)
		if (.visibilityModifierPointeur == 0) then
            call Text_erP(.owner.getPlayer(), "can't recreate visibility, full for this level")
        else
            call .visibilityModifierPointeur.activate(true)
        endif
        set .visibilityModifierSave = 0
        set .isActionMadeB = true
        call Text_mkP(.owner.getPlayer(), "visibility creation redone")
        return true
	endmethod	
endstruct




endlibrary