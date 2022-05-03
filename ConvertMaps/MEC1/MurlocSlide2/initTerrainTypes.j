globals
	TerrainTypeArray udg_terrainTypes = 0
endglobals


function InitTrig_Init_terrain_types takes nothing returns nothing
	if (udg_terrainTypes == 0) then
		set udg_terrainTypes = TerrainTypeArray.create()
		call udg_terrainTypes.newSlide("slide", 'Nsnw', 550).setAlias("s").setOrderId(1)
		call udg_terrainTypes.newWalk("walkCheckpoint", 'Yblm', 522).setAlias("wc").setOrderId(4)
		call udg_terrainTypes.newWalk("walkMeteor", 'Ngrs', 522).setAlias("wm").setOrderId(2)
		call udg_terrainTypes.newDeath("death", 'Cvin', "Abilities\\Spells\\NightElf\\EntanglingRoots\\EntanglingRootsTarget.mdl", 2.000, 0.000).setAlias("d").setOrderId(3)
	endif
endfunction

