

const initExchangeTerrains = () => { // needs AllTerrainFunctions, TerrainModifyingTrig


// TODO; Used to be private
let terrainA: number;
// TODO; Used to be private
let terrainB: number;




const ExchangeTerrains_Actions = (): void => {
	let x: number;
	let terrainType: number;
	//local integer i = 1
	//loop
	//exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
	x = MAP_MIN_X;
	while (true) {
		if ((x > MAP_MAX_X)) break;
		terrainType = GetTerrainType(x, y);
		if ((terrainType === terrainA)) {
			ChangeTerrainType(x, y, terrainB)
		} else {
			if ((terrainType === terrainB)) {
				ChangeTerrainType(x, y, terrainA)
			}
		}
		x = x + LARGEUR_CASE;
	}
	y = y + LARGEUR_CASE;
	if ((y > MAP_MAX_Y)) {
		DisableTrigger(GetTriggeringTrigger())
		RestartEnabledCheckTerrainTriggers()
		terrainModifyWorking = false;
		return;
	}
	//i = i + 1
	//endloop
};


// TODO; Used to be private
const StartTerrainModifying = (): void => {
	StopEnabledCheckTerrainTriggers()
	TriggerClearActions(gg_trg_Terrain_modifying_trig)
	TriggerAddAction(gg_trg_Terrain_modifying_trig, ExchangeTerrains_Actions)
	y = MAP_MIN_Y;
	EnableTrigger(gg_trg_Terrain_modifying_trig)
	terrainModifyWorking = true;
};



const ExchangeTerrains = (terrainTypeLabelA: string, terrainTypeLabelB: string): boolean => {
	local TerrainType terrainTypeA = udg_terrainTypes.get(terrainTypeLabelA)
	local TerrainType terrainTypeB = udg_terrainTypes.get(terrainTypeLabelB)
	if ((terrainTypeA === terrainTypeB || terrainTypeA === 0 || terrainTypeB === 0)) {
		return false;
	}
	if ((terrainModifyWorking)) {
		Text.erA("can't execute two commands of this type simultaneously !")
		return false;
	}
	terrainA = terrainTypeA.getTerrainTypeId()
	terrainB = terrainTypeB.getTerrainTypeId()

	StartTerrainModifying()
 terrainTypeA.setTerrainTypeId(terrainB)
 terrainTypeB.setTerrainTypeId(terrainA)
	return true;
};




}
