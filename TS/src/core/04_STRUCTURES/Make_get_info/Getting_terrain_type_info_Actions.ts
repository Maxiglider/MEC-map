

const initGettingTerrainTypeInfoActions = () => { // needs Escaper



const GettingTerrainTypeInfo_Actions = (): void => {
	let escaper = Hero2Escaper(GetTriggerUnit());
	local Make mkGeneral = escaper.getMake()
		local MakeGetTerrainType mk = MakeGetTerrainType(integer(mkGeneral))
	let x = GetOrderPointX();
	let y = GetOrderPointY();

	if ((!IsIssuedOrder("smart"))) {
		return;
	}
 StopUnit(mk.maker)
 Text_P(mk.makerOwner, GetTerrainData(GetTerrainType(x, y)))
};





}
