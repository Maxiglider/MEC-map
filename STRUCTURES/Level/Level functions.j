//TESH.scrollpos=0
//TESH.alwaysfold=0
library LevelFunctions


function IsLevelBeingMade takes Level level returns boolean
    local integer i = 0
    loop
        exitwhen (i > 11)
            if (udg_escapers.get(i) != 0) then
                if (udg_escapers.get(i).getMakingLevel() == level) then
                    return true
                endif
            endif
        set i = i + 1
    endloop
    return (udg_levels.getCurrentLevel() == level)
endfunction


endlibrary

