

const initTerrainModifyingTrig = () => { // initializer Init_TerrainModifyingTrig



let y: number;
// TODO; Used to be private
let wasCheckTerrainTriggerOn: Array<boolean> = [];
let terrainModifyWorking = false;
//constant integer TERRAIN_MODIFYING_NB_LINES_TO_DO = 5
//maintenant on fait ligne par ligne (--> 1)



const Init_TerrainModifyingTrig = (): void => {
	gg_trg_Terrain_modifying_trig = CreateTrigger();
	DisableTrigger(gg_trg_Terrain_modifying_trig)
	TriggerRegisterTimerEvent(gg_trg_Terrain_modifying_trig, LOW_PERIOD_FOR_WORK, true)
};


const StopEnabledCheckTerrainTriggers = (): void => {
	let escaper: Escaper;
	let i = 0;
	while (true) {
		if ((i >= NB_ESCAPERS)) break;
		escaper = udg_escapers.get(i)
		if ((escaper !== 0)) {
			if ( (escaper.doesCheckTerrain()) ) {
				wasCheckTerrainTriggerOn[ i ] = true;
 escaper.enableCheckTerrain(false)
			} else {
				wasCheckTerrainTriggerOn[ i ] = false;
			}
		}
		i = i + 1;
	}
};


const RestartEnabledCheckTerrainTriggers = (): void => {
	let escaper: Escaper;
	let i = 0;
	while (true) {
		if ((i >= NB_ESCAPERS)) break;
		escaper = udg_escapers.get(i)
		if ((escaper !== 0)) {
			if ((wasCheckTerrainTriggerOn[i])) {
 escaper.enableCheckTerrain(true)
			}
		}
		i = i + 1;
	}
};



}
