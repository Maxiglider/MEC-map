//TESH.scrollpos=2
//TESH.alwaysfold=0
library Gravity initializer InitGravity


globals
    private real gravity
endglobals


function SetGravity takes real newGravity returns nothing
    set gravity = newGravity * SLIDE_PERIOD
endfunction

function GetGravity takes nothing returns real
    return gravity
endfunction

function GetRealGravity takes nothing returns real
    return gravity / SLIDE_PERIOD
endfunction


function InitGravity takes nothing returns nothing
    set gravity = -45 * SLIDE_PERIOD
endfunction


endlibrary