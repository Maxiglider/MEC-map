const initAnimUtils = () => {
    return {
        setAnimation: (unit: unit, anim: string) => {
            if (anim === 'walk') {
                SetUnitAnimationByIndex(unit, 8)
            } else if (S2I(anim) !== 0 || anim === '0') {
                SetUnitAnimationByIndex(unit, S2I(anim))
            } else {
                SetUnitAnimation(unit, anim)
            }
        },
    }
}

export const animUtils = initAnimUtils()
