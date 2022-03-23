//TESH.scrollpos=0
//TESH.alwaysfold=0
library MakeDeleteClearMob needs Make, ClearMob



struct MakeDeleteClearMob extends Make	
	static method create takes unit maker returns MakeDeleteClearMob
        local MakeDeleteClearMob m
		if (maker == null) then
			return 0
		endif
        set m = MakeDeleteClearMob.allocate()
        set m.maker = maker
		set m.makerOwner = GetOwningPlayer(maker)
        set m.kind = "deleteClearMob"
        set m.t = CreateTrigger()
        call TriggerAddAction(m.t, Make_GetActions(m.kind))
        call TriggerRegisterUnitEvent(m.t, maker, EVENT_UNIT_ISSUED_POINT_ORDER)
        return m
    endmethod
    
    method onDestroy takes nothing returns nothing
		call DestroyTrigger(.t)
		set .t = null
		set .maker = null
	endmethod
    
    method clickMade takes integer monsterOrCasterId returns nothing
        local Escaper escaper = Hero2Escaper(.maker)
        local ClearMob clearMob = ClearTriggerMobId2ClearMob(monsterOrCasterId)
        if (clearMob != 0) then //le mob est trigger mob d'un clear mob, c'est bon, delete du clear mob
            call clearMob.destroy()
            call Text_mkP(.makerOwner, "clear mob removed")
        else
            call Text_erP(.makerOwner, "this monster is not a trigger mob of a clear mob")
        endif
    endmethod
	
	method cancelLastAction takes nothing returns boolean
        return false
	endmethod
	
	method redoLastAction takes nothing returns boolean
        return false
	endmethod	
endstruct
	
	
	
endlibrary

