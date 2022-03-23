//TESH.scrollpos=106
//TESH.alwaysfold=0
library MakeTerrainCopyPaste needs Make, BasicFunctions, ModifyTerrainFunctions, Escaper



struct MakeTerrainCopyPaste extends Make
    real x1
    real y1
    real x2
    real y2
    real x3
    real y3
    private unit unitLastClic1
    private unit unitLastClic2
    private unit unitLastClic3
    private boolean isPoint1Saved
    private boolean isPoint2Saved
    private boolean isPoint3Saved
    private boolean isPoint1Used
    private boolean isPoint2Used
    private boolean isPoint3Used
    
	
	static method create takes unit maker returns MakeTerrainCopyPaste
        local MakeTerrainCopyPaste m
		if (maker == null) then
			return 0
		endif
        set m = MakeTerrainCopyPaste.allocate()
        set m.maker = maker
		set m.makerOwner = GetOwningPlayer(maker)
        set m.kind = "terrainCopyPaste"
        set m.t = CreateTrigger()
        call TriggerAddAction(m.t, Make_GetActions(m.kind))
        call TriggerRegisterUnitEvent(m.t, maker, EVENT_UNIT_ISSUED_POINT_ORDER)
        set m.isPoint1Saved = false
        set m.isPoint2Saved = false
        set m.isPoint3Saved = false
        set m.isPoint1Used = false
        set m.isPoint2Used = false
        set m.isPoint3Used = false
        return m
    endmethod
    
    method onDestroy takes nothing returns nothing
		call DestroyTrigger(.t)
		set .t = null
		call RemoveUnit(.unitLastClic1)
		set .unitLastClic1 = null
		call RemoveUnit(.unitLastClic2)
		set .unitLastClic2 = null
		call RemoveUnit(.unitLastClic3)
		set .unitLastClic3 = null
		set .maker = null
	endmethod	
    
    private method createUnitClic takes unit u, real x, real y returns unit
		if (u == null) then
			set u = CreateUnit(.makerOwner, MAKE_LAST_CLIC_UNIT_ID, x, y, GetRandomDirectionDeg())
		else
			call SetUnitX(u, x)
			call SetUnitY(u, y)
		endif
        return u
    endmethod
    
    method unsaveLoc takes integer locId returns nothing
        if (locId == 1) then
            set .isPoint1Used = false
            call RemoveUnit(.unitLastClic1)
            set .unitLastClic1 = null
        else
            if (locId == 2) then
                set .isPoint2Used = false
                call RemoveUnit(.unitLastClic2)
                set .unitLastClic2 = null
            else
                if (locId == 3) then
                    set .isPoint3Used = false
                    call RemoveUnit(.unitLastClic3)
                    set .unitLastClic3 = null
                endif
            endif
        endif
    endmethod
    
    method unsaveLocDefinitely takes integer locId returns nothing
        call .unsaveLoc(locId)
        if (locId == 1) then
            set .isPoint1Saved = false
        else
            if (locId == 2) then
                set .isPoint2Saved = false
            else
                if (locId == 3) then
                    set .isPoint3Saved = false
                endif
            endif
        endif
    endmethod
    
    method unsaveLocsDefinitely takes nothing returns nothing
        call .unsaveLocDefinitely(1)
        call .unsaveLocDefinitely(2)
        call .unsaveLocDefinitely(3)
    endmethod
     
	method saveLoc takes real x, real y returns nothing
        local MakeAction action
        if (not .isPoint1Used) then
            set .unitLastClic1 = .createUnitClic(.unitLastClic1, x, y)
            set .x1 = x
            set .y1 = y
            set .isPoint1Saved = true
            set .isPoint1Used = true
            call .unsaveLocDefinitely(2)
            call .unsaveLocDefinitely(3)
        else
            if (not .isPoint2Used) then
                if (GetNbCaseBetween(.x1, .y1, x, y) > NB_MAX_TILES_MODIFIED) then
                    call Text_erP(.makerOwner, "Too big zone !")
                    return
                endif
                set .unitLastClic2 = .createUnitClic(.unitLastClic2, x, y)
                set .x2 = x
                set .y2 = y
                set .isPoint2Saved = true
                set .isPoint2Used = true
                call .unsaveLocDefinitely(3)
            else
                if (not .isPoint3Used) then
                    set .unitLastClic3 = .createUnitClic(.unitLastClic3, x, y)
                    set .x3 = x
                    set .y3 = y
                    set .isPoint3Saved = true
                    set .isPoint3Used = true
                else
                    set action = MakeTerrainCopyPasteAction.create(.x1, .y1, .x2, .y2, .x3, .y3, x, y)
                    if (action != 0) then
                        call .unsaveLocsDefinitely()
                        call Hero2Escaper(.maker).newAction(action)
                    else
                        call Text_erP(.makerOwner, "paste zone out of bounds")
                    endif
                endif
            endif
        endif
        call Hero2Escaper(.maker).destroyCancelledActions()
	endmethod
    
    method cancelLastAction takes nothing returns boolean
        if (.isPoint3Used) then
            call .unsaveLoc(3)
            return true
        else
            if (.isPoint2Used) then
                call .unsaveLoc(2)
                return true
            else
                if (.isPoint1Used) then
                    call .unsaveLoc(1)
                    return true
                endif
            endif
        endif
        return false
    endmethod
    
    method redoLastAction takes nothing returns boolean
        if (.isPoint1Saved and not .isPoint1Used) then
            call .saveLoc(.x1, .y1)
            return true
        else
            if (.isPoint2Saved and not .isPoint2Used) then
                call .saveLoc(.x2, .y2)
                return true
            else
                if (.isPoint3Saved and not .isPoint3Used) then
                    call .saveLoc(.x3, .y3)
                    return true
                endif
            endif
        endif
        return false
    endmethod
endstruct



endlibrary