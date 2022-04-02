import { Text } from 'core/01_libraries/Text'
import { CACHE_SEPARATEUR_PARAM } from 'core/07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache'
import { udg_levels } from 'core/08_GAME/Init_structures/Init_struct_levels'
import { createEvent } from 'Utils/mapUtils'
import { Hero2Escaper } from '../Escaper/Escaper_functions'

abstract class RectInterface {
    minX: number
    minY: number
    maxX: number
    maxY: number
    r: rect

    constructor(minX: number, minY: number, maxX: number, maxY: number) {
        this.minX = minX
        this.minY = minY
        this.maxX = maxX
        this.maxY = maxY
        this.r = Rect(this.minX, this.minY, this.maxX, this.maxY)
    }

    destroy = () => {
        RemoveRect(this.r)
    }

    toString = () => {
        let minX = I2S(R2I(this.minX))
        let minY = I2S(R2I(this.minY))
        let maxX = I2S(R2I(this.maxX))
        let maxY = I2S(R2I(this.maxY))

        return minX + CACHE_SEPARATEUR_PARAM + minY + CACHE_SEPARATEUR_PARAM + maxX + CACHE_SEPARATEUR_PARAM + maxY
    }
}

export class Start extends RectInterface {
    constructor(x1: number, y1: number, x2: number, y2: number) {
        super(RMinBJ(x1, x2), RMinBJ(y1, y2), RMaxBJ(x1, x2), RMaxBJ(y1, y2))
    }

    getRandomX = () => {
        return GetRandomReal(this.minX, this.maxX)
    }

    getRandomY = () => {
        return GetRandomReal(this.minY, this.maxY)
    }

    getCenterX = () => {
        return GetRectCenterX(this.r)
    }

    getCenterY = () => {
        return GetRectCenterY(this.r)
    }
}

export class End extends RectInterface {
    private endReaching: trigger

    constructor(x1: number, y1: number, x2: number, y2: number) {
        super(RMinBJ(x1, x2), RMinBJ(y1, y2), RMaxBJ(x1, x2), RMaxBJ(y1, y2))

        this.endReaching = createEvent({
            events: [t => TriggerRegisterEnterRectSimple(t, this.r)],
            actions: [
                () => {
                    const finisher = Hero2Escaper(GetTriggerUnit())

                    if (finisher === null) {
                        return
                    }

                    if (!udg_levels.goToNextLevel(finisher)) {
                        Text.A('Good job ! You have finished the game.')
                        TriggerSleepAction(2)
                        Text.A('restart in 10 seconds')
                        TriggerSleepAction(10)
                        udg_levels.restartTheGame()
                    }
                },
            ],
        })

        DisableTrigger(this.endReaching)
    }

    activate = (activ: boolean) => {
        if (activ) {
            EnableTrigger(this.endReaching)
        } else {
            DisableTrigger(this.endReaching)
        }
    }

    destroy = () => {
        super.destroy()
        DestroyTrigger(this.endReaching)
    }
}

export const DEPART_PAR_DEFAUT = new Start(-500, -500, 500, 500)
