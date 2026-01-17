import { createPoint, IPoint } from '../../../Utils/Point'
import { Constants } from 'core/01_libraries/Constants'
import { Natives } from '../../wc3_natives_unsecured/Natives'
import { IsIssuedOrder } from '../../01_libraries/Basic_functions'

function OnNextWaypointReached() {
    const triggerId = GetHandleId(GetTriggeringTrigger()!)
    const longDistanceMoveOrder = LongDistanceMoveOrder.triggersToLongDistanceMoveOrder.get(triggerId)

    if (longDistanceMoveOrder) {
        longDistanceMoveOrder.onNextWaypointReached()
    }
}

export function init_LongDistanceMoveOrder_garbageCollector() {
    const triggerInterval = 10000 // 10 seconds
    TimerStart(CreateTimer(), triggerInterval, true, () => {
        for (const longDistanceMoveOrder of LongDistanceMoveOrder.triggersToLongDistanceMoveOrder.values()) {
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
    const sameXorYtoleranceDelta = 10

    let simpleMove = Math.abs(deltaX) < sameXorYtoleranceDelta || Math.abs(deltaY) < sameXorYtoleranceDelta

    if (!simpleMove) {
        const distance = SquareRoot(deltaX * deltaX + deltaY * deltaY)
        simpleMove = distance <= Constants.MAX_DISTANCE_PER_MOVE_ORDER
    }

    if (simpleMove) {
        IssuePointOrder(whichUnit, 'move', x, y)
    } else {
        // Handle long distance move with intermediate waypoints
        new LongDistanceMoveOrder(whichUnit, x, y)
    }

    return true
}

export class LongDistanceMoveOrder {
    static triggersToLongDistanceMoveOrder: Map<number, LongDistanceMoveOrder> = new Map()

    private unit: unit
    private destinationX: number
    private destinationY: number
    private waypoints: IPoint[] = []
    private waypointRects: rect[] = [] // one rect less than number of waypoints because last waypoint is the destination
    private waypointRegions: region[] = [] // one region less than number of waypoints because last waypoint is the destination
    private currentWaypointIndex: number
    private nextWaypointReachedDectectionTrigger: trigger

    constructor(whichUnit: unit, x: number, y: number) {
        this.unit = whichUnit
        this.destinationX = x
        this.destinationY = y

        if (!whichUnit || !IsUnitAliveBJ(whichUnit)) {
            throw new Error('LongDistanceMoveOrder: whichUnit is invalid or dead')
        }

        this.nextWaypointReachedDectectionTrigger = CreateTrigger()
        LongDistanceMoveOrder.triggersToLongDistanceMoveOrder.set(
            GetHandleId(this.nextWaypointReachedDectectionTrigger),
            this
        )
        TriggerAddAction(this.nextWaypointReachedDectectionTrigger, OnNextWaypointReached)

        this.calculateWaypoints()

        this.currentWaypointIndex = -1
        this.issueMoveOrderToNextWaypoint()
    }

    private calculateWaypoints() {
        this.waypoints = []
        this.waypointRects = []

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
            this.waypoints.push(createPoint(waypointX, waypointY))

            if (i < steps) {
                // No rect for the final destination
                const rect = Rect(waypointX - 16, waypointY - 16, waypointX + 16, waypointY + 16)
                this.waypointRects.push(rect)

                const region = CreateRegion()
                RegionAddRect(region, rect)
                this.waypointRegions.push(region)

                TriggerRegisterEnterRegion(this.nextWaypointReachedDectectionTrigger, region)
            }
        }
    }

    private issueMoveOrderToNextWaypoint() {
        this.currentWaypointIndex++

        if (this.currentWaypointIndex < this.waypoints.length) {
            const waypoint = this.waypoints[this.currentWaypointIndex]
            IssuePointOrder(this.unit, 'move', waypoint.x, waypoint.y)

            if (this.currentWaypointIndex === this.waypoints.length - 1) {
                // Last waypoint is the final destination, we can clean the region entering detection
                this.destroy()
            }
        }
    }

    public onNextWaypointReached() {
        if (
            Natives.UGetTriggerUnit() !== this.unit ||
            Natives.UGetTriggeringRegion() !== this.waypointRegions[this.currentWaypointIndex]
        ) {
            return
        }

        this.issueMoveOrderToNextWaypoint()
    }

    private destroy() {
        LongDistanceMoveOrder.triggersToLongDistanceMoveOrder.delete(
            GetHandleId(this.nextWaypointReachedDectectionTrigger)
        )

        DestroyTrigger(this.nextWaypointReachedDectectionTrigger)

        for (const rect of this.waypointRects) {
            RemoveRect(rect)
        }

        for (const region of this.waypointRegions) {
            RemoveRegion(region)
        }
    }

    public destroyIfObsolete() {
        if (!IsUnitAliveBJ(this.unit)) {
            this.destroy()
        }
    }
}
