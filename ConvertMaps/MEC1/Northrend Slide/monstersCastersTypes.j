globals
	MonsterTypeArray udg_monsterTypes = 0
	CasterTypeArray udg_casterTypes = 0
endglobals


function InitTrig_Init_monster_and_caster_types takes nothing returns nothing
	if (udg_monsterTypes == 0) then
		set udg_monsterTypes = MonsterTypeArray.create()
		call udg_monsterTypes.new("troll", 'nitr', -1.000, 45, 350.000, false).setAlias("t")
		call udg_monsterTypes.new("wolf", 'nwwf', 0.650, 35, 425.000, false).setAlias("w")
		call udg_monsterTypes.new("polarbear", 'nplb', 2.000, 400, 400.000, true)
		call udg_monsterTypes.new("rock", 'n000', 0.600, 55, 400.000, false).setAlias("r")
	endif

	if (udg_casterTypes == 0) then
		set udg_casterTypes = CasterTypeArray.create()
	endif
endfunction
