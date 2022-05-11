globals
	TerrainTypeArray udg_terrainTypes = 0
endglobals


function InitTrig_Init_terrain_types takes nothing returns nothing
	if (udg_terrainTypes == 0) then
		set udg_terrainTypes = TerrainTypeArray.create()
		call udg_terrainTypes.setMainTileset("auto")
		call udg_terrainTypes.newSlide("slide", 'Nice', 525, true).setCliffClassId(1)
		call udg_terrainTypes.newSlide("reverse", 'Iice', -450, true).setCliffClassId(1)
		call udg_terrainTypes.newWalk("walk", 'Wgrs', 522).setCliffClassId(1)
		call udg_terrainTypes.newDeath("death", 'Nsnw', "", 2.000, 20.000).setCliffClassId(1)
	endif
endfunction
