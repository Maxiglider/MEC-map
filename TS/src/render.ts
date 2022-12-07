import { arrayPush } from 'core/01_libraries/Basic_functions'
import { ArrayHandler } from 'Utils/ArrayHandler'
import { ObjectHandler } from 'Utils/ObjectHandler'
import { getUdgLevels } from '../globals'

export type IRenderInfo = {
    [playerId: number]: { lastCameraPosX: number; lastCameraPosY: number }
}

const getTileCenter = (a: number) => {
    const b = Math.round(a)
    return b - math.fmod(b, 128)
}

export const renderWorldSingle = (renderInfo: IRenderInfo, playerIndex: number, x: number, y: number) => {
    if (GetLocalPlayer() === Player(playerIndex)) {
        const camX = getTileCenter(x)
        const camY = getTileCenter(y)

        const monstersMap = ObjectHandler.getNewObject<{
            [x_y: string]: unit[]
        }>()

        for (const [_, m] of pairs(getUdgLevels().getCurrentLevel().monsters.getAll())) {
            if (m.u && m.mt && m.mt?.getUnitMoveSpeed()) {
                if (!monstersMap[`${getTileCenter(GetUnitX(m.u))}_${getTileCenter(GetUnitY(m.u))}`]) {
                    monstersMap[`${getTileCenter(GetUnitX(m.u))}_${getTileCenter(GetUnitY(m.u))}`] =
                        ArrayHandler.getNewArray()
                }

                arrayPush(monstersMap[`${getTileCenter(GetUnitX(m.u))}_${getTileCenter(GetUnitY(m.u))}`], m.u)
            }
        }

        for (const [_, ms] of pairs(getUdgLevels().getCurrentLevel().monsterSpawns.getAll())) {
            if (ms.monsters) {
                ForGroup(ms.monsters, () => {
                    const m = GetEnumUnit()

                    if (!monstersMap[`${getTileCenter(GetUnitX(m))}_${getTileCenter(GetUnitY(m))}`]) {
                        monstersMap[`${getTileCenter(GetUnitX(m))}_${getTileCenter(GetUnitY(m))}`] =
                            ArrayHandler.getNewArray()
                    }

                    arrayPush(monstersMap[`${getTileCenter(GetUnitX(m))}_${getTileCenter(GetUnitY(m))}`], m)
                })
            }
        }

        if (
            !renderInfo[playerIndex] ||
            renderInfo[playerIndex].lastCameraPosX !== camX ||
            renderInfo[playerIndex].lastCameraPosY !== camY
        ) {
            const viewDistance = 16

            // Old
            if (renderInfo[playerIndex]) {
                const camX = renderInfo[playerIndex].lastCameraPosX
                const camY = renderInfo[playerIndex].lastCameraPosY

                const minX = camX - 128 * viewDistance
                const maxX = camX + 128 * viewDistance
                const minY = camY - 128 * viewDistance
                const maxY = camY + 128 * viewDistance

                for (let x = minX; x < maxX; x += 128) {
                    for (let y = minY; y < maxY; y += 128) {
                        const dKey = `${R2I(x)}_${R2I(y)}`

                        if (monstersMap[`${dKey}`]) {
                            for (const a of monstersMap[`${dKey}`]) {
                                ShowUnit(a, false)
                            }
                        }
                    }
                }
            }

            // New
            {
                const minX = camX - 128 * viewDistance
                const maxX = camX + 128 * viewDistance
                const minY = camY - 128 * viewDistance
                const maxY = camY + 128 * viewDistance

                for (let x = minX; x < maxX; x += 128) {
                    for (let y = minY; y < maxY; y += 128) {
                        const dKey = `${R2I(x)}_${R2I(y)}`

                        if (monstersMap[`${dKey}`]) {
                            for (const a of monstersMap[`${dKey}`]) {
                                ShowUnit(a, true)
                            }
                        }
                    }
                }
            }

            if (!renderInfo[playerIndex]) {
                renderInfo[playerIndex] = ObjectHandler.getNewObject()
            }

            renderInfo[playerIndex].lastCameraPosX = camX
            renderInfo[playerIndex].lastCameraPosY = camY
        }

        for (const [_, v] of pairs(monstersMap)) {
            ArrayHandler.clearArray(v)
        }

        ObjectHandler.clearObject(monstersMap)
    }
}

export const renderWorld = (renderInfo: IRenderInfo) => {
    for (let i = 0; i < 24; i++) {
        if (
            GetPlayerSlotState(Player(i)) === PLAYER_SLOT_STATE_PLAYING &&
            GetPlayerController(Player(i)) === MAP_CONTROL_USER
        ) {
            renderWorldSingle(renderInfo, i, GetCameraEyePositionX(), GetCameraEyePositionY())
        }
    }
}
