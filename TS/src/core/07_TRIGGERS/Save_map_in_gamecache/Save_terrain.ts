

const initSaveTerrain = () => { // needs Text, SaveTerrainHeights


// TODO; Used to be private
let y: number;
// TODO; Used to be private
let terrainTypeIds: Array<number> = [];
// TODO; Used to be private
let nbTerrainTypesUsed: number;


// TODO; Used to be private
const SaveTerrainsUsed = (): void => {
	let i: number;
	stringArrayForCache = StringArrayForCache.create("terrain", "terrainsUsed", false)
	i = 0;
	while (true) {
		if ((i >= nbTerrainTypesUsed)) break;
 stringArrayForCache.push(Ascii2String(terrainTypeIds[i]))
		i = i + 1;
	}
 stringArrayForCache.writeInCache()
	Text_A("terrains used saved")
};

// TODO; Used to be private
const SaveMapDimensionsAndCenterOff= (): void => {
	let largeurMap = R2I((MAP_MAX_X - MAP_MIN_X) / LARGEUR_CASE);
	let hauteurMap = R2I((MAP_MAX_Y - MAP_MIN_Y) / LARGEUR_CASE);
	let offsetX = R2I(MAP_MIN_X);
	let offsetY = R2I(MAP_MIN_Y);
	stringArrayForCache = StringArrayForCache.create("terrain", "largeur", false)
 stringArrayForCache.push(I2S(largeurMap))
 stringArrayForCache.writeInCache()
	stringArrayForCache = StringArrayForCache.create("terrain", "hauteur", false)
 stringArrayForCache.push(I2S(hauteurMap))
 stringArrayForCache.writeInCache()
	stringArrayForCache = StringArrayForCache.create("terrain", "centerOffsetX", false)
 stringArrayForCache.push(I2S(offsetX))
 stringArrayForCache.writeInCache()
	stringArrayForCache = StringArrayForCache.create("terrain", "centerOffsetY", false)
 stringArrayForCache.push(I2S(offsetY))
 stringArrayForCache.writeInCache()
	Text_A("map dimensions and center offsaved")
};


//crée si besoin une nouvelle instance dans le tableau et retourne l'id de cet élément de tableau
// TODO; Used to be private
const GetTerrainId = (x: number, y: number): string => {
	let terrainTypeId = GetTerrainType(x, y);
	let i = 0;
	while (true) {
		if ((i >= nbTerrainTypesUsed)) break;
		if ((terrainTypeId === terrainTypeIds[i])) {
			return I2HexaString(i);
		}
		i = i + 1;
	}
	if ((nbTerrainTypesUsed < 16)) {
		terrainTypeIds[ nbTerrainTypesUsed ] = terrainTypeId;
		nbTerrainTypesUsed = nbTerrainTypesUsed + 1;
	}
	return I2HexaString(nbTerrainTypesUsed - 1);
};


const GererOrdreTerrains = (): void => {
	let terrainType: TerrainType;
	let terrainTypes: Array<TerrainType> = [];
	let nbOrderedTerrains = 0;
	let numTerrain = 0;
	let ordreMinTerrainId: number;
	let ordreMin: number;
	//récupération de tous les terrains
	let i = 0;
	while (true) {
		terrainType = udg_terrainTypes.getWalk(i)
		if ((terrainType === 0)) break;
		terrainTypes[ numTerrain ] = terrainType;
		numTerrain = numTerrain + 1;
		i = i + 1;
	}
	i = 0;
	while (true) {
		terrainType = udg_terrainTypes.getSlide(i)
		if ((terrainType === 0)) break;
		terrainTypes[ numTerrain ] = terrainType;
		numTerrain = numTerrain + 1;
		i = i + 1;
	}
	i = 0;
	while (true) {
		terrainType = udg_terrainTypes.getDeath(i)
		if ((terrainType === 0)) break;
		terrainTypes[ numTerrain ] = terrainType;
		numTerrain = numTerrain + 1;
		i = i + 1;
	}
	//suppression des terrains non ordonnés du tableau
	i = 0;
	while (true) {
		if (i == udg_terrainTypes.count()) break;
		if ( (terrainTypes[i].getOrderId() != 0) ) {
			if ((i !== nbOrderedTerrains)) {
				terrainTypes[ nbOrderedTerrains ] = terrainTypes[i];
			}
			nbOrderedTerrains = nbOrderedTerrains + 1;
		}
		i = i + 1;
	}
	//tri du tableau
	numTerrain = 0;
	while (true) {
		if ((numTerrain >= nbOrderedTerrains - 1)) break;
		//on trouve l'emplacement du terrain avec l'ordre le plus petit
		ordreMin = 100;
		i = numTerrain;
		while (true) {
			if ((i === nbOrderedTerrains)) break;
			if ( (terrainTypes[i].getOrderId() < ordreMin) ) {
				ordreMinTerrainId = i;
				ordreMin = terrainTypes[i].getOrderId()
			}
			i = i + 1;
		}
		//on inverse l'emplacement du terrain trouvé avec celui du premier terrain non trié
		if ((ordreMinTerrainId !== numTerrain)) {
			terrainType = terrainTypes[numTerrain];
			terrainTypes[ numTerrain ] = terrainTypes[ordreMinTerrainId];
			terrainTypes[ ordreMinTerrainId ] = terrainType;
		}
		numTerrain = numTerrain + 1;
	}
	//sauvegarde des terrains dans les variables finales
	nbTerrainTypesUsed = nbOrderedTerrains;
	i = 0;
	while (true) {
		if ((i === nbOrderedTerrains)) break;
		terrainTypeIds[i] = terrainTypes[i].getTerrainTypeId()
		i = i + 1;
	}
};


// TODO; Used to be private
const SaveTerrain_Actions = (): void => {
	let x: number;
	if ((y <= MAP_MAX_Y)) {
		x = MAP_MIN_X;
		while (true) {
			if ((x > MAP_MAX_X)) break;
 stringArrayForCache.push(GetTerrainId(x, y))
			x = x + LARGEUR_CASE;
		}
		y = y + LARGEUR_CASE;
	} else {
		DisableTrigger(GetTriggeringTrigger())
 stringArrayForCache.writeInCache()
		Text_A("terrain saved")
		SaveTerrainsUsed()
		SaveMapDimensionsAndCenterOffset()
		StartSaveTerrainHeights()
	}
};


const StartSaveTerrain = (): void => {
	y = MAP_MIN_Y;
	GererOrdreTerrains()
	stringArrayForCache = StringArrayForCache.create("terrain", "terrainTypes", false)
	TriggerClearActions(trigSaveMapInCache)
	TriggerAddAction(trigSaveMapInCache, SaveTerrain_Actions)
	EnableTrigger(trigSaveMapInCache)
};





}
