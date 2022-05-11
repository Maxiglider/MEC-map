globals
	MonsterTypeArray udg_monsterTypes = 0
	CasterTypeArray udg_casterTypes = 0
endglobals


function InitTrig_Init_monster_and_caster_types takes nothing returns nothing
	if (udg_monsterTypes == 0) then
		set udg_monsterTypes = MonsterTypeArray.create()
		call udg_monsterTypes.new("trex", 'trex', 2.000, 60, 450.000, false).setKillingEffectStr("Abilities\\Spells\\Undead\\DarkRitual\\DarkRitualTarget.mdl")
		call udg_monsterTypes.new("steg", 'steg', 1.000, 80, 300.000, false).setKillingEffectStr("Abilities\\Spells\\Human\\slow\\slowtarget.mdl")
		call udg_monsterTypes.new("allo", 'allo', 0.900, 90, 400.000, false).setKillingEffectStr("Abilities\\Spells\\Human\\Avatar\\AvatarCaster.mdl")
		call udg_monsterTypes.new("diplodocus", 'dipo', 1.200, 350, 400.000, false).setAlias("diplo")
		call udg_monsterTypes.new("ptera", 'pton', 1.000, 60, 400.000, false).setKillingEffectStr("Abilities\\Spells\\Orc\\LightningShield\\LightningShieldTarget.mdl")
		call udg_monsterTypes.new("ptero", 'ptro', 1.000, 60, 400.000, false).setKillingEffectStr("Abilities\\Spells\\Human\\HolyBolt\\HolyBoltSpecialArt.mdl")
		call udg_monsterTypes.new("dragon", 'drag', 1.000, 80, 400.000, false)
		call udg_monsterTypes.new("sucho", 'such', 2.800, 85, 350.000, false).setKillingEffectStr("Abilities\\Spells\\Undead\\FrostArmor\\FrostArmorTarget.mdl")
		call udg_monsterTypes.new("plante", 'plan', 1.500, 70, 400.000, false).setKillingEffectStr("Abilities\\Spells\\NightElf\\CorrosiveBreath\\ChimaeraAcidTargetArt.mdl")
		call udg_monsterTypes.new("bouleDeFeu", 'bfeu', 1.000, 60, 400.000, false).setKillingEffectStr("Abilities\\Weapons\\DemolisherFireMissile\\DemolisherFireMissile.mdl")
		call udg_monsterTypes.new("edaphosaurus", 'edap', 3.500, 220, 400.000, true).setAlias("edap")
	endif

	if (udg_casterTypes == 0) then
		set udg_casterTypes = CasterTypeArray.create()
		call udg_casterTypes.new("dragon", udg_monsterTypes.get("dragon"), udg_monsterTypes.get("bouleDeFeu"), 1000.000, 700.000, 1.700, "spell").setAlias("dra")
	endif
endfunction

