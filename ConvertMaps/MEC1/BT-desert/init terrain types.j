//TESH.scrollpos=0
//TESH.alwaysfold=0
globals
	TerrainTypeArray udg_terrainTypes = 0
endglobals


function InitTrig_Init_terrain_types takes nothing returns nothing
	if (udg_terrainTypes == 0) then
		set udg_terrainTypes = TerrainTypeArray.create()
		call udg_terrainTypes.newSlide("s", 'Bdsr', 550)
		call udg_terrainTypes.newWalk("w", 'Bgrr', 522)
		call udg_terrainTypes.newDeath("d", 'Bdsd', "", 0.000, 20.000)
	endif
endfunction


