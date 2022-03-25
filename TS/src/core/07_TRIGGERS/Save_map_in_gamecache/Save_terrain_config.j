//TESH.scrollpos=0
//TESH.alwaysfold=0
library SaveTerrainConfigInCache needs Text




function SaveTerrainConfig takes nothing returns nothing
    call udg_terrainTypes.saveInCache()
    call Text_A("terrain configuration saved")
endfunction





endlibrary