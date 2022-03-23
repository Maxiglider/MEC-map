scope ForceSelectionWhileSliding initializer InitForceSelectionWhileSliding


function ForceSelectionWhileSliding_Actions takes nothing returns nothing
	local Escaper escaper1
	local Escaper escaper2
	local boolean isSelected1
	local boolean isSelected2
	local integer i = 0

	if (udg_doubleHeroesEnabled) then
		loop
			exitwhen (i >= NB_ESCAPERS)
				set escaper1 = udg_escapers.get(i)
				if (escaper1 != 0) then
					set escaper2 = GetMirrorEscaper(escaper1)

					if (escaper1.isSliding() or escaper2.isSliding()) then
						set isSelected1 = IsUnitSelected(escaper1.getHero(), udg_escapers.get(escaper1.getControler()).getPlayer())
						set isSelected2 = IsUnitSelected(escaper2.getHero(), udg_escapers.get(escaper2.getControler()).getPlayer())

						if (isSelected1 != isSelected2) then
							//forcer la sélection des deux héros
							call ForceSelectHeroes(escaper1)
						endif
					endif
				endif
			set i = i + 1
		endloop
	endif
endfunction


function InitForceSelectionWhileSliding takes nothing returns nothing
	local trigger trig = CreateTrigger()
	call TriggerRegisterTimerEvent(trig, .1, true)
    call TriggerAddAction( trig, function ForceSelectionWhileSliding_Actions )
endfunction


endscope