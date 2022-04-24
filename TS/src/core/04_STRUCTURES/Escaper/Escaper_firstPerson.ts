import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { Timer } from 'w3ts'
import { getUdgEscapers } from '../../../../globals'
import { createEvent, createTimer, forRange } from '../../../Utils/mapUtils'
import { Escaper } from './Escaper'

type IKeys = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

export class EscaperFirstPerson {
    private forceCamTimer: Timer | null = null

    private escaper: Escaper

    private keyDownState: { [K in IKeys]: boolean } = {
        UP: false,
        DOWN: false,
        LEFT: false,
        RIGHT: false,
    }

    constructor(escaper: Escaper) {
        this.escaper = escaper
    }

    isFirstPerson = () => !!this.forceCamTimer

    toggleFirstPerson = (active: boolean) => {
        if (active) {
            if (!this.forceCamTimer) {
                this.forceCamTimer = createTimer(0.01, true, () => {
                    const player = this.escaper.getPlayer()
                    const hero = this.escaper.getHero()

                    if (hero) {
                        SetCameraTargetControllerNoZForPlayer(player, hero, 0, 0, true)
                        SetCameraFieldForPlayer(player, CAMERA_FIELD_ANGLE_OF_ATTACK, 310, 0)
                        SetCameraFieldForPlayer(player, CAMERA_FIELD_FIELD_OF_VIEW, 1500, 0)
                        SetCameraFieldForPlayer(player, CAMERA_FIELD_ROTATION, GetUnitFacing(hero), 0) // Using the duration argument can bug out the camera and gets it stuck to keep turning..
                        SetCameraFieldForPlayer(player, CAMERA_FIELD_ZOFFSET, BlzGetUnitZ(hero) + 100, 0)
                    }
                })
            }
        } else {
            this.forceCamTimer?.destroy()
            this.forceCamTimer = null
            this.escaper.resetCamera()
        }
    }

    setKeyDownState = (key: IKeys, state: boolean) => {
        this.keyDownState[key] = state
    }

    isKeyDownState = (key: IKeys) => this.keyDownState[key]
}

export const initFirstPerson = () => {
    const keyStates = [
        { keyDown: true, blzKeyDown: bj_KEYEVENTTYPE_DEPRESS },
        { keyDown: false, blzKeyDown: bj_KEYEVENTTYPE_RELEASE },
    ]

    const keys = [
        { key: 'UP' as 'UP', blzKey: bj_KEYEVENTKEY_UP },
        { key: 'DOWN' as 'DOWN', blzKey: bj_KEYEVENTKEY_DOWN },
        { key: 'LEFT' as 'LEFT', blzKey: bj_KEYEVENTKEY_LEFT },
        { key: 'RIGHT' as 'RIGHT', blzKey: bj_KEYEVENTKEY_RIGHT },
    ]

    keyStates.forEach(({ keyDown, blzKeyDown }) => {
        keys.forEach(({ key, blzKey }) => {
            createEvent({
                events: [
                    t => forRange(NB_ESCAPERS, i => TriggerRegisterPlayerKeyEventBJ(t, Player(i), blzKeyDown, blzKey)),
                ],
                actions: [
                    () => {
                        getUdgEscapers()
                            .get(GetPlayerId(GetTriggerPlayer()))
                            ?.getFirstPersonHandle()
                            .setKeyDownState(key, keyDown)
                    },
                ],
            })
        })
    })
}
