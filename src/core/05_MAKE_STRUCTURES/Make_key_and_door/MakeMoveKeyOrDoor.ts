import { Text } from '../../01_libraries/Text'
import { KeyAndDoor } from '../../04_STRUCTURES/KeyAndDoor/KeyAndDoor'
import { Make } from '../Make/Make'

/**
 * -moveDoor / -moveKey: a first click picks a door (or a key: clicked itself, or near it), a second one moves it
 * there; then the next one
 */
export class MakeMoveKeyOrDoor extends Make {
    private part: 'door' | 'key'
    private target: KeyAndDoor | null = null
    /** The angle the doors moved get (-1 random), else they keep theirs */
    private doorAngle?: number

    constructor(maker: unit, part: 'door' | 'key', doorAngle?: number) {
        super(maker, part === 'door' ? 'doorMove' : 'keyMove')
        this.part = part
        this.doorAngle = doorAngle
    }

    doActions = () => {
        if (super.doBaseActions()) {
            if (!this.target) {
                const keyAndDoors = this.escaper.getMakingLevel().keyAndDoors
                // a key clicked itself, else the door or key nearest to the click
                const keyItem = this.part === 'key' ? GetOrderTargetItem() : undefined
                this.target =
                    (keyItem && keyAndDoors.getByKeyItem(keyItem)) ||
                    keyAndDoors.getNearPart(this.part, this.orderX, this.orderY)
                if (!this.target) {
                    Text.erP(this.makerOwner, `no ${this.part} clicked for your making level`)
                    return
                }
                Text.mkP(this.makerOwner, `click where the ${this.part} goes`)
                return
            }

            this.part === 'door'
                ? this.target.moveDoor(this.orderX, this.orderY, this.doorAngle)
                : this.target.moveKey(this.orderX, this.orderY)
            this.target = null
            Text.mkP(this.makerOwner, `${this.part} moved: click the next ${this.part}`)
        }
    }
}
