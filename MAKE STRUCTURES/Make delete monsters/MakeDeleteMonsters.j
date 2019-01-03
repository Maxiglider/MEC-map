//TESH.scrollpos=15
//TESH.alwaysfold=0
library MakeDeleteMonsters needs Make




struct MakeDeleteMonsters extends Make
    real lastX
    real lastY
    private boolean lastLocIsSaved
	private boolean lastLocSavedIsUsed
    private unit unitLastClic
    private string mode
	
	method isLastLocSavedUsed takes nothing returns boolean
		return .lastLocSavedIsUsed
	endmethod
    
    static method create takes unit maker, string mode returns MakeDeleteMonsters
	    local MakeDeleteMonsters m
		if (maker == null) then
			return 0
		endif
        set m = MakeDeleteMonsters.allocate()
        set m.maker = maker
		set m.makerOwner = GetOwningPlayer(maker)
        set m.kind = "deleteMonsters"
        set m.mode = mode
        set m.lastLocIsSaved = false
        set m.lastLocSavedIsUsed = false
        set m.t = CreateTrigger()
        call TriggerAddAction(m.t, Make_GetActions(m.kind))
        call TriggerRegisterUnitEvent(m.t, m.maker, EVENT_UNIT_ISSUED_POINT_ORDER)
        return m
	endmethod
    
    method onDestroy takes nothing returns nothing
		call DestroyTrigger(.t)
		set .t = null
		set .maker = null
        call RemoveUnit(.unitLastClic)
        set .unitLastClic = null
    endmethod
    
	method saveLoc takes real x, real y returns nothing
		set .lastX = x
		set .lastY = y
        set .lastLocIsSaved = true
		set .lastLocSavedIsUsed = true
		if (.unitLastClic == null) then
			set .unitLastClic = CreateUnit(.makerOwner, MAKE_LAST_CLIC_UNIT_ID, x, y, GetRandomDirectionDeg())
		else
			call SetUnitX(.unitLastClic, x)
			call SetUnitY(.unitLastClic, y)
		endif
        call Hero2Escaper(.maker).destroyCancelledActions()
	endmethod
	
	method unsaveLoc takes nothing returns boolean
		if (not .lastLocSavedIsUsed) then
			return false
		endif
		call RemoveUnit(.unitLastClic)
		set .unitLastClic = null
		set .lastLocSavedIsUsed = false
		return true
	endmethod
    
    method unsaveLocDefinitely takes nothing returns nothing
        call .unsaveLoc()
        set .lastLocIsSaved = false
    endmethod
    
    method cancelLastAction takes nothing returns boolean
        return .unsaveLoc()
    endmethod
	
	method redoLastAction takes nothing returns boolean
		if (.lastLocIsSaved and not .lastLocSavedIsUsed) then
            call .saveLoc(.lastX, .lastY)
            return true
        endif
        return false
	endmethod	
    
    method getMode takes nothing returns string
        return .mode
    endmethod
endstruct



endlibrary
