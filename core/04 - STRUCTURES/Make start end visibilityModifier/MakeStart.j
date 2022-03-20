//TESH.scrollpos=39
//TESH.alwaysfold=0
library MakeStart needs Make



struct MakeStart extends Make
    real lastX
    real lastY
    private unit unitLastClic
    private boolean lastLocIsSaved
	private boolean lastLocSavedIsUsed
    private boolean forNextB //à true si on veut créer le start du niveau suivant
    
	static method create takes unit maker, boolean forNext returns MakeStart
        local MakeStart m
		if (maker == null) then
			return 0
		endif
        set m = MakeStart.allocate()
        set m.maker = maker
		set m.makerOwner = GetOwningPlayer(maker)
        set m.kind = "startCreate"
        set m.t = CreateTrigger()
        call TriggerAddAction(m.t, Make_GetActions(m.kind))
        call TriggerRegisterUnitEvent(m.t, maker, EVENT_UNIT_ISSUED_POINT_ORDER)
        set m.lastLocIsSaved = false
        set m.lastLocSavedIsUsed = false
        set m.forNextB = forNext
        return m
    endmethod
    
    method onDestroy takes nothing returns nothing
		call DestroyTrigger(.t)
		set .t = null
		call RemoveUnit(.unitLastClic)
		set .unitLastClic = null
		set .maker = null
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
	
	method isLastLocSavedUsed takes nothing returns boolean
		return .lastLocSavedIsUsed
	endmethod
	
	method cancelLastAction takes nothing returns boolean
		return .unsaveLoc()
	endmethod
	
	method redoLastAction takes nothing returns boolean
        if (not .lastLocSavedIsUsed and .lastLocIsSaved) then
            call .saveLoc(.lastX, .lastY)
            return true
        endif
        return false
	endmethod
    
    method forNext takes nothing returns boolean
        return .forNextB
    endmethod
endstruct
	
	
	
endlibrary