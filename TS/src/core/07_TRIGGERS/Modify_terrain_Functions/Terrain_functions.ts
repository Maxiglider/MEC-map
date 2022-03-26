

const initTerrainFunctions = () => { // needs TerrainTypeAsciiConversion, TerrainTypeMax, TerrainTypeGrass, TerrainTypeFunctions



const IsTerrainAlreadyUsed = (terrainType: number): boolean => {
	let i = 0;
	while (true) {
		if ((udg_used_terrain_types[i] === 0)) break;
		if ((udg_used_terrain_types[i] === terrainType)) {
			return true;
		}
		i = i + 1;
	}
	return false;
};


const IsTerrainsLimitNumberReached = (): boolean => {
	return (udg_nb_used_terrains === NB_MAX_OF_TERRAINS);
};


const AddNewTerrain = (newTerrain: number): boolean => {
	if ((IsTerrainsLimitNumberReached() || IsTerrainAlreadyUsed(newTerrain))) {
		return false;
	}
	udg_used_terrain_types[ udg_nb_used_terrains ] = newTerrain;
	udg_nb_used_terrains = udg_nb_used_terrains + 1;
	return true;
};

const CanUseTerrain = (terrainType: number): boolean => {
	if ((IsTerrainAlreadyUsed(terrainType))) {
		return true;
	}
	return AddNewTerrain(terrainType);
};


const GetRandomTerrain = (): number => {
	return TerrainTypeMaxId2TerrainTypeId(GetRandomInt(1, NB_TERRAINS_TOTAL));
};


const GetRandomUsedTerrain = (): number => {
	return udg_used_terrain_types[GetRandomInt(0, udg_nb_used_terrains - 1)];
};


const GetRandomNotUsedTerrain = (): number => {
	let terrainType: number;
	while (true) {
		terrainType = GetRandomTerrain();
		if ((!IsTerrainAlreadyUsed(terrainType))) break;
	}
	return terrainType;
};


const GetTerrainName = (terrain: number): string => {
	if ((terrain > NB_TERRAINS_TOTAL)) {
		return TERRAIN_TYPE_NAMES[TerrainTypeId2TerrainTypeMaxId(terrain)];
	}
	if ((terrain <= 0)) {
		return null;
	}
	return TERRAIN_TYPE_NAMES[terrain];
};


const GetTerrainData = (terrain: number): string => {
	//GetTerrainData('Nice') == "46 : Northrend - Glace    'Nice'"
	let str: string;
	let maxId: number;
	let terrainType: TerrainType;

	if ((terrain > NB_TERRAINS_TOTAL)) {
		maxId = TerrainTypeId2TerrainTypeMaxId(terrain);
	} else {
		if ((terrain > 0)) {
			maxId = terrain;
			terrain = TerrainTypeMaxId2TerrainTypeId(maxId);
		} else {
			return null;
		}
	}
	str = udg_colorCode[RED] + TERRAIN_TYPE_DATA[maxId];

	terrainType = TerrainTypeId2TerrainType(terrain);
	if ((terrainType !== 0)) {
		if ( (terrainType.getKind() == "slide") ) {
			str = str + COLOR_TERRAIN_SLIDE;
		} else {
			if ( (terrainType.getKind() == "walk") ) {
				str = str + COLOR_TERRAIN_WALK;
			} else {
				str = str + COLOR_TERRAIN_DEATH;
			}
		}
		str = str + "        " + terrainType.label
		if ( (terrainType.theAlias != null) ) {
			str = str + "  " + terrainType.theAlias
		}
	}

	return str;
};


const DisplayTerrainDataToPlayer = (p: player, terrain: number): void => {
	DisplayTimedTextToPlayer(p, 0, 0, TERRAIN_DATA_DISPLAY_TIME, GetTerrainData(terrain))
};





}

