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
    if (GetUnitTypeId(hero) == HERO_TYPE_ID) then
        return udg_escapers.get(GetUnitUserData(hero))
    endif
    return 0
endfunction



endlibrary

