//TESH.scrollpos=60
//TESH.alwaysfold=0
library MakeMonsterTeleport needs Make



struct MakeMonsterTeleport extends Make
    private MonsterType mt
    private real period
    private real angle
    private string mode //normal ou string
    private real array lastX [20]
    private real array lastY [20]
	private integer lastLocId
	private integer locPointeur
    private unit unitLastClic
    private MonsterTeleport monster
    
	method getMonsterType takes nothing returns MonsterType
        return .mt
    endmethod
    
    method getPeriod takes nothing returns real
        return .period
    endmethod
    
    method getAngle takes nothing returns real
        return .angle
    endmethod
    
    method getMode takes nothing returns string
        return .mode
    endmethod
    
    method getMonster takes nothing returns MonsterTeleport
        return .monster
    endmethod
	
	static method create takes unit maker, string mode, MonsterType mt, real period, real angle returns MakeMonsterTeleport
        local MakeMonsterTeleport m
		if (maker == null or mt == 0 or (mode != "normal" and mode != "string") or period < MONSTER_TELEPORT_PERIOD_MIN or period > MONSTER_TELEPORT_PERIOD_MAX) then
			return 0
		endif
        set m = MakeMonsterTeleport.allocate()
        set m.maker = maker
		set m.makerOwner = GetOwningPlayer(maker)
        set m.kind = "monsterCreateTeleport"
        set m.mt = mt
        set m.mode = mode
        set m.period = period
        set m.angle = angle
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
    
    method addWaitPeriod takes nothing returns boolean
        if (.locPointeur < 0) then
            return false //un wait sans point au préalable est interdit
        endif
        if (.saveLoc(WAIT, WAIT)) then
            call .getMonster().addNewLoc(WAIT, WAIT)
            return true
        endif
        return false
    endmethod
    
    method addHidePeriod takes nothing returns boolean
        if (.locPointeur < 0) then
            return false //un hide sans point au préalable est interdit
        endif
        if (.saveLoc(HIDE, HIDE)) then
            call .getMonster().addNewLoc(HIDE, HIDE)
            return true
        endif
        return false
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
	
	method saveLoc takes real x, real y returns boolean
		if (.locPointeur >= MonsterTeleport.NB_MAX_LOC - 1) then
			return false
		endif
		set .locPointeur = .locPointeur + 1
		set .lastX[.locPointeur] = x
		set .lastY[.locPointeur] = y
		set .lastLocId = .locPointeur
        if (not(x == y and (x == WAIT or x == HIDE))) then
            call .setUnitLastClicPosition(x, y)
        endif
        call Hero2Escaper(.maker).destroyCancelledActions()
        return true
	endmethod
	
	method unsaveLoc takes nothing returns boolean
        local real x
        local real y
        local integer i
		if (.locPointeur < 0) then
			return false
		endif
        call .monster.destroyLastLoc()
		set .locPointeur = .locPointeur - 1
		if (.locPointeur >= 0) then
            set x = .lastX[.locPointeur]
            set y = .lastY[.locPointeur]
            set i = .locPointeur
            loop
                exitwhen (i < 0 or not(x == y and (x == WAIT or x == HIDE))) //il ne faut pas que la unitLastClic se retrouve au point (1, 1) ou (2, 2)
                set i = i - 1
                set x = .lastX[i]
                set y = .lastY[i]
            endloop
            if (i >= 0) then
                call .setUnitLastClicPosition(.lastX[i], .lastY[i])
            else
                call RemoveUnit(.unitLastClic)
                set .unitLastClic = null
            endif
		else
			call RemoveUnit(.unitLastClic)
			set .unitLastClic = null
            call .monster.removeUnit()
		endif
		return true
	endmethod
	
	method setMonster takes MonsterTeleport monster returns nothing //intègre le monstre créé au Make
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