//TESH.scrollpos=0
//TESH.alwaysfold=0
library VisibilityModifierMakingActions needs Escaper



function VisibilityModifierMaking_Actions takes nothing returns nothing
    local VisibilityModifier newVisibilityModifier
    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local Make mkGeneral = escaper.getMake()
	local MakeVisibilityModifier mk = MakeVisibilityModifier(integer(mkGeneral))
    local real x = GetOrderPointX()
    local real y = GetOrderPointY()
    
    if (not IsIssuedOrder("smart")) then   
        return
    endif
    call StopUnit(mk.maker)
    
	
    if (mk.isLastLocSavedUsed()) then
        set newVisibilityModifier = escaper.getMakingLevel().newVisibilityModifier(mk.lastX, mk.lastY, x, y)
        if (newVisibilityModifier == 0) then
            call Text_erP(mk.makerOwner, "can't create visibility, full for this level")
        else
            call newVisibilityModifier.activate(true)
            call escaper.newAction(MakeVisibilityModifierAction.create(escaper.getMakingLevel(), newVisibilityModifier))
            call Text_mkP(mk.makerOwner, "visibility rectangle made for level " + I2S(escaper.getMakingLevel().getId()))
         endif
        call mk.unsaveLocDefinitely()
    else
        call mk.saveLoc(x, y)
    endif
endfunction



endlibrary