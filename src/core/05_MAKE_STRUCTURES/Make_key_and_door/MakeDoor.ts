import { Text } from '../../01_libraries/Text'
import { KeyAndDoor } from '../../04_STRUCTURES/KeyAndDoor/KeyAndDoor'
import { DoorType } from '../../04_STRUCTURES/KeyAndDoor/KeyAndDoorTypes'
import { Make } from '../Make/Make'
import { MakeKeyAndDoorAction } from '../MakeLastActions/MakeKeyAndDoorAction'

/** -createDoor: each click places a door without a key, until -stop */
export class MakeDoor extends Make {
    private doorType: DoorType
    private doorAngle: number

    constructor(maker: unit, doorType: DoorType, doorAngle: number) {
        super(maker, 'doorCreate')
        this.doorType = doorType
        this.doorAngle = doorAngle
    }

    doActions = () => {
        if (super.doBaseActions()) {
            const level = this.escaper.getMakingLevel()
            const door = new KeyAndDoor(this.doorType, null, this.orderX, this.orderY, this.doorAngle, 0, 0)
            level.keyAndDoors.new(door, level.isActivated())
            level.updateDebugRegions()
            this.escaper.newAction(new MakeKeyAndDoorAction(level, door))
            Text.mkP(this.makerOwner, 'door created')
        }
    }
}
