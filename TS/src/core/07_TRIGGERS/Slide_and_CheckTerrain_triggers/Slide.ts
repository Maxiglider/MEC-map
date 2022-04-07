import { CAN_TURN_IN_AIR, Constants, SLIDE_PERIOD } from 'core/01_libraries/Constants'
import { Apm } from 'core/08_GAME/Apm_clics_par_minute/Apm'
 import {getUdgEscapers} from '../../../../globals'

import {createTimer} from 'Utils/mapUtils'
import { Gravity } from './Gravity'

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

        if(!hero) return

        const angle = Deg2Rad(GetUnitFacing(hero))
        const newX = GetUnitX(hero) + escaper.getSlideMovePerPeriod() * Cos(angle)
        const newY = GetUnitY(hero) + escaper.getSlideMovePerPeriod() * Sin(angle)

        const z = BlzGetUnitZ(hero)
        const diffZ = z - lastZ //différence de hauteur au niveau du terrain
        let height = GetUnitFlyHeight(hero)
        let delta: number

        if (
            newX >= Constants.MAP_MIN_X &&
            newX <= Constants.MAP_MAX_X &&
            newY >= Constants.MAP_MIN_Y &&
            newY <= Constants.MAP_MAX_Y
        ) {
            escaper.moveHero(newX, newY)
        }

        Apm.timeOnSlide[n] = Apm.timeOnSlide[n] + SLIDE_PERIOD

        //gestion de la hauteur du héros
        if (height > 1) {
            escaper.setSpeedZ(speedZ + Gravity.GetGravity())
            height = height + speedZ - diffZ
            if (height < 0) {
                height = 0
            }
            SetUnitFlyHeight(hero, height, 0)
            //coop
            escaper.refreshCerclePosition()
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
    }

    const CreateSlideTimer = (escaperId: number) => {
        return createTimer(SLIDE_PERIOD, true, () => Slide_Actions(escaperId))
    }

    return { CreateSlideTimer }
}

export const SlideTrigger = initSlideTrigger()
