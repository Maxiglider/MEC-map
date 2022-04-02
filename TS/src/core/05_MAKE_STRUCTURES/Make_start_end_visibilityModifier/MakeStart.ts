import {MakeOneByOneOrTwoClicks} from "../Make/MakeOneByOneOrTwoClicks";
import {Level} from "../../04_STRUCTURES/Level/Level";
import {udg_levels} from "../../08_GAME/Init_structures/Init_struct_levels";
import {Text} from "../../01_libraries/Text";


export class MakeStart extends MakeOneByOneOrTwoClicks {
    private forNextB: boolean //à true si on veut créer le start du niveau suivant

    constructor(maker: unit, forNext: boolean) {
        super(maker, 'startCreate')
        this.forNextB = forNext
    }

    forNext = (): boolean => {
        return this.forNextB
    }
    
    doActions() {
        if(super.doBaseActions()){
            let level: Level | null

            if (this.isLastLocSavedUsed()) {
                level = this.escaper.getMakingLevel()
                if (this.forNext()) {
                    if (!udg_levels.get(level.getId() + 1)) {
                        udg_levels.new()
                    }

                    level = udg_levels.get(level.getId() + 1)
                    if (!level) {
                        Text.erP(this.escaper.getPlayer(), "erreur d'origine inconnue")
                        this.escaper.destroyMake()
                        return
                    }
                }

                level.newStart(this.lastX, this.lastY, this.orderX, this.orderY)
                Text.mkP(this.makerOwner, 'start made for level ' + I2S(level.getId()))

                this.escaper.destroyMake()
            } else {
                this.saveLoc(this.orderX, this.orderY)
            }
        }
    }
}
