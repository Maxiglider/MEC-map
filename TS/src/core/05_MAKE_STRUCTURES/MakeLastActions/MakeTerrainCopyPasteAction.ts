import { LARGEUR_CASE } from 'core/01_libraries/Constants'
import { getUdgTerrainTypes } from '../../../../globals'

import { TerrainType } from '../../04_STRUCTURES/TerrainType/TerrainType'
import {MakeAction} from "./MakeAction";
import {ChangeTerrainType} from "../../07_TRIGGERS/Modify_terrain_Functions/Modify_terrain_functions";
import {Text} from "../../01_libraries/Text";
import {globals} from "../../../../globals";

const {MAP_MIN_X, MAP_MIN_Y, MAP_MAX_X, MAP_MAX_Y} = globals


export class MakeTerrainCopyPasteAction extends MakeAction {
    private minX: number
    private minY: number
    private maxX: number
    private maxY: number

    private terrainTypesBefore: TerrainType[][]
    private terrainTypesAfter: TerrainType[][]

    constructor(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        x3: number,
        y3: number,
        x4: number,
        y4: number
    ) {
        super()

        let xCopy: number
        let yCopy: number
        let xPaste: number
        let yPaste: number

        let minXcopy = RMinBJ(x1, x2)
        let maxXcopy = RMaxBJ(x1, x2)
        let minYcopy = RMinBJ(y1, y2)
        let maxYcopy = RMaxBJ(y1, y2)

        let diffX = maxXcopy - minXcopy
        let diffY = maxYcopy - minYcopy

        print("diffX " + diffX + " ; diffY " + diffY)

        let minXpaste: number
        let minYpaste: number

        if (x4 > x3) {
            //direction droite
            minXpaste = x3
        } else {
            //direction gauche
            minXpaste = x3 - diffX
        }
        if (y4 > y3) {
            //direction haut
            minYpaste = y3
        } else {
            //direction bas
            minYpaste = y3 - diffY
        }

        print("minXpaste : " + minXpaste + " ; minXpaste : " + minXpaste +" ; minYpaste : " + minYpaste +" ; minYpaste : " + minYpaste)
        print("MAP_MIN_X : " + MAP_MIN_X + " ; MAP_MAX_X : " + MAP_MAX_X + " ; MAP_MIN_Y : " + MAP_MIN_Y + " ; MAP_MAX_Y : " + MAP_MAX_Y + " ; diffX : " + diffX )


        if (
            minXpaste < MAP_MIN_X ||
            minXpaste + diffX > MAP_MAX_X ||
            minYpaste < MAP_MIN_Y ||
            minYpaste + diffY > MAP_MAX_Y
        ) {
            throw "out of bounds"
        }

        this.minX = minXpaste
        this.minY = minYpaste
        this.maxX = minXpaste + diffX
        this.maxY = minYpaste + diffY

        this.terrainTypesBefore = []
        this.terrainTypesAfter = []

        xPaste = minXpaste
        yPaste = minYpaste
        xCopy = minXcopy
        yCopy = minYcopy
        while (yCopy <= maxYcopy) {
            while (xCopy <= maxXcopy) {
                let tt = getUdgTerrainTypes().getTerrainType(xPaste, yPaste)
                if(tt) this.terrainTypesBefore[xPaste][yPaste] = tt

                const terrainType = getUdgTerrainTypes().getTerrainType(xCopy, yCopy)

                if (terrainType) {
                    this.terrainTypesAfter[xPaste][yPaste] = terrainType
                    const terrainTypeId = terrainType.getTerrainTypeId()
                    if (terrainTypeId !== 0) {
                        ChangeTerrainType(xPaste, yPaste, terrainTypeId)
                    }
                }
                xPaste = xPaste + LARGEUR_CASE
                xCopy = xCopy + LARGEUR_CASE
            }
            xPaste = minXpaste
            xCopy = minXcopy
            yPaste = yPaste + LARGEUR_CASE
            yCopy = yCopy + LARGEUR_CASE
        }

        this.isActionMadeB = true
    }

    terrainModificationCancel = (): void => {
        let x = this.minX
        let y = this.minY

        while (y <= this.maxY){
            while (x <= this.maxX){
                const terrainType = this.terrainTypesBefore[x][y]
                if (terrainType && terrainType.getTerrainTypeId() != 0) {
                    ChangeTerrainType(x, y, terrainType.getTerrainTypeId())
                }
                x = x + LARGEUR_CASE
            }
            x = this.minX
            y = y + LARGEUR_CASE
        }
    }

    terrainModificationRedo = (): void => {
        let x = this.minX
        let y = this.minY

        while (y <= this.maxY){
            while (x <= this.maxX){
                const terrainType = this.terrainTypesAfter[x][y]
                if (terrainType && terrainType.getTerrainTypeId() != 0) {
                    ChangeTerrainType(x, y, terrainType.getTerrainTypeId())
                }
                x = x + LARGEUR_CASE
            }
            x = this.minX
            y = y + LARGEUR_CASE
        }
    }

    cancel = (): boolean => {
        if (!this.isActionMadeB) {
            return false
        }
        this.terrainModificationCancel()
        this.isActionMadeB = false
        this.owner && Text.mkP(this.owner.getPlayer(), 'terrain copy/paste cancelled')
        return true
    }

    redo = (): boolean => {
        if (this.isActionMadeB) {
            return false
        }
        this.terrainModificationRedo()
        this.isActionMadeB = true
        this.owner && Text.mkP(this.owner.getPlayer(), 'terrain copy/paste redone')
        return true
    }

    destroy = () => {
        //nothing needed
    }
}
