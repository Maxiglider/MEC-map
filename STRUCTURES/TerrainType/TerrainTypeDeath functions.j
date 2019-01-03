//TESH.scrollpos=0
//TESH.alwaysfold=0
library TerrainTypeDeathFunctions needs TerrainType




function TerrainKillTimer2Escaper takes timer theTimer returns Escaper
	local trigger terrainKillTrigger = GetTriggeringTrigger()
	local integer terrainTypeDeathMaxId = udg_terrainTypes.numberOfDeath - 1
	local integer terrainTypeDeathId 
	local integer escaperId = 0
	
	set terrainTypeDeathId = 0
	loop
		exitwhen (terrainTypeDeathId > terrainTypeDeathMaxId)
			set escaperId = 0
			loop
				exitwhen (escaperId > 11)
					if (theTimer == udg_terrainTypes.getDeath(terrainTypeDeathId).getTimer(escaperId)) then
                        return udg_escapers.get(escaperId)
                    endif
				set escaperId = escaperId + 1
			endloop
		set terrainTypeDeathId = terrainTypeDeathId + 1
	endloop
    
	return 0
endfunction


function DeathTerrainKillEscaper_Actions takes nothing returns nothing
	local Escaper escaper = TerrainKillTimer2Escaper(GetExpiredTimer())
    if (escaper == 0) then
        return
    endif
	call escaper.pause(false)
	call escaper.destroyTerrainKillEffect()	
	if (escaper.currentLevelTouchTerrainDeath == udg_levels.getCurrentLevel()) then
		call escaper.kill()
    else
        if(escaper.isAlive())then
            call escaper.enableCheckTerrain(true)
        endif
	endif
endfunction


endlibrary

