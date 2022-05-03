globals
	MonsterTypeArray udg_monsterTypes = 0
	CasterTypeArray udg_casterTypes = 0
endglobals


function InitTrig_Init_monster_and_caster_types takes nothing returns nothing
	if (udg_monsterTypes == 0) then
		set udg_monsterTypes = MonsterTypeArray.create()
		call udg_monsterTypes.new("pretre", 'hmpr', 1.500, 55, 350.000, false).setAlias("pre").setKillingEffectStr("Abilities\\Spells\\Human\\Heal\\HealTarget.mdl").setHeight(0)
		call udg_monsterTypes.new("marine", 'zmar', 1.500, 55, 355.000, false).setAlias("mar").setKillingEffectStr("Abilities\\Weapons\\FragDriller\\FragDriller.mdl").setHeight(0)
		call udg_monsterTypes.new("sorciere", 'hsor', 1.250, 40, 300.000, false).setAlias("sor").setKillingEffectStr("Objects\\Spawnmodels\\Undead\\ImpaleTargetDust\\ImpaleTargetDust.mdl").setHeight(0)
		call udg_monsterTypes.new("gargouille", 'ugrm', 1.000, 45, 400.000, false).setAlias("gar").setKillingEffectStr("Objects\\Spawnmodels\\NightElf\\NEDeathSmall\\NEDeathSmall.mdl").setHeight(0)
		call udg_monsterTypes.new("trappe", 'ucry', 1.000, 65, 400.000, false).setAlias("tra").setKillingEffectStr("Abilities\\Spells\\Undead\\Impale\\ImpaleMissTarget.mdl").setHeight(0)
		call udg_monsterTypes.new("chariot", 'umtw', 3.000, 400, 400.000, true).setHeight(0)
		call udg_monsterTypes.new("trololo", 'hmtt', 1.000, 75, 400.000, false).setHeight(0)
		call udg_monsterTypes.new("tank", 'hmtt', 1.500, 90, 450.000, false).setAlias("tan").setKillingEffectStr("Units\\NightElf\\Wisp\\WispExplode.mdl").setHeight(0)
		call udg_monsterTypes.new("beteKodo", 'okod', 3.000, 400, 400.000, true).setNbMeteorsToKill(3).setHeight(0)
		call udg_monsterTypes.new("Footmen", 'hfoo', 1.700, 55, 350.000, false).setAlias("foo").setHeight(0)
	endif

	if (udg_casterTypes == 0) then
		set udg_casterTypes = CasterTypeArray.create()
		call udg_casterTypes.new("caster0", udg_monsterTypes.get("trololo"), udg_monsterTypes.get("tank"), 1000.000, 650.000, 1.000, "attack").setAlias("Ctank")
	endif
endfunction

