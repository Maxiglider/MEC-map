import { Constants } from 'core/01_libraries/Constants'
import { createTimer } from 'Utils/mapUtils'
import { Timer } from 'w3ts'
import { MonsterType } from '../Monster/MonsterType'
import { NewImmobileMonster } from '../Monster/Monster_functions'

const PERIOD = 0.01

export class CasterShot {
    x: number
    y: number
    diffX: number
    diffY: number
    nbTeleportationsRestantes: number
    unite: unit
    private trig: Timer

    constructor(monsterType: MonsterType, Xdep: number, Ydep: number, angle: number, speed: number, portee: number) {
        this.x = Xdep
        this.y = Ydep
        this.diffX = speed * CosBJ(angle) * PERIOD
        this.diffY = speed * SinBJ(angle) * PERIOD
        this.nbTeleportationsRestantes = R2I(portee / speed / PERIOD)
        this.unite = NewImmobileMonster(monsterType, Xdep, Ydep, angle)

        const shot = this

        this.trig = createTimer(PERIOD, true, () => {
            shot.x = shot.x + shot.diffX
            shot.y = shot.y + shot.diffY
            if (shot.x >= Constants.MAP_MIN_X && shot.x <= Constants.MAP_MAX_X) {
                SetUnitX(shot.unite, shot.x)
            }
            if (shot.y >= Constants.MAP_MIN_Y && shot.y <= Constants.MAP_MAX_Y) {
                SetUnitY(shot.unite, shot.y)
            }
            shot.nbTeleportationsRestantes = shot.nbTeleportationsRestantes - 1
            if (shot.nbTeleportationsRestantes == 0) {
                shot.destroy()
            }
        })
    }

    destroy = () => {
        RemoveUnit(this.unite)
        ;(this.unite as any) = null
        this.trig.destroy()
        ;(this.trig as any) = null
    }
}
