import {Make} from "./Make";
import {getUdgEscapers} from "../../../../globals";
import {createEvent} from "../../../Utils/mapUtils";


const onPressActions = () => {
    const escaper = getUdgEscapers().get(GetPlayerId(GetTriggerPlayer()))
    const make = escaper.getMake()

    if(make instanceof MakeMaintainClick){
        make.doPressActions()
    }
}

const onUnpressActions = () => {
    const escaper = getUdgEscapers().get(GetPlayerId(GetTriggerPlayer()))
    const make = escaper.getMake()

    if(make instanceof MakeMaintainClick){
        make.doUnpressActions()
    }
}

const onMouseMoveActions = () => {
    const escaper = getUdgEscapers().get(GetPlayerId(GetTriggerPlayer()))
    const make = escaper.getMake()

    if(make instanceof MakeMaintainClick){
        make.doMouseMoveActions()
    }
}


export abstract class MakeMaintainClick extends Make{
    protected activeBtn: mousebuttontype | null = null
    private activeBtnStr = ""
    private isPressed = false

    private tPress: trigger | null = null
    private tUnpress: trigger | null = null
    private tMouseMove : trigger | null = null

    protected mouseX: number = 0
    protected mouseY: number = 0

    constructor(player: player, kind: string, forSpecificLevel: boolean) {
        super(getUdgEscapers().get(GetPlayerId(player)).getHero(), kind, forSpecificLevel, player)
        this.enableTriggersMouse()
    }

    enableTriggersMouse = () => {
        this.tPress && DestroyTrigger(this.tPress)
        this.tUnpress && DestroyTrigger(this.tUnpress)
        this.tMouseMove && DestroyTrigger(this.tMouseMove)

        this.tPress = createEvent({
            events: [t => TriggerRegisterPlayerEvent(t, this.makerOwner, EVENT_PLAYER_MOUSE_DOWN)],
            actions: [onPressActions]
        })

        this.tPress = createEvent({
            events: [t => TriggerRegisterPlayerEvent(t, this.makerOwner, EVENT_PLAYER_MOUSE_UP)],
            actions: [onUnpressActions]
        })

        this.tMouseMove = createEvent({
            events: [t => TriggerRegisterPlayerEvent(t, this.makerOwner, EVENT_PLAYER_MOUSE_MOVE)],
            actions: [onMouseMoveActions]
        })
    }

    doActions = () => {
        super.doBaseActions() //stop the hero if he's controlled, the actions aren't actually done here
    }

    doPressActions = () => {
        this.activeBtn = BlzGetTriggerPlayerMouseButton()
        this.activeBtnStr = this.activeBtn == MOUSE_BUTTON_TYPE_LEFT ? "left" : "right"
        this.isPressed = true

        this.doMouseMoveActions()
    }

    doUnpressActions = () => {
        this.isPressed = false
    }

    doMouseMoveActions() {
        if(this.isPressed) {
            this.mouseX = BlzGetTriggerPlayerMouseX()
            this.mouseY = BlzGetTriggerPlayerMouseY()

            return true
        }

        return false
    }

    //abstract doMouseMoveActions: () => boolean

    destroy() {
        super.destroy()

        this.tPress && DestroyTrigger(this.tPress)
        this.tUnpress && DestroyTrigger(this.tUnpress)
        this.tMouseMove && DestroyTrigger(this.tMouseMove)
    }
}