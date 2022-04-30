//TESH.scrollpos=0
//TESH.alwaysfold=0
globals
	TerrainTypeArray udg_terrainTypes = 0
endglobals


function InitTrig_Init_terrain_types takes nothing returns nothing
	if (udg_terrainTypes == 0) then
		set udg_terrainTypes = TerrainTypeArray.create()
		call udg_terrainTypes.newSlide("s", 'Nsnw', 575)
		call udg_terrainTypes.newSlide("sr", 'Nice', 1000)
		call udg_terrainTypes.newWalk("w", 'Ngrs', 522)
		call udg_terrainTypes.newDeath("d", 'Fgrd', "", 0.000, 25.000)
	endif
endfunction

