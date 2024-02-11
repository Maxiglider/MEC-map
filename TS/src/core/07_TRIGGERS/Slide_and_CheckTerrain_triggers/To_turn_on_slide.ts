import { createEvent, forRange } from 'Utils/mapUtils'
import {
    AnglesDiff,
    ApplyAngleSymmetry,
    IsLastOrderPause,
    IsOnGround,
    StopUnit,
} from 'core/01_libraries/Basic_functions'
import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { Escaper } from 'core/04_STRUCTURES/Escaper/Escaper'
import {
    Hero2Escaper,
    IsHero,
    MainEscaperToSecondaryOne,
    isSecondaryHero,
} from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { TerrainTypeSlide } from 'core/04_STRUCTURES/TerrainType/TerrainTypeSlide'
import { Apm } from 'core/08_GAME/Apm_clics_par_minute/Apm'
import { udg_symmetryAngle } from 'core/Double_heroes/double_heroes_config'
import { globals } from '../../../../globals'
import { AutoContinueAfterSliding } from './Auto_continue_after_sliding'

const initTurnOnSlide = () => {
    //turn variables
    let escaperSecond: Escaper | null
    let slider: unit
    let n: number
    let sliderX: number
    let sliderY: number
    let orderWidget: widget
    let orderX: number
    let orderY: number
    let angle: number
    let angleSecond: number
    let canTurn: boolean

    //drunk variables
    let udg_isDrunk: boolean[] = []
    let udg_drunk: number[] = []
    let udg_drunkLevel: number[] = []
    const INITIAL_DRUNK = 10
    let udg_drunkEffect: (effect | undefined)[] = []
    let DRUNK_EFFECTS: string[] = []
    const DRUNK_EFFECT_PETIT = 'Abilities\\Weapons\\BloodElfMissile\\BloodElfMissile.mdl'
    const DRUNK_EFFECT_MOYEN = 'Abilities\\Weapons\\ChimaeraAcidMissile\\ChimaeraAcidMissile.mdl'
    const DRUNK_EFFECT_GROS = 'Abilities\\Weapons\\GreenDragonMissile\\GreenDragonMissile.mdl'

    //trigger
    let trg_turnToPoint: trigger
    let trg_turnToWidget: trigger

    const turnSliderToDirection = (escaper: Escaper, angle: number, triggerIsToLocation: boolean | null = null) => {
        const slider = escaper.getHero()
        if (!slider) return

        if (isSecondaryHero(slider)) {
            return
        }

        escaperSecond = MainEscaperToSecondaryOne(escaper)

        const n = escaper.getId()

        //drunk mode
        if (udg_isDrunk[n]) {
            if (GetRandomInt(1, 2) === 1) {
                angle = angle + udg_drunk[n]
            } else {
                angle = angle - udg_drunk[n]
            }
        }

        //turn hero
        if (IsOnGround(slider)) {
            const terrainType = escaper.getLastTerrainType()
            if (terrainType instanceof TerrainTypeSlide) {
                canTurn = terrainType.getCanTurn()
            }
        } else {
            canTurn = globals.CAN_TURN_IN_AIR
        }

        if (escaper.isStaticSliding()) {
            canTurn = false
        }

        angleSecond = ApplyAngleSymmetry(angle, udg_symmetryAngle)

        if (canTurn) {
            if (escaper.isAbsoluteInstantTurn()) {
                //turn instantly
                escaper.turnInstantly(angle)
                if (escaperSecond?.isSliding()) {
                    escaperSecond.turnInstantly(angleSecond)
                }
            } else {
                //turn normally
                if (escaper.slidingMode == 'max') {
                    const currentAngle = GetUnitFacing(slider)
                    escaper.setRemainingDegreesToTurn(AnglesDiff(angle, currentAngle))
                } else {
                    SetUnitFacing(slider, angle)
                }

                const h1 = escaperSecond?.getHero()
                if (escaperSecond?.isSliding() && h1) {
                    escaperSecond.setRemainingDegreesToTurn(AnglesDiff(angleSecond, GetUnitFacing(h1)))
                }
            }
            escaper.setSlideLastAngleOrder(angle)
            if (escaperSecond?.isSliding()) {
                escaperSecond.setSlideLastAngleOrder(angleSecond)
            }
        }

        //save click
        if (triggerIsToLocation !== null) {
            AutoContinueAfterSliding.lastClickedX[n] = orderX
            AutoContinueAfterSliding.lastClickedY[n] = orderY
            AutoContinueAfterSliding.isLastTargetALocation[n] = triggerIsToLocation

            Apm.nbClicsOnSlide[n] = Apm.nbClicsOnSlide[n] + 1
        }
    }

    const HandleTurn = (triggerIsToLocation: boolean) => {
        const escaper = Hero2Escaper(GetTriggerUnit())

        if (!escaper) {
            return
        }

        //init variables
        slider = GetTriggerUnit()
        n = GetUnitUserData(slider)
        sliderX = GetUnitX(slider)
        sliderY = GetUnitY(slider)

        if (triggerIsToLocation) {
            orderX = GetOrderPointX()
            orderY = GetOrderPointY()
        } else {
            orderWidget = GetOrderTarget()
            orderX = GetWidgetX(orderWidget)
            orderY = GetWidgetY(orderWidget)
        }

        //stop hero
        StopUnit(slider)

        if (escaper.getFirstPersonHandle().isFirstPerson()) {
            return
        }

        //angle
        //if (udg_isMirrorModeOn_j[n]) then
        //    angle = Atan2( sliderY - orderY, sliderX - orderX) * bj_RADTODEG
        //else
        angle = Atan2(orderY - sliderY, orderX - sliderX) * bj_RADTODEG
        //endif

        turnSliderToDirection(escaper, angle, triggerIsToLocation)
    }

    const init_ToTurnOnSlide = () => {
        //turn to point
        trg_turnToPoint = createEvent({
            events: [t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER)],
            conditions: [
                () => {
                    const escaper = Hero2Escaper(GetTriggerUnit())
                    return IsHero(GetTriggerUnit()) && !!escaper?.isSliding() && !IsLastOrderPause()
                },
            ],
            actions: [() => HandleTurn(true)],
        })

        //turn to widget
        trg_turnToWidget = createEvent({
            events: [t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER)],
            conditions: [
                () => {
                    const escaper = Hero2Escaper(GetTriggerUnit())
                    return IsHero(GetTriggerUnit()) && !!escaper?.isSliding()
                },
            ],
            actions: [() => HandleTurn(false)],
        })

        //drunk mode
        forRange(NB_ESCAPERS, i => (udg_drunk[i] = INITIAL_DRUNK))

        DRUNK_EFFECTS[1] = DRUNK_EFFECT_PETIT
        DRUNK_EFFECTS[2] = DRUNK_EFFECT_MOYEN
        DRUNK_EFFECTS[3] = DRUNK_EFFECT_GROS
    }

    return {
        udg_isDrunk,
        udg_drunk,
        udg_drunkLevel,
        udg_drunkEffect,
        DRUNK_EFFECTS,
        init_ToTurnOnSlide,
        turnSliderToDirection,
    }
}

export const TurnOnSlide = initTurnOnSlide()

export const init_ToTurnOnSlide = TurnOnSlide.init_ToTurnOnSlide
