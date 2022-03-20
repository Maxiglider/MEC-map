//TESH.scrollpos=0
//TESH.alwaysfold=0
library EscaperFunctions needs Text



function ColorInfo takes Escaper escaperToGetInfo, player playerToDisplay returns nothing
    local integer baseColor = escaperToGetInfo.getBaseColor()
	local string red = I2S(R2I(escaperToGetInfo.getVcRed()))
	local string green = I2S(R2I(escaperToGetInfo.getVcGreen()))
	local string blue = I2S(R2I(escaperToGetInfo.getVcBlue()))
	local string transparency = I2S(R2I(escaperToGetInfo.getVcTransparency()))
    call Text_P(playerToDisplay, "Base color : " + udg_colorCode[baseColor] + udg_baseColorString[baseColor])
    call Text_P(playerToDisplay, udg_colorCode[0] + "red     :  " + red + "  %")
    call Text_P(playerToDisplay, udg_colorCode[6] + "green :  " + green + "  %")
    call Text_P(playerToDisplay, udg_colorCode[1] + "blue   :  " + blue + "  %")
    call Text_P(playerToDisplay, udg_colorCode[8] + "transparency : " + transparency + "  %" )
endfunction


function Hero2Escaper takes unit hero returns Escaper
    if (GetUnitTypeId(hero) == HERO_TYPE_ID or GetUnitTypeId(hero) == HERO_SECONDARY_TYPE_ID) then
        return udg_escapers.get(GetUnitUserData(hero))
    endif
    return 0
endfunction


function IsHero takes unit U returns boolean
    local integer i = 0
    loop
        exitwhen (i >= NB_ESCAPERS)
            if (udg_escapers.get(i).getHero() == U) then
                return true
            endif
        set i = i + 1
    endloop
    return false
endfunction


function isSecondaryHero takes unit U returns boolean
	return IsHero(U) and GetUnitUserData(U) >= NB_PLAYERS_MAX
endfunction


function MainSliderToSecondaryOne takes unit mainSlider returns unit
	local integer secondaryEscaperId = GetUnitUserData(mainSlider) + NB_PLAYERS_MAX
	return udg_escapers.get(secondaryEscaperId).getHero()
endfunction


function MainEscaperToSecondaryOne takes Escaper e returns Escaper
	return udg_escapers.get(e.getEscaperId() + NB_PLAYERS_MAX)
endfunction


function GetMirrorEscaper takes Escaper e returns Escaper
	local integer mirrorEscaperId
	if (e.getEscaperId() >= NB_PLAYERS_MAX) then
		set mirrorEscaperId = e.getEscaperId() - NB_PLAYERS_MAX
	else
		set mirrorEscaperId = e.getEscaperId() + NB_PLAYERS_MAX
	endif

	return udg_escapers.get(mirrorEscaperId)
endfunction


function ForceSelectHeroes takes Escaper e returns nothing
	local player p = e.getControler().getPlayer()
	call ClearSelectionForPlayer(p)
	call e.selectHero()
	call GetMirrorEscaper(e).selectHero()
endfunction


function escaperId2playerId takes integer escaperId returns integer
	if (escaperId >= NB_PLAYERS_MAX) then
		return escaperId - NB_PLAYERS_MAX
	else
		return escaperId
	endif
endfunction

endlibrary