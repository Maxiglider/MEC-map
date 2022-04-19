import { Text } from '../../01_libraries/Text'
import {
    ChangeTerrainType,
} from '../../07_TRIGGERS/Modify_terrain_Functions/Modify_terrain_functions'
import { MakeAction } from './MakeAction'
import {ArrayHandler} from "../../../Utils/ArrayHandler";
import {ChangingTile} from "../Make_terrain/MakeTerrainCreateBrush";

export class MakeTerrainCreateBrushAction extends MakeAction {
    private changingTiles: ChangingTile[]

    constructor(changingTiles: ChangingTile[]) {
        super()

        this.changingTiles = changingTiles
    }

    destroy = () => {
        ArrayHandler.clearArray(this.changingTiles)
    }

    terrainModificationCancel = () => {
        for(let changingTile of this.changingTiles){
            ChangeTerrainType(changingTile.x, changingTile.y, changingTile.terrainTypeBefore.getTerrainTypeId())
        }
    }

    terrainModificationRedo = () => {
        for(let changingTile of this.changingTiles){
            ChangeTerrainType(changingTile.x, changingTile.y, changingTile.terrainTypeAfter.getTerrainTypeId())
        }
    }

    cancel = (): boolean => {
        if (!this.isActionMadeB) {
            return false
        }

        this.terrainModificationCancel()
        this.isActionMadeB = false
        this.owner && Text.mkP(this.owner.getPlayer(), 'terrain creation cancelled')

        return true
    }

    redo = (): boolean => {
        if (this.isActionMadeB) {
            return false
        }

        this.terrainModificationRedo()
        this.isActionMadeB = true
        this.owner && Text.mkP(this.owner.getPlayer(), 'terrain creation redone')

        return true
    }
}
