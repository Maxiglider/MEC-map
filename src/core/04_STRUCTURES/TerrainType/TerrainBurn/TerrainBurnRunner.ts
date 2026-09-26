import { createTimer } from 'Utils/mapUtils'
import { Timer } from 'w3ts'
import { getUdgTerrainTypes } from '../../../../../globals'
import { ChangeTerrainType } from '../../../07_TRIGGERS/Modify_terrain_Functions/Modify_terrain_functions'
import { tileIndexTx, tileIndexTy, tileToWorldCenter } from '../../Visibility/TileCoordinates'
import { isSlideTerrain } from '../TerrainType'
import type { TerrainTypeBurn } from '../TerrainTypeBurn'
import { burningTileOriginals } from './BurningTiles'
import { forEachNeighbour } from './BurnZone'

/**
 * The fire of one burn terrain type in one level, from the level's start to its end.
 *
 * One periodic timer at the propagation time, and every duration counted in its ticks: a timer per tile would cost a
 * handle per tile for nothing. The tiles are walked through arrays only, in the order they caught fire, and the
 * tables keyed by tile index are only ever read by key: the terrain changes, the effects created and their order are
 * then the same on every machine, which is what keeps this away from desyncs.
 */
export class TerrainBurnRunner {
    private tick = 0
    private timer: Timer | undefined

    /** The reached tiles still burning, in the order they caught fire */
    private burning: number[] = []
    private isBurning: { [tileIndex: number]: boolean | undefined } = {}
    /** The tick a reached tile gets its slide terrain back at. 0: never */
    private burnEnd: { [tileIndex: number]: number | undefined } = {}
    /** The tick before which a tile back to slide cannot burn again */
    private cooldownEnd: { [tileIndex: number]: number | undefined } = {}
    private effects: { [tileIndex: number]: effect | undefined } = {}
    /** The tick the effect of a tile is removed at. 0: when the tile stops burning */
    private effectEnd: { [tileIndex: number]: number | undefined } = {}

    constructor(
        private readonly burnType: TerrainTypeBurn,
        /**
         * The tiles painted with the burn terrain type, touching the level: they burn for good. The level only
         * decides which tiles are sources - the fire they start reaches any slide tile, the level's or not.
         */
        private readonly sources: number[]
    ) {}

    start = () => {
        this.timer = createTimer(this.burnType.getPropagationTime(), true, () => this.onTick())
    }

    /** Gives every reached tile its slide terrain back */
    stop = () => {
        this.timer?.destroy()
        this.timer = undefined

        for (const tileIndex of this.burning) {
            this.extinguish(tileIndex)
        }

        this.burning = []
        this.cooldownEnd = {}
    }

    private onTick = () => {
        this.tick++

        const tick = this.tick
        const stillBurning: number[] = []

        for (const tileIndex of this.burning) {
            const burnEnd = this.burnEnd[tileIndex] ?? 0

            if (burnEnd !== 0 && burnEnd <= tick) {
                this.extinguish(tileIndex)
                this.cooldownEnd[tileIndex] = tick + this.burnType.getTimeToBurnAgain()
            } else {
                const effectEnd = this.effectEnd[tileIndex] ?? 0

                if (effectEnd !== 0 && effectEnd <= tick) {
                    this.destroyEffect(tileIndex)
                }

                stillBurning.push(tileIndex)
            }
        }

        this.burning = stillBurning

        // what catches fire at this tick spreads at the next one only: the loops stop where the arrays ended
        const nbBurning = stillBurning.length

        for (const tileIndex of this.sources) {
            forEachNeighbour(tileIndex, neighbourIndex => this.tryToIgnite(neighbourIndex))
        }

        for (let i = 0; i < nbBurning; i++) {
            forEachNeighbour(stillBurning[i], neighbourIndex => this.tryToIgnite(neighbourIndex))
        }
    }

    private tryToIgnite = (tileIndex: number) => {
        if (
            this.isBurning[tileIndex] ||
            burningTileOriginals[tileIndex] !== undefined ||
            (this.cooldownEnd[tileIndex] ?? 0) > this.tick
        ) {
            return
        }

        const x = tileToWorldCenter(tileIndexTx(tileIndex))
        const y = tileToWorldCenter(tileIndexTy(tileIndex))
        const terrainTypeId = GetTerrainType(x, y)
        const terrainType = getUdgTerrainTypes().getByTerrainTypeId(terrainTypeId)

        if (!terrainType || !isSlideTerrain(terrainType) || !terrainType.getCanBurn()) {
            return
        }

        burningTileOriginals[tileIndex] = terrainTypeId
        ChangeTerrainType(x, y, this.burnType.getTerrainTypeId())

        this.isBurning[tileIndex] = true
        this.burning.push(tileIndex)

        const burningTime = this.burnType.getBurningTime()
        this.burnEnd[tileIndex] = burningTime > 0 ? this.tick + burningTime : 0

        const effectStr = this.burnType.getBurningEffectStr()

        if (effectStr !== '') {
            const burningEffectTime = this.burnType.getBurningEffectTime()

            this.effects[tileIndex] = AddSpecialEffect(effectStr, x, y)
            this.effectEnd[tileIndex] = burningEffectTime > 0 ? this.tick + burningEffectTime : 0
        }
    }

    private extinguish = (tileIndex: number) => {
        const original = burningTileOriginals[tileIndex]

        if (original !== undefined) {
            const x = tileToWorldCenter(tileIndexTx(tileIndex))
            const y = tileToWorldCenter(tileIndexTy(tileIndex))

            // a maker may have painted over it meanwhile: that terrain stays
            if (GetTerrainType(x, y) === this.burnType.getTerrainTypeId()) {
                ChangeTerrainType(x, y, original)
            }
        }

        burningTileOriginals[tileIndex] = undefined
        this.isBurning[tileIndex] = undefined
        this.burnEnd[tileIndex] = undefined
        this.destroyEffect(tileIndex)
    }

    private destroyEffect = (tileIndex: number) => {
        const burningEffect = this.effects[tileIndex]

        if (burningEffect) {
            DestroyEffect(burningEffect)
            this.effects[tileIndex] = undefined
        }

        this.effectEnd[tileIndex] = undefined
    }
}
