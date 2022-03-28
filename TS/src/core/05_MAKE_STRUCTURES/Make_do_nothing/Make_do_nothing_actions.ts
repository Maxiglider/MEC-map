const initMakeDoNothingActions = () => {
    // needs BasicFunctions

    const StopTriggerUnit = () => {
        if (!BasicFunctions.IsLastOrderPause()) {
            BasicFunctions.StopUnit(GetTriggerUnit())
        }
    }
}
