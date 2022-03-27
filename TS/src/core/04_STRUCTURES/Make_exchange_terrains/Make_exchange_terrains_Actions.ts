

const initMakeExchangeTerrainsActions = () => { // needs Escaper, ExchangeTerrains


const MakeExchangeTerrains_Actions = (): void => {
	let escaper = EscaperFunctions.Hero2Escaper(GetTriggerUnit());
	local Make mkGeneral = escaper.getMake()
		local MakeExchangeTerrains mk = MakeExchangeTerrains(integer(mkGeneral))
	let x = GetOrderPointX();
	let y = GetOrderPointY();
	let terrainTypeA: TerrainType;
	let terrainTypeB: TerrainType;

	if ((!BasicFunctions.IsIssuedOrder("smart"))) {
		return;
	}
 BasicFunctions.StopUnit(mk.maker)	
	if ( (mk.isLastLocSavedUsed()) ) {
		terrainTypeA = udg_terrainTypes.getTerrainType(mk.lastX, mk.lastY)
		terrainTypeB = udg_terrainTypes.getTerrainType(x, y)
 ExchangeTerrains(terrainTypeA.label, terrainTypeB.label)
 mk.unsaveLocDefinitely()
	} else {
 mk.saveLoc(x, y)
	}
};


}
