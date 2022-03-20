library ColorCodes initializer InitColorCodes


globals
    string array udg_colorCode
    string array udg_baseColorString
    string COLOR_TERRAIN_SLIDE 
    string COLOR_TERRAIN_WALK
    string COLOR_TERRAIN_DEATH
endglobals



function InitColorCodes takes nothing returns nothing

    set udg_colorCode[ 0 ] = "|cffff0303" //red
    set udg_colorCode[ 1 ] = "|cff0042ff" //blue
    set udg_colorCode[ 2 ] = "|cff1ce6b9" //teal
    set udg_colorCode[ 3 ] = "|cff540081" //purple
    set udg_colorCode[ 4 ] = "|cfffffc01" //yellow
    set udg_colorCode[ 5 ] = "|cfffeba0e" //orange
    set udg_colorCode[ 6 ] = "|cff20c000" //green
    set udg_colorCode[ 7 ] = "|cffe55bb0" //pink
    set udg_colorCode[ 8 ] = "|cff959697" //grey
    set udg_colorCode[ 9 ] = "|cff7ebff1" //lightblue
    set udg_colorCode[10 ] = "|cff106246" //darkgreen
    set udg_colorCode[11 ] = "|cFF4A2800" //brown
    set udg_colorCode[12 ] = "|cff9c0000" //maroon
    set udg_colorCode[13 ] = "|cff0000c3" //navy
    set udg_colorCode[14 ] = "|cff00ebff" //turquoise
    set udg_colorCode[15 ] = "|cffbd00ff" //violet
    set udg_colorCode[16 ] = "|cffecce87" //wheat
    set udg_colorCode[17 ] = "|cfff7a58b" //peach
    set udg_colorCode[18 ] = "|cffbfff81" //mint
    set udg_colorCode[19 ] = "|cffdbb8eb" //lavender
    set udg_colorCode[20 ] = "|cff4f5055" //coal
    set udg_colorCode[21 ] = "|cffecf0ff" //snow
    set udg_colorCode[22 ] = "|cff00781e" //emerald
    set udg_colorCode[23 ] = "|cffa56f34" //peanut

    set udg_baseColorString[ 0 ] = udg_colorCode[ 0 ] + "red"
    set udg_baseColorString[ 1 ] = udg_colorCode[ 1 ] + "blue"
    set udg_baseColorString[ 2 ] = udg_colorCode[ 2 ] + "teal"
    set udg_baseColorString[ 3 ] = udg_colorCode[ 3 ] + "purple"
    set udg_baseColorString[ 4 ] = udg_colorCode[ 4 ] + "yellow"
    set udg_baseColorString[ 5 ] = udg_colorCode[ 5 ] + "orange"
    set udg_baseColorString[ 6 ] = udg_colorCode[ 6 ] + "green"
    set udg_baseColorString[ 7 ] = udg_colorCode[ 7 ] + "pink"
    set udg_baseColorString[ 8 ] = udg_colorCode[ 8 ] + "grey"
    set udg_baseColorString[ 9 ] = udg_colorCode[ 9 ] + "lightblue"
    set udg_baseColorString[10 ] = udg_colorCode[10 ] + "darkgreen"
    set udg_baseColorString[11 ] = udg_colorCode[11 ] + "brown"
    set udg_baseColorString[12 ] = udg_colorCode[12 ] + "maroon"
    set udg_baseColorString[13 ] = udg_colorCode[13 ] + "navy"
    set udg_baseColorString[14 ] = udg_colorCode[14 ] + "turquoise"
    set udg_baseColorString[15 ] = udg_colorCode[15 ] + "violet"
    set udg_baseColorString[16 ] = udg_colorCode[16 ] + "wheat"
    set udg_baseColorString[17 ] = udg_colorCode[17 ] + "peach"
    set udg_baseColorString[18 ] = udg_colorCode[18 ] + "mint"
    set udg_baseColorString[19 ] = udg_colorCode[19 ] + "lavender"
    set udg_baseColorString[20 ] = udg_colorCode[20 ] + "coal"
    set udg_baseColorString[21 ] = udg_colorCode[21 ] + "snow"
    set udg_baseColorString[22 ] = udg_colorCode[22 ] + "emerald"
    set udg_baseColorString[23 ] = udg_colorCode[23 ] + "peanut"


    set COLOR_TERRAIN_SLIDE = udg_colorCode[TEAL]
    set COLOR_TERRAIN_WALK = udg_colorCode[GREEN]
    set COLOR_TERRAIN_DEATH = udg_colorCode[ORANGE]

endfunction



function ColorString2Id takes string colorString returns integer
    if (colorString == "red" or colorString == "rd") then
        return 0
    endif
    if (colorString == "blue" or colorString == "be") then
        return 1
    endif
    if (colorString == "teal" or colorString == "tl") then
        return 2
    endif
    if (colorString == "purple" or colorString == "pe") then
        return 3
    endif
    if (colorString == "yellow" or colorString == "yw") then
        return 4
    endif
    if (colorString == "orange" or colorString == "oe") then
        return 5
    endif
    if (colorString == "green" or colorString == "gn") then
        return 6
    endif
    if (colorString == "pink" or colorString == "pk") then
        return 7
    endif
    if (colorString == "grey" or colorString == "gray" or colorString == "gy") then
        return 8
    endif
    if (colorString == "lightblue" or colorString == "lb") then
        return 9
    endif
    if (colorString == "darkgreen" or colorString == "dg") then
        return 10
    endif
    if (colorString == "brown" or colorString == "bn") then
        return 11
    endif
    if (colorString == "maroon" or colorString == "mrn") then
    	return 12
    endif
    if (colorString == "navy" or colorString == "ny") then
    	return 13
    endif
    if (colorString == "turquoise" or colorString == "tqe") then
    	return 14
    endif
    if (colorString == "violet" or colorString == "vlt") then
    	return 15
    endif
    if (colorString == "wheat" or colorString == "wht") then
    	return 16
    endif
    if (colorString == "peach" or colorString == "ph") then
    	return 17
    endif
    if (colorString == "mint") then
    	return 18
    endif
    if (colorString == "lavender" or colorString == "lvr") then
    	return 19
    endif
    if (colorString == "coal") then
    	return 20
    endif
    if (colorString == "snow" or colorString == "snw") then
    	return 21
    endif
    if (colorString == "emerald" or colorString == "emd") then
    	return 22
    endif
    if (colorString == "peanut" or colorString == "pnt") then
    	return 23
    endif
    return -1
endfunction


endlibrary
