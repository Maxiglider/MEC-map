import { Text } from '../../01_libraries/Text'
import { KeyAndDoor } from '../../04_STRUCTURES/KeyAndDoor/KeyAndDoor'
import { DoorType, KeyForDoorType } from '../../04_STRUCTURES/KeyAndDoor/KeyAndDoorTypes'
import { Make } from '../Make/Make'

/** -createDoorAndKey: a first click places the door, a second its key; then the next pair */
export class MakeKeyAndDoor extends Make {
    private doorType: DoorType
    private keyType: KeyForDoorType
    private doorAngle: number
    /** The door placed by the first click, waiting for its key */
    private door: KeyAndDoor | null = null

    constructor(maker: unit, doorType: DoorType, keyType: KeyForDoorType, doorAngle: number) {
        super(maker, 'keyAndDoorCreate')
        this.doorType = doorType
        this.keyType = keyType
        this.doorAngle = doorAngle
    }

    doActions = () => {
        if (super.doBaseActions()) {
            const level = this.escaper.getMakingLevel()

            if (!this.door) {
                this.door = new KeyAndDoor(this.doorType, null, this.orderX, this.orderY, this.doorAngle, 0, 0)
                level.keyAndDoors.new(this.door, level.isActivated())
                level.updateDebugRegions()
                Text.mkP(this.makerOwner, 'door placed: click where its key goes')
                return
            }

            this.door.setKey(this.keyType, this.orderX, this.orderY)
            this.door = null
            Text.mkP(this.makerOwner, 'key and door created: click where the next door goes')
        }
    }

    /** Stopped between the two clicks: the door without its key goes */
    destroy() {
        super.destroy()
        if (this.door) {
            const level = this.door.level
            this.door.destroy()
            this.door = null
            level?.updateDebugRegions()
        }
    }
}
