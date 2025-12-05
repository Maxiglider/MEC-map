import { Constants } from 'core/01_libraries/Constants'
import { createEvent, forRange } from 'Utils/mapUtils'

type IDrag = (playerId: number, x: number, y: number) => void

export const useDrag = (props: { onDrag: IDrag }) => {
    forRange(Constants.NB_PLAYERS_MAX_REFORGED, i => {
        new FollowMouse(i, props.onDrag)
    })
}

class FollowMouse {
    private tPress: trigger
    private tUnpress: trigger
    private tMouseMove?: trigger

    private playerId: number
    private onDrag: IDrag

    constructor(playerId: number, onDrag: IDrag) {
        this.playerId = playerId
        this.onDrag = onDrag

        this.tPress = createEvent({
            events: [t => TriggerRegisterPlayerEvent(t, Player(this.playerId), EVENT_PLAYER_MOUSE_DOWN)],
            actions: [
                () => {
                    if (BlzGetTriggerPlayerMouseButton() === MOUSE_BUTTON_TYPE_LEFT) {
                        this.startFollowingMouse()
                    }
                },
            ],
        })

        this.tUnpress = createEvent({
            events: [t => TriggerRegisterPlayerEvent(t, Player(this.playerId), EVENT_PLAYER_MOUSE_UP)],
            actions: [
                () => {
                    if (BlzGetTriggerPlayerMouseButton() === MOUSE_BUTTON_TYPE_LEFT) {
                        this.stopFollowingMouse()
                    }
                },
            ],
        })
    }

    startFollowingMouse = () => {
        this.tMouseMove && DestroyTrigger(this.tMouseMove)

        this.tMouseMove = createEvent({
            events: [t => TriggerRegisterPlayerEvent(t, Player(this.playerId), EVENT_PLAYER_MOUSE_MOVE)],
            actions: [
                () => {
                    if (BlzGetTriggerPlayerMouseX() === 0 && BlzGetTriggerPlayerMouseY() === 0) {
                        return
                    }

                    this.onDrag(this.playerId, BlzGetTriggerPlayerMouseX(), BlzGetTriggerPlayerMouseY())
                },
            ],
        })
    }

    stopFollowingMouse = () => {
        this.tMouseMove && DestroyTrigger(this.tMouseMove)
    }

    destroy = () => {
        this.stopFollowingMouse()
        this.tPress && DestroyTrigger(this.tPress)
        this.tUnpress && DestroyTrigger(this.tUnpress)
    }
}
