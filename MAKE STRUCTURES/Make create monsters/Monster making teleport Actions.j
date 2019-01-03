//TESH.scrollpos=0
//TESH.alwaysfold=0
library MMTeleportActions needs BasicFunctions, Escaper


function MonsterMakingTeleport_Actions takes nothing returns nothing
    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local Make mkGeneral = escaper.getMake()
	local MakeMonsterTeleport mk = MakeMonsterTeleport(integer(mkGeneral))
    local real x = GetOrderPointX()
    local real y = GetOrderPointY()

    if (not IsIssuedOrder("smart")) then
        return
    endif
    call StopUnit(mk.maker)
    
	
	if (mk.getLocPointeur() >= 0) then 
        if (not mk.getMonster().addNewLoc(x, y)) then
            call Text_erP(mk.makerOwner, "Number limit of actions reached for this monster ! ( " + I2S(MonsterTeleport.NB_MAX_LOC) + " )")
        else
			call mk.saveLoc(x, y)
		endif		
	else
		call MonsterTeleport.destroyLocs()
		call MonsterTeleport.storeNewLoc(x, y)
		call mk.saveLoc(x, y)
		call mk.setMonster(escaper.getMakingLevel().monstersTeleport.new(mk.getMonsterType(), mk.getPeriod(), mk.getAngle(), mk.getMode(), true))
	endif
endfunction



endlibrary

