//TESH.scrollpos=0
//TESH.alwaysfold=0
globals
	MonsterTypeArray udg_monsterTypes = 0
	CasterTypeArray udg_casterTypes = 0
endglobals


function InitTrig_Init_monster_and_caster_types takes nothing returns nothing
	if (udg_monsterTypes == 0) then
		set udg_monsterTypes = MonsterTypeArray.create()
		call udg_monsterTypes.new("peon", 'opeo', -1.000, 50, 400.000, false).setKillingEffectStr("UI\\\\Feedback\\\\GoldCredit\\\\GoldCredit.mdl")
		call udg_monsterTypes.new("burrow", 'ogru', -1.000, 50, 400.000, false).setKillingEffectStr("UI\\\\Feedback\\\\GoldCredit\\\\GoldCredit.mdl")
		call udg_monsterTypes.new("wolf", 'osw2', -1.000, 50, 400.000, false).setKillingEffectStr("UI\\\\Feedback\\\\GoldCredit\\\\GoldCredit.mdl")
		call udg_monsterTypes.new("Gpeon", 'ohun', -1.000, 50, 400.000, false).setKillingEffectStr("UI\\\\Feedback\\\\GoldCredit\\\\GoldCredit.mdl")
		call udg_monsterTypes.new("Goldmine", 'ngol', -1.000, 0, 400.000, false)
		call udg_monsterTypes.new("circle", 'hfoo', -1.000, 0, 400.000, false)
		call udg_monsterTypes.new("kodo", 'oosc', -1.000, 300, 400.000, false).setKillingEffectStr("UI\\\\Feedback\\\\GoldCredit\\\\GoldCredit.mdl")
		call udg_monsterTypes.new("lightning1", 'oshm', -1.000, 50, 400.000, false)
		call udg_monsterTypes.new("lightning2", 'ospw', -1.000, 50, 400.000, false)
		call udg_monsterTypes.new("lightning3", 'odoc', -1.000, 50, 400.000, false)
		call udg_monsterTypes.new("circle2", 'hmtm', -1.000, 0, 400.000, false)
		call udg_monsterTypes.new("circle3", 'hmpr', -1.000, 0, 400.000, false)
		call udg_monsterTypes.new("circle4", 'hsor', -1.000, 0, 400.000, false)
		call udg_monsterTypes.new("archertower", 'ostr', -1.000, 0, 400.000, false)
		call udg_monsterTypes.new("arrow", 'owyv', -1.000, 70, 400.000, false)
	endif

	if (udg_casterTypes == 0) then
		set udg_casterTypes = CasterTypeArray.create()
		call udg_casterTypes.new("archer", udg_monsterTypes.get("archertower"), udg_monsterTypes.get("arrow"), 1500.000, 700.000, 1.000, "spell")
	endif
endfunction




















