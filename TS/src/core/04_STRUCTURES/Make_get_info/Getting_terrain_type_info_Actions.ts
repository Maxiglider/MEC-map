import { Text } from 'core/01_libraries/Text'

const initGettingTerrainTypeInfoActions = () => {
    // needs Escaper

    const GettingTerrainTypeInfo_Actions = (): void => {
        const escaper = Hero2Escaper(GetTriggerUnit())
        const mkGeneral: Make = escaper.getMake()
        const mk: MakeGetTerrainType = MakeGetTerrainType(integer(mkGeneral))
        const x = GetOrderPointX()
        const y = GetOrderPointY()

        if (!IsIssuedOrder('smart')) {
            return
        }
        StopUnit(mk.maker)
        Text.P(mk.makerOwner, GetTerrainData(GetTerrainType(x, y)))
    }
}
