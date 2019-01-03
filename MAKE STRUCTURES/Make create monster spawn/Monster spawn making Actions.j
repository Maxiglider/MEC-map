//TESH.scrollpos=0
//TESH.alwaysfold=0
library MonsterSpawnMakingActions needs Escaper



function MonsterSpawnMaking_Actions takes nothing returns nothing
    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local Make mkGeneral = escaper.getMake()
	local MakeMonsterSpawn mk = MakeMonsterSpawn(integer(mkGeneral))
    local real x = GetOrderPointX()
    local real y = GetOrderPointY()
    local Level level
    
    if (not IsIssuedOrder("smart")) then   
        return
    endif
    call StopUnit(mk.maker)
    
	
    if (mk.isLastLocSavedUsed()) then
        set level = escaper.getMakingLevel()
        if(level.monsterSpawns.new(mk.label, mk.mt, mk.sens, mk.frequence, mk.lastX, mk.lastY, x, y, true) != 0)then
            call Text_mkP(mk.makerOwner, "monster spawn \"" + mk.label + "\" created")
            call escaper.destroyMake()
        else
            call Text_erP(mk.makerOwner, "impossible to create monster spawn \"" + mk.label + "\", label propably already in use")
        endif
    else
        call mk.saveLoc(x, y)
    endif
endfunction



endlibrary