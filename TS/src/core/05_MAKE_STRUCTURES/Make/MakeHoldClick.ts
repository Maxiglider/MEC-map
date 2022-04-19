import {Make} from "./Make";
import {getUdgEscapers} from "../../../../globals";
import {createEvent} from "../../../Utils/mapUtils";


export const MIN_TIME_BETWEEN_ACTIONS = 0.05


const onPressActions = () => {
    const escaper = getUdgEscapers().get(GetPlayerId(GetTriggerPlayer()))
    const make = escaper.getMake()

    if(make instanceof MakeHoldClick){
        make.doPressActions()
    }
}

const onUnpressActions = () => {
    const escaper = getUdgEscapers().get(GetPlayerId(GetTriggerPlayer()))
    const make = escaper.getMake()

    if(make instanceof MakeHoldClick){
        make.doUnpressActions()
    }
}

const onMouseMoveActions = () => {
    const escaper = getUdgEscapers().get(GetPlayerId(GetTriggerPlayer()))
    const make = escaper.getMake()

    if(make instanceof MakeHoldClick){
        make.doMouseMoveActions()
    }
}

/**
 * Class MakeHoldClick
 */
export abstract class MakeHoldClick extends Make{
    protected activeBtn: mousebuttontype | null = null
    private activeBtnStr = ""
    private isPressed = false

    private tPress: trigger | null = null
    private tUnpress: trigger | null = null
    private tMouseMove : trigger | null = null

    private tTimeSinceLastMouseMove?: timer
    private timeSinceLastMouseMove: number = 1000 //high time

    protected mouseX: number = 0
    protected mouseY: number = 0

    protected currentClickMinX = 0
    protected currentClickMinY = 0
    protected currentClickMaxX = 0
    protected currentClickMaxY = 0

    constructor(player: player, kind: string, forSpecificLevel: boolean) {
        super(getUdgEscapers().get(GetPlayerId(player)).getHero(), kind, forSpecificLevel, player)
        this.enableTriggersMouse()
    }

    updateCurrentClickMinMaxLocations = () => {
        if(this.currentClickMinX == 0 || this.mouseX < this.currentClickMinX){
            this.currentClickMinX = this.mouseX
        }
        if(this.currentClickMinY == 0 || this.mouseY < this.currentClickMinY){
            this.currentClickMinY = this.mouseY
        }
        if(this.currentClickMaxX == 0 || this.mouseX > this.currentClickMaxX){
            this.currentClickMaxX = this.mouseX
        }
        if(this.currentClickMaxY == 0 || this.mouseY > this.currentClickMaxY){
            this.currentClickMaxY = this.mouseY
        }
    }

    resetCurrentClickMinMaxLocations = () => {
        this.currentClickMinX = 0
        this.currentClickMinY = 0
        this.currentClickMaxX = 0
        this.currentClickMaxY = 0
    }

    enableTriggersMouse = () => {
        this.tPress && DestroyTrigger(this.tPress)
        this.tUnpress && DestroyTrigger(this.tUnpress)
        this.tMouseMove && DestroyTrigger(this.tMouseMove)

        this.tPress = createEvent({
            events: [t => TriggerRegisterPlayerEvent(t, this.makerOwner, EVENT_PLAYER_MOUSE_DOWN)],
            actions: [onPressActions]
        })

        this.tUnpress = createEvent({
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

    doPressActions() {
        this.activeBtn = BlzGetTriggerPlayerMouseButton()
        this.activeBtnStr = this.activeBtn == MOUSE_BUTTON_TYPE_LEFT ? "left" : "right"
        this.isPressed = true

        this.resetCurrentClickMinMaxLocations()

        this.doMouseMoveActions()
    }

    doUnpressActions() {
        this.isPressed = false
    }

    doMouseMoveActions() {
        if(this.isPressed) {
            this.mouseX = BlzGetTriggerPlayerMouseX()
            this.mouseY = BlzGetTriggerPlayerMouseY()
            this.updateCurrentClickMinMaxLocations()

            if(this.tTimeSinceLastMouseMove){
                this.timeSinceLastMouseMove = TimerGetElapsed(this.tTimeSinceLastMouseMove)
            }
            this.tTimeSinceLastMouseMove && DestroyTimer(this.tTimeSinceLastMouseMove)
            this.tTimeSinceLastMouseMove = CreateTimer()
            TimerStart(this.tTimeSinceLastMouseMove, 10, false, DoNothing)

            return this.timeSinceLastMouseMove >= MIN_TIME_BETWEEN_ACTIONS
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