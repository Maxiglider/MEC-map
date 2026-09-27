import { getUdgLevels, getUdgTerrainTypes } from '../../../../../globals'
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
    /**
     * Whether the level is being played, as its fires know it: set as they are lit or put out, which Level.activate
     * does before running the hooks of the level's start or end - where a terrain save event loads its terrain -
     * and before it marks the level activated or not.
     */
    private isLevelPlayed = false

    constructor(private readonly level: Level) {}

    activate = (activ: boolean) => {
        this.stop()
        this.isLevelPlayed = activ

        if (activ) {
            this.start()
        }
    }

    /** Back to how the level started: every reached tile slide again, the fires lit anew from their sources */
    reset = () => {
        if (this.isLevelPlayed) {
            this.activate(true)
        }
    }

    /**
     * The terrain changed under the level while it is played - a terrain save loaded, by an event or a command: its
     * tiles and its sources are found again. The fires go on rather than start over, or a terrain save loaded
     * periodically would cut them short at every load; a burn terrain that got sources is lit.
     */
    refresh = () => {
        if (!this.isLevelPlayed || !terrainBurnEnabled) {
            return
        }

        const found = this.findSources()

        for (const runner of this.runners) {
            runner.setSources(found?.sourcesByTypeId[runner.getBurnType().getTerrainTypeId()] ?? [])
        }

        if (!found) {
            return
        }

        for (const burnType of found.burnTypes) {
            const sources = found.sourcesByTypeId[burnType.getTerrainTypeId()]

            if (sources && sources.length > 0 && !this.runners.some(runner => runner.getBurnType() === burnType)) {
                const runner = new TerrainBurnRunner(burnType, sources)
                this.runners.push(runner)
                runner.start()
            }
        }
    }

    private start = () => {
        if (!terrainBurnEnabled) {
            return
        }

        const found = this.findSources()

        if (!found) {
            return
        }

        for (const burnType of found.burnTypes) {
            const sources = found.sourcesByTypeId[burnType.getTerrainTypeId()]

            if (sources && sources.length > 0) {
                const runner = new TerrainBurnRunner(burnType, sources)
                this.runners.push(runner)
                runner.start()
            }
        }
    }

    /** The burn tiles touching the level, grouped by burn type, in the order the zone lists its tiles */
    private findSources = () => {
        const burnTypes = getUdgTerrainTypes().getBurnTypes()

        if (burnTypes.length === 0) {
            return undefined
        }

        const zone = computeBurnZone(this.level)

        if (!zone) {
            return undefined
        }

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

        return { burnTypes, sourcesByTypeId }
    }

    stop = () => {
        for (const runner of this.runners) {
            runner.stop()
        }

        this.runners = []
    }
}

/** Finds the tiles and the sources of every level being played again, by level id: the same order on every machine */
export const refreshTerrainBurnsOfActiveLevels = () => {
    for (let levelId = 0; levelId <= getUdgLevels().getLastLevelId(); levelId++) {
        getUdgLevels().get(levelId)?.terrainBurns.refresh()
    }
}
