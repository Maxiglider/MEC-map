import { tileset2tilesetChar } from 'core/01_libraries/Basic_functions'
import { Text } from 'core/01_libraries/Text'
import { StringArrayForCache } from 'core/07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache'
import { TerrainType } from './TerrainType'
import { TerrainTypeDeath } from './TerrainTypeDeath'
import { TerrainTypeSlide } from './TerrainTypeSlide'
import { TerrainTypeWalk } from './TerrainTypeWalk'
import {CmdParam, NbParam} from "../../06_COMMANDS/COMMANDS_vJass/Command_functions";

export class TerrainTypeArray {
    private ttWalk: TerrainTypeWalk[] = [] //le nombre de terrains du jeu est de 177
    private ttDeath: TerrainTypeDeath[] = []
    private ttSlide: TerrainTypeSlide[] = []
    numberOfWalk = 0
    numberOfDeath = 0
    numberOfSlide = 0
    mainTileset: string = 'auto'

    get = (label: string) => {
        let i = 0
        while (true) {
            if (i >= this.numberOfWalk) break
            if (this.ttWalk[i].label == label || this.ttWalk[i].theAlias == label) {
                return this.ttWalk[i]
            }
            i = i + 1
        }
        i = 0
        while (true) {
            if (i >= this.numberOfDeath) break
            if (this.ttDeath[i].label == label || this.ttDeath[i].theAlias == label) {
                return this.ttDeath[i]
            }
            i = i + 1
        }
        i = 0
        while (true) {
            if (i >= this.numberOfSlide) break
            if (this.ttSlide[i].label == label || this.ttSlide[i].theAlias == label) {
                return this.ttSlide[i]
            }
            i = i + 1
        }
        return null
    }

    getTerrainType = (x: number, y: number): TerrainType | null => {
        let terrainTypeId = GetTerrainType(x, y)
        let i = 0
        while (true) {
            if (i >= this.numberOfWalk) break
            if (this.ttWalk[i].getTerrainTypeId() == terrainTypeId) {
                return this.ttWalk[i]
            }
            i = i + 1
        }
        i = 0
        while (true) {
            if (i >= this.numberOfDeath) break
            if (this.ttDeath[i].getTerrainTypeId() == terrainTypeId) {
                return this.ttDeath[i]
            }
            i = i + 1
        }
        i = 0
        while (true) {
            if (i >= this.numberOfSlide) break
            if (this.ttSlide[i].getTerrainTypeId() == terrainTypeId) {
                return this.ttSlide[i]
            }
            i = i + 1
        }
        return null
    }

    isTerrainTypeIdAlreadyUsed = (terrainTypeId: number): boolean => {

        for(let i = 0; i < this.numberOfWalk; i++){
            if (terrainTypeId == this.ttWalk[i].getTerrainTypeId()) {
                return true
            }
        }

        for(let i = 0; i < this.numberOfDeath; i++){
            if (terrainTypeId == this.ttDeath[i].getTerrainTypeId()) {
                return true
            }
        }

        for(let i = 0; i < this.numberOfSlide; i++){
            if (terrainTypeId == this.ttSlide[i].getTerrainTypeId()) {
                return true
            }
        }

        return false
    }

    isLabelAlreadyUsed = (label: string) => {
        return this.get(label) !== null
    }

    newWalk = (label: string, terrainTypeId: number, walkspeed: number) => {
        let n = this.numberOfWalk
        if (
            this.count() >= 16 ||
            this.isLabelAlreadyUsed(label) ||
            this.isTerrainTypeIdAlreadyUsed(terrainTypeId) ||
            terrainTypeId === 0
        ) {
            return null
        }
        this.ttWalk[n] = new TerrainTypeWalk(label, terrainTypeId, walkspeed)
        if (this.ttWalk[n] !== null) {
            this.numberOfWalk = this.numberOfWalk + 1
        }
        return this.ttWalk[n]
    }

    newDeath = (
        label: string,
        terrainTypeId: number,
        killingEffectStr: string,
        timeToKill: number,
        toleranceDist: number
    ) => {
        let n = this.numberOfDeath
        if (
            this.count() >= 16 ||
            this.isLabelAlreadyUsed(label) ||
            this.isTerrainTypeIdAlreadyUsed(terrainTypeId) ||
            terrainTypeId === 0
        ) {
            return null
        }
        this.ttDeath[n] = new TerrainTypeDeath(label, terrainTypeId, killingEffectStr, timeToKill, toleranceDist)
        if (this.ttDeath[n] !== null) {
            this.numberOfDeath = this.numberOfDeath + 1
        }
        return this.ttDeath[n]
    }

    newSlide = (label: string, terrainTypeId: number, slideSpeed: number, canTurn: boolean) => {
        let n = this.numberOfSlide
        if (
            this.count() >= 16 ||
            this.isLabelAlreadyUsed(label) ||
            this.isTerrainTypeIdAlreadyUsed(terrainTypeId) ||
            terrainTypeId === 0
        ) {
            return null
        }
        this.ttSlide[n] = new TerrainTypeSlide(label, terrainTypeId, slideSpeed, canTurn)
        if (this.ttSlide[n] !== null) {
            this.numberOfSlide = this.numberOfSlide + 1
        }
        return this.ttSlide[n]
    }

    remove = (label: string): boolean => {
        let position: number
        let i: number
        let tt = this.get(label)
        if (tt === null) {
            return false
        }
        if (tt.kind == 'walk') {
            i = 0
            while (true) {
                if (this.ttWalk[i].label == label || this.ttWalk[i].theAlias == label || i >= this.numberOfWalk) break
                i = i + 1
            }
            if (i < this.numberOfWalk) {
                i = i + 1
                while (true) {
                    if (i >= this.numberOfWalk) break
                    this.ttWalk[i - 1] = this.ttWalk[i]
                    i = i + 1
                }
                this.numberOfWalk = this.numberOfWalk - 1
            }
        }
        if (tt.kind == 'death') {
            i = 0
            while (true) {
                if (this.ttDeath[i].label == label || this.ttDeath[i].theAlias == label || i >= this.numberOfDeath)
                    break
                i = i + 1
            }
            if (i < this.numberOfDeath) {
                i = i + 1
                while (true) {
                    if (i >= this.numberOfDeath) break
                    this.ttDeath[i - 1] = this.ttDeath[i]
                    i = i + 1
                }
                this.numberOfDeath = this.numberOfDeath - 1
            }
        }
        if (tt.kind == 'slide') {
            i = 0
            while (true) {
                if (this.ttSlide[i].label == label || this.ttSlide[i].theAlias == label || i >= this.numberOfSlide)
                    break
                i = i + 1
            }
            if (i < this.numberOfSlide) {
                i = i + 1
                while (true) {
                    if (i >= this.numberOfSlide) break
                    this.ttSlide[i - 1] = this.ttSlide[i]
                    i = i + 1
                }
                this.numberOfSlide = this.numberOfSlide - 1
            }
        }

        tt.destroy()

        return true
    }

    getWalk = (id: number): TerrainTypeWalk => {
        return this.ttWalk[id]
    }

    getDeath = (id: number): TerrainTypeDeath => {
        return this.ttDeath[id]
    }

    getSlide = (id: number): TerrainTypeSlide => {
        return this.ttSlide[id]
    }

    displayForPlayer = (p: player) => {
        let i = 0
        while (true) {
            if (i >= this.numberOfSlide) break
            this.ttSlide[i].displayForPlayer(p)
            i = i + 1
        }
        i = 0
        while (true) {
            if (i >= this.numberOfWalk) break
            this.ttWalk[i].displayForPlayer(p)
            i = i + 1
        }
        i = 0
        while (true) {
            if (i >= this.numberOfDeath) break
            this.ttDeath[i].displayForPlayer(p)
            i = i + 1
        }
        if (this.numberOfSlide + this.numberOfWalk + this.numberOfDeath === 0) {
            Text.erP(p, 'no terrain saved')
        }
    }

    saveInCache = () => {
        let i: number

        //main tileset
        StringArrayForCache.stringArrayForCache = new StringArrayForCache('terrain', 'mainTileset', false)
        StringArrayForCache.stringArrayForCache.push(this.mainTileset)
        StringArrayForCache.stringArrayForCache.writeInCache()

        //terrainConfig
        StringArrayForCache.stringArrayForCache = new StringArrayForCache('terrain', 'terrainConfig', true)
        i = 0
        while (true) {
            if (i >= this.numberOfSlide) break
            StringArrayForCache.stringArrayForCache.push(this.ttSlide[i].toString())
            i = i + 1
        }
        i = 0
        while (true) {
            if (i >= this.numberOfWalk) break
            StringArrayForCache.stringArrayForCache.push(this.ttWalk[i].toString())
            i = i + 1
        }
        i = 0
        while (true) {
            if (i >= this.numberOfDeath) break
            StringArrayForCache.stringArrayForCache.push(this.ttDeath[i].toString())
            i = i + 1
        }
        StringArrayForCache.stringArrayForCache.writeInCache()
    }

    count = (): number => {
        return this.numberOfWalk + this.numberOfSlide + this.numberOfDeath
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
            terrainType = this.get(CmdParam(cmd, nbTerrainsDone + 1))
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
}
