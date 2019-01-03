//TESH.scrollpos=0
//TESH.alwaysfold=0
globals
	MonsterTypeArray udg_monsterTypes = 0
	CasterTypeArray udg_casterTypes = 0
endglobals


function InitTrig_Init_monster_and_caster_types takes nothing returns nothing
	if (udg_monsterTypes == 0) then
		set udg_monsterTypes = MonsterTypeArray.create()
	endif

	if (udg_casterTypes == 0) then
		set udg_casterTypes = CasterTypeArray.create()
	endif
endfunction

