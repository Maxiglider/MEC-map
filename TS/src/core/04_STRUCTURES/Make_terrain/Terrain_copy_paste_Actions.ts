

const initTerrainCopyPasteActions = () => { // needs Escaper


const TerrainCopyPaste_Actions = (): void => {
	let escaper = EscaperFunctions.Hero2Escaper(GetTriggerUnit());
	local Make mkGeneral = escaper.getMake()
		local MakeTerrainCopyPaste mk = MakeTerrainCopyPaste(integer(mkGeneral))
	let x = GetOrderPointX();
	let y = GetOrderPointY();

	if ((!BasicFunctions.IsIssuedOrder("smart"))) {
		return;
	}
 BasicFunctions.StopUnit(mk.maker)	
 mk.saveLoc(x, y)
};



}
