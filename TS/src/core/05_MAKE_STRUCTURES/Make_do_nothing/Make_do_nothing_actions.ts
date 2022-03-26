const initMakeDoNothingActions = () => { // needs BasicFunctions


const StopTriggerUnit = (): void => {
	if ((!IsLastOrderPause())) {
		StopUnit(GetTriggerUnit())
	}
};

}
