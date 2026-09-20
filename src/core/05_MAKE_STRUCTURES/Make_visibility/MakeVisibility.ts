import { MemoryHandler } from 'Utils/MemoryHandler'
import { getUdgLevels } from '../../../../globals'
import { Text } from '../../01_libraries/Text'
import { worldToTile } from '../../04_STRUCTURES/Visibility/TileCoordinates'
import { VisibilityType } from '../../04_STRUCTURES/Visibility/VisibilityType'
import { MakeOneByOneOrTwoClicks } from '../Make/MakeOneByOneOrTwoClicks'
import { ChangingVisibilityTile, MakeVisibilityTileAction } from '../MakeLastActions/MakeVisibilityTileAction'
import { paintVisibilityTile } from './paintVisibilityTiles'

/**
 * Paints a visibility type over a rectangle of terrain tiles, two clicks for the two corners - the way -crt works.
 *
 * Replaces MakeVisibilityModifier, which created one fog modifier per rectangle. Here nothing is created: the tiles
 * are what the level stores, and the compositor decides what fog modifiers come out of the whole stack of levels.
 */
export class MakeVisibility extends MakeOneByOneOrTwoClicks {
    private visibilityType: VisibilityType

    constructor(maker: unit, visibilityType: VisibilityType) {
        super(maker, 'visibilityCreate', '', [''])

        this.visibilityType = visibilityType
    }

    getVisibilityType = () => this.visibilityType

    doActions = () => {
        if (!super.doBaseActions()) {
            return
        }

        if (!this.isLastLocSavedUsed()) {
            this.saveLoc(this.orderX, this.orderY)
            return
        }

        const level = this.escaper.getMakingLevel()
        const changes: ChangingVisibilityTile[] = MemoryHandler.getEmptyArray()

        const fromTx = worldToTile(RMinBJ(this.lastX, this.orderX))
        const toTx = worldToTile(RMaxBJ(this.lastX, this.orderX))
        const fromTy = worldToTile(RMinBJ(this.lastY, this.orderY))
        const toTy = worldToTile(RMaxBJ(this.lastY, this.orderY))

        for (let ty = fromTy; ty <= toTy; ty++) {
            for (let tx = fromTx; tx <= toTx; tx++) {
                paintVisibilityTile(level, tx, ty, this.visibilityType, changes)
            }
        }

        if (changes.length > 0) {
            this.escaper.newAction(new MakeVisibilityTileAction(level, changes))
            getUdgLevels().refreshVisibilities()

            Text.mkP(
                this.makerOwner,
                (this.visibilityType.isUntouched() ? 'visibility erased on ' : 'visibility painted on ') +
                    I2S(changes.length) +
                    ' tiles of level ' +
                    I2S(level.getId())
            )
        } else {
            Text.mkP(this.makerOwner, 'those tiles already are what you painted')
        }

        MemoryHandler.destroyArray(changes)

        this.unsaveLocDefinitely()
    }
}
