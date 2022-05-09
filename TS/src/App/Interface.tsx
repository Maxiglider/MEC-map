import { Text } from 'core/01_libraries/Text'
import * as React from 'w3ts-jsx/dist/src/index'
import { getUdgEscapers, getUdgTerrainTypes } from '../../globals'
import { Button } from './Components/Button'
import { Item } from './Components/Item'
import { usePlayerVariable } from './Hooks/usePlayerVisible'
import { terrainItems } from './Media/Terrains'
import { IAbsPos } from './Utils'

export type IItem = { texFile: string; title: string }

export type InterfaceProps = {
    cb: (props: { setVisible: ({ visible, playerId }: { visible: boolean; playerId: number }) => void }) => void
}

export const Interface = ({ cb }: InterfaceProps) => {
    const { get: getVisible, set: setVisible } = usePlayerVariable<boolean>()

    const { get: getPos, set: setPos } = usePlayerVariable<{ x: number; y: number }>()

    const mainPos = {
        x: 0.0070428,
        y: 0.47109,
    }

    // useDrag({
    //     onDrag: (playerId, x, y) => {
    //         // TODO; Leaks
    //         setPos({
    //             playerId,
    //             value: {
    //                 x: ((x - GetCameraTargetPositionX()) / (128 * 20) + 1) / 2,
    //                 y: ((y - GetCameraTargetPositionY()) / (128 * 20) + 1) / 2,
    //             },
    //         })
    //     },
    // })

    React.useEffect(() => {
        cb({
            setVisible: ({ playerId, visible }) => {
                setVisible({ playerId, value: visible })
            },
        })

        // Always on
        // setVisible({ playerId: 0, value: true })
    }, [])

    // // TODO; Update this when someone does -news etc
    // const usedTerrains: IItem[] = []
    // for (const [_, terrain] of pairs(getUdgTerrainTypes().getAll())) {
    //     arrayPush(
    //         usedTerrains,
    //         terrainItems.find(i => i.title === Ascii2String(terrain.terrainTypeId))
    //     )
    // }

    const usedTerrains = terrainItems

    const getItemPosition = ({ item }: { item: IItem }): { visible: boolean; absPos: IAbsPos } => {
        const i = usedTerrains.findIndex(d => d === item)

        const nbCols = 16
        const margin = 0.0075

        const row = Math.floor(i / nbCols)
        const col = i % nbCols

        return {
            visible: true,
            absPos: {
                point: FRAMEPOINT_TOPLEFT,
                x: mainPos.x + margin + col * 0.03 + col * margin,
                y: mainPos.y - (margin * row + 0.03 * row),
            },
        }
    }

    return (
        <container>
            <container visible={getVisible({ playerId: GetPlayerId(GetLocalPlayer()) }) || false}>
                <container>
                    <backdrop
                        inherits="EscMenuBackdrop"
                        absPosition={[
                            {
                                point: FRAMEPOINT_TOPLEFT,
                                x: mainPos.x, // getPos({ playerId: GetPlayerId(GetLocalPlayer()) })?.x || 0.1,
                                y: mainPos.y, //(getPos({ playerId: GetPlayerId(GetLocalPlayer()) })?.y || 0.3) + 0.25,
                            },
                        ]}
                        size={{
                            width: mainPos.x + 0.0075 + 16 * 0.03 + 16 * 0.0075,
                            height: mainPos.y + 0.0075 + 8 * 0.03 + 8 * 0.0075,
                        }}
                    />

                    {usedTerrains.map(item => {
                        const { visible, absPos } = getItemPosition({ item })

                        return (
                            <Item
                                v={item}
                                absPosition={absPos}
                                size={{ width: 0.03, height: 0.03 }}
                                visible={visible}
                                onClick={() => {
                                    const escaper = getUdgEscapers().get(GetPlayerId(GetTriggerPlayer()))
                                    const terrainType = getUdgTerrainTypes().getByCode(item.title)

                                    if (escaper && terrainType) {
                                        escaper.makeCreateTerrainBrush(terrainType, 1, 'square')
                                        Text.mkP(escaper.getPlayer(), 'creating terrain on')
                                    }
                                }}
                            />
                        )
                    })}
                </container>

                <container>
                    <Button
                        text={''}
                        absPosition={[
                            { point: FRAMEPOINT_TOPLEFT, x: 0.7728, y: 0.54222 },
                            { point: FRAMEPOINT_BOTTOMRIGHT, x: 0.79236, y: 0.522 },
                        ]}
                        onClick={() => setVisible({ playerId: GetPlayerId(GetTriggerPlayer()), value: false })}
                    />
                </container>
            </container>
        </container>
    )
}
