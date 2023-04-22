const initEffectUtils = () => {
    const state = { displayEffects: true }

    const setDisplayEffects = (displayEffects: boolean) => {
        state.displayEffects = displayEffects
    }

    const destroyEffect = (whichEffect: effect | undefined) => {
        if (whichEffect) {
            return DestroyEffect(whichEffect)
        }
    }

    const addSpecialEffect = (modelName: string, x: number, y: number) => {
        if (state.displayEffects) {
            return AddSpecialEffect(modelName, x, y)
        }
    }

    const addSpecialEffectLoc = (modelName: string, where: location) => {
        if (state.displayEffects) {
            return AddSpecialEffectLoc(modelName, where)
        }
    }

    const addSpecialEffectTarget = (modelName: string, targetWidget: widget, attachPointName: string) => {
        if (state.displayEffects) {
            return AddSpecialEffectTarget(modelName, targetWidget, attachPointName)
        }
    }

    return {
        getDisplayEffects: () => state.displayEffects,
        setDisplayEffects,
        destroyEffect,
        addSpecialEffect,
        addSpecialEffectLoc,
        addSpecialEffectTarget,
    }
}

export const EffectUtils = initEffectUtils()
