globals
	TerrainTypeArray udg_terrainTypes = 0
endglobals


function InitTrig_Init_terrain_types takes nothing returns nothing
	if (udg_terrainTypes == 0) then
		set udg_terrainTypes = TerrainTypeArray.create()
		call udg_terrainTypes.newSlide("slide", 'Nice', 550).setAlias("s").setOrderId(1)
		call udg_terrainTypes.newSlide("slideLent", 'Nsnw', 300).setAlias("sl").setOrderId(1)
		call udg_terrainTypes.newSlide("slideRapide", 'Glav', 850).setAlias("sr").setOrderId(1)
		call udg_terrainTypes.newWalk("walk", 'cQc1', 522).setAlias("w").setOrderId(1)
		call udg_terrainTypes.newDeath("death", 'Vrck', "Abilities\\Spells\\Orc\\Ensnare\\ensnareTarget.mdl", 2.000, 0.000).setAlias("d").setOrderId(1)
	endif
endfunction

