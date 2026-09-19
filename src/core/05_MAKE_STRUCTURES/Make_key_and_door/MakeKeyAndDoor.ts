import { Text } from '../../01_libraries/Text'
import { KeyAndDoor } from '../../04_STRUCTURES/KeyAndDoor/KeyAndDoor'
import { DoorType, KeyForDoorType } from '../../04_STRUCTURES/KeyAndDoor/KeyAndDoorTypes'
import { MakeOneByOneOrTwoClicks } from '../Make/MakeOneByOneOrTwoClicks'

/** -createKeyAndDoor: a first click places the door, a second its key; then the next pair */
export class MakeKeyAndDoor extends MakeOneByOneOrTwoClicks {
    private doorType: DoorType
    private keyType: KeyForDoorType
    private doorAngle: number

    constructor(maker: unit, doorType: DoorType, keyType: KeyForDoorType, doorAngle: number) {
        super(maker, 'keyAndDoorCreate', 'twoClics', ['twoClics'])
        this.doorType = doorType
        this.keyType = keyType
        this.doorAngle = doorAngle
    }

    doActions = () => {
        if (super.doBaseActions()) {
            if (!this.isLastLocSavedUsed()) {
                this.saveLoc(this.orderX, this.orderY)
                Text.mkP(this.makerOwner, 'door placed: click where its key goes')
                return
            }

            const level = this.escaper.getMakingLevel()
            const keyAndDoor = new KeyAndDoor(
                this.doorType,
                this.keyType,
                this.lastX,
                this.lastY,
                this.doorAngle,
                this.orderX,
                this.orderY
            )
            level.keyAndDoors.new(keyAndDoor, level.isActivated())
            Text.mkP(this.makerOwner, 'key and door created: click where the next door goes')
            this.unsaveLocDefinitely()
        }
    }
}
