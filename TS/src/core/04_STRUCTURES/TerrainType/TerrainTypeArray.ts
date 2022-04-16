import { arrayPush, tileset2tilesetChar } from 'core/01_libraries/Basic_functions'
import { Text } from 'core/01_libraries/Text'
import { CmdParam, NbParam } from '../../06_COMMANDS/COMMANDS_vJass/Command_functions'
import { BaseArray } from '../BaseArray'
import { TerrainType } from './TerrainType'
import { TerrainTypeDeath } from './TerrainTypeDeath'
import { TerrainTypeSlide } from './TerrainTypeSlide'
import { TerrainTypeWalk } from './TerrainTypeWalk'

//le nombre de terrains du jeu est de 177
export class TerrainTypeArray extends BaseArray<TerrainType> {
    constructor() {
        super(true)
    }

    mainTileset: string = 'auto'

    getFromLabel = (label: string) => {
        for (const [_, terrainType] of pairs(this.data)) {
            if (terrainType.label === label || terrainType.theAlias === label) {
                return terrainType
            }
        }

        return null
    }

    getTerrainType = (x: number, y: number) => {
        let terrainTypeId = GetTerrainType(x, y)

        for (const [_, terrainType] of pairs(this.data)) {
            if (terrainType.getTerrainTypeId() === terrainTypeId) {
                return terrainType
            }
        }

        return null
    }

    isTerrainTypeIdAlreadyUsed = (terrainTypeId: number) => {
        for (const [_, terrainType] of pairs(this.data)) {
            if (terrainType.getTerrainTypeId() === terrainTypeId) {
                return true
            }
        }

        return false
    }

    isLabelAlreadyUsed = (label: string) => {
        return this.getFromLabel(label) !== null
    }

    newWalk = (label: string, terrainTypeId: number, walkspeed: number) => {
        if (this.isLabelAlreadyUsed(label)) throw 'Label already used'
        if (this.isTerrainTypeIdAlreadyUsed(terrainTypeId)) throw 'Terrain type already used'
        if (terrainTypeId === 0) throw 'Wrong terrain type'

        const tt = new TerrainTypeWalk(label, terrainTypeId, walkspeed)
        this._new(tt)
        return tt
    }

    newDeath = (
        label: string,
        terrainTypeId: number,
        killingEffectStr: string,
        timeToKill: number,
        toleranceDist: number
    ) => {
        if (this.isLabelAlreadyUsed(label)) throw 'Label already used'
        if (this.isTerrainTypeIdAlreadyUsed(terrainTypeId)) throw 'Terrain type already used'
        if (terrainTypeId === 0) throw 'Wrong terrain type'

        const tt = new TerrainTypeDeath(label, terrainTypeId, killingEffectStr, timeToKill, toleranceDist)
        this._new(tt)
        return tt
    }

    newSlide = (label: string, terrainTypeId: number, slideSpeed: number, canTurn: boolean) => {
        if (this.isLabelAlreadyUsed(label)) throw 'Label already used'
        if (this.isTerrainTypeIdAlreadyUsed(terrainTypeId)) throw 'Terrain type already used'
        if (terrainTypeId === 0) throw 'Wrong terrain type'

        const tt = new TerrainTypeSlide(label, terrainTypeId, slideSpeed, canTurn)
        this._new(tt)
        return tt
    }

    remove = (label: string): boolean => {
        for (const [terrainTypeId, terrainType] of pairs(this.data)) {
            if (terrainType.label === label || terrainType.theAlias === label) {
                this.data[terrainTypeId].destroy()
                delete this.data[terrainTypeId]
            }
        }

        return true
    }

    displayForPlayer = (p: player) => {
        let hadOne = false

        for (const [_, terrainType] of pairs(this.data)) {
            terrainType.displayForPlayer(p)
            hadOne = true
        }

        if (!hadOne) {
            Text.erP(p, 'no terrain saved')
        }
    }

    //mettre en place l'ordre des terrains au niveau des tilesets
    setOrder = (cmd: string): boolean => {
        let terrainType: TerrainType | null
        let terrainTypesOrdered: TerrainType[] = []
        let nbTerrainsDone: number
        let i: number
        if (this.count() !== NbParam(cmd)) {
            return false
        }
        nbTerrainsDone = 0
        while (true) {
            if (nbTerrainsDone === this.count()) break
            terrainType = this.getFromLabel(CmdParam(cmd, nbTerrainsDone + 1))
            //vérification que le terrain existe
            if (terrainType === null) {
                return false
            }
            //vérification que le terrain n'a pas déjà été cité
            i = 0
            while (true) {
                if (i === nbTerrainsDone) break
                if (terrainTypesOrdered[i] === terrainType) {
                    return false
                }
                i = i + 1
            }
            //mémorisation du terrain
            terrainTypesOrdered[nbTerrainsDone] = terrainType
            nbTerrainsDone = nbTerrainsDone + 1
        }
        //mémorisation du numéro d'ordre de chaque terrain
        i = 0
        while (true) {
            if (i === nbTerrainsDone) break
            terrainTypesOrdered[i].setOrderId(i + 1)
            i = i + 1
        }
        return true
    }

    setMainTileset = (tileset: string): boolean => {
        let tilesetChar = tileset2tilesetChar(tileset)
        if (tilesetChar !== '') {
            this.mainTileset = tilesetChar
            return true
        }
        return false
    }

    getMainTileset = (): string => {
        return this.mainTileset
    }

    toJson = () => {
        const arr: TerrainType[] = []

        for (const [_, terrainType] of pairs(this.data)) {
            arrayPush(arr, terrainType)
        }

        return {
            mainTileset: this.mainTileset,
            terrainTypesMec: arr.map(terrainType => terrainType.toJson()),
        }
    }
}
