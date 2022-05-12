import { Ascii2String } from 'core/01_libraries/Ascii'
import { arrayPush } from 'core/01_libraries/Basic_functions'
import { Text } from 'core/01_libraries/Text'
import { ServiceManager } from 'Services'
import * as React from 'w3ts-jsx/dist/src/index'
import { getUdgEscapers, getUdgTerrainTypes } from '../../globals'
import { Item } from './Components/Item'
import { usePlayerVariable } from './Hooks/usePlayerVisible'
import { terrainItems } from './Media/Terrains'
import { IAbsPos } from './Utils'

export type IItem = { texFile: string; title: string; scale: '1:1' | '2:1' }

export type InterfaceProps = {
    cb: (props: {
        setVisible: ({ visible, playerId }: { visible: boolean; playerId: number }) => void
        resetUI: (playerId: number) => void
    }) => void
}

const convertToReal = (s: string) => {
    return Math.round(S2R(s) * 1000) / 1000
}

export const Interface = ({ cb }: InterfaceProps) => {
    const { get: getVisible, set: setVisible } = usePlayerVariable<boolean>()

    const { get: getPos, set: setPos } = usePlayerVariable<{ x: number; y: number }>()

    const defaultPos = { x: 0.007, y: 0.471 }
    const mainPos = getPos(GetPlayerId(GetLocalPlayer())) || defaultPos

    const forceUpdate = React.useForceUpdate()

    React.useEffect(() => {
        ServiceManager.getService('React').setForceUpdate(forceUpdate)
        return () => ServiceManager.getService('React').setForceUpdate(null)
    }, [])

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
                setVisible(playerId, visible)
            },
            resetUI: playerId => {
                setPos(playerId, defaultPos)
            },
        })

        // Always on
        // setVisible(0, true)
    }, [])

    const [terrainState, setTerrainState] = React.useState<{ oldState: string }>({ oldState: '' })

    let usedTerrains: IItem[] = []

    const udgTerrainTypes = getUdgTerrainTypes().getAll()
    for (let i = 0; i < getUdgTerrainTypes().getLastInstanceId(); i++) {
        const terrain = udgTerrainTypes[i]

        if (terrain) {
            arrayPush(
                usedTerrains,
                terrainItems.find(i => i.title === Ascii2String(terrain.terrainTypeId))
            )
        }
    }

    React.useEffect(() => {
        if (terrainState.oldState !== usedTerrains.join('_')) {
            setTerrainState({ oldState: usedTerrains.join('_') })

            usedTerrains = []
        }
    })

    const useItemGroup = <T, _ = any>({ maxNbCols, items }: { maxNbCols: number; items: T[] }) => {
        const margin = 0.0075
        const containerMargin = margin * 4
        const itemSize = 0.03

        const nbRows = Math.ceil(items.length / maxNbCols)
        const nbCols = Math.min(maxNbCols, items.length)

        const container = {
            x: mainPos.x - containerMargin,
            y: mainPos.y + containerMargin,
            width: margin + nbCols * itemSize + nbCols * margin + containerMargin * 2,
            height: margin + nbRows * itemSize + nbRows * margin + containerMargin * 2,
        }

        const getItemPosition = ({ item }: { item: T }): { visible: boolean; absPos: IAbsPos } => {
            const i = items.findIndex(d => d === item)

            const row = Math.floor(i / nbCols)
            const col = i % nbCols

            return {
                visible: true,
                absPos: {
                    point: FRAMEPOINT_TOPLEFT,
                    x: mainPos.x + margin + col * itemSize + col * margin,
                    y: mainPos.y - margin - row * itemSize - row * margin,
                },
            }
        }

        return { container, getItemPosition }
    }

    const terrainGroup = useItemGroup<IItem>({ maxNbCols: 16, items: usedTerrains })

    return (
        <container>
            <container visible={getVisible(GetPlayerId(GetLocalPlayer())) || false}>
                <container>
                    <backdrop
                        inherits="EscMenuBackdrop"
                        absPosition={{
                            point: FRAMEPOINT_TOPLEFT,
                            x: terrainGroup.container.x,
                            y: terrainGroup.container.y,
                        }}
                        size={{ width: terrainGroup.container.width, height: terrainGroup.container.height }}
                    />

                    {usedTerrains.map(item => {
                        const { visible, absPos } = terrainGroup.getItemPosition({ item })

                        return (
                            <Item
                                v={item}
                                absPosition={absPos}
                                size={{ width: 0.03, height: 0.03 }}
                                visible={(getVisible(GetPlayerId(GetLocalPlayer())) || false) && visible}
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

                {/* {(() => {
                    const x = terrainGroup.container.x + terrainGroup.container.width
                    const y = terrainGroup.container.y

                    return (
                        <container>
                            <backdrop
                                inherits="EscMenuBackdrop"
                                absPosition={{ point: FRAMEPOINT_TOPLEFT, x: terrainGroup.container.x, y }}
                                size={{ width: 0.1, height: 0.1 }}
                            />

                            <glueeditbox
                                inherits={'EscMenuEditBoxTemplate'}
                                absPosition={{ point: FRAMEPOINT_TOPLEFT, x, y }}
                                size={{ width: 0.1, height: 0.01 }}
                                text={`${mainPos.x}`}
                                onEditboxTextChanged={() => {
                                    setPos(GetPlayerId(GetLocalPlayer()), {
                                        x: convertToReal(BlzGetTriggerFrameText()),
                                        y: mainPos.y,
                                    })
                                }}
                            />

                            <glueeditbox
                                inherits={'EscMenuEditBoxTemplate'}
                                absPosition={{ point: FRAMEPOINT_TOPLEFT, x, y: y - 0.02 }}
                                size={{ width: 0.1, height: 0.01 }}
                                text={`${mainPos.y}`}
                                onEditboxTextChanged={() => {
                                    setPos(GetPlayerId(GetLocalPlayer()), {
                                        x: mainPos.x,
                                        y: convertToReal(BlzGetTriggerFrameText()),
                                    })
                                }}
                            />
                        </container>
                    )
                })()} */}

                {/* <container>
                    <text
                        text={'|cffFCD20Dx|r'}
                        absPosition={{
                            point: FRAMEPOINT_TOPLEFT,
                            x: terrainGroup.container.x + terrainGroup.container.width - 0.02,
                            y: terrainGroup.container.y - 0.02,
                        }}
                        onClick={() => setVisible(GetPlayerId(GetTriggerPlayer()), false)}
                    />

                    <gluetextbutton
                        inherits="ScriptDialogButton"
                        text={'|cffFCD20Dx|r'}
                        scale={0.8}
                        absPosition={{
                            point: FRAMEPOINT_TOPLEFT,
                            x: terrainGroup.container.x + terrainGroup.container.width - 0.04,
                            y: terrainGroup.container.y - 0.008,
                        }}
                        size={{ width: 0.025, height: 0.025 }}
                        onClick={() => setVisible(GetPlayerId(GetTriggerPlayer()), false)}
                    />

                    <gluetextbutton
                        inherits="ScriptDialogButton"
                        text={'|cffFCD20Dx|r'}
                        scale={0.286}
                        absPosition={{
                            point: FRAMEPOINT_TOPLEFT,
                            x: terrainGroup.container.x + terrainGroup.container.width,
                            y: terrainGroup.container.y,
                        }}
                        onClick={() => setVisible(GetPlayerId(GetTriggerPlayer()), false)}
                    />
                </container> */}
            </container>
        </container>
    )
}
