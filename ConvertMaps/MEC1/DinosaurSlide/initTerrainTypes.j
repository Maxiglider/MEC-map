globals
	TerrainTypeArray udg_terrainTypes = 0
endglobals


function InitTrig_Init_terrain_types takes nothing returns nothing
	if (udg_terrainTypes == 0) then
		set udg_terrainTypes = TerrainTypeArray.create()
		call udg_terrainTypes.newSlide("slide", 'Bgrr', 550).setAlias("s").setOrderId(3)
		call udg_terrainTypes.newSlide("slideReverse", 'Nice', -500).setAlias("si").setOrderId(4)
		call udg_terrainTypes.newSlide("slideRapide", 'Ygsb', 900).setAlias("sr").setOrderId(2)
		call udg_terrainTypes.newWalk("walk", 'Xdtr', 522).setAlias("w").setOrderId(1)
		call udg_terrainTypes.newDeath("death", 'Agrs', "Abilities\\Spells\\Undead\\Impale\\ImpaleHitTarget.mdl", 0.400, 0.000).setAlias("d").setOrderId(5)
	endif
endfunction

