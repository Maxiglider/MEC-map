//TESH.scrollpos=0
//TESH.alwaysfold=0
globals
	TerrainTypeArray udg_terrainTypes = 0
endglobals


function InitTrig_Init_terrain_types takes nothing returns nothing
	if (udg_terrainTypes == 0) then
		set udg_terrainTypes = TerrainTypeArray.create()
		call udg_terrainTypes.newSlide("slide", 'Nice', 550)
		call udg_terrainTypes.newWalk("walk", 'Lgrd', 522)
		call udg_terrainTypes.newDeath("death", 'Ywmb', "", 2.000, 25.000)
	endif
endfunction

