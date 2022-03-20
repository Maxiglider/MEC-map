//TESH.scrollpos=0
//TESH.alwaysfold=0
function InitTrig_Init_terrain_limit_variables takes nothing returns nothing
    set MAP_MIN_X = GetRectMinX(GetWorldBounds())
    set MAP_MAX_X = GetRectMaxX(GetWorldBounds())
    set MAP_MIN_Y = GetRectMinY(GetWorldBounds())
    set MAP_MAX_Y = GetRectMaxY(GetWorldBounds())
endfunction

