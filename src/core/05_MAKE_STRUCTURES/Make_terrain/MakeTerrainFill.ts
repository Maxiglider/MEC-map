import { MemoryHandler } from 'Utils/MemoryHandler'
import { getUdgTerrainTypes } from '../../../../globals'
import { arrayPush, outOfBounds } from '../../01_libraries/Basic_functions'
import { Text } from '../../01_libraries/Text'
import { getRealTerrainTypeId } from '../../04_STRUCTURES/TerrainType/TerrainBurn/BurningTiles'
import { TerrainType } from '../../04_STRUCTURES/TerrainType/TerrainType'
import {
    tileIndexOf,
    tileIndexTx,
    tileIndexTy,
    tileToWorldCenter,
    worldToTile,
} from '../../04_STRUCTURES/Visibility/TileCoordinates'
import { ChangeTerrainType } from '../../07_TRIGGERS/Modify_terrain_Functions/Modify_terrain_functions'
import { MakeOneByOneOrTwoClicks } from '../Make/MakeOneByOneOrTwoClicks'
import { MakeTerrainCreateBrushAction } from '../MakeLastActions/MakeTerrainCreateBrushAction'
import { ChangingTile } from './MakeTerrainCreateBrush'

const NEIGHBOUR_DX = [1, -1, 0, 0]
const NEIGHBOUR_DY = [0, 0, 1, -1]

/**
 * The paint bucket: each right click turns the clicked tile, and every tile of the same terrain linked to it by a
 * side, into the terrain type chosen. Cancelled and redone as a brush stroke is.
 *
 * A burning tile counts as the slide it really is: the fire is not part of the map, so it neither cuts a zone in two
 * nor gets filled on its own.
 */
export class MakeTerrainFill extends MakeOneByOneOrTwoClicks {
    private terrainType: TerrainType

    constructor(maker: unit, terrainType: TerrainType) {
        super(maker, 'terrainCreateFill', 'oneByOne', ['oneByOne'], false)
        this.terrainType = terrainType
    }

    doActions = () => {
        if (super.doBaseActions()) {
            this.fill(this.orderX, this.orderY)
        }
    }

    private fill = (clickX: number, clickY: number) => {
        const startTileIndex = tileIndexOf(worldToTile(clickX), worldToTile(clickY))
        const startX = tileToWorldCenter(tileIndexTx(startTileIndex))
        const startY = tileToWorldCenter(tileIndexTy(startTileIndex))

        if (outOfBounds(startX, startY)) {
            return
        }

        const filledTerrainTypeId = getRealTerrainTypeId(startX, startY)
        const terrainTypeBefore = getUdgTerrainTypes().getByTerrainTypeId(filledTerrainTypeId)

        if (!terrainTypeBefore) {
            Text.erP(this.escaper.getPlayer(), 'the terrain clicked is not a terrain type of the map')
            return
        }

        if (terrainTypeBefore === this.terrainType) {
            return
        }

        // a queue read by index, growing while it is walked
        const tiles: number[] = [startTileIndex]
        const isReached: { [tileIndex: number]: boolean | undefined } = { [startTileIndex]: true }

        for (let head = 0; head < tiles.length; head++) {
            const tx = tileIndexTx(tiles[head])
            const ty = tileIndexTy(tiles[head])

            for (let i = 0; i < 4; i++) {
                const neighbourIndex = tileIndexOf(tx + NEIGHBOUR_DX[i], ty + NEIGHBOUR_DY[i])
                const x = tileToWorldCenter(tileIndexTx(neighbourIndex))
                const y = tileToWorldCenter(tileIndexTy(neighbourIndex))

                if (
                    !isReached[neighbourIndex] &&
                    !outOfBounds(x, y) &&
                    getRealTerrainTypeId(x, y) === filledTerrainTypeId
                ) {
                    isReached[neighbourIndex] = true
                    tiles.push(neighbourIndex)
                }
            }
        }

        const changingTiles = MemoryHandler.getEmptyArray<ChangingTile>()

        for (const tileIndex of tiles) {
            const x = tileToWorldCenter(tileIndexTx(tileIndex))
            const y = tileToWorldCenter(tileIndexTy(tileIndex))

            ChangeTerrainType(x, y, this.terrainType.getTerrainTypeId())

            arrayPush(changingTiles, {
                x: x,
                y: y,
                terrainTypeBefore: terrainTypeBefore,
                terrainTypeAfter: this.terrainType,
            })
        }

        this.escaper.newAction(new MakeTerrainCreateBrushAction(changingTiles))
        MemoryHandler.destroyArray(changingTiles)

        Text.mkP(this.escaper.getPlayer(), I2S(tiles.length) + ' tiles filled')
    }
}
