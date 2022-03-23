//TESH.scrollpos=3
//TESH.alwaysfold=0
library MakeSetUnitTeleportPeriodActions needs BasicFunctions, Escaper


function SetUnitTeleportPeriod_Actions takes nothing returns nothing

//modes : oneByOne, twoClics

    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local Make mkGeneral = escaper.getMake()
	local MakeSetUnitTeleportPeriod mk = MakeSetUnitTeleportPeriod(integer(mkGeneral))
    local MonsterTeleport monster
    local integer nbMonstersFixed = 0
    local real x = GetOrderPointX()
    local real y = GetOrderPointY()
	local integer i

    if (not IsIssuedOrder("smart")) then
        return
    endif
    call StopUnit(mk.maker)
    
    
    if (mk.getMode() == "oneByOne") then
        set monster = escaper.getMakingLevel().monstersTeleport.getMonsterNear(x, y)
        if (monster != 0 and monster.u != null) then
            call monster.setPeriod(mk.getPeriod())
            set nbMonstersFixed = 1
        endif
    else
        //mode twoClics
        if (not mk.isLastLocSavedUsed()) then
            call mk.saveLoc(x, y)
            return
        endif
        
        set i = 0
        loop
            exitwhen (i > escaper.getMakingLevel().monstersTeleport.getLastInstanceId())
                set monster = escaper.getMakingLevel().monstersTeleport.get(i)
                if (monster != 0 and monster.u != null and IsUnitBetweenLocs(monster.u, mk.lastX, mk.lastY, x, y)) then
                    call monster.setPeriod(mk.getPeriod())
                    set nbMonstersFixed = nbMonstersFixed + 1
                endif
            set i = i + 1
        endloop
    endif
    
    if (nbMonstersFixed <= 1) then
        call Text_mkP(mk.makerOwner, I2S(nbMonstersFixed) + " monster fixed.")
    else
        call Text_mkP(mk.makerOwner, I2S(nbMonstersFixed) + " monsters fixed.")
    endif
    
    call mk.unsaveLocDefinitely()
endfunction



endlibrary

