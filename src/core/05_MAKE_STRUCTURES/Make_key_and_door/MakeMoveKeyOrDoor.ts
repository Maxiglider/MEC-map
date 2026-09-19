import { Text } from '../../01_libraries/Text'
import { KeyAndDoor } from '../../04_STRUCTURES/KeyAndDoor/KeyAndDoor'
import { Make } from '../Make/Make'

/** -moveDoor / -moveKey: a first click picks a door (or a key), a second one moves it there; then the next one */
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
                this.target = this.escaper.getMakingLevel().keyAndDoors.getNearPart(this.part, this.orderX, this.orderY)
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
