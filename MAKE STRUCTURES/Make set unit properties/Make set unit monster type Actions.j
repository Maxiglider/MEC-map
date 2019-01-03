//TESH.scrollpos=0
//TESH.alwaysfold=0
library MakeSetUnitMonsterTypeActions needs BasicFunctions, Escaper


function SetUnitMonsterType_Actions takes nothing returns nothing

//modes : oneByOne, twoClics

    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local Make mkGeneral = escaper.getMake()
	local MakeSetUnitMonsterType mk = MakeSetUnitMonsterType(integer(mkGeneral))
    local Monster monster
    local integer nbMonstersFixed = 0
    local real x = GetOrderPointX()
    local real y = GetOrderPointY()
	local integer i

    if (not IsIssuedOrder("smart")) then
        return
    endif
    call StopUnit(mk.maker)
    
    
    if (mk.getMode() == "oneByOne") then
        set monster = escaper.getMakingLevel().monstersNoMove.getMonsterNear(x, y)
        if (monster == 0 or monster.u == null) then
            set monster = escaper.getMakingLevel().monstersSimplePatrol.getMonsterNear(x, y) 
            if (monster == 0 or monster.u == null) then
                set monster = escaper.getMakingLevel().monstersMultiplePatrols.getMonsterNear(x, y) 
                if (monster == 0 or monster.u == null) then
                    set monster = escaper.getMakingLevel().monstersTeleport.getMonsterNear(x, y) 
                endif
            endif
        endif
        if (monster != 0 and monster.u != null) then
            if (monster.setMonsterType(mk.getMonsterType())) then
                set nbMonstersFixed = 1
            endif
        endif
    else
        //mode twoClics
        if (not mk.isLastLocSavedUsed()) then
            call mk.saveLoc(x, y)
            return
        endif
        
        set i = 0
        loop
            exitwhen (i > escaper.getMakingLevel().monstersNoMove.getLastInstanceId())
                set monster = escaper.getMakingLevel().monstersNoMove.get(i)
                if (monster != 0 and monster.u != null and IsUnitBetweenLocs(monster.u, mk.lastX, mk.lastY, x, y)) then
                    if (monster.setMonsterType(mk.getMonsterType())) then
                        set nbMonstersFixed = nbMonstersFixed + 1
                    endif
                endif
            set i = i + 1
        endloop
            
        set i = 0
        loop
            exitwhen (i > escaper.getMakingLevel().monstersSimplePatrol.getLastInstanceId())
                set monster = escaper.getMakingLevel().monstersSimplePatrol.get(i)
                if (monster != 0 and monster.u != null and IsUnitBetweenLocs(monster.u, mk.lastX, mk.lastY, x, y)) then
                    if (monster.setMonsterType(mk.getMonsterType())) then
                        set nbMonstersFixed = nbMonstersFixed + 1
                    endif
                endif
            set i = i + 1
        endloop
            
        set i = 0
        loop
            exitwhen (i > escaper.getMakingLevel().monstersMultiplePatrols.getLastInstanceId())
                set monster = escaper.getMakingLevel().monstersMultiplePatrols.get(i)
                if (monster != 0 and monster.u != null and IsUnitBetweenLocs(monster.u, mk.lastX, mk.lastY, x, y)) then
                    if (monster.setMonsterType(mk.getMonsterType())) then
                        set nbMonstersFixed = nbMonstersFixed + 1
                    endif
                endif
            set i = i + 1
        endloop
            
        set i = 0
        loop
            exitwhen (i > escaper.getMakingLevel().monstersTeleport.getLastInstanceId())
                set monster = escaper.getMakingLevel().monstersTeleport.get(i)
                if (monster != 0 and monster.u != null and IsUnitBetweenLocs(monster.u, mk.lastX, mk.lastY, x, y)) then
                    if (monster.setMonsterType(mk.getMonsterType())) then
                        set nbMonstersFixed = nbMonstersFixed + 1
                    endif
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

