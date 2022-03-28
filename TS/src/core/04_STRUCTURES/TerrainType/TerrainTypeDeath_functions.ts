

const initTerrainTypeDeathFunctions = () => { // needs TerrainType




const TerrainKillTimer2Escaper = (theTimer: timer): Escaper => {
	let terrainKillTrigger = GetTriggeringTrigger();
	local integer terrainTypeDeathMaxId = udg_terrainTypes.numberOfDeath - 1
	let terrainTypeDeathId: number;
	let escaperId = 0;

	terrainTypeDeathId = 0;
	while (true) {
		if ((terrainTypeDeathId > terrainTypeDeathMaxId)) break;
		escaperId = 0;
		while (true) {
			if ((escaperId >= NB_ESCAPERS)) break;
			if ( (theTimer == udg_terrainTypes.getDeath(terrainTypeDeathId).getTimer(escaperId)) ) {
				return udg_escapers.get(escaperId)
			}
			escaperId = escaperId + 1;
		}
		terrainTypeDeathId = terrainTypeDeathId + 1;
	}

	return 0;
};


const DeathTerrainKillEscaper_Actions = () => {
	let escaper = TerrainKillTimer2Escaper(GetExpiredTimer());
	if ((escaper === 0)) {
		return;
	}
 escaper.pause(false)
 escaper.destroyTerrainKillEffect()	
	if ( (escaper.currentLevelTouchTerrainDeath == udg_levels.getCurrentLevel()) ) {
 escaper.kill()
	} else {
		if ((escaper.isAlive())) {
 escaper.enableCheckTerrain(true)
		}
	}
};


}

