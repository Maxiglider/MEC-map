import { RefreshHideAllVM } from '../../03_view_all_hide_all/View_all_hide_all'
import { Level } from './Level'
import {ObjectHandler} from "../../../Utils/ObjectHandler";

export class VisibilityModifier {
    private x1: number
    private y1: number
    private x2: number
    private y2: number
    private fm: fogmodifier
    level?: Level

    id?: number

    constructor(x1: number, y1: number, x2: number, y2: number) {
        let visionRect = Rect(x1, y1, x2, y2)
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
        this.fm = CreateFogModifierRect(Player(0), FOG_OF_WAR_VISIBLE, visionRect, true, false)

        RemoveRect(visionRect)
        RefreshHideAllVM()
    }

    destroy = () => {
        DestroyFogModifier(this.fm)
        this.level && this.id && this.level.visibilities.removeVisibility(this.id)
    }

    activate = (activ: boolean) => {
        if (activ) {
            FogModifierStart(this.fm)
        } else {
            FogModifierStop(this.fm)
        }
    }

    copy = (): VisibilityModifier => {
        return new VisibilityModifier(this.x1, this.y1, this.x2, this.y2)
    }

    toJson = () => {
        const output = ObjectHandler.getNewObject<any>()

        output['x1'] = R2I(this.x1)
        output['y1'] = R2I(this.y1)
        output['x2'] = R2I(this.x2)
        output['y2'] = R2I(this.y2)

        return output
    }
}
