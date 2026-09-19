import { arrayValuesRound, GetLocDist } from 'core/01_libraries/Basic_functions'
import { Constants } from 'core/01_libraries/Constants'
import { globals, udg_monsters } from '../../../../globals'
import { MemoryHandler } from '../../../Utils/MemoryHandler'
import { HorizontalRectangleRegion } from '../Region/HorizontalRectangleRegion'
import type { ContactAreaBuilder } from './ContactChunks'
import { requestContactChunksRebuild } from './ContactChunks'
import { Monster } from './Monster'
import { NewPatrolMonster } from './Monster_functions'
import { MonsterType } from './MonsterType'

/** The side of the square a waypoint is reached in, as for a long distance move (LongDistanceMoveOrder) */
const WAYPOINT_SIZE = 64

function OnWaypointReached(this: any, unit: unit) {
    const monster = udg_monsters[GetUnitUserData(unit)]

    if (monster instanceof MonsterMultiplePatrols && monster.u === unit) {
        monster.nextMove()
    }
}

export class MonsterMultiplePatrols extends Monster {
    static X: number[] = []
    static Y: number[] = []

    private currentMove: number
    private sens: number //0 : normal toujours positif, 1 : sens normal avec changement, 2 : sens inversé avec changement

    x: number[] = []
    y: number[] = []
    /**
     * The point the unit walks to, as a MEC region watching it, moved from point to point: its position is
     * checked every 0.05 s, where a native region only told when a unit crossed into it. A unit already standing
     * on its next point, or stopping at the edge of a small native region, left a monster standing still for good.
     */
    private waypointRegion: HorizontalRectangleRegion | null = null
    private watchedUnit: unit | null = null

    constructor(mt: MonsterType, mode: string, forceId: number | null = null) {
        super(mt, forceId)

        //mode == "normal" (0, 1, 2, 3, 0 , 1...) ou mode == "string" (0, 1, 2, 3, 2, 1...)
        if (mode !== 'normal' && mode !== 'string') {
            throw this.constructor.name + ' : wrong mode "' + mode + '"'
        }

        if (mode === 'normal') {
            this.sens = 0
        } else {
            this.sens = 1
        }

        MonsterMultiplePatrols.X.forEach((x, n) => {
            this.x[n] = x
            this.y[n] = MonsterMultiplePatrols.Y[n]
        })

        this.currentMove = -1
        MonsterMultiplePatrols.destroyLocs()
    }

    static count = () => {
        let n = 0

        for (const [_, monster] of pairs(udg_monsters)) {
            if (monster instanceof MonsterMultiplePatrols) {
                n++
            }
        }

        return n
    }

    static storeNewLoc(x: number, y: number) {
        const nbLocsBefore = MonsterMultiplePatrols.X.length
        MonsterMultiplePatrols.X[nbLocsBefore] = x
        MonsterMultiplePatrols.Y[nbLocsBefore] = y
        return true
    }

    static destroyLocs() {
        MonsterMultiplePatrols.X = []
        MonsterMultiplePatrols.Y = []
    }

    getContactAreaLabel(): string {
        return this.circleMobParent ? super.getContactAreaLabel() : 'multiplePatrol'
    }

    protected describeOwnContactArea(area: ContactAreaBuilder) {
        for (let i = 0; i < this.x.length; i++) {
            if (i === 0) {
                area.addPoint(this.x[i], this.y[i])
            } else {
                area.addSegment(this.x[i - 1], this.y[i - 1], this.x[i], this.y[i])
            }
        }

        // the last leg, walked back to the first point in "normal" mode
        if (this.sens === 0 && this.x.length > 2) {
            area.addSegment(this.x[this.x.length - 1], this.y[this.y.length - 1], this.x[0], this.y[0])
        }
    }

    /** The waypoint region watching the current unit, made the first time a unit is there */
    private watchCurrentUnit() {
        if (!this.u) {
            return
        }

        if (!this.waypointRegion) {
            this.waypointRegion = MemoryHandler.getEmptyClass(
                HorizontalRectangleRegion,
                0,
                0,
                WAYPOINT_SIZE,
                WAYPOINT_SIZE
            )
            if (globals.debugLongDistanceMoves) {
                this.waypointRegion.debugRects(true)
            }
            this.waypointRegion.onUnitEnters(OnWaypointReached)
            this.waypointRegion.enableWatchUnits(true)
        }

        if (this.watchedUnit !== this.u) {
            this.stopWatchingUnit()
            this.waypointRegion.watchUnit(this.u)
            this.watchedUnit = this.u
        }
    }

    private stopWatchingUnit() {
        if (this.waypointRegion && this.watchedUnit) {
            this.waypointRegion.unwatchUnit(this.watchedUnit)
        }
        this.watchedUnit = null
    }

    activateMove(id: number) {
        if (!this.u) {
            return
        }

        this.watchCurrentUnit()
        if (this.waypointRegion) {
            this.waypointRegion.moveTo(this.x[id], this.y[id])
            // seen entering at the next check even when it already stands there
            this.waypointRegion.forgetUnitPresence(this.u)
        }
        IssuePointOrder(this.u, 'move', this.x[id], this.y[id])
    }

    nextMove = () => {
        const lastLocInd = this.x.length - 1

        if (this.sens === 0 || this.sens === 1) {
            if (this.currentMove >= lastLocInd) {
                if (this.sens === 0) {
                    this.currentMove = 0
                } else {
                    this.sens = 2
                    this.currentMove = this.currentMove - 1
                }
            } else {
                this.currentMove = this.currentMove + 1
            }
        } else {
            if (this.currentMove <= 0) {
                this.sens = 1
                this.currentMove = 1
            } else {
                this.currentMove = this.currentMove - 1
            }
        }

        this.activateMove(this.currentMove)
    }

    createUnit = () => {
        if (this.x.length < 2) {
            return //need at least 2 locations to create a unit
        }

        super.createUnit(() =>
            this.mt ? NewPatrolMonster(this.mt, this.x[0], this.y[0], this.x[1], this.y[1]) : undefined
        )

        this.currentMove = 1
        if (this.sens === 2) {
            this.sens = 1
        }
        this.activateMove(1)
    }

    removeUnit() {
        this.stopWatchingUnit()
        super.removeUnit()
    }

    getX = (id: number) => {
        return this.x[id]
    }

    getY = (id: number): number => {
        return this.y[id]
    }

    destroyLastLoc = (): boolean => {
        const lastLocInd = this.x.length - 1

        if (lastLocInd < 0) {
            return false
        }

        delete this.x[lastLocInd]
        delete this.y[lastLocInd]
        requestContactChunksRebuild()

        if (lastLocInd === 1) {
            this.removeUnit()
        }

        if (lastLocInd === this.currentMove) {
            this.currentMove = this.currentMove - 1
            this.activateMove(this.currentMove)
        }

        return true
    }

    addNewLocAt(id: number, x: number, y: number) {
        this.x[id] = x
        this.y[id] = y
        requestContactChunksRebuild() // one more leg it can be touched along
    }

    setLocAt(id: number, x: number, y: number) {
        this.x[id] = x
        this.y[id] = y
        if (id === this.currentMove) {
            this.activateMove(id)
        }
        requestContactChunksRebuild()
    }

    addNewLoc(x: number, y: number) {
        let lastLocInd = this.x.length - 1

        if (GetLocDist(this.getX(lastLocInd), this.getY(lastLocInd), x, y) <= Constants.PATROL_DISTANCE_MIN) {
            return 2
        }

        if (
            lastLocInd >= 0 &&
            this.sens === 0 &&
            GetLocDist(this.x[0], this.y[0], x, y) <= Constants.PATROL_DISTANCE_MIN
        ) {
            return 1
        }

        lastLocInd++

        this.addNewLocAt(lastLocInd, x, y)
        if (lastLocInd === 1) {
            this.createUnit()
        }

        return 0
    }

    destroy = () => {
        while (this.destroyLastLoc()) {}
        super.destroy()

        this.stopWatchingUnit()
        if (this.waypointRegion) {
            this.waypointRegion.destroy()
            MemoryHandler.destroyClassObject(this.waypointRegion, this.waypointRegion.constructor.name)
            this.waypointRegion = null
        }
    }

    toJson() {
        const output = super.toJson()
        if (output) {
            output['mode'] = this.sens > 0 ? 'string' : 'normal'
            output['xArr'] = arrayValuesRound(this.x)
            output['yArr'] = arrayValuesRound(this.y)
        }
        return output
    }
}
