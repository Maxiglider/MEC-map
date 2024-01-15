import { pathingBlockerUtils } from 'Utils/PathingBlockerUtils'
import { createTimer } from 'Utils/mapUtils'
import { NB_ESCAPERS, SLIDE_PERIOD } from 'core/01_libraries/Constants'
import { Apm } from 'core/08_GAME/Apm_clics_par_minute/Apm'
import { Cpm } from 'core/08_GAME/Apm_clics_par_minute/Cpm'
import { getUdgEscapers, globals } from '../../../../globals'
import { Escaper } from '../../04_STRUCTURES/Escaper/Escaper'
import { GetMirrorEscaper } from '../../04_STRUCTURES/Escaper/Escaper_functions'
import { GRAVITY_EVERY_N_PERIOD, Gravity } from './Gravity'
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

        let oldAngle = escaper.oldAngle // Get the old angle before calculating the new one.
        let newAngle = Deg2Rad(GetUnitFacing(hero))
        let currentTime = os.clock()

        if (allowTurning && escaper.slidingMode == 'max') {
            escaperTurnForOnePeriod(escaper)
            escaperTurnForOnePeriod(GetMirrorEscaper(escaper))
        }

        let newX = oldX + escaper.getSlideMovePerPeriod() * Cos(newAngle)
        let newY = oldY + escaper.getSlideMovePerPeriod() * Sin(newAngle)

        if (!globals.canSlideOverPathingBlockers) {
            const oldXd = Math.floor(oldX / 64) * 64 + 32
            const oldYd = Math.floor(oldY / 64) * 64 + 32
            const newXd = Math.floor(newX / 64) * 64 + 32
            const newYd = Math.floor(newY / 64) * 64 + 32

            if (
                pathingBlockerUtils.isBlocked(newXd, newYd) ||
                (pathingBlockerUtils.isBlocked(newXd, oldYd) && pathingBlockerUtils.isBlocked(oldXd, newYd))
            ) {
                if (pathingBlockerUtils.isBlocked(newXd, oldYd)) {
                    newX = oldX
                }

                if (pathingBlockerUtils.isBlocked(oldXd, newYd)) {
                    newY = oldY
                }
            }
        }

        if (
            newX >= globals.MAP_MIN_X &&
            newX <= globals.MAP_MAX_X &&
            newY >= globals.MAP_MIN_Y &&
            newY <= globals.MAP_MAX_Y
        ) {
            escaper.moveHero(newX, newY, false)
        }

        const gravity = escaper.getLastTerrainType()?.getGravity() || Gravity.GetGravity()

        // Management of hero's height
        counters[n]++
        if (counters[n] == GRAVITY_EVERY_N_PERIOD) {
            counters[n] = 0

            const diffZ = z - lastZ // Height difference at the terrain level
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

                    // Stop turning if a click has been made just before
                    if (!globals.CAN_TURN_IN_AIR) {
                        SetUnitFacing(hero, GetUnitFacing(hero))
                    }
                } else if (!escaper.isAlive()) {
                    // The dead hero touches the ground, slide is deactivated
                    escaper.enableSlide(false)
                }
            }
            escaper.setLastZ(z)
            escaper.setOldDiffZ(diffZ)
        }

        // Accumulate total rotation angle
        let angleDiff = newAngle - oldAngle

        // If the angle jumps between -Pi and +Pi
        if (angleDiff > Math.PI) {
            angleDiff -= 2 * Math.PI
        } else if (angleDiff < -Math.PI) {
            angleDiff += 2 * Math.PI
        }

        // Detect change in rotation direction
        if (escaper.totalRotation != 0 && Math.sign(escaper.totalRotation) != Math.sign(angleDiff)) {
            escaper.totalRotation = 0 // Reset rotation count
            escaper.startTurningTime = currentTime // Reset the start time
        }

        escaper.totalRotation += angleDiff
        escaper.oldAngle = newAngle // Store the current angle to be used as the old angle in the next frame

        // Detect full circle
        if (Math.abs(escaper.totalRotation) >= (7 / 8) * 2 * Math.PI) {
            escaper.totalRotation = 0 // Reset rotation count after a full circle
            escaper.startTurningTime = currentTime // Reset the start time after a full circle
            Cpm.nbCirclesOnSlide[n]++ // Increment circle counter
        } else if (currentTime - escaper.startTurningTime > 2) {
            // If 2 seconds have passed without a full circle
            escaper.totalRotation = 0 // Reset rotation count
            escaper.startTurningTime = currentTime // Reset the start time
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
