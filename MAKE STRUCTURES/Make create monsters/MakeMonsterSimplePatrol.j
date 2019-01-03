//TESH.scrollpos=0
//TESH.alwaysfold=0
library MakeMonsterSimplePatrol needs Make



struct MakeMonsterSimplePatrol extends Make
    private string mode
	private MonsterType mt
    real lastX
    real lastY
    private boolean lastLocIsSaved
	private boolean lastLocSavedIsUsed
    private unit unitLastClic
	
	method getMonsterType takes nothing returns MonsterType
        return .mt
    endmethod
    
	static method create takes unit maker, string mode, MonsterType mt returns MakeMonsterSimplePatrol
        local MakeMonsterSimplePatrol m
		if (maker == null or (mode != "normal" and mode != "string" and mode != "auto") or mt == 0) then
			return 0
		endif
        set m = MakeMonsterSimplePatrol.allocate()
        set m.maker = maker
		set m.makerOwner = GetOwningPlayer(maker)
        set m.kind = "monsterCreateSimplePatrol"
        set m.mode = mode
        set m.mt = mt
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
    
    method unsaveLocDefinitely takes nothing returns nothing
        call .unsaveLoc()
        set .lastLocIsSaved = false
    endmethod
	
	method isLastLocSavedUsed takes nothing returns boolean
		return .lastLocSavedIsUsed
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

