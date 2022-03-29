import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { udg_escapers } from 'core/08_GAME/Init_structures/Init_escapers'

export class KillingTimers {
    private timers: timer[]

    destroy = () => {
        let i = 0
        while (true) {
            if (i >= NB_ESCAPERS) break
            DestroyTimer(this.timers[i])
            this.timers[i] = null
            i = i + 1
        }
    }

    // TODO; Used to be static
    create = (): KillingTimers => {
    	local KillingTimers kt = KillingTimers.allocate()
    	let i: number;
    	i = 0;
    	while (true) {
    		if ((i >= NB_ESCAPERS)) break;
    		//if (udg_escapers.get(i) != 0) then //si l'escaper existe
    		//si on laisse le filtre if les escapers apparus après le début (via un -createHero) ne meurent plus avec les terrains
    		kt.timers[i] = CreateTimer()
    		//endif
    		i = i + 1;
    	}
    	return kt;
    };

    start = (timerId: number, time: number) => {
        TimerStart(this.timers[timerId], time, false, DeathTerrainKillEscaper_Actions)
        udg_escapers.get(timerId).currentLevelTouchTerrainDeath = udg_levels.getCurrentLevel()
    }

    get = (id: number): timer => {
        return this.timers[id]
    }
}
