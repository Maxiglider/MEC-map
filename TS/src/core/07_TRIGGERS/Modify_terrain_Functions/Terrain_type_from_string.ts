

const initTerrainTypeFromString = () => { // needs TerrainFunctions



const TerrainTypeString2TerrainTypeId = (str: string): number => {
	if ((IsPositiveInteger(str))) {
		return TerrainTypeMaxId2TerrainTypeId(S2I(str));
	}
	if ((SubStringBJ(str, 1, 1) === "g" && IsPositiveInteger(SubStringBJ(str, 2, StringLength(str))))) {
		return TerrainTypeGrassId2TerrainTypeId(S2I(SubStringBJ(str, 2, StringLength(str))));
	}
	if ((StringLength(str) === 6 && SubStringBJ(str, 1, 1) === "'" && SubStringBJ(str, 6, 6) === "'")) {
		return TerrainTypeAsciiString2TerrainTypeId(str);
	}
	if ((str === "x")) {
		return GetRandomTerrain();
	}
	if ((str === "xnk")) {
		return GetRandomNotUsedTerrain();
	}
	if ((str === "xak")) {
		return GetRandomUsedTerrain();
	}
	return 0;
};




}
