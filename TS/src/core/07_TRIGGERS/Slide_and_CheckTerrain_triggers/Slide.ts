import {CAN_TURN_IN_AIR, HERO_ROTATION_TIME_FOR_MAXIMUM_SPEED, SLIDE_PERIOD} from 'core/01_libraries/Constants'
import { Apm } from 'core/08_GAME/Apm_clics_par_minute/Apm'
import { createTimer } from 'Utils/mapUtils'
import { getUdgEscapers, globals } from '../../../../globals'
import { Gravity } from './Gravity'
import {Escaper} from "../../04_STRUCTURES/Escaper/Escaper";
import {GetMirrorEscaper} from "../../04_STRUCTURES/Escaper/Escaper_functions";

const escaperTurnForOnePeriod = (escaper: Escaper | null) => {
    if(!escaper) return;

    const hero = escaper.getHero()
    if(!hero) return

    const remainingDegrees = escaper.getRemainingDegreesToTurn()
    if(remainingDegrees != 0){
        const currentAngle = GetUnitFacing(hero)

        let diffToApplyAbs = RMinBJ(RAbsBJ(remainingDegrees), RAbsBJ(escaper.getSlideTurnPerPeriod()))

        if(diffToApplyAbs != 0) {
            //sens
            const sens = (remainingDegrees * escaper.getSlideTurnPerPeriod()) > 1 ? 1 : -1

            const curSlideTurn = escaper.getSlideCurrentTurnPerPeriod()

            const increaseRotationSpeedPerPeriod = RAbsBJ(escaper.getSlideTurnPerPeriod() * SLIDE_PERIOD / HERO_ROTATION_TIME_FOR_MAXIMUM_SPEED)

            let newSlideTurn: number
            let diffToApply
            if(sens > 0){
                newSlideTurn = RMinBJ(curSlideTurn + increaseRotationSpeedPerPeriod, escaper.getSlideTurnPerPeriod())
                diffToApply = RMinBJ(newSlideTurn, diffToApplyAbs)
            }else{
                newSlideTurn = RMaxBJ(curSlideTurn - increaseRotationSpeedPerPeriod, -escaper.getSlideTurnPerPeriod())
                diffToApply = RMaxBJ(newSlideTurn, -diffToApplyAbs)
            }
            escaper.setSlideCurrentTurnPerPeriod(newSlideTurn)

            //diffToApply
            escaper.setRemainingDegreesToTurn(remainingDegrees - diffToApply)

            //turn
            const newAngle = currentAngle + diffToApply
            BlzSetUnitFacingEx(hero, newAngle)
        }
    }else{
        escaper.setSlideCurrentTurnPerPeriod(0) //reset acceleration
    }
}

const initSlideTrigger = () => {
    const Slide_Actions = (n: number) => {
        const escaper = getUdgEscapers().get(n)

        if (!escaper) {
            return
        }

        const hero = escaper.getHero()
        const lastZ = escaper.getLastZ()
        const speedZ = escaper.getSpeedZ()
        const oldDiffZ = escaper.getOldDiffZ()

        if (!hero) return

        let allowTurning = escaper.getRotationSpeed() != 0

        //gestion de la hauteur du héros
        const z = BlzGetUnitZ(hero)
        const diffZ = z - lastZ //différence de hauteur au niveau du terrain
        let height = GetUnitFlyHeight(hero)
        let delta: number

        if (height > 1) {
            escaper.setSpeedZ(speedZ + Gravity.GetGravity())
            height = height + speedZ - diffZ
            if (height < 0) {
                height = 0
            }
            SetUnitFlyHeight(hero, height, 0)

            //coop
            escaper.refreshCerclePosition()

            allowTurning = allowTurning && CAN_TURN_IN_AIR
        } else {
            delta = diffZ - oldDiffZ
            if (delta < Gravity.GetGravity()) {
                escaper.setSpeedZ(oldDiffZ + Gravity.GetGravity())
                SetUnitFlyHeight(hero, -diffZ + speedZ, 0)

                //arrêter de tourner si un clic a été fait juste avant
                if (!CAN_TURN_IN_AIR) {
                    SetUnitFacing(hero, GetUnitFacing(hero))
                }
            } else if (!escaper.isAlive()) {
                //le héros mort touche le sol, on désactive le slide
                escaper.enableSlide(false)
            }
        }
        escaper.setLastZ(z)
        escaper.setOldDiffZ(diffZ)

        //turning
        if(allowTurning){
            escaperTurnForOnePeriod(escaper)
            escaperTurnForOnePeriod(GetMirrorEscaper(escaper))
        }

        //offset of the hero position
        const angle = Deg2Rad(GetUnitFacing(hero))

        const newX = GetUnitX(hero) + escaper.getSlideMovePerPeriod() * Cos(angle)
        const newY = GetUnitY(hero) + escaper.getSlideMovePerPeriod() * Sin(angle)

        if (
            newX >= globals.MAP_MIN_X &&
            newX <= globals.MAP_MAX_X &&
            newY >= globals.MAP_MIN_Y &&
            newY <= globals.MAP_MAX_Y
        ) {
            escaper.moveHero(newX, newY)
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
