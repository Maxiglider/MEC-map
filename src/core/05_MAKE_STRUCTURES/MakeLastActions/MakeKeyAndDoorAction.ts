import { Text } from '../../01_libraries/Text'
import { KeyAndDoor } from '../../04_STRUCTURES/KeyAndDoor/KeyAndDoor'
import { Level } from '../../04_STRUCTURES/Level/Level'
import { MakeAction } from './MakeAction'

/** The creation of a door (-createDoor) or of a door and its key (-createDoorAndKey), for -cancel and -redo */
export class MakeKeyAndDoorAction extends MakeAction {
    private keyAndDoor: KeyAndDoor

    constructor(level: Level, keyAndDoor: KeyAndDoor) {
        super(level)
        this.keyAndDoor = keyAndDoor
    }

    private what = () => (this.keyAndDoor.keyType ? 'door and key' : 'door')

    destroy = () => {
        if (!this.isActionMadeB) {
            this.keyAndDoor.destroy()
        }
    }

    cancel = (): boolean => {
        if (!this.isActionMadeB || !this.level) {
            return false
        }
        takeOff(this.level, this.keyAndDoor)
        this.isActionMadeB = false
        this.owner && Text.mkP(this.owner.getPlayer(), `${this.what()} creation cancelled`)
        return true
    }

    redo = (): boolean => {
        if (this.isActionMadeB || !this.level) {
            return false
        }
        putBack(this.level, this.keyAndDoor)
        this.isActionMadeB = true
        this.owner && Text.mkP(this.owner.getPlayer(), `${this.what()} creation redone`)
        return true
    }
}

/** Off its level and the map, kept to be put back */
export const takeOff = (level: Level, keyAndDoor: KeyAndDoor) => {
    keyAndDoor.remove()
    level.keyAndDoors.removeKeyAndDoor(keyAndDoor.getId())
    level.updateDebugRegions()
}

export const putBack = (level: Level, keyAndDoor: KeyAndDoor) => {
    level.keyAndDoors.new(keyAndDoor, level.isActivated())
    level.updateDebugRegions()
}
