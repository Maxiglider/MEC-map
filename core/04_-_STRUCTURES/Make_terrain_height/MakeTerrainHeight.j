//TESH.scrollpos=0
//TESH.alwaysfold=0
library MakeTerrainHeight needs Make




struct MakeTerrainHeight extends Make    
    private real radius
    private real height
	
	static method create takes unit maker, real radius, real height returns MakeTerrainHeight
        local MakeTerrainHeight m
		if (maker == null) then
			return 0
		endif
        set m = MakeTerrainHeight.allocate()
        set m.maker = maker
        set m.radius = radius
        set m.height = height
        set m.kind = "terrainHeight"
        set m.t = CreateTrigger()
        call TriggerAddAction(m.t, Make_GetActions(m.kind))
        call TriggerRegisterUnitEvent(m.t, m.maker, EVENT_UNIT_ISSUED_POINT_ORDER)
        return m
    endmethod
    
    method getRadius takes nothing returns real
        return .radius
    endmethod
    
    method getHeight takes nothing returns real
        return .height
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