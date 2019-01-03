//TESH.scrollpos=6
//TESH.alwaysfold=0
globals
    string array udg_colorCode
    string array udg_baseColorString
    string COLOR_TERRAIN_SLIDE 
    string COLOR_TERRAIN_WALK
    string COLOR_TERRAIN_DEATH
endglobals



function Trig_init_colorCodes_Actions takes nothing returns nothing

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
    set udg_colorCode[12 ] = "|c33333333" //black

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
    set udg_baseColorString[12 ] = udg_colorCode[12 ] + "black"
    
    set COLOR_TERRAIN_SLIDE = udg_colorCode[TEAL]
    set COLOR_TERRAIN_WALK = udg_colorCode[GREEN]
    set COLOR_TERRAIN_DEATH = udg_colorCode[ORANGE]

endfunction

//===========================================================================
function InitTrig_Init_colorCodes takes nothing returns nothing
    set gg_trg_Init_colorCodes = CreateTrigger(  )
    call TriggerAddAction( gg_trg_Init_colorCodes, function Trig_init_colorCodes_Actions )
endfunction

