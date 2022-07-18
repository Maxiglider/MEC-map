import { arrayPush, IsIssuedOrder, StopUnit } from 'core/01_libraries/Basic_functions'
import { createEvent } from 'Utils/mapUtils'
import { getUdgEscapers, globals } from '../../../../globals'
import { ObjectHandler } from '../../../Utils/ObjectHandler'
import { Hero2Escaper, IsHero } from '../Escaper/Escaper_functions'
import { Level } from './Level'

const SLIDE_PERIOD_TPs = 0.01

export class StaticSlide {
    private x1: number
    private y1: number
    private x2: number
    private y2: number
    private x3: number
    private y3: number
    private x4: number
    private y4: number
    private angle: number
    private speed: number
    level?: Level

    id?: number

    private slidingPlayers: number[] = []
    private triggers: trigger[] = []

    constructor(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        x3: number,
        y3: number,
        x4: number,
        y4: number,
        angle: number,
        speed: number
    ) {
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
        this.x3 = x3
        this.y3 = y3
        this.x4 = x4
        this.y4 = y4
        this.angle = angle
        this.speed = speed
    }

    destroy = () => {
        this.activate(false)
        this.level && this.id && this.level.staticSlides.removeStaticSlide(this.id)
    }

    removePlayer = (playerId: number) => {
        const itemIndex = this.slidingPlayers.indexOf(playerId)

        if (itemIndex !== -1) {
            getUdgEscapers().get(playerId)?.enableSlide(true)
            getUdgEscapers().get(playerId)?.setStaticSliding(false)
            this.slidingPlayers.splice(itemIndex, 1)
        }
    }

    activate = (activ: boolean) => {
        if (activ) {
            // Start region
            const rect = Rect(this.x1, this.y1, this.x2, this.y2)

            arrayPush(
                this.triggers,
                createEvent({
                    events: [t => TriggerRegisterEnterRectSimple(t, rect)],
                    actions: [
                        () => {
                            const hero = GetTriggerUnit()
                            const escaper = Hero2Escaper(hero)

                            if (
                                IsHero(hero) &&
                                escaper &&
                                !escaper.isStaticSliding() &&
                                !this.slidingPlayers.includes(escaper.getEscaperId())
                            ) {
                                arrayPush(this.slidingPlayers, escaper.getEscaperId())
                                escaper.setStaticSliding(true)
                                SetUnitFacing(hero, this.angle)
                                Hero2Escaper(hero)?.enableSlide(false)
                                Hero2Escaper(hero)?.setLastTerrainType(undefined)
                            }
                        },
                    ],
                })
            )

            RemoveRect(rect)

            // End region
            const rect2 = Rect(this.x3, this.y3, this.x4, this.y4)

            arrayPush(
                this.triggers,
                createEvent({
                    events: [t => TriggerRegisterEnterRectSimple(t, rect2)],
                    actions: [
                        () => {
                            const hero = GetTriggerUnit()
                            this.removePlayer(Hero2Escaper(hero)?.getEscaperId() || -1)
                        },
                    ],
                })
            )

            RemoveRect(rect2)

            // Move sliders
            arrayPush(
                this.triggers,
                createEvent({
                    events: [t => TriggerRegisterTimerEventPeriodic(t, SLIDE_PERIOD_TPs)],
                    actions: [
                        () => {
                            for (const playerId of this.slidingPlayers) {
                                const hero = getUdgEscapers().get(playerId)?.getHero()

                                if (!hero) {
                                    continue
                                }

                                const x = GetUnitX(hero)
                                const y = GetUnitY(hero)

                                const distanceSlidePerPeriod = this.speed * SLIDE_PERIOD_TPs

                                const newX = x + distanceSlidePerPeriod * Cos(Deg2Rad(this.angle))
                                const newY = y + distanceSlidePerPeriod * Sin(Deg2Rad(this.angle))

                                if (newX >= globals.MAP_MIN_X && newX <= globals.MAP_MAX_X) {
                                    SetUnitX(hero, newX)
                                }

                                if (newY >= globals.MAP_MIN_Y && newY <= globals.MAP_MAX_Y) {
                                    SetUnitY(hero, newY)
                                }
                            }
                        },
                    ],
                })
            )

            // Prevent clicks
            arrayPush(
                this.triggers,
                createEvent({
                    events: [
                        t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER),
                        t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER),
                    ],
                    actions: [
                        () => {
                            if (this.slidingPlayers.includes(Hero2Escaper(GetTriggerUnit())?.getEscaperId() || -1)) {
                                if (!IsIssuedOrder('smart')) {
                                    return
                                }

                                StopUnit(GetTriggerUnit())
                            }
                        },
                    ],
                })
            )
        } else {
            for (const playerId of this.slidingPlayers) {
                this.removePlayer(playerId)
            }

            for (const trigger of this.triggers) {
                DestroyTrigger(trigger)
            }
        }
    }

    containsPoint = (x: number, y: number) => {
        const x1 = Math.min(this.x1, this.x2)
        const x2 = Math.max(this.x1, this.x2)
        const x3 = Math.min(this.x3, this.x4)
        const x4 = Math.max(this.x3, this.x4)
        const y1 = Math.min(this.y1, this.y2)
        const y2 = Math.max(this.y1, this.y2)
        const y3 = Math.min(this.y3, this.y4)
        const y4 = Math.max(this.y3, this.y4)

        return (x >= x1 && x <= x2 && y >= y1 && y <= y2) || (x >= x3 && x <= x4 && y >= y3 && y <= y4)
    }

    getX1 = () => this.x1
    getX2 = () => this.x2
    getX3 = () => this.x3
    getX4 = () => this.x4
    getY1 = () => this.y1
    getY2 = () => this.y2
    getY3 = () => this.y3
    getY4 = () => this.y4

    getSpeed = () => this.speed
    getAngle = () => this.angle

    setSpeed = (speed: number) => {
        this.speed = speed
    }

    setAngle = (angle: number) => {
        this.angle = angle
    }

    toJson = () => {
        const output = ObjectHandler.getNewObject<any>()

        output['x1'] = R2I(this.x1)
        output['y1'] = R2I(this.y1)
        output['x2'] = R2I(this.x2)
        output['y2'] = R2I(this.y2)
        output['x3'] = R2I(this.x3)
        output['y3'] = R2I(this.y3)
        output['x4'] = R2I(this.x4)
        output['y4'] = R2I(this.y4)
        output['angle'] = R2I(this.angle)
        output['speed'] = R2I(this.speed)

        return output
    }
}
