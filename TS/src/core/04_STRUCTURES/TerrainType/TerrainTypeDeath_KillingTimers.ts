

const initTerrainTypeDeathKillingTimers = () => { // needs TerrainTypeDeathFunctions


//struct KillingTimers

// TODO; Used to be private
	 timer array timers [NB_ESCAPERS]
    
// TODO; Used to be private
	 


const onDestroy = () => {
	let i = 0;
	while (true) {
		if ((i >= NB_ESCAPERS)) break;
		DestroyTimer(this.timers[i])
		this.timers[ i ] = null;
		i = i + 1;
	}
};

// TODO; Used to be static
const create = (): KillingTimers => {
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

const start = (timerId: number, time: number) => {
	TimerStart(this.timers[timerId], time, false, DeathTerrainKillEscaper_Actions)
	udg_escapers.get(timerId).currentLevelTouchTerrainDeath = udg_levels.getCurrentLevel()
};

const get = (id: number): timer => {
	return this.timers[id];
};

//endstruct


}
