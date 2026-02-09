import { Constants } from 'core/01_libraries/Constants'
import { MemoryHandler } from '../../../Utils/MemoryHandler'
import { arrayPush } from '../../01_libraries/Basic_functions'
import { HorizontalRegion } from '../Region/HorizontalRegion'

function OnNextWaypointReached(unit: unit) {
    const longDistanceMoveOrder = LongDistanceMoveOrder.unitToLongDistanceMoveOrder[GetHandleId(unit)]

    if (!!longDistanceMoveOrder) {
        longDistanceMoveOrder.onNextWaypointReached()
    }
}

export function init_LongDistanceMoveOrder_garbageCollector() {
    const triggerInterval = 10 // 10 seconds
    TimerStart(CreateTimer(), triggerInterval, true, () => {
        for (const [_, longDistanceMoveOrder] of pairs(LongDistanceMoveOrder.unitToLongDistanceMoveOrder)) {
            longDistanceMoveOrder.destroyIfObsolete()
        }
    })
}

/**
 * Issues an order to a unit to move to a point, with intermediate waypoints if the distance is too long.
 * @param whichUnit The unit to issue the move order to.
 * @param x The x-coordinate of the destination point.
 * @param y The y-coordinate of the destination point.
 * @returns True if the order was successfully issued, false otherwise.
 */
export const IssueMoveOrderForLongDistance = (whichUnit: unit, x: number, y: number): boolean => {
    if (!whichUnit || !IsUnitAliveBJ(whichUnit)) {
        return false
    }

    // Determinate if we can handle the move in one go (short distance or vertical/horizontal move)
    const startX = GetUnitX(whichUnit)
    const startY = GetUnitY(whichUnit)
    const deltaX = x - startX
    const deltaY = y - startY

    const distance = SquareRoot(deltaX * deltaX + deltaY * deltaY)
    let simpleMove = distance <= Constants.MAX_DISTANCE_PER_MOVE_ORDER

    if (simpleMove) {
        IssuePointOrder(whichUnit, 'move', x, y)
    } else {
        // Handle long distance move with intermediate waypoints
        // new LongDistanceMoveOrder(whichUnit, x, y)
        MemoryHandler.getEmptyClass(LongDistanceMoveOrder, whichUnit, x, y)
    }

    return true
}

export class LongDistanceMoveOrder {
    // todo fix: the creation of instances of this class probably causes memory leaks
    static unitToLongDistanceMoveOrder: { [x: number]: LongDistanceMoveOrder } = {}

    private unit: unit
    private destinationX: number
    private destinationY: number
    private waypointsX = MemoryHandler.getEmptyArray<number>()
    private waypointsY = MemoryHandler.getEmptyArray<number>()
    private nextWaypointRegion: HorizontalRegion
    private currentWaypointIndex: number

    constructor(whichUnit: unit, x: number, y: number) {
        this.unit = whichUnit
        this.destinationX = x
        this.destinationY = y

        if (!whichUnit || !IsUnitAliveBJ(whichUnit)) {
            throw new Error('LongDistanceMoveOrder: whichUnit is invalid or dead')
        }

        LongDistanceMoveOrder.unitToLongDistanceMoveOrder[GetHandleId(this.unit)] = this

        // this.nextWaypointRegion = new HorizontalRegion(0, 0, 64, 64)
        this.nextWaypointRegion = MemoryHandler.getEmptyClass(HorizontalRegion, 0, 0, 64, 64)

        this.nextWaypointRegion.watchUnit(this.unit)
        this.nextWaypointRegion.onUnitEnters(OnNextWaypointReached)
        this.nextWaypointRegion.enableWatchUnits(true)

        this.calculateWaypoints()

        this.currentWaypointIndex = -1
        this.issueMoveOrderToNextWaypoint()
    }

    private calculateWaypoints() {
        const startX = GetUnitX(this.unit)
        const startY = GetUnitY(this.unit)
        const deltaX = this.destinationX - startX
        const deltaY = this.destinationY - startY
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

        const steps = Math.ceil(distance / Constants.MAX_DISTANCE_PER_MOVE_ORDER)

        for (let i = 1; i <= steps; i++) {
            const t = I2R(i) / I2R(steps)
            const waypointX = startX + t * deltaX
            const waypointY = startY + t * deltaY
            arrayPush(this.waypointsX, waypointX)
            arrayPush(this.waypointsY, waypointY)
        }
    }

    private issueMoveOrderToNextWaypoint() {
        this.currentWaypointIndex++

        if (this.currentWaypointIndex < this.waypointsX.length) {
            const waypointX = this.waypointsX[this.currentWaypointIndex]
            const waypointY = this.waypointsY[this.currentWaypointIndex]
            IssuePointOrder(this.unit, 'move', waypointX, waypointY)

            this.nextWaypointRegion.moveTo(waypointX, waypointY)

            if (this.currentWaypointIndex === this.waypointsX.length - 1) {
                // Last waypoint is the final destination, we can clean the region entering detection
                this.destroy()
            }
        }
    }

    public onNextWaypointReached() {
        this.issueMoveOrderToNextWaypoint()
    }

    private destroy() {
        delete LongDistanceMoveOrder.unitToLongDistanceMoveOrder[GetHandleId(this.unit)]

        this.nextWaypointRegion.destroy()

        MemoryHandler.destroyArray(this.waypointsX)
        MemoryHandler.destroyArray(this.waypointsY)

        MemoryHandler.destroyClassObject(this.nextWaypointRegion, this.nextWaypointRegion.constructor.name)
        MemoryHandler.destroyClassObject(this, this.constructor.name)
    }

    public destroyIfObsolete() {
        if (!IsUnitAliveBJ(this.unit)) {
            this.destroy()
        }
    }
}
