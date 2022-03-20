//TESH.scrollpos=105
//TESH.alwaysfold=0
library MonsterDeleteActions needs BasicFunctions, Escaper


function MonsterDelete_Actions takes nothing returns nothing

//modes : oneByOne, all, noMove, move, simplePatrol, multiplePatrols

    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local Make mkGeneral = escaper.getMake()
	local MakeDeleteMonsters mk = MakeDeleteMonsters(integer(mkGeneral))
    local MonsterNoMove Mnm
    local MonsterSimplePatrol Msp
	local MonsterMultiplePatrols Mmp
    local MonsterTeleport Mt
    local hashtable suppressionHashTable = InitHashtable()
    local integer nbMonstersRemoved = 0
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
        set Mnm = escaper.getMakingLevel().monstersNoMove.getMonsterNear(x, y)
        if (Mnm != 0 and Mnm.u != null) then
            call Mnm.removeUnit()
            call SaveInteger(suppressionHashTable, 0, nbMonstersRemoved, integer(Mnm))
            set nbMonstersRemoved = 1
        else        
            set Msp = escaper.getMakingLevel().monstersSimplePatrol.getMonsterNear(x, y)
            if (Msp != 0 and Msp.u != null) then
                call Msp.removeUnit()
                call SaveInteger(suppressionHashTable, 0, nbMonstersRemoved, integer(Msp))
                set nbMonstersRemoved = 1
            else        
                set Mmp = escaper.getMakingLevel().monstersMultiplePatrols.getMonsterNear(x, y)
                if (Mmp != 0 and Mmp.u != null) then
                    call Mmp.removeUnit()
                    call SaveInteger(suppressionHashTable, 0, nbMonstersRemoved, integer(Mmp))
                    set nbMonstersRemoved = 1
                else
                    set Mt = escaper.getMakingLevel().monstersTeleport.getMonsterNear(x, y)
                    if (Mt != 0 and Mt.u != null) then
                        call Mt.removeUnit()
                        call SaveInteger(suppressionHashTable, 0, nbMonstersRemoved, integer(Mt))
                        set nbMonstersRemoved = 1
                    endif
                endif      
            endif
        endif
        
    else
    
        if (not mk.isLastLocSavedUsed()) then
            call mk.saveLoc(x, y)
            call FlushParentHashtable(suppressionHashTable)
            set suppressionHashTable = null
            return
        endif
        
        
        //no move
        if (mk.getMode() == "all" or mk.getMode() == "noMove") then
            set i = 0
            loop
                exitwhen (i > escaper.getMakingLevel().monstersNoMove.getLastInstanceId())
                    set Mnm = escaper.getMakingLevel().monstersNoMove.get(i)
                    if (Mnm != 0) then
                        if (Mnm.u != null and IsUnitBetweenLocs(Mnm.u, mk.lastX, mk.lastY, x, y)) then
                            call Mnm.removeUnit()
                            call SaveInteger(suppressionHashTable, 0, nbMonstersRemoved, integer(Mnm))
                            set nbMonstersRemoved = nbMonstersRemoved + 1
                        endif
                    endif
                set i = i + 1
            endloop
        endif
        
        //simple patrol
        if (mk.getMode() == "all" or mk.getMode() == "move" or mk.getMode() == "simplePatrol") then
            set i = 0
            loop
                exitwhen (i > escaper.getMakingLevel().monstersSimplePatrol.getLastInstanceId())
                    set Msp = escaper.getMakingLevel().monstersSimplePatrol.get(i)
                    if (Msp != 0) then
                        if (Msp.u != null and IsUnitBetweenLocs(Msp.u, mk.lastX, mk.lastY, x, y)) then
                            call Msp.removeUnit()
                            call SaveInteger(suppressionHashTable, 0, nbMonstersRemoved, integer(Msp))
                            set nbMonstersRemoved = nbMonstersRemoved + 1
                        endif
                    endif
                set i = i + 1
            endloop        
        endif
        
        //multiple patrol
        if (mk.getMode() == "all" or mk.getMode() == "move" or mk.getMode() == "multiplePatrols") then
            set i = 0
            loop
                exitwhen (i > escaper.getMakingLevel().monstersMultiplePatrols.getLastInstanceId())
                    set Mmp = escaper.getMakingLevel().monstersMultiplePatrols.get(i)
                    if (Mmp != 0) then
                        if (Mmp.u != null and IsUnitBetweenLocs(Mmp.u, mk.lastX, mk.lastY ,x, y)) then
                            call Mmp.removeUnit()
                            call SaveInteger(suppressionHashTable, 0, nbMonstersRemoved, integer(Mmp))
                            set nbMonstersRemoved = nbMonstersRemoved + 1
                        endif
                    endif
                set i = i + 1
            endloop        
        endif
        
        //teleport
        if (mk.getMode() == "all") then
            set i = 0
            loop
                exitwhen (i > escaper.getMakingLevel().monstersTeleport.getLastInstanceId())
                    set Mt = escaper.getMakingLevel().monstersTeleport.get(i)
                    if (Mt != 0) then
                        if (Mt.u != null and IsUnitBetweenLocs(Mt.u, mk.lastX, mk.lastY ,x, y)) then
                            call Mt.removeUnit()
                            call SaveInteger(suppressionHashTable, 0, nbMonstersRemoved, integer(Mt))
                            set nbMonstersRemoved = nbMonstersRemoved + 1
                        endif
                    endif
                set i = i + 1
            endloop        
        endif
    endif
    
    if (nbMonstersRemoved <= 1) then
        call Text_mkP(mk.makerOwner, I2S(nbMonstersRemoved) + " monster removed.")
    else
        call Text_mkP(mk.makerOwner, I2S(nbMonstersRemoved) + " monsters removed.")
    endif
    
	if (nbMonstersRemoved > 0) then
		call escaper.newAction(MakeDeleteMonstersAction.create(escaper.getMakingLevel(), suppressionHashTable))
    endif
    
    call mk.unsaveLocDefinitely()
    
    call FlushParentHashtable(suppressionHashTable)
    set suppressionHashTable = null
endfunction



endlibrary

