//TESH.scrollpos=0
//TESH.alwaysfold=0
library CasterDeleteActions needs BasicFunctions, Escaper


function CasterDelete_Actions takes nothing returns nothing

//modes : oneByOne, twoClics

    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local Make mkGeneral = escaper.getMake()
	local MakeDeleteCasters mk = MakeDeleteCasters(integer(mkGeneral))
    local Caster caster
    local hashtable suppressionHashTable = InitHashtable()
    local integer nbCastersRemoved = 0
    local real x = GetOrderPointX()
    local real y = GetOrderPointY()
	local integer i

    if (not IsIssuedOrder("smart")) then
        call FlushParentHashtable(suppressionHashTable)
        set suppressionHashTable = null
        return
    endif
    call StopUnit(mk.maker)
    
    
    if (mk.getMode() == "oneByOne") then
        set caster = escaper.getMakingLevel().casters.getCasterNear(x, y)
        if (caster != 0 and caster.casterUnit != null) then
            call caster.disable()
            call SaveInteger(suppressionHashTable, 0, nbCastersRemoved, integer(caster))
            set nbCastersRemoved = 1
        endif
    else
        //mode twoClics
        if (not mk.isLastLocSavedUsed()) then
            call mk.saveLoc(x, y)
            call FlushParentHashtable(suppressionHashTable)
            set suppressionHashTable = null
            return
        endif
        
        set i = 0
        loop
            exitwhen (i > escaper.getMakingLevel().casters.getLastInstanceId())
                set caster = escaper.getMakingLevel().casters.get(i)
                if (caster != 0 and caster.casterUnit != null and IsUnitBetweenLocs(caster.casterUnit, mk.lastX, mk.lastY, x, y)) then
                    call caster.disable()
                    call SaveInteger(suppressionHashTable, 0, nbCastersRemoved, integer(caster))
                    set nbCastersRemoved = nbCastersRemoved + 1
                endif
            set i = i + 1
        endloop
    endif
    
    if (nbCastersRemoved <= 1) then
        call Text_mkP(mk.makerOwner, I2S(nbCastersRemoved) + " caster removed.")
    else
        call Text_mkP(mk.makerOwner, I2S(nbCastersRemoved) + " casters removed.")
    endif
    
	if (nbCastersRemoved > 0) then
		call escaper.newAction(MakeDeleteCastersAction.create(escaper.getMakingLevel(), suppressionHashTable))
	endif
    
    call mk.unsaveLocDefinitely()
    
    call FlushParentHashtable(suppressionHashTable)
    set suppressionHashTable = null
endfunction



endlibrary

