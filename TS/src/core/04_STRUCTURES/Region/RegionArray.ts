import { MemoryHandler } from 'Utils/MemoryHandler'
import { arrayPush } from 'core/01_libraries/Basic_functions'
import { Text } from '../../01_libraries/Text'
import { BaseArray } from '../BaseArray'
import type { Level } from '../Level/Level'
import { IRegionFlags, Region } from './Region'

export class RegionArray extends BaseArray<Region> {
    private level: Level

    constructor(level: Level) {
        super(false)
        this.level = level
    }

    getByLabel = (label: string) => {
        for (const [_, r] of pairs(this.data)) {
            if (r.getLabel() === label) {
                return r
            }
        }

        return null
    }

    new(region: Region) {
        this._new(region)
        region.level = this.level

        this.level.updateDebugRegions()
    }

    newFromJson = (regionsJson: { [x: string]: any }[]) => {
        for (const r of regionsJson) {
            const region = new Region(r.label, r.minX, r.minY, r.maxX, r.maxY)
            r.flags && region.setFlags(r.flags)
            this.new(region)
        }
    }

    removeRegion = (regionId: number) => {
        delete this.data[regionId]

        this.level.updateDebugRegions()
    }

    clearRegion = (label: string): boolean => {
        const r = this.getByLabel(label)
        if (r) {
            delete this.data[r.getId()]
            r.destroy()
            return true
        } else {
            return false
        }
    }

    getRegionAt = (x: number, y: number) => {
        for (const [_, r] of pairs(this.data)) {
            if (r.getMinX() <= x && r.getMaxX() >= x && r.getMinY() <= y && r.getMaxY() >= y) {
                return r
            }
        }

        return null
    }

    getRegionsAt = (x: number, y: number) => {
        const regions = MemoryHandler.getEmptyArray<Region>()

        for (const [_, r] of pairs(this.data)) {
            if (r.getMinX() <= x && r.getMaxX() >= x && r.getMinY() <= y && r.getMaxY() >= y) {
                arrayPush(regions, r)
            }
        }

        return regions
    }

    getRegionAtWithFlag = (x: number, y: number, flag: IRegionFlags) => {
        for (const [_, r] of pairs(this.data)) {
            if (r.getMinX() <= x && r.getMaxX() >= x && r.getMinY() <= y && r.getMaxY() >= y) {
                if (r.hasFlag(flag)) {
                    return r
                }
            }
        }

        return null
    }

    displayForPlayer = (p: player) => {
        const nbRs = this.count()
        if (nbRs == 0) {
            Text.erP(p, 'no regions for this level')
        } else {
            for (const [_, r] of pairs(this.data)) {
                r.displayForPlayer(p)
            }
        }
    }

    changeLabel = (oldLabel: string, newLabel: string): boolean => {
        const rWithOldLabel = this.getByLabel(oldLabel)
        const rWithNewLabel = this.getByLabel(newLabel)

        if (!rWithOldLabel || rWithNewLabel) {
            return false
        }

        rWithOldLabel.setLabel(newLabel)

        return true
    }
}
