//TESH.scrollpos=0
//TESH.alwaysfold=0
library MakeCaster needs Make



struct MakeCaster extends Make    
    private CasterType casterType
    private real angle
    
    method getCasterType takes nothing returns CasterType
        return .casterType
    endmethod
    
    method getAngle takes nothing returns real
        return .angle
    endmethod
    
	
	static method create takes unit maker, CasterType casterType, real angle returns MakeCaster
        local MakeCaster m
		if (maker == null) then
			return 0
		endif
        set m = MakeCaster.allocate()
        set m.maker = maker
        set m.kind = "casterCreate"
        set m.t = CreateTrigger()
        call TriggerAddAction(m.t, Make_GetActions(m.kind))
        call TriggerRegisterUnitEvent(m.t, m.maker, EVENT_UNIT_ISSUED_POINT_ORDER)
        set m.casterType = casterType
        set m.angle = angle
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
