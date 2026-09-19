import { Text } from '../../01_libraries/Text'
import { KeyAndDoor } from '../../04_STRUCTURES/KeyAndDoor/KeyAndDoor'
import { DoorType, KeyForDoorType } from '../../04_STRUCTURES/KeyAndDoor/KeyAndDoorTypes'
import { Make } from '../Make/Make'
import { MakeKeyAndDoorAction, putBack, takeOff } from '../MakeLastActions/MakeKeyAndDoorAction'

/**
 * -createDoorAndKey: a first click places the door, a second its key; then the next pair. As with multiple patrols,
 * -cancel and -redo work on the door placed while its key isn't, then on the whole pairs made.
 */
export class MakeKeyAndDoor extends Make {
    private doorType: DoorType
    private keyType: KeyForDoorType
    private doorAngle: number
    /** The door placed by the first click, waiting for its key */
    private door: KeyAndDoor | null = null
    /** That door, taken off by -cancel, for -redo */
    private cancelledDoor: KeyAndDoor | null = null

    constructor(maker: unit, doorType: DoorType, keyType: KeyForDoorType, doorAngle: number) {
        super(maker, 'keyAndDoorCreate')
        this.doorType = doorType
        this.keyType = keyType
        this.doorAngle = doorAngle
    }

    private forgetCancelledDoor = () => {
        this.cancelledDoor && this.cancelledDoor.destroy()
        this.cancelledDoor = null
    }

    doActions = () => {
        if (super.doBaseActions()) {
            const level = this.escaper.getMakingLevel()

            if (!this.door) {
                this.forgetCancelledDoor()
                this.escaper.destroyCancelledActions()
                this.door = new KeyAndDoor(this.doorType, null, this.orderX, this.orderY, this.doorAngle, 0, 0)
                putBack(level, this.door)
                Text.mkP(this.makerOwner, 'door placed: click where its key goes')
                return
            }

            this.door.setKey(this.keyType, this.orderX, this.orderY)
            this.escaper.newAction(new MakeKeyAndDoorAction(level, this.door))
            this.door = null
            Text.mkP(this.makerOwner, 'key and door created: click where the next door goes')
        }
    }

    cancelLastAction = () => {
        if (!this.door || !this.door.level) {
            return false
        }
        takeOff(this.door.level, this.door)
        this.cancelledDoor = this.door
        this.door = null
        Text.mkP(this.makerOwner, 'door placing cancelled')
        return true
    }

    redoLastAction = () => {
        if (!this.cancelledDoor || !this.cancelledDoor.level) {
            return false
        }
        putBack(this.cancelledDoor.level, this.cancelledDoor)
        this.door = this.cancelledDoor
        this.cancelledDoor = null
        Text.mkP(this.makerOwner, 'door placing redone: click where its key goes')
        return true
    }

    /** Stopped between the two clicks: the door without its key goes */
    destroy() {
        super.destroy()
        this.forgetCancelledDoor()
        if (this.door) {
            const level = this.door.level
            this.door.destroy()
            this.door = null
            level?.updateDebugRegions()
        }
    }
}
