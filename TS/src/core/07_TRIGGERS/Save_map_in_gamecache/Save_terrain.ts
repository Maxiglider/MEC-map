import { Constants, LARGEUR_CASE } from 'core/01_libraries/Constants'
import { FunctionsOnNumbers } from 'core/01_libraries/Functions_on_numbers'
import { Text } from 'core/01_libraries/Text'
import { udg_terrainTypes } from '../../../../globals'
import { SaveMapInCache } from './SAVE_MAP_in_cache'
import { SaveTerrainHeights } from './Save_terrain_heights_and_cliffs'
import { StringArrayForCache } from './struct_StringArrayForCache'

const initSaveTerrain = () => {
    let y: number
    let terrainTypeIds: number[] = []
    let nbTerrainTypesUsed: number

    const SaveTerrainsUsed = () => {
        let i: number
        StringArrayForCache.stringArrayForCache = new StringArrayForCache('terrain', 'terrainsUsed', false)
        i = 0
        while (true) {
            if (i >= nbTerrainTypesUsed) break
            StringArrayForCache.stringArrayForCache.push(Ascii2String(terrainTypeIds[i]))
            i = i + 1
        }
        StringArrayForCache.stringArrayForCache.writeInCache()
        Text.A('terrains used saved')
    }

    const SaveMapDimensionsAndCenterOffset = () => {
        let largeurMap = R2I((Constants.MAP_MAX_X - Constants.MAP_MIN_X) / LARGEUR_CASE)
        let hauteurMap = R2I((Constants.MAP_MAX_Y - Constants.MAP_MIN_Y) / LARGEUR_CASE)
        let offsetX = R2I(Constants.MAP_MIN_X)
        let offsetY = R2I(Constants.MAP_MIN_Y)
        StringArrayForCache.stringArrayForCache = new StringArrayForCache('terrain', 'largeur', false)
        StringArrayForCache.stringArrayForCache.push(I2S(largeurMap))
        StringArrayForCache.stringArrayForCache.writeInCache()
        StringArrayForCache.stringArrayForCache = new StringArrayForCache('terrain', 'hauteur', false)
        StringArrayForCache.stringArrayForCache.push(I2S(hauteurMap))
        StringArrayForCache.stringArrayForCache.writeInCache()
        StringArrayForCache.stringArrayForCache = new StringArrayForCache('terrain', 'centerOffsetX', false)
        StringArrayForCache.stringArrayForCache.push(I2S(offsetX))
        StringArrayForCache.stringArrayForCache.writeInCache()
        StringArrayForCache.stringArrayForCache = new StringArrayForCache('terrain', 'centerOffsetY', false)
        StringArrayForCache.stringArrayForCache.push(I2S(offsetY))
        StringArrayForCache.stringArrayForCache.writeInCache()
        Text.A('map dimensions and center offsaved')
    }

    //crée si besoin une nouvelle instance dans le tableau et retourne l'id de cet élément de tableau

    const GetTerrainId = (x: number, y: number): string => {
        let terrainTypeId = GetTerrainType(x, y)
        let i = 0
        while (true) {
            if (i >= nbTerrainTypesUsed) break
            if (terrainTypeId === terrainTypeIds[i]) {
                return FunctionsOnNumbers.I2HexaString(i)
            }
            i = i + 1
        }
        if (nbTerrainTypesUsed < 16) {
            terrainTypeIds[nbTerrainTypesUsed] = terrainTypeId
            nbTerrainTypesUsed = nbTerrainTypesUsed + 1
        }
        return FunctionsOnNumbers.I2HexaString(nbTerrainTypesUsed - 1)
    }

    const GererOrdreTerrains = () => {
        let terrainType: TerrainType
        let terrainTypes: TerrainType[] = []
        let nbOrderedTerrains = 0
        let numTerrain = 0
        let ordreMinTerrainId: number
        let ordreMin: number
        //récupération de tous les terrains
        let i = 0
        while (true) {
            terrainType = udg_terrainTypes.getWalk(i)
            if (terrainType === 0) break
            terrainTypes[numTerrain] = terrainType
            numTerrain = numTerrain + 1
            i = i + 1
        }
        i = 0
        while (true) {
            terrainType = udg_terrainTypes.getSlide(i)
            if (terrainType === 0) break
            terrainTypes[numTerrain] = terrainType
            numTerrain = numTerrain + 1
            i = i + 1
        }
        i = 0
        while (true) {
            terrainType = udg_terrainTypes.getDeath(i)
            if (terrainType === 0) break
            terrainTypes[numTerrain] = terrainType
            numTerrain = numTerrain + 1
            i = i + 1
        }
        //suppression des terrains non ordonnés du tableau
        i = 0
        while (true) {
            if (i == udg_terrainTypes.count()) break
            if (terrainTypes[i].getOrderId() != 0) {
                if (i !== nbOrderedTerrains) {
                    terrainTypes[nbOrderedTerrains] = terrainTypes[i]
                }
                nbOrderedTerrains = nbOrderedTerrains + 1
            }
            i = i + 1
        }
        //tri du tableau
        numTerrain = 0
        while (true) {
            if (numTerrain >= nbOrderedTerrains - 1) break
            //on trouve l'emplacement du terrain avec l'ordre le plus petit
            ordreMin = 100
            i = numTerrain
            while (true) {
                if (i === nbOrderedTerrains) break
                if (terrainTypes[i].getOrderId() < ordreMin) {
                    ordreMinTerrainId = i
                    ordreMin = terrainTypes[i].getOrderId()
                }
                i = i + 1
            }
            //on inverse l'emplacement du terrain trouvé avec celui du premier terrain non trié
            if (ordreMinTerrainId !== numTerrain) {
                terrainType = terrainTypes[numTerrain]
                terrainTypes[numTerrain] = terrainTypes[ordreMinTerrainId]
                terrainTypes[ordreMinTerrainId] = terrainType
            }
            numTerrain = numTerrain + 1
        }
        //sauvegarde des terrains dans les variables finales
        nbTerrainTypesUsed = nbOrderedTerrains
        i = 0
        while (true) {
            if (i === nbOrderedTerrains) break
            terrainTypeIds[i] = terrainTypes[i].getTerrainTypeId()
            i = i + 1
        }
    }

    const SaveTerrain_Actions = () => {
        let x: number
        if (y <= Constants.MAP_MAX_Y) {
            x = Constants.MAP_MIN_X
            while (true) {
                if (x > Constants.MAP_MAX_X) break
                StringArrayForCache.stringArrayForCache.push(GetTerrainId(x, y))
                x = x + LARGEUR_CASE
            }
            y = y + LARGEUR_CASE
        } else {
            DisableTrigger(GetTriggeringTrigger())
            StringArrayForCache.stringArrayForCache.writeInCache()
            Text.A('terrain saved')
            SaveTerrainsUsed()
            SaveMapDimensionsAndCenterOffset()
            SaveTerrainHeights.StartSaveTerrainHeights()
        }
    }

    const StartSaveTerrain = () => {
        y = Constants.MAP_MIN_Y
        GererOrdreTerrains()
        StringArrayForCache.stringArrayForCache = new StringArrayForCache('terrain', 'terrainTypes', false)
        TriggerClearActions(SaveMapInCache.trigSaveMapInCache)
        TriggerAddAction(SaveMapInCache.trigSaveMapInCache, SaveTerrain_Actions)
        EnableTrigger(SaveMapInCache.trigSaveMapInCache)
    }

    return { GererOrdreTerrains, StartSaveTerrain }
}

export const SaveTerrain = initSaveTerrain()
