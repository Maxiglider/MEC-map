// For -snapPatrolsToSlideOffset and -snapPatrolsToSlide commands
import { getUdgMonsterTypes, getUdgTerrainTypes } from '../../../../globals'
import { createPoint } from '../../../Utils/Point'
import { MonsterType } from '../../04_STRUCTURES/Monster/MonsterType'

export const snapPatrolsToSlideOffsetMap: { [mt: string]: { angle: number; offset: number } | null } = {}
const snappedHistoryMap: { [historyId: string]: { x: number | undefined; y: number | undefined } } = {}

export const snapPointToSlide = (
    historyId: string,
    _x1: number,
    _y1: number,
    x2: number,
    y2: number,
    preferredDistance: number,
    fixStartOnSlidePatrols: boolean,
    mt: MonsterType
) => {
    const x1 = snappedHistoryMap[historyId]?.x || _x1
    const y1 = snappedHistoryMap[historyId]?.y || _y1

    if (!snappedHistoryMap[historyId]) {
        snappedHistoryMap[historyId] = { x: _x1, y: _y1 }
    }

    const currentTerrain = getUdgTerrainTypes().getTerrainType(x1, y1)
    let newX = x1
    let newY = y1

    if (currentTerrain?.kind === 'death') {
        const angle = Atan2(y2 - y1, x2 - x1)
        let currentX: number | undefined = undefined
        let currentY: number | undefined = undefined

        for (let i = 0; i <= 256; i++) {
            const testX = x1 + Math.cos(angle) * i
            const testY = y1 + Math.sin(angle) * i
            const tt = getUdgTerrainTypes().getTerrainType(testX, testY)

            if (tt?.kind === 'slide' || tt?.kind === 'walk') {
                currentX = testX
                currentY = testY
                break
            }
        }

        if (currentX !== undefined && currentY !== undefined) {
            const oppositeAngle = angle + Math.PI

            newX = currentX + Math.cos(oppositeAngle) * (preferredDistance + GetRandomInt(-4, 4))
            newY = currentY + Math.sin(oppositeAngle) * (preferredDistance + GetRandomInt(-4, 4))
        }
    }

    if (fixStartOnSlidePatrols && (currentTerrain?.kind === 'slide' || currentTerrain?.kind === 'walk')) {
        const angle = Atan2(y2 - y1, x2 - x1) + Math.PI

        let currentX: number | undefined = undefined
        let currentY: number | undefined = undefined

        for (let i = 0; i <= 256; i++) {
            const testX = x1 + Math.cos(angle) * i
            const testY = y1 + Math.sin(angle) * i
            const tt = getUdgTerrainTypes().getTerrainType(testX, testY)

            if (tt?.kind === 'death') {
                currentX = testX
                currentY = testY
                break
            }
        }

        if (currentX !== undefined && currentY !== undefined) {
            const oppositeAngle = angle

            newX = currentX + Math.cos(oppositeAngle) * (preferredDistance + GetRandomInt(-4, 4))
            newY = currentY + Math.sin(oppositeAngle) * (preferredDistance + GetRandomInt(-4, 4))
        }
    }

    const item = snapPatrolsToSlideOffsetMap[mt.label] || snapPatrolsToSlideOffsetMap['all']

    if (item) {
        newX += Math.cos(item.angle) * item.offset
        newY += Math.sin(item.angle) * item.offset
    }

    return createPoint(newX, newY)
}

// For command -patchImmo
export const adaptMonstersImmolation = (delta: number) => {
    getUdgMonsterTypes().forAll(monsterType => {
        const newImmolationRadius = Math.max(5, Math.min(400, monsterType.getImmolationRadius() + delta))
        monsterType.setImmolation(newImmolationRadius)
    })
}

export const cameraFieldMap: { [x: string]: camerafield } = {
    TARGET_DISTANCE: CAMERA_FIELD_TARGET_DISTANCE,
    FARZ: CAMERA_FIELD_FARZ,
    ANGLE_OF_ATTACK: CAMERA_FIELD_ANGLE_OF_ATTACK,
    FIELD_OF_VIEW: CAMERA_FIELD_FIELD_OF_VIEW,
    ROLL: CAMERA_FIELD_ROLL,
    ROTATION: CAMERA_FIELD_ROTATION,
    ZOFFSET: CAMERA_FIELD_ZOFFSET,
    NEARZ: CAMERA_FIELD_NEARZ,
    LOCAL_PITCH: CAMERA_FIELD_LOCAL_PITCH,
    LOCAL_YAW: CAMERA_FIELD_LOCAL_YAW,
    LOCAL_ROLL: CAMERA_FIELD_LOCAL_ROLL,
}
