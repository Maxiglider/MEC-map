import { AutoContinueAfterSliding } from 'core/07_TRIGGERS/Slide_and_CheckTerrain_triggers/Auto_continue_after_sliding'
import { getUdgEscapers } from '../../../globals'
import { createEvent } from '../../Utils/mapUtils'
import { Escaper } from '../04_STRUCTURES/Escaper/Escaper'
import { TurnOnSlide } from '../07_TRIGGERS/Slide_and_CheckTerrain_triggers/To_turn_on_slide'

const FOLLOW_MOUSE_PERIOD = 0.1

/**
 * Class SimpleFollowMouse - Active while holding right mouse button
 */
export class SimpleFollowMouse {
    private escaper: Escaper

    private tPress: trigger
    private tUnpress: trigger
    private tMouseMove: trigger | undefined

    private tFollowMouse: timer

    public angle?: number
    public isActive = false

    constructor(escaper: Escaper) {
        this.escaper = escaper

        const player = escaper.getPlayer()

        this.tPress = createEvent({
            events: [t => TriggerRegisterPlayerEvent(t, player, EVENT_PLAYER_MOUSE_DOWN)],
            actions: [
                () => {
                    const escaper = getUdgEscapers().get(GetPlayerId(GetTriggerPlayer()))
                    const followMouse = escaper?.getSimpleFollowMouse()

                    if (followMouse) {
                        const activeBtn = BlzGetTriggerPlayerMouseButton()

                        if (activeBtn == MOUSE_BUTTON_TYPE_RIGHT) {
                            this.isActive = true
                        }
                    }
                },
            ],
        })

        this.tUnpress = createEvent({
            events: [t => TriggerRegisterPlayerEvent(t, player, EVENT_PLAYER_MOUSE_UP)],
            actions: [
                () => {
                    const escaper = getUdgEscapers().get(GetPlayerId(GetTriggerPlayer()))
                    const followMouse = escaper?.getSimpleFollowMouse()

                    if (followMouse) {
                        const activeBtn = BlzGetTriggerPlayerMouseButton()

                        if (activeBtn == MOUSE_BUTTON_TYPE_RIGHT) {
                            this.isActive = false
                        }
                    }
                },
            ],
        })

        this.tMouseMove = createEvent({
            events: [t => TriggerRegisterPlayerEvent(t, player, EVENT_PLAYER_MOUSE_MOVE)],
            actions: [
                () => {
                    const escaper = getUdgEscapers().get(GetPlayerId(GetTriggerPlayer()))
                    const followMouse = escaper?.getSimpleFollowMouse()

                    if (followMouse) {
                        if (BlzGetTriggerPlayerMouseX() == 0 && BlzGetTriggerPlayerMouseY() == 0) {
                            return
                        }

                        this.escaper.mouseX = BlzGetTriggerPlayerMouseX()
                        this.escaper.mouseY = BlzGetTriggerPlayerMouseY()

                        const slider = this.escaper.getHero()

                        if (slider) {
                            const sliderX = GetUnitX(slider)
                            const sliderY = GetUnitY(slider)
                            const orderX = this.escaper.mouseX
                            const orderY = this.escaper.mouseY
                            this.angle = Atan2(orderY - sliderY, orderX - sliderX) * bj_RADTODEG

                            if (this.isActive) {
                                AutoContinueAfterSliding.lastClickedX[this.escaper.getId()] = orderX
                                AutoContinueAfterSliding.lastClickedY[this.escaper.getId()] = orderY
                                AutoContinueAfterSliding.isLastTargetALocation[this.escaper.getId()] = true
                            }
                        }
                    }
                },
            ],
        })

        // Create the timer and start it immediately
        this.tFollowMouse = CreateTimer()
        TimerStart(this.tFollowMouse, FOLLOW_MOUSE_PERIOD, true, () => {
            const slider = escaper?.getHero()

            if (escaper && slider) {
                const followMouse = escaper.getSimpleFollowMouse()

                if (followMouse && followMouse.isActive) {
                    if (escaper.isSliding()) {
                        //let's face mouse
                        followMouse.angle && TurnOnSlide.turnSliderToDirection(escaper, followMouse.angle)
                    }
                }
            }
        })
    }

    destroy = () => {
        this.isActive = false
        DestroyTimer(this.tFollowMouse)
        this.tPress && DestroyTrigger(this.tPress)
        this.tUnpress && DestroyTrigger(this.tUnpress)
        this.tMouseMove && DestroyTrigger(this.tMouseMove)
    }
}
