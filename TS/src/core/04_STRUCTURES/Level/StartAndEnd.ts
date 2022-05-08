import { Text } from 'core/01_libraries/Text'
import { getUdgLevels } from "../../../../globals"

import { createEvent } from 'Utils/mapUtils'
import { Hero2Escaper } from '../Escaper/Escaper_functions'
import {ObjectHandler} from "../../../Utils/ObjectHandler";


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

    destroy() {
        RemoveRect(this.r)
    }

    toJson = () => {
        const output = ObjectHandler.getNewObject<any>()

        output['minX'] = this.minX
        output['minY'] = this.minY
        output['maxX'] = this.maxX
        output['maxY'] = this.maxY

        return output
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

                    if (!finisher) {
                        return
                    }

                    if (!getUdgLevels().goToNextLevel(finisher)) {
                        Text.A('Good job ! You have finished the game.')
                        TriggerSleepAction(2)
                        Text.A('restart in 10 seconds')
                        TriggerSleepAction(10)
                        getUdgLevels().restartTheGame()
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

export let DEPART_PAR_DEFAUT: Start

export const init_StartAndEnd = () => {
    DEPART_PAR_DEFAUT = new Start(-50, -50, 50, 50)
}
