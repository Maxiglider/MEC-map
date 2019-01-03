//TESH.scrollpos=0
//TESH.alwaysfold=0
library TerrainTypeDeathKillingTimers needs TerrainTypeDeathFunctions


struct KillingTimers
	private timer array timers [12]
    
	private method onDestroy takes nothing returns nothing
        local integer i = 0
		loop
			exitwhen (i > 11)
				call DestroyTimer(.timers[i])
				set .timers[i] = null
            set i = i + 1
		endloop
	endmethod
    
    static method create takes nothing returns KillingTimers
        local KillingTimers kt = KillingTimers.allocate()
        local integer i
        set i = 0
        loop
            exitwhen (i > 11)
                //if (udg_escapers.get(i) != 0) then //si l'escaper existe
                //si on laisse le filtre if les escapers apparus après le début (via un -createHero) ne meurent plus avec les terrains
                    set kt.timers[i] = CreateTimer()
                //endif
            set i = i + 1
        endloop
        return kt
    endmethod
	
	method start takes integer timerId, real time returns nothing
		call TimerStart(.timers[timerId], time, false, function DeathTerrainKillEscaper_Actions)
		set udg_escapers.get(timerId).currentLevelTouchTerrainDeath = udg_levels.getCurrentLevel()
	endmethod
    
    method get takes integer id returns timer
        return .timers[id]
    endmethod    
endstruct


endlibrary