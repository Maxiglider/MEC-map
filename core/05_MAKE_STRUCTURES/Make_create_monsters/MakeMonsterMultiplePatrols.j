//TESH.scrollpos=69
//TESH.alwaysfold=0
library MakeMonsterMultiplePatrols needs Make



struct MakeMonsterMultiplePatrols extends Make
    private MonsterType mt
    private string mode //normal ou string
    private real array lastX [20]
    private real array lastY [20]
	private integer lastLocId
	private integer locPointeur
    private unit unitLastClic
    private MonsterMultiplePatrols monster
    
	method getMonsterType takes nothing returns MonsterType
        return .mt
    endmethod
    
    method getMode takes nothing returns string
        return .mode
    endmethod
    
    method getMonster takes nothing returns MonsterMultiplePatrols
        return .monster
    endmethod
	
	static method create takes unit maker, string mode, MonsterType mt returns MakeMonsterMultiplePatrols
        local MakeMonsterMultiplePatrols m
		if (maker == null or mt == 0 or (mode != "normal" and mode != "string")) then
			return 0
		endif
        set m = MakeMonsterMultiplePatrols.allocate()
        set m.maker = maker
		set m.makerOwner = GetOwningPlayer(maker)
        set m.kind = "monsterCreateMultiplePatrols"
        set m.mt = mt
        set m.mode = mode
        set m.monster = 0
        set m.t = CreateTrigger()
        call TriggerAddAction(m.t, Make_GetActions(m.kind))
        call TriggerRegisterUnitEvent(m.t, m.maker, EVENT_UNIT_ISSUED_POINT_ORDER)
		set m.lastLocId = -1
		set m.locPointeur = -1
        return m
    endmethod
    
    method onDestroy takes nothing returns nothing
        local Escaper escaper
        if (.monster != 0 and .monster.u != null) then
            set escaper = Hero2Escaper(.maker)
            call escaper.newAction(MakeMonsterAction.create(escaper.getMakingLevel(), .monster))
        else
            call .monster.destroy()
        endif
		call DestroyTrigger(.t)
		set .t = null
		call RemoveUnit(.unitLastClic)
		set .unitLastClic = null
		set .maker = null
	endmethod	
    
    method nextMonster takes nothing returns nothing
        local Escaper escaper
        set .lastLocId = -1
        set .locPointeur = -1
		call RemoveUnit(.unitLastClic)
		set .unitLastClic = null
        if (.monster != 0 and .monster.u != null) then
            set escaper = Hero2Escaper(.maker)
            call escaper.newAction(MakeMonsterAction.create(escaper.getMakingLevel(), .monster))
        else
            call .monster.destroy()
        endif
        set .monster = 0
    endmethod
	
	method getLocPointeur takes nothing returns integer
		return .locPointeur
	endmethod
    
    method setUnitLastClicPosition takes real x, real y returns nothing
        if (.unitLastClic == null) then
			set .unitLastClic = CreateUnit(.makerOwner, MAKE_LAST_CLIC_UNIT_ID, x, y, GetRandomDirectionDeg())
		else
			//call SetUnitX(.unitLastClic, x)
			//call SetUnitY(.unitLastClic, y)
            call SetUnitPosition(.unitLastClic, x, y)
		endif
    endmethod
	
	method saveLoc takes real x, real y returns nothing
		if (.locPointeur >= MonsterMultiplePatrols.NB_MAX_LOC - 1) then
			return
		endif
		set .locPointeur = .locPointeur + 1
		set .lastX[.locPointeur] = x
		set .lastY[.locPointeur] = y
		set .lastLocId = .locPointeur
		call .setUnitLastClicPosition(x, y)
        call Hero2Escaper(.maker).destroyCancelledActions()
	endmethod
	
	method unsaveLoc takes nothing returns boolean
		if (.locPointeur < 0) then
			return false
		endif
        call .monster.destroyLastLoc()
		set .locPointeur = .locPointeur - 1
		if (.locPointeur >= 0) then
            call .setUnitLastClicPosition(.lastX[.locPointeur], .lastY[.locPointeur])
		else
			call RemoveUnit(.unitLastClic)
			set .unitLastClic = null
            call .monster.removeUnit()
		endif
		return true
	endmethod
	
	method setMonster takes MonsterMultiplePatrols monster returns nothing //intègre le monstre créé au Make
		if (.monster != 0) then
            call .monster.destroy()
        endif
        set .monster = monster
	endmethod
	
	method cancelLastAction takes nothing returns boolean
        return .unsaveLoc()
	endmethod
	
	method redoLastAction takes nothing returns boolean 
        if (.locPointeur < .lastLocId) then
            set .locPointeur = .locPointeur + 1
            call .monster.addNewLoc(.lastX[.locPointeur], .lastY[.locPointeur])
            call .setUnitLastClicPosition(.lastX[.locPointeur], .lastY[.locPointeur])
            return true
        endif
		return false
	endmethod	
endstruct
	
	
	
endlibrary