import { ApplyAngleSymmetry, IsLastOrderPause, IsOnGround, StopUnit } from 'core/01_libraries/Basic_functions'
import { CAN_TURN_IN_AIR, NB_ESCAPERS } from 'core/01_libraries/Constants'
import { Escaper } from 'core/04_STRUCTURES/Escaper/Escaper'
import {
    Hero2Escaper,
    IsHero,
    isSecondaryHero,
    MainEscaperToSecondaryOne,
} from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { TerrainTypeSlide } from 'core/04_STRUCTURES/TerrainType/TerrainTypeSlide'
import { udg_symmetryAngle } from 'core/Double_heroes/double_heroes_config'

const initTurnOnSlide = () => {
    //turn variables
    let escaper: Escaper
    let escaperSecond: Escaper
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
    let udg_drunkEffect: effect[] = []
    let DRUNK_EFFECTS: string[] = []
    const DRUNK_EFFECT_PETIT = 'Abilities\\Weapons\\BloodElfMissile\\BloodElfMissile.mdl'
    const DRUNK_EFFECT_MOYEN = 'Abilities\\Weapons\\ChimaeraAcidMissile\\ChimaeraAcidMissile.mdl'
    const DRUNK_EFFECT_GROS = 'Abilities\\Weapons\\GreenDragonMissile\\GreenDragonMissile.mdl'

    //trigger
    let trg_turnToPoint: trigger
    let trg_turnToWidget: trigger

    const Trig_to_turn_to_point_Conditions = (): boolean => {
        escaper = Hero2Escaper(GetTriggerUnit())
        return IsHero(GetTriggerUnit()) && escaper.isSliding() && !IsLastOrderPause()
    }

    const HandleTurn = (triggerIsToLocation: boolean) => {
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

        if (isSecondaryHero(slider)) {
            return
        }

        escaperSecond = MainEscaperToSecondaryOne(escaper)

        //angle
        //if (udg_isMirrorModeOn_j[n]) then
        //    angle = Atan2( sliderY - orderY, sliderX - orderX) * bj_RADTODEG
        //else
        angle = Atan2(orderY - sliderY, orderX - sliderX) * bj_RADTODEG
        //endif

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
            if (escaper.getLastTerrainType().kind == 'slide') {
                canTurn = TerrainTypeSlide(integer(escaper.getLastTerrainType())).getCanTurn()
            }
        } else {
            canTurn = CAN_TURN_IN_AIR
        }

        angleSecond = ApplyAngleSymmetry(angle, udg_symmetryAngle)

        if (canTurn) {
            if (escaper.isAbsoluteInstantTurn()) {
                escaper.turnInstantly(angle)
                if (escaperSecond.isSliding()) {
                    escaperSecond.turnInstantly(angleSecond)
                }
            } else {
                SetUnitFacing(slider, angle)
                const h1 = escaperSecond.getHero()

                if (escaperSecond.isSliding() && h1) {
                    SetUnitFacing(h1, angleSecond)
                }
            }
            escaper.setSlideLastAngleOrder(angle)
            if (escaperSecond.isSliding()) {
                escaperSecond.setSlideLastAngleOrder(angleSecond)
            }
        }

        //save click
        lastClickedX[n] = orderX
        lastClickedY[n] = orderY
        isLastTargetALocation[n] = triggerIsToLocation

        nbClicsOnSlide[n] = nbClicsOnSlide[n] + 1
    }

    const Trig_to_turn_to_point_Actions = () => {
        HandleTurn(true)
    }

    const Trig_to_turn_to_widget_Conditions = (): boolean => {
        escaper = Hero2Escaper(GetTriggerUnit())
        return IsHero(GetTriggerUnit()) && escaper.isSliding()
    }

    const Trig_to_turn_to_widget_Actions = () => {
        HandleTurn(false)
    }

    //===========================================================================
    const Init_ToTurnOnSlide = () => {
        let i: number
        //turn to point
        trg_turnToPoint = CreateTrigger()
        TriggerRegisterAnyUnitEventBJ(trg_turnToPoint, EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER)
        TriggerAddCondition(trg_turnToPoint, Condition(Trig_to_turn_to_point_Conditions))
        TriggerAddAction(trg_turnToPoint, Trig_to_turn_to_point_Actions)
        //turn to widget
        trg_turnToWidget = CreateTrigger()
        TriggerRegisterAnyUnitEventBJ(trg_turnToWidget, EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER)
        TriggerAddCondition(trg_turnToWidget, Condition(Trig_to_turn_to_widget_Conditions))
        TriggerAddAction(trg_turnToWidget, Trig_to_turn_to_widget_Actions)
        //drunk mode
        i = 0
        while (true) {
            if (i >= NB_ESCAPERS) break
            udg_drunk[i] = INITIAL_DRUNK
            i = i + 1
        }
        DRUNK_EFFECTS[1] = DRUNK_EFFECT_PETIT
        DRUNK_EFFECTS[2] = DRUNK_EFFECT_MOYEN
        DRUNK_EFFECTS[3] = DRUNK_EFFECT_GROS
    }

    Init_ToTurnOnSlide()

    return { udg_isDrunk, udg_drunk, udg_drunkLevel, udg_drunkEffect, DRUNK_EFFECTS }
}

export const TurnOnSlide = initTurnOnSlide()
