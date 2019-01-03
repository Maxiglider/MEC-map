//TESH.scrollpos=0
//TESH.alwaysfold=0
library MakeMonsterNoMove needs Make




struct MakeMonsterNoMove extends Make    
    private MonsterType mt
    private real facingAngle
    
    method getMonsterType takes nothing returns MonsterType
        return .mt
    endmethod
    
    method getFacingAngle takes nothing returns real
        return .facingAngle
    endmethod
	
	static method create takes unit maker, MonsterType mt, real facingAngle returns MakeMonsterNoMove
        local MakeMonsterNoMove m
		if (maker == null or mt == 0) then
			return 0
		endif
        set m = MakeMonsterNoMove.allocate()
        set m.maker = maker
        set m.kind = "monsterCreateNoMove"
        set m.mt = mt
        set m.facingAngle = facingAngle
        set m.t = CreateTrigger()
        call TriggerAddAction(m.t, Make_GetActions(m.kind))
        call TriggerRegisterUnitEvent(m.t, m.maker, EVENT_UNIT_ISSUED_POINT_ORDER)
        return m
    endmethod
    
    method onDestroy takes nothing returns nothing
		call DestroyTrigger(.t)
		set .t = null
		set .maker = null
	endmethod
	
	method cancelLastAction takes nothing returns boolean
        return false
	endmethod
	
	method redoLastAction takes nothing returns boolean
        return false
	endmethod	
endstruct
	
	
	
	
endlibrary
	
