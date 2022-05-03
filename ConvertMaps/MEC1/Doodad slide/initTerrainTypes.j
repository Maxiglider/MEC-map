globals
	TerrainTypeArray udg_terrainTypes = 0
endglobals


function InitTrig_Init_terrain_types takes nothing returns nothing
	if (udg_terrainTypes == 0) then
		set udg_terrainTypes = TerrainTypeArray.create()
		call udg_terrainTypes.newSlide("sl", 'Glav', 300).setOrderId(1)
		call udg_terrainTypes.newSlide("sn", 'Avin', 550).setOrderId(2)
		call udg_terrainTypes.newSlide("sr", 'Adrd', 750).setOrderId(3)
		call udg_terrainTypes.newSlide("rs", 'Adrg', -450).setOrderId(4)
		call udg_terrainTypes.newWalk("w", 'Bgrr', 522).setOrderId(5)
		call udg_terrainTypes.newDeath("d", 'Lgrd', "Abilities\\Spells\\Undead\\DeathCoil\\DeathCoilSpecialArt.mdl", 0.010, 30.000).setOrderId(6)
	endif
endfunction

