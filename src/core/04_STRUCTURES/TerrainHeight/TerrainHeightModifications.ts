import { Constants } from 'core/01_libraries/Constants'
import { globals } from '../../../../globals'

/**
 * The terrain height modifications made during the game, by tilepoint, for -smic to export them: the loader adds
 * them to the heights of the base map, which it keeps as they are otherwise, ramps and cliffs included.
 *
 * They are computed, not read with GetLocationZ: a permanent TerrainDeformCrater raises every tilepoint closer
 * than its radius by height * cos(pi/2 * distance / radius), to 0.002 measured in the game on flat ground, ramps
 * and cliffs, while GetLocationZ only gives the new height later and not everywhere at once (2026-10-02).
 *
 * Kept as reals, rounded only by toJson, so that crater over crater adds no rounding errors. Only -smic reads
 * them, on the exporting machine alone: nothing in the game depends on them.
 */
export class TerrainHeightModifications {
    /** tileId: y * (number of tilepoints in a row) + x, from MAP_MIN_X and MAP_MIN_Y, the order of war3map.w3e */
    private modifications: { [tileId: number]: number } = {}

    /**
     * What a crater of -terrainHeight does to the terrain, added (factor 1, applied or redone) or taken back
     * (factor -1, cancelled).
     */
    addCrater = (x: number, y: number, radius: number, height: number, factor: number) => {
        const tilepointsByRow = this.tilepointsByRow()
        const tilepointsByColumn = this.tilepointsByColumn()

        const minTileX = math.max(0, math.ceil((x - radius - globals.MAP_MIN_X) / Constants.LARGEUR_CASE))
        const maxTileX = math.min(
            tilepointsByRow - 1,
            math.floor((x + radius - globals.MAP_MIN_X) / Constants.LARGEUR_CASE)
        )
        const minTileY = math.max(0, math.ceil((y - radius - globals.MAP_MIN_Y) / Constants.LARGEUR_CASE))
        const maxTileY = math.min(
            tilepointsByColumn - 1,
            math.floor((y + radius - globals.MAP_MIN_Y) / Constants.LARGEUR_CASE)
        )

        for (let tileY = minTileY; tileY <= maxTileY; tileY++) {
            for (let tileX = minTileX; tileX <= maxTileX; tileX++) {
                const dx = globals.MAP_MIN_X + tileX * Constants.LARGEUR_CASE - x
                const dy = globals.MAP_MIN_Y + tileY * Constants.LARGEUR_CASE - y
                const distance = SquareRoot(dx * dx + dy * dy)

                if (distance >= radius) {
                    continue
                }

                const tileId = tileY * tilepointsByRow + tileX
                const modification =
                    (this.modifications[tileId] ?? 0) + factor * height * Cos((bj_PI / 2) * (distance / radius))

                if (math.abs(modification) < 0.001) {
                    delete this.modifications[tileId]
                } else {
                    this.modifications[tileId] = modification
                }
            }
        }
    }

    /**
     * [tileId1, modification1, tileId2, modification2, ...], by tileId, each modification rounded to an integer and
     * left out once 0
     */
    toJson = (): number[] => {
        const tileIds: number[] = []
        for (const [tileId] of pairs(this.modifications)) {
            tileIds.push(tileId)
        }
        table.sort(tileIds)

        const json: number[] = []
        for (const tileId of tileIds) {
            const modification = math.floor(this.modifications[tileId] + 0.5)
            if (modification !== 0) {
                json.push(tileId, modification)
            }
        }

        return json
    }

    private tilepointsByRow = () => R2I((globals.MAP_MAX_X - globals.MAP_MIN_X) / Constants.LARGEUR_CASE) + 1

    private tilepointsByColumn = () => R2I((globals.MAP_MAX_Y - globals.MAP_MIN_Y) / Constants.LARGEUR_CASE) + 1
}

export const terrainHeightModifications = new TerrainHeightModifications()
