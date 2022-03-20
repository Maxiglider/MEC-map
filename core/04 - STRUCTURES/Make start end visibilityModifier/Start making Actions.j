//TESH.scrollpos=0
//TESH.alwaysfold=0
library StartMakingActions needs Escaper



function StartMaking_Actions takes nothing returns nothing
    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local Make mkGeneral = escaper.getMake()
	local MakeStart mk = MakeStart(integer(mkGeneral))
    local real x = GetOrderPointX()
    local real y = GetOrderPointY()
    local Level level
    
    if (not IsIssuedOrder("smart")) then   
        return
    endif
    call StopUnit(mk.maker)
    
	
    if (mk.isLastLocSavedUsed()) then
        set level = escaper.getMakingLevel()
        if (mk.forNext()) then
            if (udg_levels.get(level.getId() + 1) == 0) then
                if (not udg_levels.new()) then
                    call Text_erP(escaper.getPlayer(), "nombre maximum de niveaux atteint")
                    call escaper.destroyMake()
                    return
                endif
            endif
            set level = udg_levels.get(level.getId() + 1)
            if (level == 0) then
                call Text_erP(escaper.getPlayer(), "erreur d'origine inconnue")
                call escaper.destroyMake()
                return
            endif
        endif
        call level.newStart(mk.lastX, mk.lastY, x, y)
        call Text_mkP(mk.makerOwner, "start made for level " + I2S(level.getId()))
        call escaper.destroyMake()
    else
        call mk.saveLoc(x, y)
    endif
endfunction



endlibrary
