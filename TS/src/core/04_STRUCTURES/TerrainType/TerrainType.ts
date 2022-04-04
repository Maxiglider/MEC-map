import {CanUseTerrain} from 'core/07_TRIGGERS/Modify_terrain_Functions/Terrain_functions'

export abstract class TerrainType {
    label: string
    theAlias: string | null
    kind: string
    terrainTypeId: number
    orderId: number //numéro du terrain (ordre des tilesets), de 1 à 16
    cliffClassId: number //cliff class 1 or 2, depending of the main tileset

    constructor(
        label: string,
        terrainTypeId: number,
        theAlias: string | null,
        kind: string,
        orderId: number,
        cliffClassId: number
    ) {
        if(terrainTypeId == 0){
            throw "Wrong terrain type id"
        }
        this.label = label
        this.terrainTypeId = terrainTypeId
        this.theAlias = theAlias
        this.kind = kind
        this.orderId = orderId
        this.cliffClassId = cliffClassId
    }

    setOrderId = (orderId: number): TerrainType => {
        this.orderId = orderId
        return this
    }

    getOrderId = (): number => {
        return this.orderId
    }

    setCliffClassId = (cliffClassId: number): TerrainType => {
        if (cliffClassId === 1 || cliffClassId === 2) {
            this.cliffClassId = cliffClassId
        }
        return this
    }

    getCliffClassId = (): number => {
        return this.cliffClassId
    }

    setType = (terrainTypeId: number) => {
        this.terrainTypeId = terrainTypeId
    }

    setLabel = (label: string) => {
        this.label = label
    }

    setAlias = (theAlias: string): TerrainType => {
        this.theAlias = theAlias
        return this
    }

    getTerrainTypeId = (): number => {
        return this.terrainTypeId
    }

    setTerrainTypeId = (terrainTypeId: number): boolean => {
        if (!CanUseTerrain(terrainTypeId)) {
            return false
        }
        this.terrainTypeId = terrainTypeId
        return true
    }

    getKind = (): string => {
        return this.kind
    }

    abstract displayForPlayer(p: player): void

    abstract toString(): string

    abstract destroy(): void
}
