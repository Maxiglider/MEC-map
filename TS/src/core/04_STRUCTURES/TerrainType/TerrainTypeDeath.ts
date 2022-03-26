

const initTerrainTypeDeath = () => { // needs TerrainTypeDeathKillingTimers


const DEATH_TERRAIN_MAX_TOLERANCE = 50;


//struct TerrainTypeDeath extends TerrainType

// TODO; Used to be private
	 string killingEffectStr
// TODO; Used to be private
	 real timeToKill  //en secondes
// TODO; Used to be private
	 KillingTimers killingTimers
// TODO; Used to be private
     real toleranceDist
	
// TODO; Used to be static
	 


const create = (label: string, terrainTypeId: number, killingEffectStr: string, timeToKill: number, toleranceDist: number): TerrainTypeDeath => {
	let i: number;
	let tt: TerrainTypeDeath;
	if ((!CanUseTerrain(terrainTypeId))) {
		return 0;
	}
	tt = TerrainTypeDeath.allocate()
	tt.label = label
	tt.theAlias = null
	tt.terrainTypeId = terrainTypeId
	tt.killingEffectStr = killingEffectStr
	tt.timeToKill = timeToKill
	tt.killingTimers = KillingTimers.create()
	tt.kind = "death"
	tt.toleranceDist = toleranceDist
	tt.orderId = 0
	tt.cliffClassId = 1
	return tt;
};

// TODO; Used to be private
const onDestroy = (): void => {
 this.killingTimers.destroy()			
};

const setKillingEffectStr = (killingEffectStr: string): void => {
	this.killingEffectStr = killingEffectStr;
};

const getKillingEffectStr = (): string => {
	return this.killingEffectStr;
};

const setTimeToKill = (newTimeToKill: number): boolean => {
	if ((newTimeToKill < 0)) {
		return false;
	}
	this.timeToKill = newTimeToKill;
	return true;
};

const getTimeToKill = (): number => {
	return this.timeToKill;
};

const killEscaper = (escaper: Escaper): void => {
 escaper.enableCheckTerrain(false)
 escaper.enableSlide(false)
 escaper.pause(true)
 escaper.createTerrainKillEffect(this.killingEffectStr)
 this.killingTimers.start(escaper.getId(), this.timeToKill)
};

const getTimer = (escaperId: number): timer => {
	return this.killingTimers.get(escaperId)
};

const getToleranceDist = (): number => {
	return this.toleranceDist;
};

const setToleranceDist = (toleranceDist: number): boolean => {
	if ((toleranceDist < 0 || toleranceDist > DEATH_TERRAIN_MAX_TOLERANCE)) {
		return false;
	}
	this.toleranceDist = toleranceDist;
	return true;
};

//endstruct


}
