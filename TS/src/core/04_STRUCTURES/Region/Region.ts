import { MemoryHandler } from 'Utils/MemoryHandler'
import { createPoint } from 'Utils/Point'
import { GREY, TERRAIN_DATA_DISPLAY_TIME } from '../../01_libraries/Constants'
import { udg_colorCode } from '../../01_libraries/Init_colorCodes'
import { Text } from '../../01_libraries/Text'
import { Level } from '../Level/Level'

export const regionFlags = ['wanderable'] as const

export type IRegionFlags = (typeof regionFlags)[number]

export class Region {
    private static lastInstanceId = -1

    public static getNextId = () => {
        return ++Region.lastInstanceId
    }

    public level: Level | undefined = undefined
    private id: number
    private label: string

    private minX: number
    private minY: number
    private maxX: number
    private maxY: number

    private flags: IRegionFlags[] = []

    constructor(label: string, x1: number, y1: number, x2: number, y2: number) {
        this.id = Region.getNextId()
        this.label = label
        this.minX = Math.round(RMinBJ(x1, x2))
        this.minY = Math.round(RMinBJ(y1, y2))
        this.maxX = Math.round(RMaxBJ(x1, x2))
        this.maxY = Math.round(RMaxBJ(y1, y2))
    }

    getId() {
        return this.id
    }

    getLabel = (): string => {
        return this.label
    }

    getMinX = () => this.minX
    getMaxX = () => this.maxX
    getMinY = () => this.minY
    getMaxY = () => this.maxY

    getRandomPoint = () => {
        return createPoint(
            this.minX + Math.random() * (this.maxX - this.minX),
            this.minY + Math.random() * (this.maxY - this.minY)
        )
    }

    destroy = () => {
        this.level && this.level.regions.removeRegion(this.id)
    }

    setLabel = (newLabel: string) => {
        this.label = newLabel
    }

    displayForPlayer = (p: player) => {
        const display = udg_colorCode[GREY] + this.label

        Text.P_timed(p, TERRAIN_DATA_DISPLAY_TIME, display)
    }

    setFlags = (flags: IRegionFlags[]) => {
        this.flags = flags
    }

    hasFlag = (flag: IRegionFlags) => {
        return this.flags.includes(flag)
    }

    setFlag = (flag: IRegionFlags, b: boolean) => {
        if (b) {
            if (!this.flags.includes(flag)) {
                this.flags.push(flag)
            }
        } else {
            if (this.flags.includes(flag)) {
                this.flags.splice(this.flags.indexOf(flag), 1)
            }
        }
    }

    toJson = () => {
        const output = MemoryHandler.getEmptyObject<any>()

        output['label'] = this.label
        output['minX'] = R2I(this.minX)
        output['minY'] = R2I(this.minY)
        output['maxX'] = R2I(this.maxX)
        output['maxY'] = R2I(this.maxY)
        output['flags'] = this.flags

        return output
    }
}
