//TESH.scrollpos=42
//TESH.alwaysfold=0
library MakeMonsterSpawn needs Make



struct MakeMonsterSpawn extends Make
    real lastX
    real lastY
    private unit unitLastClic
    private boolean lastLocIsSaved
	private boolean lastLocSavedIsUsed
    string label
    MonsterType mt
    string sens
    real frequence
    
    
	static method create takes unit maker, string label, MonsterType mt, string sens, real frequence returns MakeMonsterSpawn
        local MakeMonsterSpawn m
		if (maker == null) then
			return 0
		endif
        set m = MakeMonsterSpawn.allocate()
        set m.maker = maker
		set m.makerOwner = GetOwningPlayer(maker)
        set m.kind = "monsterSpawnCreate"
        set m.label = label
        set m.mt = mt
        set m.sens = sens
        set m.frequence = frequence
        set m.t = CreateTrigger()
        call TriggerAddAction(m.t, Make_GetActions(m.kind))
        call TriggerRegisterUnitEvent(m.t, maker, EVENT_UNIT_ISSUED_POINT_ORDER)
        set m.lastLocIsSaved = false
        set m.lastLocSavedIsUsed = false
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
endstruct
	
	
	
endlibrary