scope DoubleKill initializer InitDoubleKill


function DoubleKill_Actions takes nothing returns nothing
	if (udg_doubleHeroesEnabled and IsHero(GetTriggerUnit())) then
		call GetMirrorEscaper(Hero2Escaper(GetTriggerUnit())).kill()
	endif
endfunction


function InitDoubleKill takes nothing returns nothing
	local trigger triggerDoubleKill = CreateTrigger()
    call TriggerRegisterAnyUnitEventBJ( triggerDoubleKill, EVENT_PLAYER_UNIT_DEATH )
    call TriggerAddAction( triggerDoubleKill, function DoubleKill_Actions )
endfunction

endscope