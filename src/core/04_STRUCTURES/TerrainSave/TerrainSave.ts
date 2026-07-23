import { MemoryHandler } from 'Utils/MemoryHandler'
import { Constants } from 'core/01_libraries/Constants'
import { getUdgTerrainSaves, getUdgTerrainTypes, globals } from '../../../../globals'
import { ChangeTerrainType } from '../../07_TRIGGERS/Modify_terrain_Functions/Modify_terrain_functions'
import type { Level } from '../Level/Level'
import { HorizontalRectangleRegion } from '../Region/HorizontalRectangleRegion'
import type { TerrainType } from '../TerrainType/TerrainType'

type Bounds = { minX: number; maxX: number; minY: number; maxY: number }

export class TerrainSave {
    private label: string
    private level: Level | null
    private zone: HorizontalRectangleRegion | null

    private capturedTerrain: TerrainType[] = []
    private originX = 0
    private originY = 0
    private width = 0
    private height = 0

    private previousTerrain: TerrainType[] | null = null
    private applied = false

    private minimapEnabled = false

    constructor(label: string, level: Level | null, zone: HorizontalRectangleRegion | null) {
        this.label = label
        this.level = level
        this.zone = zone
    }

    getLabel = (): string => this.label
    setLabel = (newLabel: string) => {
        this.label = newLabel
    }

    getLevel = (): Level | null => this.level
    setLevel = (newLevel: Level | null): boolean => {
        if (!getUdgTerrainSaves().canAssignLevel(this.label, newLevel, this)) {
            return false
        }

        this.level = newLevel
        return true
    }

    getZone = (): HorizontalRectangleRegion | null => this.zone
    isWholeMap = (): boolean => this.zone === null

    isApplied = (): boolean => this.applied

    isMinimapEnabled = (): boolean => this.minimapEnabled
    setMinimapEnabled = (enabled: boolean) => {
        this.minimapEnabled = enabled
    }

    private getBounds(): Bounds {
        if (this.zone) {
            return {
                minX: this.zone.getMinX(),
                maxX: this.zone.getMaxX(),
                minY: this.zone.getMinY(),
                maxY: this.zone.getMaxY(),
            }
        }

        return {
            minX: globals.MAP_MIN_X,
            maxX: globals.MAP_MAX_X,
            minY: globals.MAP_MIN_Y,
            maxY: globals.MAP_MAX_Y,
        }
    }

    // Walks the already-captured (originX, originY, width, height) grid - not the live zone/whole-map bounds,
    // so it stays valid for apply()/unapply() even if the zone was destroyed/changed since capture.
    private forEachTile(cb: (x: number, y: number, index: number) => void) {
        let index = 0
        for (let row = 0; row < this.height; row++) {
            const y = this.originY + row * Constants.LARGEUR_CASE
            for (let col = 0; col < this.width; col++) {
                const x = this.originX + col * Constants.LARGEUR_CASE
                cb(x, y, index)
                index++
            }
        }
    }

    captureTerrain = () => {
        const bounds = this.getBounds()

        const newOriginX = bounds.minX
        const newOriginY = bounds.minY
        const newWidth = Math.floor((bounds.maxX - bounds.minX) / Constants.LARGEUR_CASE) + 1
        const newHeight = Math.floor((bounds.maxY - bounds.minY) / Constants.LARGEUR_CASE) + 1

        const newCapturedTerrain: TerrainType[] = []

        let index = 0
        for (let row = 0; row < newHeight; row++) {
            const y = newOriginY + row * Constants.LARGEUR_CASE
            for (let col = 0; col < newWidth; col++) {
                const x = newOriginX + col * Constants.LARGEUR_CASE

                const terrainType = getUdgTerrainTypes().getTerrainType(x, y)
                if (terrainType === null) {
                    throw `TerrainSave: captureTerrain: no TerrainType found at (${x}, ${y})`
                }

                newCapturedTerrain[index] = terrainType
                index++
            }
        }

        this.originX = newOriginX
        this.originY = newOriginY
        this.width = newWidth
        this.height = newHeight
        this.capturedTerrain = newCapturedTerrain
    }

    apply = (): boolean => {
        if (!this.applied) {
            const newPreviousTerrain: TerrainType[] = []
            this.forEachTile((x, y, index) => {
                const terrainType = getUdgTerrainTypes().getTerrainType(x, y)
                if (terrainType !== null) {
                    newPreviousTerrain[index] = terrainType
                }
            })
            this.previousTerrain = newPreviousTerrain
        }

        this.forEachTile((x, y, index) => {
            const terrainType = this.capturedTerrain[index]
            if (terrainType !== undefined) {
                ChangeTerrainType(x, y, terrainType.getTerrainTypeId())
            }
        })

        this.applied = true
        return true
    }

    unapply = (): boolean => {
        if (!this.applied || !this.previousTerrain) {
            return false
        }

        const previousTerrain = this.previousTerrain
        this.forEachTile((x, y, index) => {
            const terrainType = previousTerrain[index]
            if (terrainType !== undefined) {
                ChangeTerrainType(x, y, terrainType.getTerrainTypeId())
            }
        })

        this.applied = false
        this.previousTerrain = null
        return true
    }

    // Used by TerrainSaveArray.newFromJson to restore a saved grid without reading live terrain.
    loadCapturedTerrainFromJson = (
        originX: number,
        originY: number,
        width: number,
        height: number,
        terrainTypeIds: number[]
    ) => {
        const newCapturedTerrain: TerrainType[] = []

        for (let i = 0; i < terrainTypeIds.length; i++) {
            const terrainType = getUdgTerrainTypes().getByTerrainTypeId(terrainTypeIds[i])
            if (terrainType === null) {
                throw `TerrainSave: loadCapturedTerrainFromJson: unknown terrainTypeId "${terrainTypeIds[i]}"`
            }
            newCapturedTerrain[i] = terrainType
        }

        this.originX = originX
        this.originY = originY
        this.width = width
        this.height = height
        this.capturedTerrain = newCapturedTerrain
    }

    toJson = () => {
        const output = MemoryHandler.getEmptyObject<any>()

        output.label = this.label
        output.level = this.level ? this.level.id : null
        output.zone = this.zone ? this.zone.toJson() : null

        output.originX = this.originX
        output.originY = this.originY
        output.width = this.width
        output.height = this.height

        const terrainTypeIds: number[] = []
        for (let i = 0; i < this.capturedTerrain.length; i++) {
            terrainTypeIds[i] = this.capturedTerrain[i].getTerrainTypeId()
        }
        output.capturedTerrain = terrainTypeIds

        output.minimapEnabled = this.minimapEnabled

        return output
    }

    destroy = () => {
        this.zone?.destroy()
    }
}
