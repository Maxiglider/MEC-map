import { NB_ESCAPERS, SLIDE_PERIOD } from 'core/01_libraries/Constants'
import { Apm } from 'core/08_GAME/Apm_clics_par_minute/Apm'
import { createTimer } from 'Utils/mapUtils'
import { getUdgEscapers, globals } from '../../../../globals'
import { Escaper } from '../../04_STRUCTURES/Escaper/Escaper'
import { GetMirrorEscaper } from '../../04_STRUCTURES/Escaper/Escaper_functions'
import { Gravity, GRAVITY_EVERY_N_PERIOD } from './Gravity'
import { MAX_DEGREE_ON_WHICH_SPEED_TABLE_TAKES_CONTROL, SPEED_AT_LEAST_THAN_50_DEGREES } from './SlidingMax'

const tmpLoc = Location(0, 0)

const escaperTurnForOnePeriod = (escaper: Escaper | null) => {
    if (!escaper) return

    const hero = escaper.getHero()
    if (!hero) return

    const remainingDegrees = escaper.getRemainingDegreesToTurn()
    if (remainingDegrees != 0) {
        const currentAngle = GetUnitFacing(hero)

        let diffToApplyAbs = RMinBJ(RAbsBJ(remainingDegrees), RAbsBJ(escaper.getMaxSlideTurnPerPeriod()))

        if (diffToApplyAbs > 0.05) {
            //sens
            const sens = remainingDegrees * escaper.getMaxSlideTurnPerPeriod() > 0 ? 1 : -1
            const maxIncreaseRotationSpeedPerPeriod = RAbsBJ(
                (escaper.getMaxSlideTurnPerPeriod() * SLIDE_PERIOD) / escaper.rotationTimeForMaximumSpeed
            )

            let newSlideTurn: number

            const curSlideTurn = escaper.getSlideCurrentTurnPerPeriod()

            let increaseRotationSpeedPerPeriod = maxIncreaseRotationSpeedPerPeriod

            let diffToApply

            if (RAbsBJ(remainingDegrees) <= MAX_DEGREE_ON_WHICH_SPEED_TABLE_TAKES_CONTROL) {
                const tableInd = Math.round(RAbsBJ(remainingDegrees))
                const aimedSpeedPercentage = SPEED_AT_LEAST_THAN_50_DEGREES[tableInd]
                const aimedNewSpeedPerPeriod = (escaper.getMaxSlideTurnPerPeriod() * aimedSpeedPercentage * sens) / 100
                const diffSpeed = aimedNewSpeedPerPeriod - curSlideTurn
                if (RAbsBJ(diffSpeed) < maxIncreaseRotationSpeedPerPeriod) {
                    diffToApply = aimedNewSpeedPerPeriod
                } else {
                    const sensDiffToApply = diffSpeed > 0 ? 1 : -1
                    diffToApply = curSlideTurn + sensDiffToApply * maxIncreaseRotationSpeedPerPeriod
                }
                escaper.setSlideCurrentTurnPerPeriod(diffToApply)
            } else {
                if (sens > 0) {
                    newSlideTurn = RMinBJ(
                        curSlideTurn + increaseRotationSpeedPerPeriod,
                        escaper.getMaxSlideTurnPerPeriod()
                    )
                    diffToApply = RMinBJ(newSlideTurn, diffToApplyAbs)
                    diffToApply = RMinBJ(remainingDegrees, diffToApply)
                } else {
                    newSlideTurn = RMaxBJ(
                        curSlideTurn - increaseRotationSpeedPerPeriod,
                        -escaper.getMaxSlideTurnPerPeriod()
                    )
                    diffToApply = RMaxBJ(newSlideTurn, -diffToApplyAbs)
                    diffToApply = RMaxBJ(remainingDegrees, diffToApply)
                }
                escaper.setSlideCurrentTurnPerPeriod(newSlideTurn)
            }

            //diffToApply
            escaper.setRemainingDegreesToTurn(remainingDegrees - diffToApply)

            //turn
            const newAngle = currentAngle + diffToApply
            BlzSetUnitFacingEx(hero, newAngle)
        }
    }
}

const initSlideTrigger = () => {
    //counter for height which has to execute at 0.01s period
    const counters: number[] = []
    for (let i = 0; i < NB_ESCAPERS; i++) {
        counters[i] = 0
    }

    const Slide_Actions = (n: number) => {
        const escaper = getUdgEscapers().get(n)

        if (!escaper) {
            return
        }

        const hero = escaper.getHero()

        if (!hero) return

        //offset of the hero position
        const oldX = GetUnitX(hero)
        const oldY = GetUnitY(hero)

        const lastZ = escaper.getLastZ()
        const speedZ = escaper.getSpeedZ()
        const oldDiffZ = escaper.getOldDiffZ()
        let height = GetUnitFlyHeight(hero)
        MoveLocation(tmpLoc, oldX, oldY)
        const z = GetLocationZ(tmpLoc)

        //turning
        const allowTurning = escaper.getRotationSpeed() != 0 && (height < 1 || globals.CAN_TURN_IN_AIR)

        if (allowTurning && escaper.slidingMode == 'max') {
            escaperTurnForOnePeriod(escaper)
            escaperTurnForOnePeriod(GetMirrorEscaper(escaper))
        }

        const angle = Deg2Rad(GetUnitFacing(hero))
        const newX = oldX + escaper.getSlideMovePerPeriod() * Cos(angle)
        const newY = oldY + escaper.getSlideMovePerPeriod() * Sin(angle)

        if (
            newX >= globals.MAP_MIN_X &&
            newX <= globals.MAP_MAX_X &&
            newY >= globals.MAP_MIN_Y &&
            newY <= globals.MAP_MAX_Y
        ) {
            escaper.moveHero(newX, newY)
        }

        const gravity = escaper.getLastTerrainType()?.getGravity() || Gravity.GetGravity()

        //gestion de la hauteur du héros
        counters[n]++
        if (counters[n] == GRAVITY_EVERY_N_PERIOD) {
            counters[n] = 0

            const diffZ = z - lastZ //différence de hauteur au niveau du terrain
            let delta: number

            if (height > 1) {
                escaper.setSpeedZ(speedZ + gravity)
                height += speedZ - diffZ
                if (height < 0) {
                    height = 0
                }
                SetUnitFlyHeight(hero, height, 0)

                //coop
                escaper.refreshCerclePosition()
            } else {
                delta = diffZ - oldDiffZ
                if (delta < gravity) {
                    escaper.setSpeedZ(oldDiffZ + gravity)
                    SetUnitFlyHeight(hero, -diffZ + escaper.getSpeedZ(), 0)

                    //arrêter de tourner si un clic a été fait juste avant
                    if (!globals.CAN_TURN_IN_AIR) {
                        SetUnitFacing(hero, GetUnitFacing(hero))
                    }
                } else if (!escaper.isAlive()) {
                    //le héros mort touche le sol, on désactive le slide
                    escaper.enableSlide(false)
                }
            }
            escaper.setLastZ(z)
            escaper.setOldDiffZ(diffZ)
        }

        //update apm
        Apm.timeOnSlide[n] = Apm.timeOnSlide[n] + SLIDE_PERIOD
    }

    const CreateSlideTimer = (escaperId: number) => {
        return createTimer(SLIDE_PERIOD, true, () => Slide_Actions(escaperId))
    }

    return { CreateSlideTimer }
}

export const SlideTrigger = initSlideTrigger()
