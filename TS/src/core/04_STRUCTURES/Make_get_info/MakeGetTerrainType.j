//TESH.scrollpos=0
//TESH.alwaysfold=0
library MakeGetTerrainType needs Make



struct MakeGetTerrainType extends Make
	static method create takes unit maker returns MakeGetTerrainType
        local MakeGetTerrainType m
		if (maker == null) then
			return 0
		endif
        set m = MakeGetTerrainType.allocate()
        set m.maker = maker
        set m.makerOwner = GetOwningPlayer(maker)
        set m.kind = "getTerrainType"
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