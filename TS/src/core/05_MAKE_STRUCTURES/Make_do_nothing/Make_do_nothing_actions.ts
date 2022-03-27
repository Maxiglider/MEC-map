const initMakeDoNothingActions = () => {
    // needs BasicFunctions

    const StopTriggerUnit = (): void => {
        if (!BasicFunctions.IsLastOrderPause()) {
            BasicFunctions.StopUnit(GetTriggerUnit())
        }
    }
}
