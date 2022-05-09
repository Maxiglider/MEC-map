import { Ascii2String } from 'core/01_libraries/Ascii'
import { LARGEUR_CASE } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { TerrainType } from 'core/04_STRUCTURES/TerrainType/TerrainType'
import { getUdgTerrainTypes, globals } from '../../../../globals'
import { arrayPush } from '../../01_libraries/Basic_functions'
import { I2HexaString } from '../../01_libraries/Functions_on_numbers'
import { SaveTerrainHeights } from './Save_terrain_heights_and_cliffs'
import { SaveTerrainRamps } from './Save_terrain_ramps'
import { SaveWater } from './Save_water'
import {ArrayHandler} from "../../../Utils/ArrayHandler";
import {ObjectHandler} from "../../../Utils/ObjectHandler";
import {clearArrayOrObject} from "../../../Utils/clearArrayOrObject";

let terrainTypeIds: number[] = []
let nbTerrainTypesUsed: number

const SaveTerrainsUsed = (json: { [x: string]: any }) => {
    json.terrainsUsed = ArrayHandler.getNewArray()

    for (let i = 0; i < nbTerrainTypesUsed; i++) {
        arrayPush(json.terrainsUsed, Ascii2String(terrainTypeIds[i]))
    }

    Text.A('terrains used saved')
}

const SaveMapDimensionsAndCenterOffset = (json: { [x: string]: any }) => {
    let largeurMap = R2I((globals.MAP_MAX_X - globals.MAP_MIN_X) / LARGEUR_CASE)
    let hauteurMap = R2I((globals.MAP_MAX_Y - globals.MAP_MIN_Y) / LARGEUR_CASE)
    let offsetX = R2I(globals.MAP_MIN_X)
    let offsetY = R2I(globals.MAP_MIN_Y)

    json.terrain = ObjectHandler.getNewObject()
    json.terrain.largeur = largeurMap
    json.terrain.hauteur = hauteurMap
    json.terrain.centerOffsetX = offsetX
    json.terrain.centerOffsetY = offsetY

    //Text.A('map dimensions and center offset saved')
}

//crée si besoin une nouvelle instance dans le tableau et retourne l'id de cet élément de tableau
const GetTerrainId = (x: number, y: number): string => {
    let terrainTypeId = GetTerrainType(x, y)

    for (let i = 0; i < nbTerrainTypesUsed; i++) {
        if (terrainTypeId === terrainTypeIds[i]) {
            return I2HexaString(i)
        }
    }

    if (nbTerrainTypesUsed < 16) {
        terrainTypeIds[nbTerrainTypesUsed] = terrainTypeId
        nbTerrainTypesUsed = nbTerrainTypesUsed + 1
    }
    return I2HexaString(nbTerrainTypesUsed - 1)
}

const GererOrdreTerrains = () => {
    let nbOrderedTerrains = 0
    let ordreMinTerrainId: number = -1
    let ordreMin: number

    //récupération de tous les terrains
    const terrainTypes = getUdgTerrainTypes().getAll()
    // const terrainTypesWithOrder: TerrainType[] = [] //todomax is this variable terrainTypesWithOrder really useless ?

    //suppression des terrains non ordonnés du tableau
    for (const [i] of pairs(terrainTypes)) {
        if (terrainTypes[i].getOrderId() != 0) {
            // arrayPush(terrainTypesWithOrder, terrainTypes[i])
            nbOrderedTerrains = nbOrderedTerrains + 1
        }
    }

    //tri du tableau
    for (let numTerrain = 0; numTerrain < nbOrderedTerrains - 1; numTerrain++) {
        //on trouve l'emplacement du terrain avec l'ordre le plus petit
        ordreMin = 100

        for (let i = numTerrain; i < nbOrderedTerrains; i++) {
            if (terrainTypes[i].getOrderId() < ordreMin) {
                ordreMinTerrainId = i
                ordreMin = terrainTypes[i].getOrderId()
            }
        }

        //on inverse l'emplacement du terrain trouvé avec celui du premier terrain non trié
        if (ordreMinTerrainId !== numTerrain) {
            const terrainType = terrainTypes[numTerrain]
            terrainTypes[numTerrain] = terrainTypes[ordreMinTerrainId]
            terrainTypes[ordreMinTerrainId] = terrainType
        }
    }

    //sauvegarde des terrains dans les variables finales
    nbTerrainTypesUsed = nbOrderedTerrains
    for (let i = 0; i < nbOrderedTerrains; i++) {
        terrainTypeIds[i] = terrainTypes[i].getTerrainTypeId()
    }
}

const SaveTerrain = (json: { [x: string]: any }) => {
    const terrainTypesArr = ArrayHandler.getNewArray()

    let y = globals.MAP_MIN_Y
    while (y <= globals.MAP_MAX_Y) {
        let x = globals.MAP_MIN_X
        while (x <= globals.MAP_MAX_X) {
            arrayPush(terrainTypesArr, GetTerrainId(x, y))
            x = x + LARGEUR_CASE
        }
        y = y + LARGEUR_CASE
    }

    json.terrainTypes = terrainTypesArr.join('')
    clearArrayOrObject(terrainTypesArr)

    Text.A('terrain saved')
}

export const PushTerrainDataIntoJson = (json: { [x: string]: any }) => {
    json.mainTileset = getUdgTerrainTypes().getMainTileset()
    GererOrdreTerrains()
    SaveTerrain(json) //2 MB leak
    SaveTerrainsUsed(json)
    SaveMapDimensionsAndCenterOffset(json)
    SaveTerrainHeights.SaveTerrainHeights(json)
    SaveTerrainHeights.SaveTerrainCliffs(json)
    SaveTerrainRamps.SaveTerrainRamps(json)
    // SaveWater.SaveWater(json) //copie from TerrainHeights for the moment ; disabled because i didn't succeed to handle water yet
}


//function to save whole terrain in an array of array
export function saveTerrainType2Dims() {
    const terrainsTypes: (TerrainType | null)[][] = ArrayHandler.getNewArray()

    let yInd = 0
    let y = globals.MAP_MIN_Y
    while (y <= globals.MAP_MAX_Y) {
        let xInd = 0
        let x = globals.MAP_MIN_X
        while (x <= globals.MAP_MAX_X) {
            !terrainsTypes[xInd] && (terrainsTypes[xInd] = ArrayHandler.getNewArray())
            terrainsTypes[xInd][yInd] = getUdgTerrainTypes().getTerrainType(x, y)

            xInd++
            x = x + LARGEUR_CASE
        }

        yInd++
        y = y + LARGEUR_CASE
    }

    return terrainsTypes
}