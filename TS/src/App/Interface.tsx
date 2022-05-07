import { arrayPush } from 'core/01_libraries/Basic_functions'
import { Text } from 'core/01_libraries/Text'
import * as React from 'w3ts-jsx/dist/src/index'
import { getUdgEscapers, getUdgTerrainTypes } from '../../globals'
import { Ascii2String } from '../core/01_libraries/Ascii'
import { Button } from './Components/Button'
import { Item } from './Components/Item'
import { useDrag } from './Hooks/useDrag'
import { usePlayerVariable } from './Hooks/usePlayerVisible'
import { terrainItems } from './Media/Terrains'

export type IItem = { texFile: string; title: string }

export type InterfaceProps = {
    cb: (props: { setVisible: ({ visible, playerId }: { visible: boolean; playerId: number }) => void }) => void
}

export const Interface = ({ cb }: InterfaceProps) => {
    const { get: getVisible, set: setVisible } = usePlayerVariable<boolean>()

    const { get: getPos, set: setPos } = usePlayerVariable<{ x: number; y: number }>()

    useDrag({
        onDrag: (playerId, x, y) => {
            // TODO; Leaks
            setPos({
                playerId,
                value: {
                    x: ((x - GetCameraTargetPositionX()) / (128 * 20) + 1) / 2,
                    y: ((y - GetCameraTargetPositionY()) / (128 * 20) + 1) / 2,
                },
            })
        },
    })

    React.useEffect(() => {
        cb({
            setVisible: ({ playerId, visible }) => {
                setVisible({ playerId, value: visible })
            },
        })
    }, [])

    // TODO; Update this when someone does -news etc
    const usedTerrains: IItem[] = []
    for (const [_, terrain] of pairs(getUdgTerrainTypes().getAll())) {
        arrayPush(
            usedTerrains,
            terrainItems.find(i => i.title === Ascii2String(terrain.terrainTypeId))
        )
    }

    const getItemPosition = ({ item }: { item: IItem }): { visible: boolean; absPos: [AbsPos, AbsPos] } => {
        const i = usedTerrains.findIndex(d => d.title === item.title)

        return {
            visible: true,
            absPos: [
                { point: FRAMEPOINT_TOPLEFT, x: 0.1501 + i * 0.05177, y: 0.51048 },
                { point: FRAMEPOINT_BOTTOMRIGHT, x: 0.18987 + i * 0.05177, y: 0.4707 },
            ],
        }
    }

    // TSTL fails if this is placed inline
    const absPos = [
        {
            point: FRAMEPOINT_TOPLEFT,
            x: getPos({ playerId: GetPlayerId(GetLocalPlayer()) })?.x || 0.1,
            y: (getPos({ playerId: GetPlayerId(GetLocalPlayer()) })?.y || 0.3) + 0.25,
        },
        {
            point: FRAMEPOINT_BOTTOMRIGHT,
            x: (getPos({ playerId: GetPlayerId(GetLocalPlayer()) })?.x || 0.1) + 0.3,
            y: getPos({ playerId: GetPlayerId(GetLocalPlayer()) })?.y || 0.3,
        },
    ]

    return (
        <container>
            <container visible={getVisible({ playerId: GetPlayerId(GetLocalPlayer()) }) || false}>
                <container>
                    <backdrop
                        texture={{ texFile: 'ui\\glues\\singleplayer\\orc_exp\\scrolltexture1' }}
                        absPosition={absPos}
                    />

                    {usedTerrains.map(item => {
                        const { visible, absPos } = getItemPosition({ item })

                        return (
                            <Item
                                v={item}
                                absPosition={absPos}
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
