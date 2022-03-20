//TESH.scrollpos=0
//TESH.alwaysfold=0
library Apm initializer Init_Apm needs BasicFunctions


globals
    integer array nbClicsOnSlide
    real array timeOnSlide
endglobals



function Init_Apm takes nothing returns nothing
    local integer i = 0
    loop
        exitwhen (i >= NB_ESCAPERS)
            set nbClicsOnSlide[i] = 0
            set timeOnSlide[i] = 0.
        set i = i + 1
    endloop
endfunction



function DisplayApm takes integer playerId returns nothing
    local real time = timeOnSlide[playerId]
    local integer clics 
    local integer apm
    if (time > 0.) then
        set clics = nbClicsOnSlide[playerId]
        set apm = R2I(I2R(clics) * 60. / time)
        call Text_P(Player(playerId), udg_colorCode[playerId] + "clics : " + I2S(clics) + ",  time : " + I2S(R2I(time)) + ",  apm : " + I2S(apm))
    else
        call Text_P(Player(playerId), udg_colorCode[playerId] + "unknown")
    endif
endfunction


function DisplayApmAll takes integer playerId returns nothing
    local integer clics
    local real time
    local integer apm
    
    local integer i = 0
    loop
        exitwhen (i > 11)
            if (udg_escapers.get(i) != 0) then
                set time = timeOnSlide[i]
                if (time > 0.) then
                    set clics = nbClicsOnSlide[i]
                    set apm = R2I( I2R(clics) * 60. / time )
                    call Text_P(Player(playerId), udg_colorCode[i] + GetPlayerName(Player(i)) + ":  clics : " + I2S(clics) + ",  time : " + I2S(R2I(time)) + ",  apm : " + I2S(apm))
                else
                    call Text_P(Player(playerId), udg_colorCode[i] + GetPlayerName(Player(i)) + ":  unknown")
                endif
            endif
        set i = i + 1
    endloop
endfunction


endlibrary