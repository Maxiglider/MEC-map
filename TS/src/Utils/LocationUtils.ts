const loc = Location(0, 0)
const GetLocZ = (x: number, y: number) => {
    MoveLocation(loc, x, y)
    return GetLocationZ(loc)
}

export const GetUnitZEx = (unit: unit) => {
    return GetLocZ(GetUnitX(unit), GetUnitY(unit)) + GetUnitFlyHeight(unit)
}
