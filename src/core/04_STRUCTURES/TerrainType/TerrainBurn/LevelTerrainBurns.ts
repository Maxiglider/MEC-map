import { getUdgTerrainTypes } from '../../../../../globals'
import type { Level } from '../../Level/Level'
import { computeBurnZone, forEachNeighbour, getTileTerrainTypeId } from './BurnZone'
import { TerrainBurnRunner } from './TerrainBurnRunner'

/** Whether the fires are lit at all, for the game being played only: -terrainBurn, never saved */
let terrainBurnEnabled = true

export const isTerrainBurnEnabled = () => terrainBurnEnabled

export const setTerrainBurnEnabled = (enabled: boolean) => {
    terrainBurnEnabled = enabled
}

/**
 * The fires of a level: lit when the level starts, from the burn tiles touching its ground only, and put out when it
 * ends, the reached tiles getting their slide terrain back. Nothing of it is saved - the burn terrain types are, and
 * the level's tiles are found again at every start (see computeBurnZone).
 */
export class LevelTerrainBurns {
    private runners: TerrainBurnRunner[] = []

    constructor(private readonly level: Level) {}

    activate = (activ: boolean) => {
        this.stop()

        if (activ) {
            this.start()
        }
    }

    /** Back to how the level started: every reached tile slide again, the fires lit anew from their sources */
    reset = () => {
        if (this.level.isActivated()) {
            this.activate(true)
        }
    }

    private start = () => {
        if (!terrainBurnEnabled) {
            return
        }

        const burnTypes = getUdgTerrainTypes().getBurnTypes()

        if (burnTypes.length === 0) {
            return
        }

        const zone = computeBurnZone(this.level)

        if (!zone) {
            return
        }

        // the burn tiles touching the level, grouped by burn type, in the order the zone lists its tiles
        const sourcesByTypeId: { [terrainTypeId: number]: number[] | undefined } = {}
        const isSource: { [tileIndex: number]: boolean | undefined } = {}

        for (const burnType of burnTypes) {
            sourcesByTypeId[burnType.getTerrainTypeId()] = []
        }

        for (const tileIndex of zone.tiles) {
            forEachNeighbour(tileIndex, neighbourIndex => {
                if (isSource[neighbourIndex]) {
                    return
                }

                const sources = sourcesByTypeId[getTileTerrainTypeId(neighbourIndex)]

                if (sources) {
                    isSource[neighbourIndex] = true
                    sources.push(neighbourIndex)
                }
            })
        }

        for (const burnType of burnTypes) {
            const sources = sourcesByTypeId[burnType.getTerrainTypeId()]

            if (sources && sources.length > 0) {
                const runner = new TerrainBurnRunner(burnType, sources)
                this.runners.push(runner)
                runner.start()
            }
        }
    }

    stop = () => {
        for (const runner of this.runners) {
            runner.stop()
        }

        this.runners = []
    }
}
