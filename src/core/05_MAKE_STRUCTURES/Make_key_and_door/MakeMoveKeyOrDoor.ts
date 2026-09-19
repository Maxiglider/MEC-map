import { Text } from '../../01_libraries/Text'
import { KeyAndDoor } from '../../04_STRUCTURES/KeyAndDoor/KeyAndDoor'
import { Make } from '../Make/Make'

/**
 * -moveDoor / -moveKey: a first click picks a door (near it) or a key (itself: a key can always be clicked, since
 * heroes pick it up), a second one moves it there; then the next one
 */
export class MakeMoveKeyOrDoor extends Make {
    private part: 'door' | 'key'
    private target: KeyAndDoor | null = null

    constructor(maker: unit, part: 'door' | 'key') {
        super(maker, part === 'door' ? 'doorMove' : 'keyMove')
        this.part = part
    }

    doActions = () => {
        if (super.doBaseActions()) {
            if (!this.target) {
                const keyAndDoors = this.escaper.getMakingLevel().keyAndDoors
                if (this.part === 'key') {
                    const keyItem = GetOrderTargetItem()
                    this.target = keyItem ? keyAndDoors.getByKeyItem(keyItem) : null
                } else {
                    this.target = keyAndDoors.getNearDoor(this.orderX, this.orderY)
                }
                if (!this.target) {
                    Text.erP(this.makerOwner, `no ${this.part} clicked for your making level`)
                    return
                }
                Text.mkP(this.makerOwner, `click where the ${this.part} goes`)
                return
            }

            this.part === 'door'
                ? this.target.moveDoor(this.orderX, this.orderY)
                : this.target.moveKey(this.orderX, this.orderY)
            this.target = null
            Text.mkP(this.makerOwner, `${this.part} moved: click the next ${this.part}`)
        }
    }
}
