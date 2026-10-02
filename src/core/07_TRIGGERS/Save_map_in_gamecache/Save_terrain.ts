import { MemoryHandler } from 'Utils/MemoryHandler'
import { Ascii2String } from 'core/01_libraries/Ascii'
import { Constants } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { getRealTerrainTypeId } from 'core/04_STRUCTURES/TerrainType/TerrainBurn/BurningTiles'
import type { TerrainType } from 'core/04_STRUCTURES/TerrainType/TerrainType'
import { getUdgTerrainTypes, globals } from '../../../../globals'
import { arrayPush } from '../../01_libraries/Basic_functions'
import { I2CustomBase64String } from '../../01_libraries/Functions_on_numbers'
import { terrainHeightModifications } from '../../04_STRUCTURES/TerrainHeight/TerrainHeightModifications'

let terrainTypeIds: number[] = []
let nbTerrainTypesUsed: number

const SaveTerrainsUsed = (json: { [x: string]: any }) => {
    json.terrainsUsed = MemoryHandler.getEmptyArray()

    for (let i = 0; i < nbTerrainTypesUsed; i++) {
        arrayPush(json.terrainsUsed, Ascii2String(terrainTypeIds[i]))
    }

    Text.A('terrains used saved')
}

const SaveMapDimensionsAndCenterOffset = (json: { [x: string]: any }) => {
    let largeurMap = R2I((globals.MAP_MAX_X - globals.MAP_MIN_X) / Constants.LARGEUR_CASE)
    let hauteurMap = R2I((globals.MAP_MAX_Y - globals.MAP_MIN_Y) / Constants.LARGEUR_CASE)
    let offsetX = R2I(globals.MAP_MIN_X)
    let offsetY = R2I(globals.MAP_MIN_Y)

    json.terrain = MemoryHandler.getEmptyObject()
    json.terrain.largeur = largeurMap
    json.terrain.hauteur = hauteurMap
    json.terrain.centerOffsetX = offsetX
    json.terrain.centerOffsetY = offsetY

    //Text.A('map dimensions and center offset saved')
}

//crée si besoin une nouvelle instance dans le tableau et retourne l'id de cet élément de tableau
const GetTerrainId = (x: number, y: number): string => {
    // a burning tile is saved as the slide it really is: the fire is not part of the map
    let terrainTypeId = getRealTerrainTypeId(x, y)

    for (let i = 0; i < nbTerrainTypesUsed; i++) {
        if (terrainTypeId === terrainTypeIds[i]) {
            return I2CustomBase64String(i)
        }
    }

    if (nbTerrainTypesUsed < Constants.NB_MAX_OF_TERRAINS) {
        terrainTypeIds[nbTerrainTypesUsed] = terrainTypeId
        nbTerrainTypesUsed = nbTerrainTypesUsed + 1
    }
    return I2CustomBase64String(nbTerrainTypesUsed - 1)
}

/**
 * The terrain types given an order (-setTerrainsOrder), sorted by it: the order the exported terrain lists its tiles in.
 *
 * Gathered into an array of its own: the terrain types array is keyed by creation, with a hole wherever one was
 * removed, and holds the unordered ones too, so it can be neither walked by index nor sorted in place. Ties are broken
 * by label, so that the result does not depend on the order pairs walks that array in.
 */
const GererOrdreTerrains = () => {
    const orderedTerrainTypes: TerrainType[] = []

    for (const [_, terrainType] of pairs(getUdgTerrainTypes().getAll())) {
        if (terrainType.getOrderId() !== 0) {
            orderedTerrainTypes.push(terrainType)
        }
    }

    orderedTerrainTypes.sort((a, b) =>
        a.getOrderId() !== b.getOrderId()
            ? a.getOrderId() - b.getOrderId()
            : a.label < b.label
              ? -1
              : a.label > b.label
                ? 1
                : 0
    )

    //sauvegarde des terrains dans les variables finales
    nbTerrainTypesUsed = orderedTerrainTypes.length
    for (let i = 0; i < nbTerrainTypesUsed; i++) {
        terrainTypeIds[i] = orderedTerrainTypes[i].getTerrainTypeId()
    }
}

const SaveTerrain = (json: { [x: string]: any }) => {
    const terrainTypesArr = MemoryHandler.getEmptyArray()

    let y = globals.MAP_MIN_Y
    while (y <= globals.MAP_MAX_Y) {
        let x = globals.MAP_MIN_X
        while (x <= globals.MAP_MAX_X) {
            arrayPush(terrainTypesArr, GetTerrainId(x, y))
            x = x + Constants.LARGEUR_CASE
        }
        y = y + Constants.LARGEUR_CASE
    }

    json.terrainTypes = terrainTypesArr.join('')
    MemoryHandler.destroyArray(terrainTypesArr)

    Text.A('terrain saved')
}

const SaveBoundsInfo = (json: { [x: string]: any }) => {
    if (!globals.WORLD_BOUNDS_RECT || !bj_mapInitialPlayableArea) {
        return
    }

    const worldBoundsMinX = GetRectMinX(globals.WORLD_BOUNDS_RECT)
    const worldBoundsMinY = GetRectMinY(globals.WORLD_BOUNDS_RECT)

    json.boundsInfo = {
        playableAreaMinTileX: R2I((GetRectMinX(bj_mapInitialPlayableArea!) - worldBoundsMinX) / 128),
        playableAreaMinTileY: R2I((GetRectMinY(bj_mapInitialPlayableArea!) - worldBoundsMinY) / 128),
        playableAreaMaxTileX: R2I((GetRectMaxX(bj_mapInitialPlayableArea!) - worldBoundsMinX) / 128),
        playableAreaMaxTileY: R2I((GetRectMaxY(bj_mapInitialPlayableArea!) - worldBoundsMinY) / 128),

        cameraBoundsMinTileX: R2I((GetRectMinX(bj_mapInitialCameraBounds!) - worldBoundsMinX) / 128),
        cameraBoundsMinTileY: R2I((GetRectMinY(bj_mapInitialCameraBounds!) - worldBoundsMinY) / 128),
        cameraBoundsMaxTileX: R2I((GetRectMaxX(bj_mapInitialCameraBounds!) - worldBoundsMinX) / 128),
        cameraBoundsMaxTileY: R2I((GetRectMaxY(bj_mapInitialCameraBounds!) - worldBoundsMinY) / 128),
    }
}

/**
 * The version of the terrain the loader is given, which it refuses if it does not know it. 2: no more heights,
 * cliffs nor ramps, which the loader keeps from the base map, but the height modifications made in the game.
 */
const TERRAIN_FORMAT_VERSION = 2

/**
 * The terrain of the map into that JSON: what the game can change of it, the loader keeping the rest from the
 * base map.
 */
export const PushTerrainDataIntoJson = (json: { [x: string]: any }) => {
    json.formatVersion = TERRAIN_FORMAT_VERSION
    json.mainTileset = getUdgTerrainTypes().getMainTileset()
    GererOrdreTerrains()
    SaveTerrain(json) //2 MB leak
    SaveTerrainsUsed(json)
    SaveMapDimensionsAndCenterOffset(json)
    json.terrainHeightModifications = terrainHeightModifications.toJson()
    SaveBoundsInfo(json)
}
