//TESH.scrollpos=0
//TESH.alwaysfold=0
library MMMultiplePatrolsActions needs BasicFunctions, Escaper


function MonsterMakingMultiplePatrols_Actions takes nothing returns nothing
    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local Make mkGeneral = escaper.getMake()
	local MakeMonsterMultiplePatrols mk = MakeMonsterMultiplePatrols(integer(mkGeneral))
    local real x = GetOrderPointX()
    local real y = GetOrderPointY()
    local integer erreur

    if (not IsIssuedOrder("smart")) then
        return
    endif
    call StopUnit(mk.maker)
    
	
	if (mk.getLocPointeur() >= 0) then
        set erreur = mk.getMonster().addNewLoc(x, y)
        if (erreur > 0) then
            if (erreur == 3) then
                call Text_erP(mk.makerOwner, "Number limit of patrol locations reached for this monster ! ( " + I2S(MonsterMultiplePatrols.NB_MAX_LOC) + " )")
            endif
            if (erreur == 2) then
                call Text_erP(mk.makerOwner, "Too close to the last location !")
            endif
            if (erreur == 1) then
                call Text_erP(mk.makerOwner, "Too close to the first location !")
            endif
        else
			call mk.saveLoc(x, y)
		endif		
	else
		call MonsterMultiplePatrols.destroyLocs()
		call MonsterMultiplePatrols.storeNewLoc(x, y)
		call mk.saveLoc(x, y)
		call mk.setMonster(escaper.getMakingLevel().monstersMultiplePatrols.new(mk.getMonsterType(), mk.getMode(), true))
	endif
endfunction



endlibrary

