globals
	MonsterTypeArray udg_monsterTypes = 0
	CasterTypeArray udg_casterTypes = 0
endglobals


function InitTrig_Init_monster_and_caster_types takes nothing returns nothing
	if (udg_monsterTypes == 0) then
		set udg_monsterTypes = MonsterTypeArray.create()
		call udg_monsterTypes.new("crabe", 'crab', 1.000, 50, 400.000, false).setAlias("c").setKillingEffectStr("Abilities\\Spells\\NightElf\\FanOfKnives\\FanOfKnivesCaster.mdl")
		call udg_monsterTypes.new("ogre", 'nomg', 1.000, 85, 400.000, false).setAlias("o").setKillingEffectStr("Abilities\\Spells\\Undead\\FrostNova\\FrostNovaTarget.mdl")
		call udg_monsterTypes.new("geant", 'gean', 1.000, 105, 225.000, false).setAlias("g").setKillingEffectStr("Abilities\\Spells\\Orc\\WarStomp\\WarStompCaster.mdl")
		call udg_monsterTypes.new("indomptable", 'nowk', 3.000, 200, 400.000, true).setNbMeteorsToKill(3)
		call udg_monsterTypes.new("ancien", 'nsqa', 2.500, 150, 400.000, true)
		call udg_monsterTypes.new("miniOgre", 'nomg', 0.650, 50, 400.000, false).setAlias("mo").setKillingEffectStr("Abilities\\Spells\\Undead\\FrostNova\\FrostNovaTarget.mdl")
	endif

	if (udg_casterTypes == 0) then
		set udg_casterTypes = CasterTypeArray.create()
		call udg_casterTypes.new("caster0", udg_monsterTypes.get("trololo"), udg_monsterTypes.get("tank"), 1000.000, 650.000, 1.000, "attack").setAlias("Ctank")
	endif
endfunction

